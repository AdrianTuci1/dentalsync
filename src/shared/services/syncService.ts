import { getSubdomain } from '../utils/getSubdomains';
import { saveOfflineData, getOfflineData, removeOfflineData } from '../utils/localForage';

// Key for storing offline edits
const OFFLINE_EDITS_KEY = 'offline_edits';

const db = getSubdomain();

/**
 * Queue an offline edit for later syncing
 */
export async function queueOfflineEdit(edit: Record<string, any>): Promise<void> {
  try {
    const existingEdits = (await getOfflineData<Record<string, any>[]>(OFFLINE_EDITS_KEY)) || [];
    await saveOfflineData(OFFLINE_EDITS_KEY, [...existingEdits, edit]);
    console.log('Queued offline edit:', edit);
  } catch (error) {
    console.error('Error queuing offline edit:', error);
  }
}

/**
 * Sync queued offline edits to the server
 */
export async function syncOfflineEdits(baseUrl: string): Promise<void> {
  try {
    const edits = (await getOfflineData<Record<string, any>[]>(OFFLINE_EDITS_KEY)) || [];

    if (edits.length === 0) {
      console.log('No offline edits to sync.');
      return;
    }

    console.log(`Syncing ${edits.length} offline edits...`);

    // Batch sync all edits
    const response = await fetch(`${baseUrl}/api/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-clinic-db': `${db}_db`
      },
      body: JSON.stringify(edits), // Send all edits in a single request
    });

    if (response.ok) {
      console.log('Successfully synced all edits.');
      // Clear synced edits from local storage
      await removeOfflineData(OFFLINE_EDITS_KEY);
    } else {
      const error = await response.json();
      console.error('Error syncing edits:', error);
      // Keep failed edits in the queue for retry
    }
  } catch (error) {
    console.error('Error syncing offline edits:', error);
  }
}