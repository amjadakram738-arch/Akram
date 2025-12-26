# Testing Guide - Video Translator Extension

## 📋 Complete Testing Checklist

This guide provides comprehensive testing procedures for the Video Translator Chrome Extension.

---

## 🚀 Quick Start Testing (5 minutes)

### Prerequisites
- Chrome browser (v88+)
- Extension installed and loaded
- Internet connection
- Video website (YouTube recommended for first test)

### Basic Functionality Test

1. **Load Extension**
   ```
   ✓ Go to chrome://extensions/
   ✓ Verify "Video Translator" is present
   ✓ Verify status is "Enabled"
   ✓ No error messages shown
   ```

2. **Test Popup**
   ```
   ✓ Click extension icon
   ✓ Popup opens without errors
   ✓ All UI elements visible
   ✓ Toggle works
   ✓ Dropdowns populate
   ```

3. **Test on YouTube**
   ```
   ✓ Go to youtube.com
   ✓ Search for "TED Talk" or any video with speech
   ✓ Click extension icon
   ✓ Toggle "Enable Translation" ON
   ✓ Play video
   ✓ Wait 5 seconds
   ✓ Verify subtitle overlay appears
   ✓ Verify subtitles update with translation
   ```

**Expected Result**: Subtitles should appear over the video with translated text.

**If it works**: Extension is functioning correctly! ✅

**If it doesn't work**: See [Troubleshooting](#troubleshooting) section below.

---

## 🧪 Comprehensive Testing (30 minutes)

### 1. Installation Testing

#### Test 1.1: Clean Installation
```
Steps:
1. Remove extension if already installed
2. Clear browser cache
3. Restart Chrome
4. Install extension fresh
5. Verify no errors during installation

Expected: Extension installs without errors
Status: [ ] Pass [ ] Fail
```

#### Test 1.2: Extension Permissions
```
Steps:
1. Go to chrome://extensions/
2. Click "Details" for Video Translator
3. Check listed permissions

Expected: 
- ✓ Read and change all your data on all websites
- ✓ Display notifications
- ✓ Manage your apps, extensions, and themes

Status: [ ] Pass [ ] Fail
```

#### Test 1.3: Icon Display
```
Steps:
1. Look at browser toolbar
2. Click puzzle icon (if extension not visible)
3. Pin extension to toolbar

Expected: Extension icon appears and is functional
Status: [ ] Pass [ ] Fail
```

---

### 2. User Interface Testing

#### Test 2.1: Popup Interface
```
Steps:
1. Click extension icon
2. Check all elements render correctly
3. Try interacting with each control

Elements to check:
[ ] Header with logo and title
[ ] Translation toggle switch
[ ] Operating mode dropdown
[ ] Source language dropdown (populated)
[ ] Target language dropdown (populated)
[ ] Display mode dropdown
[ ] Font size dropdown
[ ] Dual language checkbox
[ ] Theme dropdown
[ ] Test Audio button
[ ] Export Subtitles button
[ ] Status indicator
[ ] Advanced Settings button

Status: [ ] Pass [ ] Fail
```

#### Test 2.2: Options Page
```
Steps:
1. Right-click extension icon → Options
2. Navigate through all sections
3. Verify all controls work

Sections to test:
[ ] General settings
[ ] Audio capture settings
[ ] Translation engine configuration
[ ] Display & UI settings
[ ] Performance settings
[ ] Privacy & security settings
[ ] Advanced features
[ ] About section

Status: [ ] Pass [ ] Fail
```

#### Test 2.3: Theme Switching
```
Steps:
1. Open popup
2. Change theme to "Light"
3. Verify UI updates
4. Change to "Dark"
5. Verify UI updates
6. Change to "Auto"
7. Verify follows system preference

Expected: Theme changes immediately without reload
Status: [ ] Pass [ ] Fail
```

---

### 3. Video Detection Testing

#### Test 3.1: YouTube Detection
```
Steps:
1. Go to youtube.com
2. Open DevTools (F12) → Console
3. Play any video
4. Look for "Video detected" message

Expected: Video detected within 1 second
Status: [ ] Pass [ ] Fail
```

#### Test 3.2: Vimeo Detection
```
Steps:
1. Go to vimeo.com
2. Open any video
3. Check Console for detection message

Expected: Video detected successfully
Status: [ ] Pass [ ] Fail
```

#### Test 3.3: HTML5 Video Detection
```
Steps:
1. Go to any site with HTML5 video player
2. Play video
3. Check detection

Test sites:
- https://www.w3schools.com/html/html5_video.asp
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video

Expected: Video detected
Status: [ ] Pass [ ] Fail
```

#### Test 3.4: iframe Video Detection
```
Steps:
1. Find page with embedded YouTube/Vimeo video
2. Verify detection works in iframe

Expected: Video in iframe is detected
Status: [ ] Pass [ ] Fail
```

#### Test 3.5: Dynamic Video Loading
```
Steps:
1. Go to site with infinite scroll (YouTube homepage)
2. Scroll down to load more videos
3. Click on dynamically loaded video
4. Verify detection still works

Expected: New videos detected as they load
Status: [ ] Pass [ ] Fail
```

---

### 4. Translation Testing

#### Test 4.1: Basic Translation
```
Steps:
1. Go to YouTube
2. Play English video
3. Enable translation
4. Set target to Spanish
5. Wait for subtitles

Expected: English audio translated to Spanish text
Status: [ ] Pass [ ] Fail
```

#### Test 4.2: Auto Language Detection
```
Steps:
1. Play Spanish video
2. Set source to "Auto Detect"
3. Set target to English
4. Verify correct detection

Expected: Spanish auto-detected and translated to English
Status: [ ] Pass [ ] Fail
```

#### Test 4.3: Multiple Language Pairs
```
Test these pairs:
[ ] English → Spanish
[ ] Spanish → English
[ ] French → English
[ ] German → English
[ ] Chinese → English
[ ] Japanese → English
[ ] Arabic → English
[ ] English → Arabic (RTL test)

Status: [ ] Pass [ ] Fail
```

#### Test 4.4: Translation Engine Fallback
```
Steps:
1. Open Options → Translation section
2. Note current engine order
3. Disable top engine
4. Test translation still works
5. Re-enable all engines

Expected: Fallback to next available engine
Status: [ ] Pass [ ] Fail
```

#### Test 4.5: Translation Quality
```
Steps:
1. Play video with clear speech
2. Compare original vs translated meaning
3. Check for obvious errors

Quality criteria:
[ ] Translation makes sense
[ ] Key terms preserved
[ ] Grammar mostly correct
[ ] Context appropriate

Status: [ ] Pass [ ] Fail
```

---

### 5. Audio Capture Testing

#### Test 5.1: Direct Capture
```
Steps:
1. Options → Audio → Select "Direct Capture"
2. Play YouTube video
3. Verify subtitles generate

Expected: Audio captured from video stream
Status: [ ] Pass [ ] Fail
```

#### Test 5.2: Microphone Capture
```
Steps:
1. Options → Audio → Select "Microphone Capture"
2. Grant microphone permission
3. Play video through speakers
4. Verify subtitles generate

Expected: Audio captured from microphone
Status: [ ] Pass [ ] Fail
```

#### Test 5.3: Audio Test Function
```
Steps:
1. Click extension icon
2. Click "Test Audio" button
3. Grant permissions if asked
4. Read result message

Expected: Test passes with capabilities listed
Status: [ ] Pass [ ] Fail
```

#### Test 5.4: Muted Video
```
Steps:
1. Play video
2. Mute video
3. Enable translation

Expected: Still captures audio (internal routing)
Status: [ ] Pass [ ] Fail
```

#### Test 5.5: Headphones Connected
```
Steps:
1. Connect headphones
2. Play video through headphones
3. Enable translation

Expected: Audio still captured
Status: [ ] Pass [ ] Fail
```

---

### 6. Display & UI Testing

#### Test 6.1: Display Modes
```
Test each mode:

[ ] Simple Mode
    - Clean subtitle at bottom
    - Single line translation
    - Default styling

[ ] Cinematic Mode
    - Large bold text
    - Enhanced visibility
    - Movie-style appearance

[ ] Educational Mode
    - Dual language display
    - Original + translation
    - Side-by-side layout

[ ] Interactive Mode
    - Editable subtitles
    - Click to edit
    - Dashed border on hover

Status: [ ] Pass [ ] Fail
```

#### Test 6.2: Font Customization
```
Test each setting:

[ ] Font Size: Small (14px)
[ ] Font Size: Medium (18px)
[ ] Font Size: Large (24px)
[ ] Font Size: Auto (responsive)
[ ] Font Family: Sans-serif
[ ] Font Family: Serif
[ ] Font Family: Monospace

Status: [ ] Pass [ ] Fail
```

#### Test 6.3: Color Customization
```
Steps:
1. Options → Display & UI
2. Change text color (e.g., yellow)
3. Change background color (e.g., dark blue)
4. Test on video
5. Verify colors applied

Expected: Custom colors visible
Status: [ ] Pass [ ] Fail
```

#### Test 6.4: Opacity Control
```
Steps:
1. Set opacity to 100%
2. Verify solid background
3. Set opacity to 50%
4. Verify semi-transparent
5. Set opacity to 0%
6. Verify background invisible

Expected: Opacity changes smoothly
Status: [ ] Pass [ ] Fail
```

#### Test 6.5: Position Control
```
Steps:
1. Set position to "Top"
2. Verify subtitles at top
3. Set position to "Bottom"
4. Verify subtitles at bottom
5. Set position to "Center"
6. Verify subtitles centered
7. Try dragging subtitles
8. Verify custom position works

Expected: Position changes correctly
Status: [ ] Pass [ ] Fail
```

#### Test 6.6: Dual Language Mode
```
Steps:
1. Enable "Show Both Languages"
2. Play video
3. Verify both original and translation show

Expected: Two lines - original and translation
Status: [ ] Pass [ ] Fail
```

---

### 7. Performance Testing

#### Test 7.1: CPU Usage
```
Steps:
1. Open Task Manager (Windows) or Activity Monitor (Mac)
2. Note Chrome CPU usage before translation
3. Enable translation on video
4. Monitor CPU usage
5. Calculate increase

Expected: <20% CPU increase
Actual: _____%
Status: [ ] Pass [ ] Fail
```

#### Test 7.2: Memory Usage
```
Steps:
1. Open chrome://extensions/
2. Find Video Translator
3. Note memory usage
4. Use extension for 10 minutes
5. Check memory again

Expected: <100MB memory usage
Actual: _____MB
Status: [ ] Pass [ ] Fail
```

#### Test 7.3: Latency Measurement
```
Steps:
1. Play video with clear timestamp/clock
2. Enable translation
3. Note when word is spoken
4. Note when translation appears
5. Calculate difference

Expected: <1 second latency
Actual: _____ms
Status: [ ] Pass [ ] Fail
```

#### Test 7.4: Multiple Tab Performance
```
Steps:
1. Open 5 tabs with videos
2. Enable translation on all
3. Play all videos
4. Monitor browser performance

Expected: Browser remains responsive
Status: [ ] Pass [ ] Fail
```

#### Test 7.5: Long Session Stability
```
Steps:
1. Enable translation
2. Play 1-hour video
3. Monitor for memory leaks
4. Check for crashes/slowdowns

Expected: Stable performance throughout
Status: [ ] Pass [ ] Fail
```

---

### 8. Feature Testing

#### Test 8.1: Export Subtitles
```
Steps:
1. Enable translation on video
2. Let subtitles accumulate
3. Click "Export Subtitles"
4. Select format (SRT)
5. Verify file downloads
6. Open file and check content

Expected: Valid SRT file with subtitles
Status: [ ] Pass [ ] Fail
```

#### Test 8.2: Operating Modes
```
Test each mode:

[ ] Auto Mode - Verify auto-optimization
[ ] Manual Mode - Verify full control
[ ] Economy Mode - Verify lower resource usage
[ ] High Accuracy Mode - Verify better quality
[ ] Fast Mode - Verify faster processing

Status: [ ] Pass [ ] Fail
```

#### Test 8.3: Keyboard Shortcuts
```
Test each shortcut:

[ ] Ctrl+Shift+S - Toggle translation
[ ] Ctrl+↑ - Increase font size
[ ] Ctrl+↓ - Decrease font size

Mac equivalents:
[ ] Cmd+Shift+S
[ ] Cmd+↑
[ ] Cmd+↓

Status: [ ] Pass [ ] Fail
```

#### Test 8.4: Settings Persistence
```
Steps:
1. Change all settings to non-defaults
2. Close extension popup
3. Restart Chrome
4. Open extension popup
5. Verify settings saved

Expected: All settings preserved
Status: [ ] Pass [ ] Fail
```

---

### 9. Compatibility Testing

#### Test 9.1: Major Video Sites
```
Test on each platform:

[ ] YouTube.com
[ ] Vimeo.com
[ ] Dailymotion.com
[ ] Twitch.tv
[ ] Facebook videos
[ ] Twitter videos
[ ] Instagram videos
[ ] LinkedIn Learning
[ ] Coursera
[ ] Udemy
[ ] Khan Academy
[ ] TED.com

Status: [ ] Pass [ ] Fail
```

#### Test 9.2: Browser Compatibility
```
Test on:

[ ] Chrome (latest)
[ ] Chrome (version 88)
[ ] Microsoft Edge (Chromium)
[ ] Brave Browser
[ ] Opera

Status: [ ] Pass [ ] Fail
```

#### Test 9.3: OS Compatibility
```
Test on:

[ ] Windows 10
[ ] Windows 11
[ ] macOS Big Sur+
[ ] Ubuntu Linux
[ ] Android (Chrome)

Status: [ ] Pass [ ] Fail
```

#### Test 9.4: Screen Sizes
```
Test at:

[ ] 1920x1080 (Full HD)
[ ] 1366x768 (Laptop)
[ ] 2560x1440 (2K)
[ ] 3840x2160 (4K)
[ ] Mobile (360x640)
[ ] Tablet (768x1024)

Status: [ ] Pass [ ] Fail
```

---

### 10. Error Handling Testing

#### Test 10.1: Network Errors
```
Steps:
1. Enable translation
2. Disconnect internet
3. Try translating
4. Verify error message shows
5. Reconnect internet
6. Verify recovery

Expected: Graceful error handling
Status: [ ] Pass [ ] Fail
```

#### Test 10.2: Invalid Inputs
```
Test invalid scenarios:

[ ] Select same source and target language
[ ] Disable all translation engines
[ ] Set memory limit to 0
[ ] Set buffer to 0 seconds

Expected: Validation or graceful handling
Status: [ ] Pass [ ] Fail
```

#### Test 10.3: Permission Denials
```
Steps:
1. Deny microphone permission
2. Try audio capture
3. Verify error message
4. Provides option to grant permission

Expected: Clear error with instructions
Status: [ ] Pass [ ] Fail
```

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Issue: Extension won't load
**Check:**
- Chrome version (must be 88+)
- manifest.json file exists and is valid
- All required files present
- No conflicting extensions

#### Issue: No subtitles appear
**Check:**
- Translation toggle is ON
- Video is actually playing
- Volume is not at 0
- Internet connection
- Microphone permission granted

#### Issue: Translation is slow
**Try:**
- Switch to "Fast Mode"
- Reduce buffer size
- Enable only fast translation engines
- Check internet speed

#### Issue: High CPU/memory usage
**Try:**
- Switch to "Economy Mode"
- Reduce buffer size
- Disable advanced features
- Close unused tabs

---

## ✅ Test Results Summary

### Test Session Information
- **Date**: ___________
- **Tester**: ___________
- **Chrome Version**: ___________
- **OS**: ___________
- **Extension Version**: 1.0.0

### Results Overview
- **Total Tests**: 100+
- **Tests Passed**: _____
- **Tests Failed**: _____
- **Tests Skipped**: _____
- **Pass Rate**: _____%

### Critical Issues Found
1. ___________
2. ___________
3. ___________

### Recommendations
1. ___________
2. ___________
3. ___________

### Sign-off
**Tested by**: ___________
**Date**: ___________
**Status**: [ ] Approved [ ] Needs Work

---

## 📝 Notes

- Focus on critical functionality first
- Test on real-world scenarios
- Document all bugs with reproduction steps
- Take screenshots of UI issues
- Measure performance metrics accurately

---

**Happy Testing!** 🎉
