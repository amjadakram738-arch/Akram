# 📦 Video Translator Extension - Installation Guide

## Quick Installation (5 Minutes)

### Step 1: Download the Extension

**Option A: Clone from Git**
```bash
git clone https://github.com/your-repo/video-translator-extension.git
cd video-translator-extension
```

**Option B: Download ZIP**
1. Download the ZIP file
2. Extract to a folder (e.g., `video-translator-extension/`)

---

### Step 2: Open Chrome Extensions Page

1. Open **Google Chrome** (or Chromium-based browser)
2. Navigate to: `chrome://extensions/`
   - Or click: **Menu (⋮)** → **Extensions** → **Manage Extensions**

---

### Step 3: Enable Developer Mode

1. Look for **Developer mode** toggle in the top-right corner
2. **Turn it ON** (switch will turn blue)

---

### Step 4: Load the Extension

1. Click **"Load unpacked"** button (top-left)
2. Browse to the extension folder you extracted/cloned
3. Select the **root folder** (containing `manifest.json`)
4. Click **"Select Folder"**

---

### Step 5: Verify Installation

✅ You should see:
- **Extension card** with the name "Video Translator - Auto Subtitles"
- **Extension icon** in your browser toolbar (puzzle piece icon)
- **Version**: 1.0.0
- **Status**: Enabled (no errors)

---

### Step 6: Pin the Extension (Optional but Recommended)

1. Click the **puzzle piece icon** in the toolbar
2. Find "Video Translator"
3. Click the **pin icon** 📌
4. Extension icon will now always be visible

---

## 🎯 First-Time Setup

### Configure Basic Settings

1. **Click the extension icon** in the toolbar
2. Set your **Target Language** (e.g., English, Arabic, Spanish)
3. Keep **Source Language** on "Auto Detect"
4. Choose **Operating Mode**: Start with "Normal Mode"
5. **Audio Capture**: Use "Direct Capture" for most sites

---

## 🧪 Testing the Extension

### Test 1: YouTube Video

1. Go to [YouTube.com](https://www.youtube.com)
2. Open any video with spoken audio
3. Click **extension icon** → **"Start Translation"**
4. **Expected Result**: 
   - Subtitles appear at bottom of video
   - Translations update in real-time
   - Subtitles are readable and synchronized

### Test 2: Settings Panel

1. Click extension icon → **"Advanced Settings"**
2. Browse through different sections
3. Try changing:
   - Font size slider
   - Subtitle position (top/middle/bottom)
   - Theme (light/dark)
4. Click **"Save Settings"**

### Test 3: Keyboard Shortcuts

1. While on a video page with translation active
2. Press `Ctrl+Shift+S` to toggle on/off
3. Press `Ctrl+Shift+Up` to increase font size
4. Press `Ctrl+Shift+Down` to decrease font size

---

## 🔧 Browser-Specific Instructions

### Chrome/Chromium

✅ **Fully Supported** - Follow steps above

### Microsoft Edge

1. Navigate to: `edge://extensions/`
2. Follow same steps as Chrome (Chromium-based)

### Brave Browser

1. Navigate to: `brave://extensions/`
2. Follow same steps as Chrome

### Opera

1. Navigate to: `opera://extensions/`
2. Follow same steps as Chrome

### Firefox

⚠️ **Requires Manifest Conversion**

Firefox uses Manifest V2. To install:
1. Navigate to: `about:debugging#/runtime/this-firefox`
2. Click **"Load Temporary Add-on"**
3. Select any file in the extension folder
4. **Note**: Extension will be removed when Firefox restarts

For permanent installation, the extension needs to be signed and published to Firefox Add-ons store.

### Safari

⚠️ **Requires Conversion**

Safari uses a different format. Use Xcode to convert:
1. Open Xcode
2. Use **Safari Extension Converter**
3. Point to the extension folder
4. Build and install

---

## 🚫 Troubleshooting Installation

### Error: "Manifest file is missing or unreadable"

**Solution**: 
- Make sure you selected the **root folder** containing `manifest.json`
- Check that `manifest.json` exists and is valid JSON

### Error: "Package is invalid"

**Solution**:
- Verify all required files exist:
  - `manifest.json`
  - `background.js`
  - `content.js`
  - `popup.html`
  - `options.html`
  - `icons/` folder with PNG files

### Extension icon not showing

**Solution**:
1. Click the puzzle piece icon in toolbar
2. Find "Video Translator"
3. Click the pin icon to make it permanent

### No permissions showing up

**Solution**:
- The extension needs `<all_urls>` permission to work on all sites
- Chrome will prompt for permission on first use
- Grant permission when prompted

### Icons not displaying

**Solution**:
- Icons should be in `/icons/` folder
- Required sizes: 16x16, 32x32, 48x48, 128x128 PNG
- If missing, you can:
  ```bash
  cd icons/
  # Create placeholder icons
  for SIZE in 16 32 48 128; do
    convert -size ${SIZE}x${SIZE} xc:"#3b82f6" icon${SIZE}.png
  done
  ```

---

## 🔄 Updating the Extension

### Method 1: Reload Extension

1. Go to `chrome://extensions/`
2. Find "Video Translator"
3. Click **Reload button** (🔄)

### Method 2: Update Files

1. Pull latest changes (if using Git)
   ```bash
   cd video-translator-extension/
   git pull origin main
   ```
2. Or replace files manually
3. Reload extension as in Method 1

---

## 🗑️ Uninstalling

### Remove Extension

1. Go to `chrome://extensions/`
2. Find "Video Translator"
3. Click **"Remove"**
4. Confirm deletion

### Clear All Data

**Before uninstalling**, if you want to clear saved data:
1. Right-click extension icon → **Options**
2. Go to **Privacy** section
3. Click **"Clear All Data"**
4. Then uninstall

---

## 🔐 Permissions Explained

The extension requests these permissions:

| Permission | Purpose |
|-----------|---------|
| `activeTab` | Access current tab to detect videos |
| `storage` | Save your settings and preferences |
| `scripting` | Inject subtitle overlay on pages |
| `tabs` | Manage translation sessions per tab |
| `contextMenus` | Right-click menu on videos |
| `notifications` | Alert you when translation starts/stops |
| `webNavigation` | Detect page navigation |
| `<all_urls>` | Work on any website |

**Privacy Note**: 
- ✅ All data stays LOCAL by default
- ✅ No external servers unless you enable cloud mode
- ✅ No tracking or analytics
- ✅ Open source - audit the code yourself

---

## 📱 Mobile Installation

### Android (Kiwi Browser or Yandex)

1. Install **Kiwi Browser** from Play Store
2. Open Kiwi Browser
3. Go to `chrome://extensions/`
4. Enable "Developer mode"
5. Load unpacked extension (requires extracting ZIP to device)

**Note**: Features may be limited on mobile

### iOS/iPad

❌ **Not Supported**

Chrome extensions cannot be installed on iOS Safari.  
Safari extensions require different format and App Store approval.

---

## 🎓 Next Steps

After installation:

1. ✅ [Read the README](README.md) for full features list
2. ✅ [Check Advanced Settings](README.md#configuration)
3. ✅ Test on different websites
4. ✅ Customize appearance to your liking
5. ✅ Enable offline mode if needed

---

## 🆘 Still Having Issues?

### Get Help

- 📖 [Full Documentation](README.md)
- 🐛 [Report Issues](https://github.com/your-repo/issues)
- 💬 [Community Support](https://github.com/your-repo/discussions)
- 📧 [Email Support](mailto:support@example.com)

### Common Questions

**Q: Does it work on Netflix/Amazon Prime?**  
A: Yes, but enable "System Audio Capture" in settings due to DRM.

**Q: Can I use it offline?**  
A: Yes! Enable Offline Mode and download models in Advanced Settings.

**Q: Is it free?**  
A: Yes, completely free and open source. No API keys required.

**Q: Does it slow down my browser?**  
A: Minimal impact. Enable "Economy Mode" if you have an older device.

**Q: Can I use it on private/incognito tabs?**  
A: Yes, but you need to enable "Allow in Incognito" in `chrome://extensions/`

---

## ✅ Installation Complete!

**You're all set!** 🎉

Start translating videos on any website:
1. Open a video
2. Click the extension icon
3. Click "Start Translation"
4. Enjoy real-time subtitles! 

**Pro Tip**: Set up your preferred languages in settings first for a smoother experience.

---

**Last Updated**: 2024  
**Extension Version**: 1.0.0  
**Minimum Chrome Version**: 88+
