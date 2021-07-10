import { createMenuConfig } from '__/helpers/create-menu-config';

export const vscodeMenuConfig = createMenuConfig({
  default: {
    title: 'Code',
    menu: {},
  },

  file: {
    title: 'File',
    menu: {
      'new-file': {
        title: 'New File',
      },
      'new-window': {
        title: 'New Window',
        breakAfter: true,
      },

      'open-file': {
        title: 'Open File',
      },
      'open-folder': {
        title: 'Open Folder',
      },
      'open-workspace': {
        title: 'Open Workspace',
      },
      'open-recent': {
        title: 'Open recent',
        breakAfter: true,
      },

      'add-folder-to-workspace': {
        title: 'Add Folder to Workspace',
      },
      'save-workspace-as': {
        title: 'Add Folder to Workspace as...',
        breakAfter: true,
      },

      save: {
        title: 'Save',
      },
      'save-as': {
        title: 'Save as...',
      },
      'save-all': {
        title: 'Save All',
        breakAfter: true,
        disabled: true,
      },
    },
  },
});

export default vscodeMenuConfig;
