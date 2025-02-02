import { StrictMode } from 'react'
import App from '@/app/App'
import { Provider } from 'react-redux'
import store, {persistor} from '@/shared/services/store';
import 'leaflet/dist/leaflet.css';
import { Workbox } from 'workbox-window';
import ReactDOM from "react-dom/client";
import { PersistGate } from "redux-persist/integration/react";




ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
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