export const KEYBOARD_SHORTCUTS = {
  toggle: {
    key: 'S',
    ctrlKey: true,
    macCtrlKey: true,
    description: 'Toggle subtitles on/off',
    defaultKey: 'Ctrl+S'
  },
  quickTranslate: {
    key: 'T',
    ctrlKey: true,
    macCtrlKey: true,
    description: 'Quick translate current subtitle',
    defaultKey: 'Ctrl+T'
  },
  swapLanguages: {
    key: 'L',
    ctrlKey: true,
    macCtrlKey: true,
    description: 'Swap source and target languages',
    defaultKey: 'Ctrl+L'
  },
  showSettings: {
    key: ',',
    ctrlKey: true,
    macCtrlKey: true,
    description: 'Open settings page',
    defaultKey: 'Ctrl+,'
  },
  nextEngine: {
    key: 'E',
    ctrlKey: true,
    macCtrlKey: true,
    description: 'Cycle to next translation engine',
    defaultKey: 'Ctrl+E'
  },
  toggleAudio: {
    key: 'M',
    ctrlKey: true,
    macCtrlKey: true,
    description: 'Toggle audio capture',
    defaultKey: 'Ctrl+M'
  },
  resetPosition: {
    key: 'R',
    ctrlKey: true,
    macCtrlKey: true,
    description: 'Reset subtitle position',
    defaultKey: 'Ctrl+R'
  },
  hideOverlay: {
    key: 'Escape',
    ctrlKey: false,
    macCtrlKey: false,
    description: 'Hide subtitle overlay temporarily',
    defaultKey: 'Escape'
  },
  cycleMode: {
    key: 'D',
    ctrlKey: true,
    macCtrlKey: true,
    description: 'Cycle through display modes',
    defaultKey: 'Ctrl+D'
  },
  increaseFont: {
    key: '+',
    ctrlKey: true,
    macCtrlKey: true,
    description: 'Increase subtitle font size',
    defaultKey: 'Ctrl++'
  },
  decreaseFont: {
    key: '-',
    ctrlKey: true,
    macCtrlKey: true,
    description: 'Decrease subtitle font size',
    defaultKey: 'Ctrl+-'
  },
  exportSubtitles: {
    key: 'X',
    ctrlKey: true,
    macCtrlKey: true,
    shiftKey: true,
    description: 'Export current subtitles',
    defaultKey: 'Ctrl+Shift+X'
  },
};

export const DEFAULT_SHORTCUTS = {
  toggle: 'Ctrl+S',
  quickTranslate: 'Ctrl+T',
  swapLanguages: 'Ctrl+L',
  showSettings: 'Ctrl+,',
  nextEngine: 'Ctrl+E',
  toggleAudio: 'Ctrl+M',
  resetPosition: 'Ctrl+R',
  hideOverlay: 'Escape',
  cycleMode: 'Ctrl+D',
  increaseFont: 'Ctrl++',
  decreaseFont: 'Ctrl+-',
  exportSubtitles: 'Ctrl+Shift+X',
};
