import { syncOfflineEdits } from '../services/syncService';

export function setupNetworkListener(baseUrl: string): void {
  window.addEventListener('online', () => {
    console.log('Back online. Syncing offline edits...');
    syncOfflineEdits(baseUrl);
  });

  window.addEventListener('offline', () => {
    console.log('App is offline.');
  });
}