// Offscreen Document Script - Audio processing for Manifest V3
// Copyright: Video Translator Extension

console.log('Offscreen document loaded');

// Audio context and processing
let audioContext = null;
let audioStream = null;
let mediaRecorder = null;
let audioChunks = [];

// Initialize audio context
function initializeAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    console.log('Audio context initialized');
  }
  return audioContext;
}

// Start audio capture
async function startAudioCapture() {
  try {
    // Request audio stream from tab
    audioStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });
    
    console.log('Audio stream captured');
    
    // Initialize audio context
    const context = initializeAudioContext();
    
    // Create media stream source
    const source = context.createMediaStreamSource(audioStream);
    
    // Create analyzer for audio visualization (optional)
    const analyzer = context.createAnalyser();
    analyzer.fftSize = 2048;
    
    // Connect nodes
    source.connect(analyzer);
    
    // Setup media recorder for audio capture
    mediaRecorder = new MediaRecorder(audioStream, {
      mimeType: 'audio/webm'
    });
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      // Process accumulated audio chunks
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      processAudioBlob(audioBlob);
      audioChunks = [];
    };
    
    // Start recording
    mediaRecorder.start(1000); // Capture in 1-second chunks
    
    return { success: true };
  } catch (error) {
    console.error('Audio capture failed:', error);
    return { success: false, error: error.message };
  }
}

// Stop audio capture
function stopAudioCapture() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
  
  if (audioStream) {
    audioStream.getTracks().forEach(track => track.stop());
    audioStream = null;
  }
  
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
  
  console.log('Audio capture stopped');
  return { success: true };
}

// Process audio blob
async function processAudioBlob(blob) {
  try {
    // Convert blob to array buffer
    const arrayBuffer = await blob.arrayBuffer();
    
    // Send to background script for further processing
    chrome.runtime.sendMessage({
      action: 'audioDataReady',
      data: arrayBuffer,
      timestamp: Date.now()
    });
    
    console.log('Audio blob processed and sent');
  } catch (error) {
    console.error('Audio processing failed:', error);
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Offscreen received message:', message);
  
  switch (message.action) {
    case 'startCapture':
      startAudioCapture().then(sendResponse);
      return true; // Async response
      
    case 'stopCapture':
      sendResponse(stopAudioCapture());
      break;
      
    case 'getStatus':
      sendResponse({
        success: true,
        capturing: mediaRecorder && mediaRecorder.state === 'recording',
        audioContext: !!audioContext
      });
      break;
      
    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }
});

// Cleanup on unload
window.addEventListener('beforeunload', () => {
  stopAudioCapture();
});

console.log('Offscreen document ready for audio processing');
