// IndexedDB wrapper for storing large binary files (APKs, ZIPs, source codes)
// This prevents localStorage quota exceeded errors and allows unlimited file sizes.

const DB_NAME = 'ApnaBazaarDB';
const DB_VERSION = 1;
const STORE_NAME = 'uploaded_files';

// In-memory object URL cache for instant downloads during session
const memoryUrlCache = new Map<string, string>();

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function storeFileBlob(id: string, file: Blob | File, filename: string): Promise<string> {
  // Store object URL in memory cache for immediate downloads
  try {
    const objUrl = URL.createObjectURL(file);
    memoryUrlCache.set(id, objUrl);
  } catch (e) {
    console.warn('Memory URL creation failed', e);
  }

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({
        id,
        blob: file,
        filename,
        timestamp: Date.now(),
      });

      req.onsuccess = () => resolve(`indexeddb:${id}`);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB store failed, using in-memory cache:', err);
    return `indexeddb:${id}`;
  }
}

export async function getFileBlob(id: string): Promise<{ blob: Blob; filename: string } | null> {
  const cleanId = id.replace(/^indexeddb:/, '');

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(cleanId);

      req.onsuccess = () => {
        if (req.result && req.result.blob) {
          resolve({ blob: req.result.blob, filename: req.result.filename });
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export function getCachedMemoryUrl(id: string): string | undefined {
  const cleanId = id.replace(/^indexeddb:/, '');
  return memoryUrlCache.get(cleanId);
}

// Client-side image compression to keep thumbnails < 50KB
export function compressImageFile(file: File, maxDim = 500, quality = 0.8): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => {
        resolve(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}
