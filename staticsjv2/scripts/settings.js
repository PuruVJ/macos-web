if (!localStorage.getItem('proxy-tab-title')) localStorage.setItem('proxy-tab-title', 'Browser');
if (!localStorage.getItem('proxy-favicon')) localStorage.setItem('proxy-favicon', '/app-icons/safari/256.webp');
document.title = localStorage.getItem('proxy-tab-title') || document.title;
const existingIcon = document.querySelector("link[rel='icon']");
const iconHref = localStorage.getItem('proxy-favicon') || '/app-icons/safari/256.webp';
if (existingIcon) {
  existingIcon.setAttribute('href', iconHref);
} else {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = iconHref;
  document.head.appendChild(link);
}
