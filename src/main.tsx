import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/app/App'
import { Provider } from 'react-redux'
import store from '@/shared/services/store';
import 'leaflet/dist/leaflet.css';
import { Workbox } from 'workbox-window';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </StrictMode>,
)


// Register the service worker
if ('serviceWorker' in navigator) {
  const wb = new Workbox('/service-worker.js');

  wb.addEventListener('installed', (event: any) => {
    if (event.isUpdate) {
      if (confirm('New update available. Reload?')) {
        window.location.reload();
      }
    }
  });

  wb.register();
}