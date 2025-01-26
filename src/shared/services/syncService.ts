import { saveOfflineData, getOfflineData, removeOfflineData } from '../utils/localForage';

// Queue offline edits under a specific key
const OFFLINE_EDITS_KEY = 'offline_edits';

export async function queueOfflineEdit(edit: Record<string, any>): Promise<void> {
  try {
    const existingEdits = (await getOfflineData<Record<string, any>[]>(OFFLINE_EDITS_KEY)) || [];
    await saveOfflineData(OFFLINE_EDITS_KEY, [...existingEdits, edit]);
    console.log('Queued offline edit:', edit);
  } catch (error) {
    console.error('Error queuing offline edit:', error);
  }
}

// Sync queued edits to the server
export async function syncOfflineEdits(baseUrl: string): Promise<void> {
  try {
    const edits = await getOfflineData<Record<string, any>[]>(OFFLINE_EDITS_KEY);
    if (!edits || edits.length === 0) {
      console.log('No offline edits to sync.');
      return;
    }

    // Iterate over edits and send to the server
    for (const edit of edits) {
      const response = await fetch(`${baseUrl}/api/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(edit),
      });

      if (response.ok) {
        console.log('Successfully synced edit:', edit);
        // Remove successfully synced edit
        await removeOfflineData(OFFLINE_EDITS_KEY);
      } else {
        console.error('Failed to sync edit:', edit, response.statusText);
      }
    }
  } catch (error) {
    console.error('Error syncing offline edits:', error);
  }
}