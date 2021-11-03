const zIndexConfig = {
  wallpaper: -1,
  'bootup-screen': 999999999999,
  'context-menu': 99999999,
  'window-traffic-lights': 1,
  dock: 9900,
  'dock-tooltip': 1000,
  'system-updates-available': 1,
  'system-dialog': 9999,
  'menubar-menu-parent': 1,
};

for (const [element, zIndexValue] of Object.entries(zIndexConfig)) {
  document.body.style.setProperty(`--system-z-index-${element}`, zIndexValue + '');
}

export function elevation(node: HTMLElement, uiElement: keyof typeof zIndexConfig) {
  node.style.zIndex = `var(--system-z-index-${uiElement})`;
}
