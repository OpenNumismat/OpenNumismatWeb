import {onMounted, ref} from 'vue'
import initSqlJs from "sql.js";

let isInitialized = false
let SQL = null
let db = null

export function useSQLite() {
  const isLoading = ref(false)
  const error = ref(null)
  const status = ref('');

  onMounted(async () => {
    await initialize()
  });

  const initialize = async () => {
    if (isInitialized)
      return

    isLoading.value = true
    error.value = null
    status.value = 'Loading SQL.js'

    try {
      SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });
      isInitialized = true
    }
    catch (err) {
      console.error('Failed to load SQL.js:', err);
      status.value = 'Failed to load SQL.js'
      error.value = err
    }
    finally {
      isLoading.value = false
    }
  }

  const openDatabase = async (file) => {
    return new Promise((resolve, reject) => {
      if (!isInitialized)
        initialize()

      isLoading.value = true
      error.value = null
      status.value = 'Loading database...';

      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const uint8Array = new Uint8Array(arrayBuffer);

          // Load database
          db = new SQL.Database(uint8Array);

          status.value = `Database loaded successfully: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
          resolve()
        }
        catch (err) {
          console.error('Error loading database:', err);
          status.value = 'Error loading database'
          error.value = err
          reject()
        }
        finally {
          isLoading.value = false
        }
      }

      reader.onerror = (err) => {
        status.value = 'Error reading file'
        error.value = e.target.error
        isLoading.value = false
        reject()
      }

      reader.readAsArrayBuffer(file);
    });
  }

  const executeQuery = async (sql, params = []) => {
    if (!db)
      return

    isLoading.value = true
    error.value = null
    status.value = 'Executing query...';
    let results = null

    try {
      const result = db.exec(sql, params);
      console.log(result[0].values)
      results = result.length > 0
        ? result[0].values
        : [];
    }
    catch (err) {
      console.error('Failed execute query:', err);
      status.value = 'Failed execute query'
      error.value = err
    }
    finally {
      isLoading.value = false
    }

    return results
  }

  return {
    isLoading,
    error,
    status,
    openDatabase,
    executeQuery,
  }
}
