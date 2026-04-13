import axios from "axios";
import {useGlobalStatus} from "@/composables/useGlobalStatus.js";
import i18n from "@/i18n/index.js";
import {useSQLite} from "@/composables/useSQLite.js";
import {arrayBufferToBase64} from "@/utils/bytes2img.js";

const globalStatus = useGlobalStatus();

const api = axios.create({
//  baseURL: 'http://localhost:8000',
  timeout: 20000,
})

api.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem('apiKey');

  if (apiKey) {
    config.headers['access_token'] = apiKey;
  }

  return config;
});

let connection_type = null;
let connected_file = null;

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
  1: 'title',
}

const infoFields = ['coins.title', 'obverseimg.image', 'reverseimg.image',
    'status', 'region', 'country', 'period', 'ruler', 'value', 'unit', 'type',
    'series', 'subjectshort', 'issuedate', 'year', 'mintage', 'material',
    'mint', 'mintmark', 'features', 'subject', 'grade', 'paydate', 'payprice',
    'storage', 'condition', 'quantity',];

const initSettings = async () => {
  let settings = {};
  settings.version = 0;
  settings.password = '';
  settings.type = null;
  settings.convert_fraction = true;
  settings.enable_bc = true;
  settings.statuses = {
    'demo': i18n.global.t('demo'),
    'pass': i18n.global.t('pass'),
    'owned': i18n.global.t('owned'),
    'ordered': i18n.global.t('ordered'),
    'sold': i18n.global.t('sold'),
    'sale': i18n.global.t('sale'),
    'wish': i18n.global.t('wish'),
    'missing': i18n.global.t('missing'),
    'bidding': i18n.global.t('bidding'),
    'duplicate': i18n.global.t('duplicate'),
    'replacement': i18n.global.t('replacement'),
  };

  settings.fields = {};
  Object.values(fieldIds).forEach(field => {
    settings.fields[field] = field;
  })

  return settings
}

const checkDbVersion = async (settings) => {
    globalStatus.status.value = i18n.global.t('Check collection')

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

export function useService(passwordDialogRef) {
  const {openDatabase, executeQuery} = useSQLite();

  const checkDbPassword = async (settings) => {
    globalStatus.status.value = i18n.global.t('Check password')

    if (MD5('') !== settings.password) {
      const enteredPassword = await passwordDialogRef.value.promptPassword()
      if (enteredPassword && MD5(enteredPassword) === settings.password) {
        return true
      }
      else {
        globalStatus.error.value = i18n.global.t('Wrong password')
        return false
      }
    }

    return true
  }

  const getServerFileList = async () => {
    let serverFileList = [];

    await globalStatus.startLoading(i18n.global.t('Connect to remote server'));

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
    connection_type = 'remote';
    connected_file = file;

    let collectionSettings = await initSettings();
    let collectionFilters = {};
    let settingsDb = {};

    await globalStatus.startLoading(i18n.global.t('Open collection'));

    try {
      const responseSettings = await api.get('/api/settings', {params: {f: file}})
      settingsDb = responseSettings.data
    }
    catch (err) {
      globalStatus.error.value = err
    }
    finally {
      await globalStatus.finishLoading();
    }

    if (Object.keys(settingsDb).length !== 0) {
      collectionSettings.version = settingsDb.version;
      collectionSettings.password = settingsDb.password;
      collectionSettings.type = settingsDb.type;
      collectionSettings.convert_fraction = settingsDb.convert_fraction;
      collectionSettings.enable_bc = settingsDb.enable_bc;
      collectionSettings.statuses = {...collectionSettings.statuses, ...settingsDb.statuses}
      collectionSettings.fields = {...collectionSettings.fields, ...settingsDb.fields}
    }

    const versionValid = await checkDbVersion(collectionSettings);
    if (!versionValid) {
      return null;
    }
    else {
      const passwordValid = await checkDbPassword(collectionSettings)
      if (!passwordValid) {
        return null;
      }
    }

    await globalStatus.startLoading(i18n.global.t('Load collection'));

    try {
      const responseFilters = await api.get('/api/filters', {params: {f: file}})
      collectionFilters = responseFilters.data
    }
    catch (err) {
      globalStatus.error.value = err
    }
    finally {
      await globalStatus.finishLoading();
    }

    return {collectionSettings, collectionFilters};
  }

  const openLocalFile = async (file) => {
    connection_type = 'local';

    let collectionFilters = {};
    let collectionSettings = await initSettings()

    await openDatabase(file)

    const sql_settings = `SELECT * FROM settings`
    const settingsDb = await executeQuery(sql_settings)

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
          Object.keys(collectionSettings.statuses).forEach(key => {
            if (elem[0] === key + '_status_title')
              collectionSettings.statuses[key] = elem[1]
          })
        }
    })

    const versionValid = await checkDbVersion(collectionSettings);
    if (!versionValid) {
      return null;
    }
    else {
      const passwordValid = await checkDbPassword(collectionSettings)
      if (!passwordValid) {
        return null;
      }
    }

    const field_sql = `SELECT id, title FROM fields WHERE id IN (${Object.keys(fieldIds)})`
    const fieldsDb = await executeQuery(field_sql)

    fieldsDb.forEach(function(elem) {
      const field = fieldIds[elem[0]]
      collectionSettings.fields[field] = elem[1]
    })

    const sql_statuses = 'SELECT DISTINCT status FROM coins';
    collectionFilters['status'] = (await executeQuery(sql_statuses)).flat()
    const sql_countries = "SELECT DISTINCT IFNULL(country,'') FROM coins ORDER BY country";
    collectionFilters['country'] = (await executeQuery(sql_countries)).flat()
    const sql_years = "SELECT DISTINCT IFNULL(year,'') FROM coins ORDER BY year";
    collectionFilters['year'] = (await executeQuery(sql_years)).flat()
    const sql_series = "SELECT DISTINCT IFNULL(series,'') FROM coins ORDER BY series";
    collectionFilters['series'] = (await executeQuery(sql_series)).flat()
    const sql_types = "SELECT DISTINCT IFNULL(type,'') FROM coins ORDER BY type";
    collectionFilters['type'] = (await executeQuery(sql_types)).flat()
    const sql_periods = "SELECT DISTINCT IFNULL(period,'') FROM coins ORDER BY period";
    collectionFilters['period'] = (await executeQuery(sql_periods)).flat()
    const sql_mints = "SELECT DISTINCT IFNULL(mint,'') FROM coins ORDER BY mint";
    collectionFilters['mint'] = (await executeQuery(sql_mints)).flat()

    return {collectionSettings, collectionFilters};
  }

  const loadCoins = async (search=null, sortBy=null, reverse=false, statusFilter=null, countryFilter=null,
                           yearFilter=null, seriesFilter=null, typeFilter=null, periodFilter=null, mintFilter=null) => {
    if (connection_type === 'local')
      return loadCoinsLocal(search, sortBy, reverse, statusFilter, countryFilter, yearFilter, seriesFilter, typeFilter, periodFilter, mintFilter);
    else if (connection_type === 'remote')
      return loadCoinsRemote(search, sortBy, reverse, statusFilter, countryFilter, yearFilter, seriesFilter, typeFilter, periodFilter, mintFilter, connected_file);
  }

  const loadCoinsRemote = async (search, sortBy, reverse, statusFilter, countryFilter, yearFilter, seriesFilter, typeFilter, periodFilter, mintFilter, file) => {
    let coinsList = [];

    await globalStatus.startLoading(i18n.global.t('Load coins'));

    try {
      const responseCoins = await api.get('/api/coins', {params: {
          f: file,
          search: search,
          sort: sortBy,
          reverse: reverse,
          status_filter: statusFilter,
          country_filter: countryFilter,
          year_filter: yearFilter,
          series_filter: seriesFilter,
          type_filter: typeFilter,
          period_filter: periodFilter,
          mint_filter: mintFilter,
      }})
      coinsList = responseCoins.data
    }
    catch (err) {
      globalStatus.error.value = err
    }
    finally {
      await globalStatus.finishLoading();
    }

    return coinsList;
  }

  const loadCoinsLocal = async (search, sortBy, reverse, statusFilter, countryFilter, yearFilter, seriesFilter, typeFilter, periodFilter, mintFilter) => {
    let sql = `
        SELECT coins.id, title, status, subjectshort, value, unit, year, mintmark, series, country
        FROM coins
      `
    let params = [];
    let sql_filters = [];
    if (search) {
      sql_filters.push("title LIKE ?")
      params.push(`%${search}%`);
    }
    if (statusFilter) {
      sql_filters.push('status = ?')
      params.push(statusFilter);
    }
    if (countryFilter) {
      sql_filters.push('country = ?')
      params.push(countryFilter);
    }
    if (yearFilter) {
      sql_filters.push('year = ?')
      params.push(yearFilter);
    }
    if (seriesFilter) {
      sql_filters.push('series = ?')
      params.push(seriesFilter);
    }
    if (typeFilter) {
      sql_filters.push('type = ?')
      params.push(typeFilter);
    }
    if (periodFilter) {
      sql_filters.push('period = ?')
      params.push(periodFilter);
    }
    if (mintFilter) {
      sql_filters.push('mint = ?')
      params.push(mintFilter);
    }
    if (sql_filters.length > 0)
      sql += ` WHERE ${sql_filters.join(' AND ')}`;
    if (sortBy)
      sql += ` ORDER BY ${sortBy}`;
    else
      sql += ' ORDER BY sort_id';
    if (reverse)
      sql += ' DESC';

    return await executeQuery(sql, params)
  }

  const loadImages = async () => {
    if (connection_type === 'local')
      return loadImagesLocal();
    else if (connection_type === 'remote')
      return loadImagesRemote(connected_file);
  }

  const loadImagesRemote = async (file) => {
    let images = [];

    try {
      const response = await api.get('/api/images', {params: {f: file}})
      images = response.data
    }
    catch (err) {
      globalStatus.error.value = err
    }

    return images;
  }

  const loadImagesLocal = async () => {
    let sql = `
        SELECT coins.id, images.image
        FROM coins LEFT OUTER JOIN images ON images.id = coins.image
      `
    return await executeQuery(sql);
  }

  const loadImage = async (coinId, type) => {
    if (connection_type === 'local')
      return loadImageLocal(coinId, type);
    else if (connection_type === 'remote')
      return loadImageRemote(coinId, type, connected_file);
  }

  const loadImageRemote = async (coinId, type, file) => {
    let photo;

    try {
      const response = await api.get('/api/photo', {params: {f: file, id: coinId, type: type}})
      photo = arrayBufferToBase64(response.data)
    }
    catch (err) {
      globalStatus.error.value = err
    }

    return photo;
  }

  const loadImageLocal = async (coinId, type) => {
    let sql
    if (type === 'obverse') {
      sql = `SELECT obverseimg.image FROM coins
          LEFT JOIN photos AS obverseimg ON coins.obverseimg = obverseimg.id
          WHERE coins.id=?`
    }
    else if (type === 'reverse') {
      sql = `SELECT reverseimg.image FROM coins
          LEFT JOIN photos AS reverseimg ON coins.reverseimg = reverseimg.id
          WHERE coins.id=?`
    }
    else {
      sql = `SELECT obverseimg.image, reverseimg.image FROM coins
          LEFT JOIN photos AS obverseimg ON coins.obverseimg = obverseimg.id
          LEFT JOIN photos AS reverseimg ON coins.reverseimg = reverseimg.id
          WHERE coins.id=?`
    }

    const results = await executeQuery(sql, [coinId,])
    let img
    if (type === 'both') {
      const maxHeight = 54*4 // Step-down scaling for better quality
      let aspectRatio
      let img1 = null, img2 = null
      let newWidth1 = 0, newWidth2 = 0

      if (results[0][0]) {
        const b64_img1 = arrayBufferToBase64(results[0][0])
        img1 = new Image()
        img1.src = b64_img1
        await img1.decode()
        aspectRatio = img1.naturalWidth / img1.naturalHeight
        newWidth1 = maxHeight * aspectRatio
      }

      if (results[0][1]) {
        const b64_img2 = arrayBufferToBase64(results[0][1])
        img2 = new Image()
        img2.src = b64_img2
        await img2.decode()
        aspectRatio = img2.naturalWidth / img2.naturalHeight
        newWidth2 = maxHeight * aspectRatio
      }

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      canvas.width = newWidth1 + newWidth2
      canvas.height = maxHeight
      if (img1)
        ctx.drawImage(img1, 0, 0, newWidth1, maxHeight)
      if (img2)
        ctx.drawImage(img2, newWidth1, 0, newWidth2, maxHeight)
      img = canvas.toDataURL('image/png')
    }
    else {
      img = arrayBufferToBase64(results[0][0])
    }

    return img
  }

  const getDetails = async (coinId) => {
    if (connection_type === 'local')
      return getDetailsLocal(coinId);
    else if (connection_type === 'remote')
      return getDetailsRemote(coinId, connected_file);
  }

  const getDetailsRemote = async (coinId, file) => {
    let coinData= [];

    await globalStatus.startLoading(i18n.global.t('Request'));

    try {
      const response = await api.get('/api/coin_data', {params: {f: file, id: coinId}})
      coinData = response.data
    }
    catch (err) {
      globalStatus.error.value = err
    }
    finally {
      await globalStatus.finishLoading();
    }

    return coinData;
  }

  const getDetailsLocal = async (coinId) => {
    let coinData;

    const sql = `SELECT ${ infoFields.join(',') } FROM coins
        LEFT JOIN photos AS obverseimg ON coins.obverseimg = obverseimg.id
        LEFT JOIN photos AS reverseimg ON coins.reverseimg = reverseimg.id
        WHERE coins.id=?`
    const results = await executeQuery(sql, [coinId,])
    coinData = results[0]

    return coinData
  }

  const getPhotos = async (coinId) => {
    if (connection_type === 'local')
      return getPhotosLocal(coinId);
    else if (connection_type === 'remote')
      return getPhotosRemote(coinId, connected_file);
  }

  const getPhotosRemote = async (coinId, file) => {
    let photos= [];

    await globalStatus.startLoading(i18n.global.t('Request'));

    try {
      const response = await api.get('/api/photos', {params: {f: file, id: coinId}})
      photos = response.data
    }
    catch (err) {
      globalStatus.error.value = err
    }
    finally {
      await globalStatus.finishLoading();
    }

    return photos;
  }

  const getPhotosLocal = async (coinId) => {
    let photos;

    const sql = `SELECT obverseimg.image, reverseimg.image, edgeimg.image, photo1.image, photo2.image, photo3.image, photo4.image FROM coins
          LEFT JOIN photos AS obverseimg ON coins.obverseimg = obverseimg.id
          LEFT JOIN photos AS reverseimg ON coins.reverseimg = reverseimg.id
          LEFT JOIN photos AS edgeimg ON coins.edgeimg = edgeimg.id
          LEFT JOIN photos AS photo1 ON coins.photo1 = photo1.id
          LEFT JOIN photos AS photo2 ON coins.photo2 = photo2.id
          LEFT JOIN photos AS photo3 ON coins.photo3 = photo3.id
          LEFT JOIN photos AS photo4 ON coins.photo4 = photo4.id
          WHERE coins.id=?`
    const results = await executeQuery(sql, [coinId,])
    photos = results[0]

    return photos
  }

  function infoFieldIndex(field) {
    return infoFields.findIndex(element => element === field);
  }

  const getSummary = async () => {
    if (connection_type === 'local')
      return getSummaryLocal();
    else if (connection_type === 'remote')
      return getSummaryRemote(connected_file);
  }

  const getSummaryRemote = async (file) => {
    let summary= {};

    await globalStatus.startLoading(i18n.global.t('Request'));

    try {
      const response = await api.get('/api/summary', {params: {f: file}})
      summary = response.data
    }
    catch (err) {
      globalStatus.error.value = err
    }
    finally {
      await globalStatus.finishLoading();
    }

    return summary;
  }

  const getSummaryLocal = async () => {
    let collection_summary = {};

    let sql = "SELECT count(*) FROM coins"
    let results = await executeQuery(sql)
    collection_summary['total_count'] = results[0][0]

    sql = "SELECT count(*) FROM coins WHERE status IN ('owned', 'ordered', 'sale', 'duplicate', 'replacement')"
    results = await executeQuery(sql)
    collection_summary['count_owned'] = results[0][0]

    sql = "SELECT count(*) FROM coins WHERE status='wish'"
    results = await executeQuery(sql)
    collection_summary['count_wish'] = results[0][0]

    sql = "SELECT count(*) FROM coins WHERE status='sold'"
    results = await executeQuery(sql)
    collection_summary['count_sold'] = results[0][0]

    sql = "SELECT count(*) FROM coins WHERE status='bidding'"
    results = await executeQuery(sql)
    collection_summary['count_bidding'] = results[0][0]

    sql = "SELECT count(*) FROM coins WHERE status='missing'"
    results = await executeQuery(sql)
    collection_summary['count_missing'] = results[0][0]

    sql = "SELECT SUM(totalpayprice) FROM coins WHERE status IN ('owned', 'ordered', 'sale', 'sold', 'missing', 'duplicate', 'replacement') AND totalpayprice<>'' AND totalpayprice IS NOT NULL"
    results = await executeQuery(sql)
    collection_summary['paid'] = results[0][0]

    sql = "SELECT SUM(payprice) FROM coins WHERE status IN ('owned', 'ordered', 'sale', 'sold', 'missing', 'duplicate', 'replacement') AND payprice<>'' AND payprice IS NOT NULL"
    results = await executeQuery(sql)
    collection_summary['paid_without_commission'] = results[0][0]

    sql = "SELECT paydate FROM coins WHERE status IN ('owned', 'ordered', 'sale', 'sold', 'missing', 'duplicate', 'replacement') AND paydate<>'' AND paydate IS NOT NULL ORDER BY paydate LIMIT 1"
    results = await executeQuery(sql)
    collection_summary['first_purchase'] = results[0][0]

    return collection_summary
  }

  return {
    getServerFileList,
    openRemoteFile,
    openLocalFile,
    loadCoins,
    loadImages,
    loadImage,
    getDetails,
    getPhotos,
    infoFieldIndex,
    getSummary,
  }
}
