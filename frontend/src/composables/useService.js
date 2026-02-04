import axios from "axios";
import {useGlobalStatus} from "@/composables/useGlobalStatus.js";
import i18n from "@/i18n/index.js";
import {useSQLite} from "@/composables/useSQLite.js";

const globalStatus = useGlobalStatus();
const {openDatabase, executeQuery} = useSQLite();

const api = axios.create({
//  baseURL: 'http://localhost:5000',
  timeout: 5000,
})

const fieldIds = {
  13: 'status',
  75: 'region',
  4: 'country',
  6: 'period',
  74: 'ruler',
  10: 'type',
  11: 'series',
  12: 'subjectshort',
  9: 'issuedate',
  5: 'year',
  25: 'mintage',
  14: 'material',
  7: 'mint',
  8: 'mintmark',
  20: 'grade',
  40: 'paydate',
  41: 'payprice',
  67: 'storage',
  83: 'condition',
  71: 'quantity',
}

const initSettings = async () => {
  let settings = {};
  settings.version = 0;
  settings.password = '';
  settings.type = null;
  settings.convert_fraction = true;
  settings.enable_bc = true;
  settings.statuses = {
    'demo': 'demo',
    'pass': 'pass',
    'owned': 'owned',
    'ordered': 'ordered',
    'sold': 'sold',
    'sale': 'sale',
    'wish': 'wish',
    'missing': 'missing',
    'bidding': 'bidding',
    'duplicate': 'duplicate',
    'replacement': 'replacement',
  };

  settings.fields = {};
  Object.values(fieldIds).forEach(field => {
    settings.fields[field] = field;
  })

  return settings
}

const checkDbVersion = async (settings) => {
    globalStatus.status.value = 'Check collection'

    if (settings.type !== 'OpenNumismat') {
      globalStatus.error.value = i18n.global.t('wrong_version');
      return false;
    }

    if (settings.version < 6) {
      globalStatus.error.value = i18n.global.t('too_old_version');
      return false;
    }
    else if (settings.version < 10) {
      globalStatus.warning.value = i18n.global.t('old_version');
    }
    else if (settings.version > 10) {
      globalStatus.warning.value = i18n.global.t('newest_version');
    }

    return true;
}

function MD5(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()}function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}

const checkDbPassword = async (settings) => {
  globalStatus.status.value = 'Check password'

  if (MD5('') !== settings.password) {
    const enteredPassword = await passwordDialog.value.promptPassword()
    if (enteredPassword && MD5(enteredPassword) === settings.password) {
      return true
    }
    else {
      globalStatus.error.value = 'Wrong password'
      return false
    }
  }

  return true
}

export function useService() {
  const getServerFileList = async () => {
    let serverFileList = [];

    await globalStatus.startLoading('Connect to remote server');

    try {
      const response = await api.get('/api/filelist')
      serverFileList = response.data
    } catch (err) {
      globalStatus.error.value = err
    } finally {
      await globalStatus.finishLoading()
    }

    return serverFileList;
  }

  const openRemoteFile = async (file) => {
    let coinsList = [];
    let collectionSettings = {};

    await globalStatus.startLoading('Open collection');

    try {
      const responseSettings = await api.get('/api/settings', {params: {f: file}})
      collectionSettings = responseSettings.data

      const responseCoins = await api.get('/api/coins', {params: {f: file}})
      coinsList = responseCoins.data
    }
    catch (err) {
      globalStatus.error.value = err
    }
    finally {
      await globalStatus.finishLoading();
    }

    return {collectionSettings, coinsList};
  }

  const openLocalFile = async (file) => {
    let coinsList = [];
    let collectionSettings = {};

    await openDatabase(file)

    const sql_settings = `SELECT * FROM settings`
    const settingsDb = await executeQuery(sql_settings)

    collectionSettings = await initSettings()

    settingsDb.forEach(function(elem) {
        if (elem[0] === 'Version')
            collectionSettings.version = Number(elem[1]);
        else if (elem[0] === 'Password')
            collectionSettings.password = elem[1];
        else if (elem[0] === 'Type')
            collectionSettings.type = elem[1];
        else if (elem[0] === 'convert_fraction')
            collectionSettings.convert_fraction = Boolean(elem[1]);
        else if (elem[0] === 'enable_bc')
            collectionSettings.enable_bc = Boolean(elem[1]);
        else {
          Object.keys(collectionSettings).forEach(key => {
            if (elem[0] === key + '_status_title')
              collectionSettings.statuses[key] = elem[1]
          })
        }
    })

    const field_sql = `SELECT id, title FROM fields WHERE id IN (${Object.keys(fieldIds)})`
    const fieldsDb = await executeQuery(field_sql)

    fieldsDb.forEach(function(elem) {
      const field = fieldIds[elem[0]]
      collectionSettings.fields[field] = elem[1]
    })

    const versionValid = await checkDbVersion(collectionSettings);
    if (versionValid) {
      const passwordValid = await checkDbPassword(collectionSettings)
      if (passwordValid) {
        const sql = `
            SELECT coins.id, images.image, title, status, subjectshort, value, unit, year, mintmark, series, country
            FROM coins LEFT OUTER JOIN images ON images.id = coins.image
          `
        coinsList = await executeQuery(sql)
      }
    }

    return {collectionSettings, coinsList};
  }

  return {
    getServerFileList,
    openRemoteFile,
    openLocalFile,
  }
}
