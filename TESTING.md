# 🧪 Testing Guide - Video Translator Extension

Complete testing checklist to ensure 100% functionality.

---

## 🎯 Pre-Testing Checklist

Before starting tests, verify:

- [ ] Extension is installed (`chrome://extensions/`)
- [ ] Extension is **enabled**
- [ ] **Developer mode** is ON
- [ ] No error messages in extension card
- [ ] Extension icon is visible in toolbar
- [ ] All permissions granted

---

## 1️⃣ Basic Functionality Tests

### Test 1.1: Extension Installation
**Steps:**
1. Load extension as unpacked
2. Check for errors

**Expected:**
- ✅ No errors in console
- ✅ Extension appears in list
- ✅ Icon shows in toolbar

---

### Test 1.2: Popup Interface
**Steps:**
1. Click extension icon
2. Verify all UI elements load

**Expected:**
- ✅ Popup opens instantly
- ✅ All dropdowns populated
- ✅ Buttons are clickable
- ✅ Settings save correctly
- ✅ Status shows "Inactive"

---

### Test 1.3: Settings Page
**Steps:**
1. Right-click icon → Options
2. Navigate through all sections

**Expected:**
- ✅ All 7 sections load
- ✅ Navigation works
- ✅ All inputs are responsive
- ✅ Save button works
- ✅ Export/Import buttons work

---

## 2️⃣ Translation Functionality Tests

### Test 2.1: YouTube Video Translation
**Platform:** YouTube  
**Test Video:** https://www.youtube.com/watch?v=jNQXAC9IVRw (or any video)

**Steps:**
1. Open YouTube video
2. Click extension icon
3. Set Target Language: English (or your preference)
4. Click "Start Translation"

**Expected:**
- ✅ Subtitles appear within 5 seconds
- ✅ Subtitles are at bottom of video
- ✅ Translation updates every 3-5 seconds
- ✅ Text is readable (white on dark background)
- ✅ Subtitles sync with audio

**Common Issues:**
- Subtitles not showing → Check position setting
- Translation delayed → Check internet connection
- No audio captured → Try different capture mode

---

### Test 2.2: Netflix Translation (DRM)
**Platform:** Netflix  
**Note:** Requires "System Audio Capture"

**Steps:**
1. Open any Netflix video
2. Enable "System Audio Capture" in settings
3. Start translation

**Expected:**
- ✅ Subtitles appear despite DRM
- ⚠️ May require page reload
- ⚠️ Slight audio delay is normal

---

### Test 2.3: Vimeo Translation
**Platform:** Vimeo

**Steps:**
1. Open any Vimeo video
2. Start translation with default settings

**Expected:**
- ✅ Works exactly like YouTube
- ✅ No special configuration needed

---

### Test 2.4: Embedded Video (iframe)
**Test Page:** Any page with embedded YouTube/Vimeo

**Steps:**
1. Find page with embedded video
2. Start translation

**Expected:**
- ✅ Extension detects video in iframe
- ✅ Subtitles work normally
- ⚠️ May need to reload iframe if fails

---

## 3️⃣ Audio Capture Mode Tests

### Test 3.1: Direct Capture
**Mode:** Direct Capture (default)

**Steps:**
1. Set Audio Capture: Direct
2. Play any video

**Expected:**
- ✅ Captures audio from video element
- ✅ Works on most sites
- ✅ Low latency (<1 second)

---

### Test 3.2: Microphone Capture
**Mode:** Microphone  
**Setup:** Play video through speakers

**Steps:**
1. Set Audio Capture: Microphone
2. Grant microphone permission
3. Play video with speakers ON

**Expected:**
- ✅ Captures audio from environment
- ✅ Works even on DRM-protected sites
- ⚠️ May capture background noise

---

### Test 3.3: System Audio Capture
**Mode:** System Audio  
**Platform:** Netflix, Amazon Prime

**Steps:**
1. Set Audio Capture: System Audio
2. Play protected content

**Expected:**
- ✅ Bypasses DRM restrictions
- ✅ Captures tab audio only
- ✅ No background noise

---

### Test 3.4: Hybrid Mode
**Mode:** Hybrid (Auto-select)

**Steps:**
1. Set Audio Capture: Hybrid
2. Test on multiple sites

**Expected:**
- ✅ Automatically selects best method
- ✅ Falls back if primary fails
- ✅ Works on all tested sites

---

## 4️⃣ Language & Translation Tests

### Test 4.1: Language Auto-Detection
**Steps:**
1. Enable "Auto Detect Language"
2. Play videos in different languages (Spanish, French, Arabic)

**Expected:**
- ✅ Correctly identifies source language
- ✅ Translates to target language
- ✅ Shows detected language in popup

---

### Test 4.2: Multiple Translation Engines
**Steps:**
1. Go to Advanced Settings → Translation
2. Enable only 1 engine at a time
3. Test translation

**Engines to Test:**
- Google Translate
- LibreTranslate
- MyMemory

**Expected:**
- ✅ Each engine produces translation
- ✅ Quality varies by engine
- ✅ Falls back if engine fails

---

### Test 4.3: 150+ Languages
**Steps:**
1. Test translation to/from:
   - Arabic (ar)
   - Chinese (zh)
   - Japanese (ja)
   - Russian (ru)
   - Hindi (hi)

**Expected:**
- ✅ All languages supported
- ✅ Right-to-left languages (Arabic) display correctly
- ✅ Special characters render properly

---

## 5️⃣ Display & UI Tests

### Test 5.1: Font Size Adjustment
**Steps:**
1. Start translation
2. Adjust font size slider (12-48px)

**Expected:**
- ✅ Subtitles resize in real-time
- ✅ Size persists across sessions
- ✅ Keyboard shortcuts work (Ctrl+Shift+Up/Down)

---

### Test 5.2: Position Change
**Steps:**
1. Start translation
2. Change position: Top, Middle, Bottom

**Expected:**
- ✅ Subtitles move to new position
- ✅ Position stays after page reload

---

### Test 5.3: Color Customization
**Steps:**
1. Change text color (white → yellow)
2. Change background color
3. Adjust opacity (0-100%)

**Expected:**
- ✅ Colors update immediately
- ✅ Opacity slider works smoothly
- ✅ Custom colors persist

---

### Test 5.4: Theme Switching
**Steps:**
1. Set theme: Auto → Light → Dark

**Expected:**
- ✅ UI changes to match theme
- ✅ Subtitles adapt colors
- ✅ Auto theme matches system preference

---

### Test 5.5: Draggable Subtitles
**Steps:**
1. Enable "Draggable Subtitles"
2. Drag subtitle to new position

**Expected:**
- ✅ Cursor changes to "grab"
- ✅ Subtitle moves smoothly
- ✅ Position saved temporarily

---

### Test 5.6: Display Modes
**Modes to Test:**
- Simple (default)
- Cinema (large, cinematic)
- Educational (dual language)
- Interactive (editable)
- Floating Panel (side panel)

**Expected:**
- ✅ Each mode looks distinct
- ✅ Educational mode shows both languages
- ✅ Floating panel docks to side

---

## 6️⃣ Performance Tests

### Test 6.1: Economy Mode
**Steps:**
1. Set Operating Mode: Economy
2. Monitor CPU/Memory usage

**Expected:**
- ✅ Lower CPU usage (check Task Manager)
- ✅ Memory stays under 100MB
- ✅ Slightly lower accuracy acceptable

---

### Test 6.2: High Accuracy Mode
**Steps:**
1. Set Operating Mode: High Accuracy
2. Compare translation quality

**Expected:**
- ✅ Better translations
- ⚠️ Higher CPU usage
- ⚠️ Slightly slower response

---

### Test 6.3: GPU Acceleration
**Steps:**
1. Enable GPU Acceleration
2. Check performance

**Expected:**
- ✅ Faster processing (if GPU available)
- ✅ No visual artifacts
- ⚠️ May not work on all systems

---

### Test 6.4: Memory Limit
**Steps:**
1. Set Memory Limit: 50MB, 100MB, 500MB
2. Monitor actual usage

**Expected:**
- ✅ Extension respects limit
- ✅ Reduces features if limit hit
- ✅ No crashes

---

## 7️⃣ Privacy & Security Tests

### Test 7.1: Local-Only Mode
**Steps:**
1. Enable "Local-Only Processing"
2. Monitor network traffic (DevTools → Network)

**Expected:**
- ❌ No external API calls (except for translation engines)
- ✅ No tracking requests
- ✅ No personal data sent

---

### Test 7.2: Anonymous Mode
**Steps:**
1. Enable "Anonymous Mode"
2. Check network requests

**Expected:**
- ✅ No metadata sent
- ✅ No user agent strings
- ✅ No cookies

---

### Test 7.3: Data Retention
**Steps:**
1. Set Data Retention: "Session Only"
2. Translate videos
3. Close browser
4. Reopen and check storage

**Expected:**
- ✅ Old translations deleted
- ✅ Settings preserved
- ✅ No leftover cache

---

### Test 7.4: Clear All Data
**Steps:**
1. Translate videos
2. Go to Options → Privacy
3. Click "Clear All Data"

**Expected:**
- ✅ All translations deleted
- ✅ Cache cleared
- ✅ Confirmation message shown

---

## 8️⃣ Advanced Feature Tests

### Test 8.1: Offline Mode
**Steps:**
1. Enable Offline Mode
2. Click "Download Offline Models"
3. Disconnect internet
4. Try translation

**Expected:**
- ⚠️ Model download may not be implemented yet
- ✅ Shows "download" notification
- ⚠️ Translation may fail without models

---

### Test 8.2: Keyboard Shortcuts
**Shortcuts:**
- `Ctrl+Shift+S`: Toggle on/off
- `Ctrl+Shift+Up`: Increase font
- `Ctrl+Shift+Down`: Decrease font

**Expected:**
- ✅ All shortcuts work
- ✅ Work on all pages
- ✅ Mac shortcuts use Cmd instead of Ctrl

---

### Test 8.3: Context Menu
**Steps:**
1. Right-click on video element
2. Select "Translate This Video"

**Expected:**
- ✅ Context menu appears
- ✅ Translation starts automatically
- ✅ Works on all video types

---

### Test 8.4: Notifications
**Steps:**
1. Start translation
2. Check for notification

**Expected:**
- ✅ "Translation Started" notification appears
- ✅ Notification auto-closes after 5 seconds
- ✅ Can be disabled in settings

---

### Test 8.5: Export Settings
**Steps:**
1. Configure custom settings
2. Click "Export Settings"
3. Download JSON file

**Expected:**
- ✅ JSON file downloads
- ✅ Contains all settings
- ✅ Valid JSON format

---

### Test 8.6: Import Settings
**Steps:**
1. Export settings first
2. Change some settings
3. Import previously exported JSON

**Expected:**
- ✅ Settings restored from file
- ✅ UI updates to match
- ✅ Works after browser restart

---

## 9️⃣ Edge Cases & Error Handling

### Test 9.1: No Audio Track
**Steps:**
1. Play silent video
2. Start translation

**Expected:**
- ⚠️ Shows error: "No audio detected"
- ✅ Doesn't crash
- ✅ Can be stopped and restarted

---

### Test 9.2: Very Fast Speech
**Steps:**
1. Play video with rapid speech
2. Start translation

**Expected:**
- ✅ Captures most words
- ⚠️ May miss some if too fast
- ✅ Subtitles update quickly

---

### Test 9.3: Multiple Videos on Page
**Steps:**
1. Open page with 2+ videos
2. Start translation

**Expected:**
- ✅ Detects all videos
- ✅ Translates first/largest video
- ⚠️ May need manual selection

---

### Test 9.4: Video Player Changes
**Steps:**
1. Start translation on YouTube
2. Switch to different video
3. Verify translation continues

**Expected:**
- ✅ Detects new video
- ✅ Restarts translation automatically
- ⚠️ May have brief pause

---

### Test 9.5: Page Reload
**Steps:**
1. Start translation
2. Reload page (F5)
3. Check if translation resumes

**Expected:**
- ⚠️ Translation stops (expected)
- ✅ Can restart manually
- ✅ Settings persist

---

### Test 9.6: Network Failure
**Steps:**
1. Start translation
2. Disable internet mid-translation
3. Re-enable internet

**Expected:**
- ⚠️ Translation pauses
- ✅ Shows error notification
- ✅ Resumes when internet returns

---

## 🔟 Browser Compatibility Tests

### Test 10.1: Chrome (Latest)
**Version:** 120+

**Expected:**
- ✅ 100% functionality
- ✅ No warnings

---

### Test 10.2: Microsoft Edge
**Version:** Latest

**Expected:**
- ✅ 100% functionality (Chromium-based)
- ✅ Identical to Chrome

---

### Test 10.3: Brave Browser
**Version:** Latest

**Expected:**
- ✅ Works with Shields down
- ⚠️ May block some features with Shields up

---

### Test 10.4: Opera
**Version:** Latest

**Expected:**
- ✅ Full compatibility
- ✅ Sidebar integration possible

---

### Test 10.5: Firefox (Developer Edition)
**Version:** Latest

**Expected:**
- ⚠️ Manifest V2 required
- ⚠️ Temporary add-on only
- ⚠️ Some features may differ

---

## 🎓 Performance Benchmarks

### Benchmark 1: Translation Latency
**Target:** <2 seconds from speech to subtitle

**Test:**
1. Play video with clear speech
2. Measure time from spoken word to subtitle

**Acceptable:**
- ✅ <1 second: Excellent
- ✅ 1-2 seconds: Good
- ⚠️ 2-5 seconds: Acceptable
- ❌ >5 seconds: Poor (investigate)

---

### Benchmark 2: Memory Usage
**Target:** <100MB in Normal Mode

**Test:**
1. Start translation
2. Let run for 10 minutes
3. Check Task Manager

**Acceptable:**
- ✅ <50MB: Excellent
- ✅ 50-100MB: Good
- ⚠️ 100-200MB: High (optimize)
- ❌ >200MB: Excessive (bug)

---

### Benchmark 3: CPU Usage
**Target:** <10% average

**Test:**
1. Monitor CPU during translation
2. Average over 5 minutes

**Acceptable:**
- ✅ <5%: Excellent
- ✅ 5-10%: Good
- ⚠️ 10-20%: High (enable Economy Mode)
- ❌ >20%: Excessive (bug)

---

## ✅ Testing Checklist Summary

### Critical Tests (Must Pass)
- [ ] Extension installs without errors
- [ ] Popup UI loads correctly
- [ ] YouTube translation works
- [ ] Subtitles are visible and readable
- [ ] Settings save and load correctly
- [ ] Keyboard shortcuts work
- [ ] No memory leaks after 10 minutes
- [ ] Context menu appears
- [ ] Multiple languages supported

### Important Tests (Should Pass)
- [ ] Netflix/DRM content works
- [ ] All capture modes functional
- [ ] All display modes work
- [ ] Theme switching works
- [ ] Export/Import settings work
- [ ] Performance within benchmarks
- [ ] Privacy settings respected
- [ ] Error handling graceful

### Nice-to-Have Tests (Can Have Issues)
- [ ] Offline mode functional
- [ ] GPU acceleration works
- [ ] All 150 languages tested
- [ ] Sentiment analysis works
- [ ] Collaborative features work
- [ ] Firefox compatibility
- [ ] Mobile browser support

---

## 🐛 Bug Reporting Template

If you find a bug:

```markdown
**Bug Title:** [Short description]

**Severity:** Critical / High / Medium / Low

**Browser:** Chrome 120 / Edge / etc.

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots:**
[Attach if applicable]

**Console Errors:**
```
[Paste console errors]
```

**Extension Version:** 1.0.0
**Operating System:** Windows 11 / macOS / Linux
```

---

## 📊 Test Results Template

After completing tests:

```markdown
# Test Results - Video Translator Extension

**Test Date:** YYYY-MM-DD
**Tester:** [Name]
**Extension Version:** 1.0.0
**Browser:** Chrome 120

## Summary
- **Total Tests:** X
- **Passed:** ✅ X
- **Failed:** ❌ X
- **Skipped:** ⚠️ X

## Critical Issues
1. [Issue 1]
2. [Issue 2]

## Minor Issues
1. [Issue 1]
2. [Issue 2]

## Recommendations
1. [Recommendation 1]
2. [Recommendation 2]

**Overall Status:** ✅ Ready / ⚠️ Needs Work / ❌ Not Ready
```

---

## 🎉 Testing Complete!

If all critical tests pass:
- ✅ Extension is **ready for use**
- ✅ Can be **published** to Chrome Web Store
- ✅ Safe for **public release**

If some tests fail:
- 📝 Document all failures
- 🔧 Fix critical bugs first
- 🧪 Re-test after fixes
- ✅ Iterate until ready

---

**Happy Testing!** 🧪🎉

*Ensure quality before release!*
