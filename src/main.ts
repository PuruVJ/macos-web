import Desktop from './components/Desktop/Desktop.svelte';
import './css/global.scss';

const desktop = new Desktop({
  target: document.getElementById('root'),
});

export default desktop;
