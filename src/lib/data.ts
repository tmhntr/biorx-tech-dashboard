export type Container = "vial" | "1cc" | "3cc" | "5cc" | "10cc";
export type SheetRow = {
  product_name: string;
  tech_name: string;
  filled_time: Date;
  filled_date: Date;
  activity: number;
  actual_activity: number;
  procedure: string;
  volume: number;
  final_volume: number;
  notes: string;
};

export type DataRow = {
  product_name: string;
  tech_name: string;
  activity: number;
  actual_activity: number;
  procedure: string;
  volume: number;
  final_volume: number;
  notes: string;
  filled_datetime: string;
  dispense_time: number | null;
  activity_error: number;
  container: Container;
  QS: boolean;
};

export const processRow = (row: SheetRow): DataRow => {
  var date = new Date(row.filled_date);
  var time = new Date(row.filled_time);

  var filled_datetime =
    date.toISOString().slice(0, 10) +
    "T" +
    time.toISOString().slice(11, 19) +
    ".000";

  return {
    product_name: row.product_name,
    tech_name: row.tech_name,
    activity: row.activity,
    actual_activity: row.actual_activity,
    procedure: row.procedure,
    volume: row.volume,
    final_volume: row.final_volume,
    notes: row.notes,
    filled_datetime,
    dispense_time: null,
    activity_error: ((row.actual_activity - row.activity) * 100) / row.activity,
    container: "3cc",
    QS: row.notes.includes("QS"),
  };
};

export const processRows = (rows: SheetRow[]): DataRow[] => {
  var temp = rows.map(processRow);
  temp.sort((a, b) => {
    return a.filled_datetime.localeCompare(b.filled_datetime);
  });
  temp = temp.map((row, i) => {
    if (i > 0 && row.product_name === temp[i - 1].product_name) {
      row.dispense_time =
        (new Date(row.filled_datetime).getTime() -
          new Date(temp[i - 1].filled_datetime).getTime()) /
        1000;
      if (row.dispense_time < 0 || row.dispense_time > 60 * 30) {
        row.dispense_time = null;
      }
    }
    if (row.final_volume < 0.39) {
      row.container = "1cc";
    } else if (row.final_volume < 1.49) {
      row.container = "3cc";
    } else if (row.final_volume < 2.5) {
      row.container = "5cc";
    } else {
      row.container = "10cc";
    }
    if (row.procedure.includes("vial")) row.container = "vial";

    return row;
  });
  return temp;
};

export const saveDataRowsToIndexedDB = async (dataRows: DataRow[]) => {
  const dbName = "DispensingDB";
  const storeName = "DataRows";
  const dbVersion = 1;
  // const clearDatabase = () => {
  //   return new Promise<void>((resolve, reject) => {
  //     const request = indexedDB.open(dbName, dbVersion);

  //     request.onsuccess = (event) => {
  //       const db = (event.target as IDBOpenDBRequest).result;
  //       const transaction = db.transaction(storeName, "readwrite");
  //       const store = transaction.objectStore(storeName);

  //       const clearRequest = store.clear();

  //       clearRequest.onsuccess = () => {
  //         resolve();
  //       };

  //       clearRequest.onerror = (event) => {
  //         reject((event.target as IDBRequest).error);
  //       };
  //     };

  //     request.onerror = (event) => {
  //       reject((event.target as IDBRequest).error);
  //     };
  //   });
  // };

//   await clearDatabase();

  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "filled_datetime" });
      }
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);

      dataRows.forEach((dataRow) => {
        store.put(dataRow);
      });

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    };

    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
    };
  });
};

export const queryDataRowsFromIndexedDB = async (filters: {
  filled_datetime?: { start: string; end: string };
  container?: Container;
  product?: string;
}): Promise<DataRow[]> => {
  const dbName = "DispensingDB";
  const storeName = "DataRows";
  const dbVersion = 1;

  return new Promise<DataRow[]>((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const dataRows: DataRow[] = [];

      const cursorRequest = store.openCursor();

      cursorRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          const dataRow = cursor.value as DataRow;
          let matches = true;

          if (filters.filled_datetime) {
            const { start, end } = filters.filled_datetime;
            if (
              dataRow.filled_datetime < start ||
              dataRow.filled_datetime > end
            ) {
              matches = false;
            }
          }

          if (filters.container && dataRow.container !== filters.container) {
            matches = false;
          }

          if (filters.product && dataRow.product_name !== filters.product) {
            matches = false;
          }

          if (matches) {
            dataRows.push(dataRow);
          }

          cursor.continue();
        } else {
          resolve(dataRows);
        }
      };

      cursorRequest.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    };

    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
    };
  });
};
