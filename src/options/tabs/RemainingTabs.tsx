import React, { useState } from 'react';
import { useSettings } from '../../shared/hooks/useSettings';
import { Select } from '../../shared/components/Select';
import { Slider } from '../../shared/components/Slider';
import { Toggle } from '../../shared/components/Toggle';
import { TRANSLATION_ENGINES } from '../../constants/engines';
import { LanguageSelector } from '../../shared/components/LanguageSelector';
import { TRANSLATION_LANGUAGES } from '../../constants/languages';
import styles from './tabs.module.css';

export const TranslationSettings: React.FC = () => {
  const { settings, updateSetting } = useSettings();
  const [qualityMode, setQualityMode] = useState<'high' | 'medium' | 'low'>(
    (settings.performanceSettings as any)?.qualityMode || 'medium'
  );

  const engineOptions = TRANSLATION_ENGINES.map(engine => ({
    value: engine.id,
    label: `${engine.icon} ${engine.name}`,
    description: engine.free ? 'Free' : 'Requires API key',
    icon: engine.icon,
  }));

  const displaySettings = settings.displaySettings || {};

  return (
    <div className={styles.tab}>
      <div className={styles.section}>
        <h3>Translation Engine</h3>
        <p className={styles.description}>
          Choose the translation service to use
        </p>
        <Select
          value={settings.translationEngine || 'google'}
          onChange={(engine) => updateSetting('translationEngine', engine)}
          options={engineOptions}
          searchable
        />
        <div className={styles.engineInfo}>
          <span className={styles.engineLabel}>
            {TRANSLATION_ENGINES.find(e => e.id === settings.translationEngine)?.description}
          </span>
          <span className={`${styles.freeTag} ${
            TRANSLATION_ENGINES.find(e => e.id === settings.translationEngine)?.free 
              ? styles.free : styles.paid
          }`}>
            {TRANSLATION_ENGINES.find(e => e.id === settings.translationEngine)?.free 
              ? 'Free' : 'API Key Required'}
          </span>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Quality Mode</h3>
        <p className={styles.description}>
          Balance between translation quality and speed
        </p>
        <div className={styles.qualityButtons}>
          {(['high', 'medium', 'low'] as const).map(mode => (
            <button
              key={mode}
              className={`${styles.qualityBtn} ${qualityMode === mode ? styles.active : ''}`}
              onClick={() => {
                setQualityMode(mode);
                updateSetting('performanceSettings', {
                  ...(settings.performanceSettings || {}),
                  qualityMode: mode
                });
              }}
            >
              <span className={styles.stars}>
                {mode === 'high' && '⭐⭐⭐'}
                {mode === 'medium' && '⭐⭐'}
                {mode === 'low' && '⭐'}
              </span>
              <span>{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3>Retry Attempts</h3>
        <p className={styles.description}>
          Number of times to retry failed translations
        </p>
        <Slider
          min={1}
          max={5}
          step={1}
          value={(settings.advancedSettings as any)?.retryAttempts || 3}
          onChange={(value) => updateSetting('advancedSettings', {
            ...(settings.advancedSettings || {}),
            retryAttempts: value
          })}
          showValue
        />
      </div>

      <div className={styles.section}>
        <h3>Cache Translations</h3>
        <p className={styles.description}>
          Store translated text for faster repeated translations
        </p>
        <Toggle
          label="Enable translation cache"
          checked={(settings.advancedSettings as any)?.cacheEnabled !== false}
          onChange={(checked) => updateSetting('advancedSettings', {
            ...(settings.advancedSettings || {}),
            cacheEnabled: checked
          })}
        />
      </div>

      <div className={styles.section}>
        <h3>Fallback Chain</h3>
        <p className={styles.description}>
          Fallback order when primary engine fails
        </p>
        <div className={styles.fallbackChain}>
          {TRANSLATION_ENGINES.slice(0, 5).map((engine, idx) => (
            <div key={engine.id} className={styles.chainItem}>
              <span className={styles.order}>{idx + 1}</span>
              <span className={styles.engineIcon}>{engine.icon}</span>
              <span className={styles.engineName}>{engine.name}</span>
              {idx < 4 && <span className={styles.arrow}>→</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AudioSettingsTab: React.FC = () => {
  const { settings, updateSetting } = useSettings();
  const audioSettings = settings.audioSettings || {};

  const captureMethods = [
    { value: 'direct', label: 'Direct Capture', icon: '🎯' },
    { value: 'microphone', label: 'Microphone', icon: '🎤' },
    { value: 'hybrid', label: 'Hybrid', icon: '🔄' },
    { value: 'api', label: 'Audio API', icon: '🔌' },
    { value: 'manual', label: 'Manual', icon: '✍️' },
  ];

  return (
    <div className={styles.tab}>
      <div className={styles.section}>
        <h3>Audio Capture Method</h3>
        <p className={styles.description}>
          How to capture audio from video players
        </p>
        <Select
          value={audioSettings.captureMethod || 'direct'}
          onChange={(method) => updateSetting('audioSettings', { ...audioSettings, captureMethod: method })}
          options={captureMethods}
        />
      </div>

      <div className={styles.section}>
        <h3>Microphone Sensitivity</h3>
        <p className={styles.description}>
          Adjust sensitivity when using microphone capture
        </p>
        <div className={styles.qualityButtons}>
          {(['low', 'medium', 'high'] as const).map(sensitivity => (
            <button
              key={sensitivity}
              className={`${styles.qualityBtn} ${audioSettings.microphoneSensitivity === sensitivity ? styles.active : ''}`}
              onClick={() => updateSetting('audioSettings', { ...audioSettings, microphoneSensitivity: sensitivity })}
            >
              {sensitivity === 'low' && '🔈'}
              {sensitivity === 'medium' && '🔉'}
              {sensitivity === 'high' && '🔊'}
              <span>{sensitivity.charAt(0).toUpperCase() + sensitivity.slice(1)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3>Noise Filter</h3>
        <p className={styles.description}>
          Reduce background noise in audio capture
        </p>
        <Select
          value={audioSettings.noiseFilterLevel || 'off'}
          onChange={(level) => updateSetting('audioSettings', { ...audioSettings, noiseFilterLevel: level })}
          options={[
            { value: 'off', label: 'Off' },
            { value: 'light', label: 'Light' },
            { value: 'medium', label: 'Medium' },
            { value: 'heavy', label: 'Heavy' },
          ]}
        />
      </div>

      <div className={styles.section}>
        <h3>Multi-Channel Support</h3>
        <p className={styles.description}>
          Capture audio from multiple channels
        </p>
        <Toggle
          label="Enable multi-channel capture"
          checked={audioSettings.multiChannelEnabled || false}
          onChange={(checked) => updateSetting('audioSettings', { ...audioSettings, multiChannelEnabled: checked })}
        />
      </div>

      <div className={styles.section}>
        <h3>Always Capture</h3>
        <p className={styles.description}>
          Capture audio even when video is muted
        </p>
        <Toggle
          label="Enable always-capture mode"
          checked={audioSettings.alwaysCapture || false}
          onChange={(checked) => updateSetting('audioSettings', { ...audioSettings, alwaysCapture: checked })}
        />
      </div>
    </div>
  );
};

export const DisplaySettingsTab: React.FC = () => {
  const { settings, updateSetting } = useSettings();
  const displaySettings = settings.displaySettings || {};

  return (
    <div className={styles.tab}>
      <div className={styles.twoColumn}>
        <div className={styles.column}>
          <div className={styles.section}>
            <h3>Font Size</h3>
            <Slider
              min={12}
              max={32}
              step={1}
              value={displaySettings.fontSize || 16}
              onChange={(size) => updateSetting('displaySettings', { ...displaySettings, fontSize: size })}
              showValue
              unit="px"
            />
          </div>

          <div className={styles.section}>
            <h3>Font Family</h3>
            <Select
              value={displaySettings.fontFamily || 'sans'}
              onChange={(font) => updateSetting('displaySettings', { ...displaySettings, fontFamily: font })}
              options={[
                { value: 'sans', label: 'Sans Serif' },
                { value: 'serif', label: 'Serif' },
                { value: 'monospace', label: 'Monospace' },
              ]}
            />
          </div>

          <div className={styles.section}>
            <h3>Text Align</h3>
            <div className={styles.alignButtons}>
              {['left', 'center', 'right'].map(align => (
                <button
                  key={align}
                  className={`${styles.alignBtn} ${(displaySettings.textAlign || 'center') === align ? styles.active : ''}`}
                  onClick={() => updateSetting('displaySettings', { ...displaySettings, textAlign: align })}
                >
                  {align === 'left' && '⬅️'}
                  {align === 'center' && '↔️'}
                  {align === 'right' && '➡️'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.section}>
            <h3>Position</h3>
            <div className={styles.positionButtons}>
              {['top', 'bottom', 'center'].map(pos => (
                <button
                  key={pos}
                  className={`${styles.posBtn} ${displaySettings.position === pos ? styles.active : ''}`}
                  onClick={() => updateSetting('displaySettings', { ...displaySettings, position: pos })}
                >
                  {pos === 'top' && '⬆️'}
                  {pos === 'bottom' && '⬇️'}
                  {pos === 'center' && '◈'}
                  <span>{pos.charAt(0).toUpperCase() + pos.slice(1)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h3>Display Mode</h3>
            <Select
              value={displaySettings.displayMode || 'simple'}
              onChange={(mode) => updateSetting('displaySettings', { ...displaySettings, displayMode: mode })}
              options={[
                { value: 'simple', label: 'Simple (Text only)' },
                { value: 'cinematic', label: 'Cinematic (Large text)' },
                { value: 'educational', label: 'Educational (Dual)' },
                { value: 'interactive', label: 'Interactive (Editable)' },
              ]}
            />
          </div>

          <div className={styles.section}>
            <h3>Opacity</h3>
            <Slider
              min={50}
              max={100}
              step={5}
              value={displaySettings.opacity || 100}
              onChange={(opacity) => updateSetting('displaySettings', { ...displaySettings, opacity })}
              showValue
              unit="%"
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Shadow & Effects</h3>
        <Toggle
          label="Enable text shadow and effects"
          checked={displaySettings.shadowEnabled !== false}
          onChange={(checked) => updateSetting('displaySettings', { ...displaySettings, shadowEnabled: checked })}
        />
      </div>

      <div className={styles.previewSection}>
        <h3>Preview</h3>
        <div 
          className={styles.previewBox}
          style={{
            fontSize: `${displaySettings.fontSize || 16}px`,
            fontFamily: displaySettings.fontFamily || 'sans-serif',
            textAlign: displaySettings.textAlign || 'center',
            opacity: (displaySettings.opacity || 100) / 100,
            textShadow: displaySettings.shadowEnabled !== false ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none',
          }}
        >
          This is a preview of how your subtitles will appear
        </div>
      </div>
    </div>
  );
};

export const PerformanceSettingsTab: React.FC = () => {
  const { settings, updateSetting } = useSettings();
  const perfSettings = settings.performanceSettings || {};

  const modeOptions = [
    { value: 'high', label: '⚡ High Performance', description: 'Maximum speed' },
    { value: 'balanced', label: '⚖️ Balanced', description: 'Speed and quality' },
    { value: 'low', label: '🔋 Battery Saver', description: 'Lower resource usage' },
  ];

  return (
    <div className={styles.tab}>
      <div className={styles.section}>
        <h3>Performance Mode</h3>
        <p className={styles.description}>
          Choose between performance and battery life
        </p>
        <div className={styles.modeCards}>
          {modeOptions.map(mode => (
            <button
              key={mode.value}
              className={`${styles.modeCard} ${perfSettings.mode === mode.value ? styles.active : ''}`}
              onClick={() => updateSetting('performanceSettings', { ...perfSettings, mode: mode.value })}
            >
              <span className={styles.modeLabel}>{mode.label}</span>
              <span className={styles.modeDesc}>{mode.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3>GPU Acceleration</h3>
        <p className={styles.description}>
          Use GPU for faster processing
        </p>
        <Toggle
          label="Enable GPU acceleration"
          checked={perfSettings.gpuAcceleration !== false}
          onChange={(checked) => updateSetting('performanceSettings', { ...perfSettings, gpuAcceleration: checked })}
        />
      </div>

      <div className={styles.section}>
        <h3>Memory Limit</h3>
        <p className={styles.description}>
          Maximum memory the extension can use
        </p>
        <Slider
          min={50}
          max={500}
          step={50}
          value={perfSettings.memoryLimit || 256}
          onChange={(value) => updateSetting('performanceSettings', { ...perfSettings, memoryLimit: value })}
          showValue
          unit="MB"
        />
      </div>

      <div className={styles.section}>
        <h3>Battery Saver</h3>
        <p className={styles.description}>
          Reduce background activity when on battery
        </p>
        <Toggle
          label="Enable battery saver mode"
          checked={perfSettings.batterySaverMode || false}
          onChange={(checked) => updateSetting('performanceSettings', { ...perfSettings, batterySaverMode: checked })}
        />
      </div>

      <div className={styles.section}>
        <h3>Thread Count</h3>
        <p className={styles.description}>
          Number of parallel processing threads
        </p>
        <Select
          value={(perfSettings.threadCount || 'auto').toString()}
          onChange={(value) => updateSetting('performanceSettings', { 
            ...perfSettings, 
            threadCount: value === 'auto' ? 'auto' : parseInt(value) 
          })}
          options={[
            { value: 'auto', label: 'Auto (Recommended)' },
            { value: '1', label: '1 Thread' },
            { value: '2', label: '2 Threads' },
            { value: '4', label: '4 Threads' },
            { value: '8', label: '8 Threads' },
          ]}
        />
      </div>
    </div>
  );
};

export const PrivacySettingsTab: React.FC = () => {
  const { settings, updateSetting } = useSettings();
  const privacySettings = settings.privacySettings || {};

  const deleteOptions = [
    { value: 'disabled', label: 'Never' },
    { value: '1h', label: 'After 1 hour' },
    { value: '24h', label: 'After 24 hours' },
    { value: '1w', label: 'After 1 week' },
    { value: '1m', label: 'After 1 month' },
  ];

  const handleClearData = async () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      await chrome.storage.local.clear();
      await chrome.storage.sync.clear();
      location.reload();
    }
  };

  return (
    <div className={styles.tab}>
      <div className={styles.section}>
        <h3>Local-Only Mode</h3>
        <p className={styles.description}>
          Process everything locally, no data sent to servers
        </p>
        <Toggle
          label="Enable local-only mode"
          checked={privacySettings.localOnlyMode || false}
          onChange={(checked) => updateSetting('privacySettings', { ...privacySettings, localOnlyMode: checked })}
        />
      </div>

      <div className={styles.section}>
        <h3>Anonymous Mode</h3>
        <p className={styles.description}>
          Don't send any usage statistics
        </p>
        <Toggle
          label="Enable anonymous mode"
          checked={privacySettings.anonymousMode !== false}
          onChange={(checked) => updateSetting('privacySettings', { ...privacySettings, anonymousMode: checked })}
        />
      </div>

      <div className={styles.section}>
        <h3>Auto-Delete Recordings</h3>
        <p className={styles.description}>
          Automatically delete translation history
        </p>
        <Select
          value={privacySettings.autoDeleteRecordings || 'disabled'}
          onChange={(value) => updateSetting('privacySettings', { ...privacySettings, autoDeleteRecordings: value })}
          options={deleteOptions}
        />
      </div>

      <div className={styles.section}>
        <h3>Data Encryption</h3>
        <p className={styles.description}>
          Encrypt stored translations
        </p>
        <Toggle
          label="Enable data encryption"
          checked={privacySettings.dataEncryption !== false}
          onChange={(checked) => updateSetting('privacySettings', { ...privacySettings, dataEncryption: checked })}
        />
      </div>

      <div className={styles.section}>
        <h3>Quick Lock</h3>
        <p className={styles.description}>
          Quickly hide the extension with a keyboard shortcut
        </p>
        <Toggle
          label="Enable quick lock"
          checked={privacySettings.quickLock || false}
          onChange={(checked) => updateSetting('privacySettings', { ...privacySettings, quickLock: checked })}
        />
      </div>

      <div className={styles.section}>
        <h3>Clear All Data</h3>
        <p className={styles.description}>
          Remove all stored settings and translation history
        </p>
        <button className={styles.dangerButton} onClick={handleClearData}>
          🗑️ Clear All Data
        </button>
      </div>
    </div>
  );
};

export const IntegrationsSettingsTab: React.FC = () => {
  const { settings, updateSetting } = useSettings();
  const intSettings = settings.integrationsSettings || {};

  const [whitelist, setWhitelist] = useState((intSettings.whitelist || []).join('\n'));
  const [blacklist, setBlacklist] = useState((intSettings.blacklist || []).join('\n'));

  const handleWhitelistChange = (value: string) => {
    setWhitelist(value);
    const domains = value.split('\n').filter(d => d.trim());
    updateSetting('integrationsSettings', { ...intSettings, whitelist: domains });
  };

  const handleBlacklistChange = (value: string) => {
    setBlacklist(value);
    const domains = value.split('\n').filter(d => d.trim());
    updateSetting('integrationsSettings', { ...intSettings, blacklist: domains });
  };

  const handleExport = async () => {
    const data = await chrome.storage.sync.get(null);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'video-translator-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          await chrome.storage.sync.set(imported);
          location.reload();
        } catch {
          alert('Invalid settings file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={styles.tab}>
      <div className={styles.section}>
        <h3>Cloud Integrations</h3>
        <p className={styles.description}>
          Connect to cloud services
        </p>
        <div className={styles.integrationButtons}>
          <button className={styles.integrationBtn}>
            <span className={styles.icon}>📁</span>
            <span>Google Drive</span>
            <span className={styles.status}>
              {intSettings.googleDrive ? '✅ Connected' : 'Connect'}
            </span>
          </button>
          <button className={styles.integrationBtn}>
            <span className={styles.icon}>📦</span>
            <span>Dropbox</span>
            <span className={styles.status}>
              {intSettings.dropbox ? '✅ Connected' : 'Connect'}
            </span>
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Site Whitelist</h3>
        <p className={styles.description}>
          Sites where the extension will always run (one per line)
        </p>
        <textarea
          className={styles.textarea}
          value={whitelist}
          onChange={(e) => handleWhitelistChange(e.target.value)}
          placeholder="youtube.com&#10;netflix.com"
          rows={4}
        />
      </div>

      <div className={styles.section}>
        <h3>Site Blacklist</h3>
        <p className={styles.description}>
          Sites where the extension will never run (one per line)
        </p>
        <textarea
          className={styles.textarea}
          value={blacklist}
          onChange={(e) => handleBlacklistChange(e.target.value)}
          placeholder="facebook.com"
          rows={4}
        />
      </div>

      <div className={styles.section}>
        <h3>Export/Import Settings</h3>
        <p className={styles.description}>
          Backup or restore your settings
        </p>
        <div className={styles.exportButtons}>
          <button className={styles.exportBtn} onClick={handleExport}>
            📤 Export Settings
          </button>
          <label className={styles.importBtn}>
            📥 Import Settings
            <input type="file" accept=".json" onChange={handleImport} hidden />
          </label>
        </div>
      </div>
    </div>
  );
};

export const AdvancedSettingsTab: React.FC = () => {
  const { settings, updateSetting } = useSettings();
  const advSettings = settings.advancedSettings || {};

  return (
    <div className={styles.tab}>
      <div className={styles.section}>
        <h3>Developer Mode</h3>
        <p className={styles.description}>
          Enable advanced debugging tools
        </p>
        <Toggle
          label="Enable developer mode"
          checked={advSettings.developerMode || false}
          onChange={(checked) => updateSetting('advancedSettings', { ...advSettings, developerMode: checked })}
        />
      </div>

      <div className={styles.section}>
        <h3>Experimental Features</h3>
        <p className={styles.description}>
          Try new features before they're released
        </p>
        <Toggle
          label="Enable experimental features"
          checked={advSettings.experimentalFeatures || false}
          onChange={(checked) => updateSetting('advancedSettings', { ...advSettings, experimentalFeatures: checked })}
        />
      </div>

      <div className={styles.section}>
        <h3>Advanced Audio</h3>
        <p className={styles.description}>
          Enable additional audio processing options
        </p>
        <Toggle
          label="Enable advanced audio options"
          checked={advSettings.advancedAudio || false}
          onChange={(checked) => updateSetting('advancedSettings', { ...advSettings, advancedAudio: checked })}
        />
      </div>

      <div className={styles.section}>
        <h3>Log Level</h3>
        <p className={styles.description}>
          How detailed should the logs be
        </p>
        <Select
          value={advSettings.logLevel || 'info'}
          onChange={(level) => updateSetting('advancedSettings', { ...advSettings, logLevel: level })}
          options={[
            { value: 'debug', label: 'Debug (Most verbose)' },
            { value: 'info', label: 'Info' },
            { value: 'warn', label: 'Warnings only' },
            { value: 'error', label: 'Errors only' },
          ]}
        />
      </div>

      <div className={styles.section}>
        <h3>Request Timeout</h3>
        <p className={styles.description}>
          Maximum time to wait for translation requests
        </p>
        <Slider
          min={5}
          max={60}
          step={5}
          value={(advSettings.timeout || 30) / 1000}
          onChange={(seconds) => updateSetting('advancedSettings', { ...advSettings, timeout: seconds * 1000 })}
          showValue
          unit="s"
        />
      </div>

      <div className={styles.section}>
        <h3>Custom API Endpoints</h3>
        <p className={styles.description}>
          Use custom translation API endpoints
        </p>
        <input
          type="text"
          className={styles.textInput}
          placeholder="https://api.example.com/translate"
          value={(advSettings.customEndpoints?.[0]) || ''}
          onChange={(e) => updateSetting('advancedSettings', { 
            ...advSettings, 
            customEndpoints: [e.target.value] 
          })}
        />
      </div>

      <div className={styles.section}>
        <h3>Webhook URL</h3>
        <p className={styles.description}>
          Receive notifications at this URL
        </p>
        <input
          type="text"
          className={styles.textInput}
          placeholder="https://example.com/webhook"
          value={(advSettings.webhooks?.[0]) || ''}
          onChange={(e) => updateSetting('advancedSettings', { 
            ...advSettings, 
            webhooks: [{ url: e.target.value, events: ['translation_complete', 'error'] }] 
          })}
        />
      </div>

      {advSettings.developerMode && (
        <div className={styles.section}>
          <h3>Debug Console</h3>
          <div className={styles.logViewer}>
            <div className={styles.logHeader}>
              <span>Console Output</span>
              <button onClick={() => console.clear()}>Clear</button>
            </div>
            <div className={styles.logContent}>
              [Dev mode enabled - logs appear here]
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
