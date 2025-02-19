import { Product } from "@/types";
import { Container, DataRow } from "./data/transform";
// db.ts

let request: IDBOpenDBRequest;
let db: IDBDatabase;
let version = 1;


export enum Stores {
  dispensing = 'dispensing',
}

export const initDB = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // open the connection
    request = indexedDB.open('myDB');

    request.onupgradeneeded = () => {
      db = request.result;

      // if the data object store doesn't exist, create it
      if (!db.objectStoreNames.contains(Stores.dispensing)) {
        console.log('Creating users store');
        db.createObjectStore(Stores.dispensing, { keyPath: 'filled_datetime' });
      }
      // no need to resolve here
    };

    request.onsuccess = () => {
      db = request.result;
      version = db.version;
      console.log('request.onsuccess - initDB', version);
      resolve(true);
    };

    request.onerror = () => {
      resolve(false);
    };
  });
};


export const saveDataRowsToIndexedDB = async (dataRows: DataRow[]) => {
    // clear the store
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open("myDB", 1);

        request.onsuccess = (event) => {
            const db = (event.target as IDBRequest<IDBDatabase>).result;
            db.close();
            resolve();
        };

        request.onerror = (event) => {
            reject((event.target as IDBRequest).error);
        };
    });

    return new Promise<void>((resolve, reject) => {
        const request = indexedDB.open("myDB", 1);
    
        request.onsuccess = (event) => {
        const db = (event.target as IDBRequest<IDBDatabase>).result;
    
        const transaction = db.transaction(Stores.dispensing, "readwrite");
        const store = transaction.objectStore(Stores.dispensing);
    
        dataRows.forEach((row) => {
            store.put(row);
        });
    
        transaction.oncomplete = () => {
            db.close();
            resolve();
        };
        };
    
        request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
        };
    });
    }

export type DataFilters = {
    filled_datetime?: { start: string; end: string };
    container?: Container[];
    product?: string[];
    QS?: boolean;
    notes?: string[];
};

export const queryDataRowsFromIndexedDB = async (filters: DataFilters): Promise<DataRow[]> => {
    return new Promise<DataRow[]>((resolve, reject) => {
        const request = indexedDB.open("myDB", 1);

        request.onsuccess = (event) => {
            const db = (event.target as IDBRequest<IDBDatabase>).result;

            const transaction = db.transaction(Stores.dispensing, "readonly");
            const store = transaction.objectStore(Stores.dispensing);

            const cursor = store.openCursor();

            const dataRows: DataRow[] = [];

            cursor.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

                if (cursor) {
                    const row = cursor.value;
                    if (
                        (!filters.filled_datetime ||
                            (filters.filled_datetime.start <= row.filled_datetime &&
                                row.filled_datetime <= filters.filled_datetime.end)) &&
                        (!filters.container || filters.container.includes(row.container)) &&
                        (!filters.product || filters.product.includes(row.product_name)) &&
                        (!filters.QS || row.QS) &&
                        (!filters.notes || filters.notes.some((note) => row.notes.includes(note)))
                    ) {
                        dataRows.push(row);
                    }
                    cursor.continue();
                } else {
                    resolve(dataRows);
                }
            };
        };

        request.onerror = (event) => {
            reject((event.target as IDBRequest).error);
        };
    });
};

