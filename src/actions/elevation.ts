const zIndexConfig = {
  wallpaper: -1,
  'bootup-screen': 50,
  'context-menu': 40,
  'window-traffic-lights': 1,
  dock: 20,
  'dock-tooltip': 10,
  'system-updates-available': 1,
  'system-dialog': 30,
  'menubar-menu-parent': 1,
};

for (const [element, zIndexValue] of Object.entries(zIndexConfig)) {
  document.body.style.setProperty(`--system-z-index-${element}`, zIndexValue + '');
}

export function elevation(node: HTMLElement, uiElement: keyof typeof zIndexConfig) {
  node.style.isolation = 'isolate';
  node.style.zIndex = `var(--system-z-index-${uiElement})`;
}
