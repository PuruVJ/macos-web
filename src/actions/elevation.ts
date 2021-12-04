const zIndexConfig = {
  wallpaper: -1,
  'bootup-screen': 110,
  'context-menu': 100,
  'window-traffic-lights': 10,
  dock: 80,
  'dock-tooltip': 70,
  'system-updates-available': 60,
  'system-dialog': 90,
  'menubar-menu-parent': 160,
};

for (const [element, zIndexValue] of Object.entries(zIndexConfig)) {
  document.body.style.setProperty(`--system-z-index-${element}`, zIndexValue + '');
}

export function elevation(node: HTMLElement, uiElement: keyof typeof zIndexConfig) {
  node.style.zIndex = `var(--system-z-index-${uiElement})`;
}
