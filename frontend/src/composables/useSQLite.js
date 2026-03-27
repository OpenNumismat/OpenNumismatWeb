import {onMounted} from 'vue'
import initSqlJs from "sql.js";
import {useGlobalStatus} from "@/composables/useGlobalStatus.js";
import i18n from "@/i18n/index.js";

const globalStatus = useGlobalStatus();
let isInitialized = false
let SQL = null
let db = null

export function useSQLite() {
  onMounted(async () => {
    await initialize()
  });

  const initialize = async () => {
    if (isInitialized)
      return

    await globalStatus.startLoading(i18n.global.t('Loading SQL.js'));

    try {
      SQL = await initSqlJs({
        locateFile: file => `wasm/${file}`
      });
      isInitialized = true
    }
    catch (err) {
      console.error('Failed to load SQL.js:', err);
      globalStatus.status.value = i18n.global.t('Failed to load SQL.js')
      globalStatus.error.value = err
    }
    finally {
      await globalStatus.finishLoading();
    }
  }

  const openDatabase = async (file) => {
    return new Promise((resolve, reject) => {
      if (!isInitialized)
        initialize()

      globalStatus.startLoading(i18n.global.t('Loading database...'));

      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const uint8Array = new Uint8Array(arrayBuffer);

          // Load database
          db = new SQL.Database(uint8Array);

          resolve()
        }
        catch (err) {
          console.error('Error loading database:', err);
          globalStatus.status.value = i18n.global.t('Error loading database')
          globalStatus.error.value = err
          reject()
        }
        finally {
          await globalStatus.finishLoading();
        }
      }

      reader.onerror = (err) => {
        globalStatus.finishLoading();
        globalStatus.status.value = i18n.global.t('Error reading file')
        globalStatus.error.value = err
        reject()
      }

      reader.readAsArrayBuffer(file);
    });
  }

  const executeQuery = async (sql, params = []) => {
    if (!db)
      return

    await globalStatus.startLoading(i18n.global.t('Executing query...'));
    let results = null

    try {
/*
      const result = [];
      const stmt = db.prepare(sql);
      stmt.bind(params);
      while(stmt.step()) {
        result.push(stmt.get());
      }
      stmt.free();
      results = result;
*/
      console.log(sql, params)
      const result = db.exec(sql, params);
      results = result.length > 0
        ? result[0].values
        : [];
      console.log(results)
    }
    catch (err) {
      console.error('Failed execute query:', err, '\nRequest: ', sql, '\nParams: ', params);
      globalStatus.status.value = i18n.global.t('Failed execute query')
      globalStatus.error.value = err
    }
    finally {
      await globalStatus.finishLoading();
    }

    return results
  }

  return {
    openDatabase,
    executeQuery,
  }
}
