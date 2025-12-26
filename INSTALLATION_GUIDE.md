# Installation Guide - Video Translator Extension

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Installation Methods](#installation-methods)
- [Step-by-Step Installation](#step-by-step-installation)
- [Verification](#verification)
- [First-Time Setup](#first-time-setup)
- [Testing Instructions](#testing-instructions)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required
- **Browser**: Google Chrome 88+ or any Chromium-based browser (Edge, Brave, Opera)
- **Operating System**: Windows 10+, macOS 10.13+, or Linux (Ubuntu 18.04+)
- **Internet Connection**: Required for cloud-based translation (optional for offline mode)

### Optional
- **Microphone**: For audio capture from speakers (if direct capture fails)
- **Permissions**: Storage, tabs, scripting, notifications

---

## Installation Methods

### Method 1: Load Unpacked Extension (Recommended)

Best for: Development, testing, or if you have the source code.

**Advantages:**
- Easy updates (just refresh)
- Full debugging capabilities
- Can modify code

**Disadvantages:**
- Must keep source folder
- Shows "Developer mode" warning

### Method 2: Install from ZIP

Best for: Distribution without Chrome Web Store.

**Advantages:**
- Self-contained package
- Easy to share

**Disadvantages:**
- Must extract before loading
- Manual updates required

### Method 3: Chrome Web Store (Coming Soon)

Best for: End users.

**Advantages:**
- One-click installation
- Automatic updates
- No developer mode required

**Disadvantages:**
- Not yet available

---

## Step-by-Step Installation

### Method 1: Load Unpacked Extension

#### Step 1: Download the Extension

**Option A: Clone from Git**
```bash
git clone <repository-url>
cd video-translator-extension
```

**Option B: Download ZIP**
1. Download the extension ZIP file
2. Extract to a permanent location (e.g., `C:\Extensions\VideoTranslator` or `~/Extensions/VideoTranslator`)
3. **Important**: Don't delete this folder after installation!

#### Step 2: Open Chrome Extensions Page

Choose one of these methods:

**Method A: Via URL**
1. Open Chrome
2. Type in address bar: `chrome://extensions/`
3. Press Enter

**Method B: Via Menu**
1. Click the three-dot menu (⋮) in top-right corner
2. Hover over "More Tools"
3. Click "Extensions"

**Method C: Via Keyboard**
- Windows/Linux: Press `Ctrl + Shift + Delete`, then navigate to Extensions
- macOS: Press `Cmd + Shift + Delete`, then navigate to Extensions

#### Step 3: Enable Developer Mode

1. Look for "Developer mode" toggle in the **top-right** corner of the Extensions page
2. Click the toggle to enable it (it should turn blue/green)
3. New buttons will appear: "Load unpacked", "Pack extension", "Update"

![Developer Mode](https://via.placeholder.com/800x200/4CAF50/FFFFFF?text=Developer+Mode+Toggle)

#### Step 4: Load the Extension

1. Click the **"Load unpacked"** button
2. A file browser window will open
3. Navigate to the extension folder (where `manifest.json` is located)
4. Select the folder and click "Select Folder" (or "Open" on macOS)

**Important**: You must select the folder containing `manifest.json`, not the ZIP file!

#### Step 5: Verify Installation

You should now see:
- ✅ "Video Translator" card in your extensions list
- ✅ Extension icon in your browser toolbar (puzzle piece icon area)
- ✅ Status showing "On" with blue toggle
- ✅ Version number (1.0.0)

If you see any errors:
- Check that `manifest.json` exists in the selected folder
- Verify all required files are present
- See [Troubleshooting](#troubleshooting) section

#### Step 6: Pin the Extension (Optional but Recommended)

1. Click the puzzle piece icon (🧩) in the browser toolbar
2. Find "Video Translator" in the dropdown
3. Click the pin icon (📌) to pin it to the toolbar
4. The extension icon will now always be visible

---

### Method 2: Install from ZIP Package

#### Step 1: Create ZIP Package

If you have the source code and want to package it:

```bash
# Navigate to extension directory
cd video-translator-extension

# Create ZIP (excludes unnecessary files)
zip -r video-translator-v1.0.0.zip . \
  -x "*.git*" \
  -x "*.DS_Store" \
  -x "node_modules/*" \
  -x "*.md" \
  -x "*.sh"
```

Or on Windows (PowerShell):
```powershell
Compress-Archive -Path * -DestinationPath video-translator-v1.0.0.zip -Force
```

#### Step 2: Extract ZIP

1. Download/locate the ZIP file
2. Right-click → Extract All (Windows) or double-click (macOS)
3. Extract to a **permanent location**
4. Remember this location for future updates

#### Step 3: Follow Method 1 Steps

Continue from Method 1, Step 2 (Open Chrome Extensions Page)

---

## Verification

### Visual Verification

After installation, verify these elements:

1. **Extension Card** (chrome://extensions/)
   - [ ] Extension name: "Video Translator"
   - [ ] Version: 1.0.0
   - [ ] Status: Enabled (toggle is blue)
   - [ ] No error messages
   - [ ] Icon displays correctly

2. **Browser Toolbar**
   - [ ] Extension icon visible (if pinned)
   - [ ] Icon is colorful (not grayed out)

3. **Extension Popup**
   - [ ] Click extension icon
   - [ ] Popup window opens
   - [ ] UI elements display correctly
   - [ ] No console errors (press F12 to check)

### Functional Verification

1. **Test Popup**
   ```
   ✓ Extension icon clickable
   ✓ Popup opens without errors
   ✓ Settings controls are interactive
   ✓ Language dropdowns populate
   ✓ Toggle switches work
   ```

2. **Test on YouTube**
   ```
   ✓ Go to youtube.com
   ✓ Play any video
   ✓ Enable translation in popup
   ✓ Observe subtitle overlay appears
   ✓ Check browser console for errors (F12)
   ```

3. **Test Settings**
   ```
   ✓ Right-click extension icon → Options
   ✓ Options page opens in new tab
   ✓ All sections load correctly
   ✓ Settings can be changed and saved
   ```

---

## First-Time Setup

### Initial Configuration

1. **Click Extension Icon**
   - The popup window will open
   - Default settings are already configured

2. **Select Languages**
   - **Source Language**: Choose "Auto Detect" (recommended) or specific language
   - **Target Language**: Choose your preferred language (default: English)

3. **Choose Operating Mode**
   - For best results: **Auto Mode** (recommended)
   - For specific needs: Select from 11 available modes

4. **Adjust Display Settings** (Optional)
   - **Display Mode**: Simple (recommended for first use)
   - **Font Size**: Medium (default)
   - **Theme**: Auto (follows system preference)

5. **Test Audio** (Recommended)
   - Click "Test Audio" button in popup
   - Grant microphone permission if prompted
   - Verify audio capture is working

6. **Save Settings**
   - Settings auto-save when changed
   - Or click "Advanced Settings" to configure more options

### Permissions Setup

When you first use the extension, Chrome may ask for permissions:

1. **Microphone Permission**
   - Purpose: Capture audio for speech recognition
   - When asked: Click "Allow"
   - Location: Will appear as browser notification

2. **Storage Permission**
   - Purpose: Save your settings
   - Granted automatically during installation

3. **Tab Access Permission**
   - Purpose: Detect videos on web pages
   - Granted automatically during installation

### Grant Permissions Manually

If permissions were denied:

1. Go to `chrome://extensions/`
2. Find "Video Translator"
3. Click "Details"
4. Scroll to "Site access"
5. Select "On all sites" (recommended)
6. Check "Allow" for microphone under "Permissions"

---

## Testing Instructions

### Quick Test (5 minutes)

1. **Basic Functionality Test**
   ```
   1. Install extension (see above)
   2. Click extension icon
   3. Toggle "Enable Translation" ON
   4. Open new tab: youtube.com
   5. Play any video with spoken audio
   6. Verify subtitles appear
   7. Try dragging subtitles to reposition
   8. Toggle translation OFF
   9. Verify subtitles disappear
   ```

2. **Settings Test**
   ```
   1. Click extension icon
   2. Change "Target Language" to Spanish
   3. Reload video page
   4. Play video
   5. Verify subtitles are in Spanish
   6. Change "Font Size" to Large
   7. Verify subtitle size increases
   ```

3. **Advanced Settings Test**
   ```
   1. Right-click extension icon → Options
   2. Navigate through all sections
   3. Change "Theme" to Dark
   4. Click "Save Settings"
   5. Verify theme changes immediately
   ```

### Comprehensive Test (15 minutes)

#### Test 1: Video Detection
- [ ] YouTube video detected
- [ ] Vimeo video detected
- [ ] HTML5 video detected
- [ ] Embedded iframe video detected

#### Test 2: Translation Engines
- [ ] Google Translate works
- [ ] Fallback to secondary engine works
- [ ] Error handling works (disable internet)

#### Test 3: Display Modes
- [ ] Simple mode works
- [ ] Cinematic mode works
- [ ] Educational mode (dual language) works
- [ ] Interactive mode works

#### Test 4: Keyboard Shortcuts
- [ ] Ctrl+Shift+S toggles translation
- [ ] Ctrl+↑ increases font size
- [ ] Ctrl+↓ decreases font size

#### Test 5: Performance
- [ ] No browser lag during translation
- [ ] Memory usage reasonable (<100MB)
- [ ] Extension works on multiple tabs

#### Test 6: Edge Cases
- [ ] Works with muted video
- [ ] Works with headphones connected
- [ ] Works when video speed changed
- [ ] Survives page refresh

---

## Troubleshooting

### Extension Won't Load

**Error: "Manifest file is missing or unreadable"**

**Solution:**
1. Verify `manifest.json` exists in the root folder
2. Check file is not corrupted
3. Ensure proper JSON formatting (no trailing commas)
4. Re-download extension if needed

**Error: "Failed to load extension"**

**Solution:**
1. Check Chrome version (must be 88+)
2. Disable other conflicting extensions
3. Clear Chrome cache
4. Restart Chrome
5. Try loading in Incognito mode

### Extension Icon Not Appearing

**Problem:** Extension loads but icon not in toolbar

**Solution:**
1. Click puzzle piece icon (🧩) in toolbar
2. Find "Video Translator" in dropdown
3. Click pin icon to pin it
4. If still not visible, restart Chrome

### No Subtitles Appearing

**Problem:** Extension enabled but no subtitles show

**Solution:**
1. **Check Translation Toggle**
   - Click extension icon
   - Ensure toggle is ON (blue/green)

2. **Verify Video Detected**
   - Open DevTools (F12)
   - Check Console for "Video detected" message
   - If not detected, refresh page

3. **Check Permissions**
   - Go to chrome://extensions/
   - Click "Details" for Video Translator
   - Verify "Site access" is "On all sites"

4. **Test Audio Capture**
   - Click extension icon
   - Click "Test Audio" button
   - Grant microphone permission if asked
   - Verify test passes

5. **Check Internet Connection**
   - Translation requires internet (unless offline mode)
   - Verify connection is active
   - Try different website

### Translation Not Working

**Problem:** Subtitles appear but not translated

**Solution:**
1. **Verify Language Selection**
   - Source language should be correct
   - Target language should be different from source
   - Try "Auto Detect" for source

2. **Check Translation Engines**
   - Open Options → Translation section
   - Enable multiple engines for fallback
   - Move Google Translate to priority 1

3. **Clear Cache**
   - Options → Privacy section
   - Click "Clear All Data"
   - Reconfigure settings
   - Restart Chrome

### Performance Issues

**Problem:** Browser slows down with extension

**Solution:**
1. **Switch to Economy Mode**
   - Click extension icon
   - Select "Operating Mode" → "Economy Mode"

2. **Reduce Settings**
   - Options → Performance
   - Set "Performance Mode" to "Low"
   - Reduce "Buffer Size" to 3 seconds
   - Lower "Maximum Memory Usage" to 50MB

3. **Disable Features**
   - Disable "Archive"
   - Disable "Sentiment Analysis"
   - Disable "Interactive Learning"
   - Disable "GPU Acceleration" (if causing issues)

4. **Close Unused Tabs**
   - Extension runs per-tab
   - Each tab uses resources
   - Close tabs you're not using

### Audio Capture Fails

**Problem:** No audio captured, subtitles don't generate

**Solution:**
1. **Grant Microphone Permission**
   - Chrome will prompt when needed
   - Click "Allow"
   - Or grant manually: chrome://settings/content/microphone

2. **Try Different Capture Method**
   - Options → Audio Capture
   - Change "Capture Method" to "Microphone Capture"
   - Or try "Hybrid Capture"

3. **Check Audio Devices**
   - Ensure speakers/headphones working
   - Try unplugging and replugging
   - Check system audio settings

4. **Enable Always Capture Mode**
   - Options → Audio Capture
   - Check "Always Capture Mode"
   - Restart video

### Extension Crashes or Freezes

**Problem:** Extension stops responding

**Solution:**
1. **Reload Extension**
   - Go to chrome://extensions/
   - Find "Video Translator"
   - Click refresh icon (🔄)

2. **Check Console Errors**
   - Right-click extension icon → Inspect popup
   - Check Console tab for errors
   - Report errors if persistent

3. **Reinstall Extension**
   - Remove extension
   - Clear Chrome cache
   - Reinstall fresh copy

4. **Report Bug**
   - Note steps to reproduce
   - Capture console errors
   - Submit issue on GitHub

### DRM Content Not Working

**Problem:** Netflix, Disney+, etc. don't work

**Solution:**
1. **Enable DRM Bypass**
   - Options → Advanced → Site Compatibility
   - Enable "DRM Bypass (System audio capture)"

2. **Use Microphone Capture**
   - Options → Audio Capture
   - Set "Capture Method" to "Microphone Capture"
   - Ensure audio plays through speakers

3. **Legal Note**
   - Some DRM content cannot be captured legally
   - Check terms of service for your streaming platform
   - Use at your own discretion

---

## Getting Help

### Resources

- **README.md**: Comprehensive documentation
- **GitHub Issues**: Report bugs or request features
- **Console Logs**: Check for error messages (F12 → Console)
- **Extension Options**: Built-in help text

### Reporting Issues

When reporting bugs, include:

1. **System Information**
   - Chrome version: `chrome://version/`
   - OS version
   - Extension version

2. **Steps to Reproduce**
   - Exact steps that cause the issue
   - Expected behavior
   - Actual behavior

3. **Console Errors**
   - Open DevTools (F12)
   - Copy any error messages from Console
   - Take screenshots if helpful

4. **Video Site**
   - URL of the problematic video
   - Video platform (YouTube, Vimeo, etc.)
   - Any site-specific settings

### Contact

- **GitHub**: [Repository Issues]
- **Email**: support@videotranslator.example.com

---

## Next Steps

After successful installation:

1. ✅ **Read the README.md** for full feature list
2. ✅ **Explore Advanced Settings** for customization
3. ✅ **Test on different sites** (YouTube, Vimeo, etc.)
4. ✅ **Customize keyboard shortcuts** in Chrome settings
5. ✅ **Join the community** for tips and updates

---

**Congratulations! You've successfully installed Video Translator Extension!** 🎉

Enjoy breaking language barriers, one video at a time! 🌍
