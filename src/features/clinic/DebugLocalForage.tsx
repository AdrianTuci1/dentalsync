import React, { useEffect, useState } from "react";
import localforage from "localforage";
import styles from "./DebugLocalForage.module.scss"; // Optional CSS module for styling

interface CacheEntry {
  key: string;
  value: any;
}

const DebugLocalForage: React.FC = () => {
  const [entries, setEntries] = useState<CacheEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCacheData = async () => {
      try {
        const keys = await localforage.keys();
        const entryPromises = keys.map(async (key) => {
          const value = await localforage.getItem(key);
          return { key, value };
        });
        const results = await Promise.all(entryPromises);
        setEntries(results);
      } catch (error) {
        console.error("Error fetching cache data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCacheData();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading cached data...</div>;
  }

  return (
    <div className={styles.container}>
      <h2>LocalForage Debug Info</h2>
      {entries.length === 0 ? (
        <p>No data found in cache.</p>
      ) : (
        <ul className={styles.list}>
          {entries.map((entry) => (
            <li key={entry.key} className={styles.listItem}>
              <strong>{entry.key}:</strong>
              <pre className={styles.pre}>
                {JSON.stringify(entry.value, null, 2)}
              </pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DebugLocalForage;