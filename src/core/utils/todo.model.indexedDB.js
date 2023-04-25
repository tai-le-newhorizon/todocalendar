import "./seed";

let indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB,
    // IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction,
  baseName = "ztodo",
  storeName = "todolist01";

function connectDB(f) {
  // Open (or create) the database
  let request = indexedDB.open(baseName, 1);
  request.onerror = zlog;
  request.onsuccess = function () {
    f(request.result);
  };

  request.onupgradeneeded = function (e) {
    let Db = e.currentTarget.result;
    if (Db.objectStoreNames.contains(storeName))
      Db.deleteObjectStore(storeName);

    //Create store
    if (!Db.objectStoreNames.contains(storeName)) {
      let store = Db.createObjectStore(storeName, {
        keyPath: "id",
        autoIncrement: true,
      });
      store.createIndex("start", "start");
      store.createIndex("tags", "extendedProps.tags", {
        unique: false,
        multiEntry: true,
      });
    }
    connectDB(f);
  };
}

function get(id, f) {
  connectDB(function (db) {
    let transaction = db
      .transaction([storeName], "readonly")
      .objectStore(storeName)
      .get(id);
    transaction.onerror = zlog;
    transaction.onsuccess = function () {
      f(transaction.result ? transaction.result : -1);
    };
  });
}

function getAll(f) {
  connectDB(function (db) {
    let rows = [],
      store = db.transaction([storeName], "readonly").objectStore(storeName);

    if (store.mozGetAll)
      store.mozGetAll().onsuccess = function (e) {
        f(e.target.result);
      };
    else
      store.openCursor().onsuccess = function (e) {
        let cursor = e.target.result;
        if (cursor) {
          rows.push(cursor.value);
          cursor.continue();
        } else {
          f(rows);
        }
      };
  });
}

function findAll(f, keyName, keyRange) {
  if (!keyName || !keyRange) {
    getAll(f);
    return;
  }

  connectDB(function (db) {
    const keyRangeValue = keyRange;
    let rows = [];
    let index = db
      .transaction([storeName], "readonly")
      .objectStore(storeName)
      .index(keyName);

    index.openCursor(keyRangeValue).onsuccess = function (e) {
      let cursor = e.target.result;
      if (cursor) {
        rows.push(cursor.value);
        cursor.continue();
      } else {
        f(rows);
      }
    };
  });
}

function up(obj) {
  zlog('up: ', obj)
  if (!obj.id) return
  del(obj.id);
  add(obj);
}

function add(obj, cb) {
  zlog('add: ', obj)
  if (!obj) return
  connectDB((db) => {
    let tx = db.transaction([storeName], "readwrite");
    let store = tx.objectStore(storeName);
    let request = store.add(obj);
    request.onerror = zlog;
    request.onsuccess = () => {
      typeof cb == "function" && cb(request.result);
    };
  });
}

function del(id, cb) {
  zlog('del: ', id)
  if (!id) return
  connectDB((db) => {
    let tx = db.transaction([storeName], "readwrite");
    let store = tx.objectStore(storeName);
    let request = store.delete(id);
    request.onerror = zlog;
    request.onsuccess = () => {
      typeof cb == "function" && cb(request.result);
    };
  });
}

// Run data seed
// let dataSeed = window.dataSeed;
// for (let i = 0; i < dataSeed.length; i++) {
//   const ele = dataSeed[i];
//   add(ele);
// }

// IDBKeyRange.bound(0, 10000)
let exportObject = {
  findAll,
  get,
  add,
  up,
  del,
};

export default exportObject;
