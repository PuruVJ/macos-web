import { createMenuConfig } from '🍎/helpers/create-menu-config';

export const finderMenuConfig = createMenuConfig({
  default: {
    title: 'Finder',
    menu: {
      'about-finder': {
        title: 'About Finder',
        breakAfter: true,
      },
      preferences: {
        title: 'Preferences',
        breakAfter: true,
      },
      'empty-trash': {
        title: 'Empty Trash',
        breakAfter: true,
      },
      'hide-finder': {
        title: 'Hide Finder',
      },
      'hide-others': {
        title: 'Hide Others',
      },
      'show-all': {
        title: 'Show All',
        disabled: true,
      },
    },
  },

  file: {
    title: 'File',
    menu: {
      'new-finder-window': {
        title: 'New Finder Window',
      },
      'new-folder': {
        title: 'New Folder',
      },
      'new-folder-with-selection': {
        title: 'New Folder with Selection',
        disabled: true,
      },
      'new-smart-folder': {
        title: 'New Smart Folder',
      },
      'new-tab': {
        title: 'New tab',
      },
      open: {
        title: 'Open',
        disabled: true,
      },
      'open-with': {
        title: 'Open With',
        disabled: true,
      },
      print: {
        title: 'Print',
        disabled: true,
      },
      'close-window': {
        title: 'Close Window',
        disabled: true,
        breakAfter: true,
      },

      'get-info': {
        title: 'Get Info',
      },
      rename: {
        title: 'Rename',
        disabled: true,
        breakAfter: true,
      },

      compress: {
        title: 'Compress',
        disabled: true,
        breakAfter: true,
      },

      duplicate: {
        title: 'Duplicate',
        disabled: true,
      },
      'make-alias': {
        title: 'Make Alias',
        disabled: true,
      },
      'quick-look': {
        title: 'Quick Look',
        disabled: true,
      },
      'show-original': {
        title: 'Show Original',
        disabled: true,
      },
      'add-to-sidebar': {
        title: 'Add to Sidebar',
        disabled: true,
        breakAfter: true,
      },

      'move-to-trash': {
        title: 'Move to Trash',
        disabled: true,
      },
      eject: {
        title: 'Eject',
        disabled: true,
        breakAfter: true,
      },

      find: {
        title: 'Find',
        breakAfter: true,
      },

      tags: {
        title: 'Tags...',
        disabled: true,
      },
    },
  },

  edit: {
    title: 'Edit',
    menu: {
      undo: {
        title: 'Undo',
        disabled: true,
      },
      redo: {
        title: 'Redo',
        disabled: true,
        breakAfter: true,
      },

      cut: {
        title: 'Cut',
        disabled: true,
      },
      copy: {
        title: 'Copy',
        disabled: true,
      },
      paste: {
        title: 'Paste',
        disabled: true,
      },
      'select-all': {
        title: 'Select All',
        disabled: true,
        breakAfter: true,
      },

      'show-clipboard': {
        title: 'Show Clipboard',
        breakAfter: true,
      },

      'start-dictation': {
        title: 'Start Dictation...',
      },
      'emoji-and-symbols': {
        title: 'Emoji & Symbols',
      },
    },
  },

  view: {
    title: 'View',
    menu: {
      'as-icons': {
        title: 'As Icons',
        disabled: true,
      },
      'as-list': {
        title: 'As List',
        disabled: true,
      },
      'as-columns': {
        title: 'As Columns',
        disabled: true,
      },
      'as-gallery': {
        title: 'As Gallery',
        disabled: true,
        breakAfter: true,
      },

      'use-stacks': {
        title: 'Use Stacks',
      },
      'sort-by': {
        title: 'Sort By',
        menu: {},
      },
      'clean-up': {
        title: 'Clean Up',
        disabled: true,
      },
      'clean-up-by': {
        title: 'Clean Up By',
        disabled: true,
        breakAfter: true,
        menu: {},
      },

      'hide-sidebar': {
        title: 'Hide Sidebar',
        disabled: true,
      },
      'show-preview': {
        title: 'Show Preview',
        disabled: true,
        breakAfter: true,
      },

      'hide-toolbar': {
        title: 'Hide Toolbar',
        disabled: true,
      },
      'show-all-tabs': {
        title: 'Show All Tabs',
        disabled: true,
      },
      'show-tab-bar': {
        title: 'Show Tab Bar',
        disabled: true,
      },
      'show-path-bar': {
        title: 'Show Path Bar',
        disabled: true,
      },
      'show-status-bar': {
        title: 'Show Status Bar',
        disabled: true,
        breakAfter: true,
      },

      'customize-toolbar': {
        title: 'Customize Toolbar...',
        disabled: true,
        breakAfter: true,
      },

      'show-view-options': {
        title: 'Show View Options',
      },
      'show-preview-options': {
        title: 'Show Preview Options',
        disabled: true,
        breakAfter: true,
      },

      'enter-full-screen': {
        title: 'Enter Full Screen',
        disabled: true,
      },
    },
  },

  go: {
    title: 'Go',
    menu: {
      back: {
        title: 'Back',
        disabled: true,
      },
      forward: {
        title: 'Forward',
        disabled: true,
      },
      'enclosing-folder': {
        title: 'Enclosing Folder',
        breakAfter: true,
      },

      recents: {
        title: 'Recents',
      },
      documents: {
        title: 'Documents',
      },
      desktop: {
        title: 'Desktop',
      },
      downloads: {
        title: 'Downloads',
      },
      home: {
        title: 'Home',
      },
      computer: {
        title: 'Computer',
      },
      airdrop: {
        title: 'Airdrop',
      },
      network: {
        title: 'Network',
      },
      'icloud-drive': {
        title: 'iCloud Drive',
      },
      applications: {
        title: 'Applications',
      },
      utilities: {
        title: 'Utilities',
        breakAfter: true,
      },

      'go-to-folder': {
        title: 'Go to Folder',
      },
      'connect-to-server': {
        title: 'Connect to Server',
      },
    },
  },

  window: {
    title: 'Window',
    menu: {
      minimize: {
        title: 'Minimize',
        disabled: true,
      },
      zoom: {
        title: 'Zoom',
        disabled: true,
      },
      'move-window-to-left-side-of-screen': {
        title: 'Move Window to Left Side of Screen',
        disabled: true,
      },
      'move-window-to-right-side-of-screen': {
        title: 'Move Window to Right Side of Screen',
        disabled: true,
      },
      'cycle-through-windows': {
        title: 'Cycle Through Windows',
        breakAfter: true,
      },

      'show-previous-tab': {
        title: 'Show Previous Tab',
        disabled: true,
      },
      'show-next-tab': {
        title: 'Show Next Tab',
        disabled: true,
      },
      'move-tab-to-new-window': {
        title: 'Move Tab to New Window',
        disabled: true,
      },
      'merge-all-windows': {
        title: 'Merge all Windows',
        disabled: true,
        breakAfter: true,
      },

      'bring-all-to-front': {
        title: 'Bring All to Front',
      },
    },
  },

  help: {
    title: 'Help',
    menu: {
      'send-finder-feedback': {
        title: 'Send Finder Feedback',
        breakAfter: true,
      },
      'macos-help': {
        title: 'macOS Help',
      },
    },
  },
});
