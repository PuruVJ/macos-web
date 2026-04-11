if (!localStorage.getItem('proxy-bg')) localStorage.setItem('proxy-bg', 'radial-gradient(circle at 10% 20%, #1f2937 0%, #0f172a 55%, #020617 100%)');
document.documentElement.style.setProperty('--bg', localStorage.getItem('proxy-bg') || '#0b0f14');
