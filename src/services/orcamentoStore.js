import { sanitize } from "../utils/format";

const LOCAL_DB_NAME = "jamorc-local";
const LOCAL_STORE_NAME = "snapshots";
const LOCAL_SNAPSHOT_KEY = "ultimo";

const openLocalDb = () =>
  new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB indisponível neste navegador."));
      return;
    }
    const request = indexedDB.open(LOCAL_DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(LOCAL_STORE_NAME);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const localDbOp = async (mode, operation) => {
  const dbLocal = await openLocalDb();
  try {
    return await new Promise((resolve, reject) => {
      const tx = dbLocal.transaction(LOCAL_STORE_NAME, mode);
      const request = operation(tx.objectStore(LOCAL_STORE_NAME));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      tx.onerror = () => reject(tx.error);
    });
  } finally {
    dbLocal.close();
  }
};

export async function saveLocalSnapshot(data) {
  const snapshot = sanitize({ ...data, savedAt: new Date().toISOString() });
  await localDbOp("readwrite", (store) => store.put(snapshot, LOCAL_SNAPSHOT_KEY));
}

export async function loadLocalSnapshot() {
  return await localDbOp("readonly", (store) => store.get(LOCAL_SNAPSHOT_KEY));
}
