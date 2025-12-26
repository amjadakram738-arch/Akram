// Audio Processor - Handles audio capture, processing, and transcription

export class AudioProcessor {
  constructor() {
    this.audioContext = null;
    this.mediaRecorder = null;
    this.audioWorklet = null;
    this.isProcessing = false;
  }

  async captureFromTab(tabId, options = {}) {
    try {
      // Request tab audio stream
      const stream = await this.getTabAudioStream(tabId);
      
      // Apply noise reduction if enabled
      if (options.noiseReduction) {
        return await this.processWithNoiseReduction(stream, options);
      }

      return await this.processAudioStream(stream, options);
    } catch (error) {
      console.error('Audio capture failed:', error);
      throw error;
    }
  }

  async getTabAudioStream(tabId) {
    try {
      // Try to capture tab audio
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          mandatory: {
            chromeMediaSource: 'tab',
            chromeMediaSourceId: tabId
          }
        }
      });

      return stream;
    } catch (error) {
      // Fallback to display media
      return await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: false
      });
    }
  }

  async processAudioStream(stream, options) {
    return new Promise((resolve, reject) => {
      const audioChunks = [];
      const mimeType = this.getSupportedMimeType();

      this.mediaRecorder = new MediaRecorder(stream, { mimeType });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunks, { type: mimeType });
          const audioData = await this.convertBlobToBase64(audioBlob);
          resolve(audioData);
        } catch (error) {
          reject(error);
        }
      };

      this.mediaRecorder.onerror = (error) => {
        reject(error);
      };

      // Start recording
      this.mediaRecorder.start();

      // Stop after duration
      const duration = options.duration || 3000;
      setTimeout(() => {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
          this.mediaRecorder.stop();
        }
      }, duration);
    });
  }

  async processWithNoiseReduction(stream, options) {
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Create source from stream
      const source = this.audioContext.createMediaStreamSource(stream);

      // Create noise reduction filter
      const filter = await this.createNoiseFilter(options.noiseFilterLevel || 'medium');

      // Connect: source -> filter -> destination
      source.connect(filter);
      
      const destination = this.audioContext.createMediaStreamDestination();
      filter.connect(destination);

      // Process the filtered stream
      return await this.processAudioStream(destination.stream, options);
    } catch (error) {
      console.error('Noise reduction failed, using raw audio:', error);
      return await this.processAudioStream(stream, options);
    }
  }

  async createNoiseFilter(level) {
    // Create simple noise gate using dynamics compressor
    const filter = this.audioContext.createDynamicsCompressor();

    switch (level) {
      case 'light':
        filter.threshold.setValueAtTime(-50, this.audioContext.currentTime);
        filter.knee.setValueAtTime(20, this.audioContext.currentTime);
        filter.ratio.setValueAtTime(4, this.audioContext.currentTime);
        break;
      case 'medium':
        filter.threshold.setValueAtTime(-40, this.audioContext.currentTime);
        filter.knee.setValueAtTime(30, this.audioContext.currentTime);
        filter.ratio.setValueAtTime(8, this.audioContext.currentTime);
        break;
      case 'strong':
        filter.threshold.setValueAtTime(-30, this.audioContext.currentTime);
        filter.knee.setValueAtTime(40, this.audioContext.currentTime);
        filter.ratio.setValueAtTime(12, this.audioContext.currentTime);
        break;
      default:
        filter.threshold.setValueAtTime(-40, this.audioContext.currentTime);
        filter.ratio.setValueAtTime(8, this.audioContext.currentTime);
    }

    filter.attack.setValueAtTime(0.003, this.audioContext.currentTime);
    filter.release.setValueAtTime(0.25, this.audioContext.currentTime);

    return filter;
  }

  getSupportedMimeType() {
    const types = [
      'audio/webm',
      'audio/webm;codecs=opus',
      'audio/ogg;codecs=opus',
      'audio/mp4'
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return 'audio/webm'; // Default fallback
  }

  async convertBlobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async transcribeAudio(audioData, options = {}) {
    try {
      // Use Web Speech API as fallback
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        return await this.transcribeWithWebSpeech(audioData, options);
      }

      // Otherwise, use external service
      return await this.transcribeWithService(audioData, options);
    } catch (error) {
      console.error('Transcription failed:', error);
      throw error;
    }
  }

  async transcribeWithWebSpeech(audioData, options) {
    return new Promise((resolve, reject) => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = options.language || 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      recognition.onerror = (event) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      recognition.start();
    });
  }

  async transcribeWithService(audioData, options) {
    // This would integrate with Whisper API or similar service
    // For now, return a placeholder
    throw new Error('External transcription service not configured');
  }

  async extractAudioFromVideo(videoElement) {
    try {
      // Create audio context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Create media element source
      const source = audioContext.createMediaElementSource(videoElement);

      // Create destination for recording
      const destination = audioContext.createMediaStreamDestination();

      // Connect
      source.connect(destination);
      source.connect(audioContext.destination); // Also play to speakers

      return destination.stream;
    } catch (error) {
      console.error('Failed to extract audio from video:', error);
      throw error;
    }
  }

  stop() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.isProcessing = false;
  }

  // Audio analysis utilities
  async analyzeAudioLevel(stream) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyzer = audioContext.createAnalyser();

    source.connect(analyzer);
    analyzer.fftSize = 256;

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    analyzer.getByteFrequencyData(dataArray);

    // Calculate average volume
    const sum = dataArray.reduce((a, b) => a + b, 0);
    const average = sum / bufferLength;

    audioContext.close();

    return {
      level: average,
      isSilent: average < 10,
      isLoud: average > 200
    };
  }
}

export default AudioProcessor;
