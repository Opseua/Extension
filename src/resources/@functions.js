// await new Promise(r => setTimeout(r, (500))); await new Promise(r => setTimeout(r, (15 * (1000)))); await new Promise(r => setTimeout(r, (2 * (60 * 1000))));
// setInterval(async () => { /* APÓS 15 SEGUNDOS E REPETIÇÃO */ }, (15 * (1000))); setInterval(async () => { /* APÓS 2 MINUTOS E REPETIÇÃO */ }, (2 * (60 * 1000)));

/* CHECAR SE É ARRAY  */ // Array.isArray(['a', 'b', ])   |   CHECAR SE TEM A CHAVE  if ('chave' in obj){ }   |   CHECAR SE É OBJETO typeof obj === 'object'
// let { 'key': atribuirNisso, } = { 'key': 'AAA', }; console.log(atribuirNisso); let arrNew = arr.map((v, index) => ({ index, 'providerOk': v.provider, 'actionOk': v.action, })); // PODE REATRIBUIR NA MESMA VARIÁVEL
// let ret = rets.some(v => v.ret === true)), ret = rets.every(v => v.ret === true)); 
// let string = 'a/b/c/d'; console.log(string.split('/').reverse()[0]); console.log(string.split('/').reverse()[1]); console.log(string.split('/').reverse()[2]); // SPLIT POR '/' E PEGAR A PARTIR DO ÚLTIMO ÍNDICE
// Math.trunc(value) // REMOVER ARREDONDAMENTO (MANTENDO O MESMO NÚMERO ANTES DO PONTO)

// for (let [index, value,] of array.entries()) { console.log('INDEX', index, 'VALUE', value); };
// array = array.map(v => { let resultado = rangeParse(v); return resultado * 2; });

// let obj = { 'keyA': 'valueA', 'keyB': 'valueB', 'keyC': 'valueC' }; for (let key in obj) { console.log(key); console.log(obj[key]); }
// let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8,]; console.log(arr.slice(1, 5));
// let value = 'CASAMENTO'; console.log(['CADEIRA', 'casa', 'CARRO',].some(a => value?.toLowerCase()?.includes(a?.toLowerCase()))); // true

/* FORMATAR EM '0001' */ // number = String(number).padStart(4, '0'); 
/* ESPERAR E EXECUTAR UMA VEZ */ // setTimeout(() => { console.log('OK'); }, (2 * (1000)));
/* ESPERAR E REPETIR */ // setInterval(() => { console.log('OK'); }, (2 * (1000)));
/* TIMEOUT */ // let timeout = setTimeout(() => { console.log('OK'); }, (5 * (60 * 1000))); clearTimeout(timeout);
/* LOOP 99 VEZES */ // for (let index = 0; index < 99; index++) { console.log('INDEX', index); };

// CORTAR PARTE DECIMAL | ARREDONDAR PARA CIMA | ARREDONDAR PARA BAIXO | ARREDONDAR PARA O MAIS PRÓXIMO
// Math.trunc(4.9); /*    */  Math.ceil(4.9);  /* */ Math.floor(4.9); /* */ Math.round(4.9);

/* QUALQUER → BASE64 | BASE64 → UTF8 */ // let qualquerParaBase64 = Buffer.from('CASAMENTO').toString('base64'); console.log(`qualquerParaBase64 ${qualquerParaBase64}`) // npm prune (REMOVER BIBLIOTECAS DESNCESSÁRIAS)
// let base64ParaUtf8 = Buffer.from(qualquerParaBase64, 'base64').toString('utf8'); console.log(`base64ParaUtf8 ${base64ParaUtf8}`); cd /d D:\ARQUIVOS\PROJETOS\Sniffer_Python

// let table = { 'cols': ['COL_A', 'COL_B', 'COL_C',], 'lins': [['A1', 'B1', 'C1',], ['A2', 'B2', 'C2',], ['A3', 'B3', 'C3',],], };
// table = table.lins.map(l => Object.fromEntries(table.cols.map((c, i) => [c, l[i],]))); console.table(table);

// ############### CLEAR CONSOLE | CRASH CODE ###############
function clearConsole() { if (eng) { console.clear(); } else { process.stdout.write('\u001b[2J\u001b[0;0H'); process.stdout.write('\x1Bc'); } } let msgQtd = 0; let runCleCon = console.log; clearConsole();
globalThis['thisIgnore'] = ''; console.log = function () { runCleCon.apply(console, arguments); msgQtd++; if (msgQtd >= 100) { clearConsole(); msgQtd = 0; console.log('CONSOLE LIMPO!\n'); } };
function getTypeof(v) { // 'number' / 'nan' / 'string' / 'boolean' / 'null' / 'undefined' / 'array' / 'object' / 'buffer' / 'function' / 'date' / 'set' / 'map' / 'regexp' / 'error' → let a = getTypeof(false)
    let t = typeof v; return (t !== 'object') ? ((t === 'number') ? (Number.isNaN(v) ? 'nan' : 'number') : t) : (v === null) ? 'null' : ((eng ? (v instanceof Uint8Array) : Buffer.isBuffer(v)) ? 'buffer' :
        (Array.isArray(v)) ? 'array' : (v instanceof Error) ? 'error' : (v instanceof Date) ? 'date' : (v instanceof Set) ? 'set' : (v instanceof Map) ? 'map' : (v instanceof RegExp) ? 'regexp' : 'object');
} function codeStop(m = 'PARANDO CÓDIGO...') { if (!eng && m === true) { x; } console.log(m); if (eng) { chrome.management.setEnabled(chrome.runtime.id, false); } else { m = process; m.kill(m.pid, 'SIGINT'); m.exit(); } }
// codeStop(`Encerramento TAL`); codeStop(); /* → ENCERRA O CÓDIGO */ codeStop(true); /* → QUEBRA O CÓDIGO */

// *-*-*-*-*-*-* eng: [true|false → CHROME|NODE/GOOGLE/HTML] *-*-*-*-*-*-* engType: [1|2|3|4 → CHROME|NODE|GOOGLE|HTML] *-*-*-*-*-*-*
let x; globalThis['cs']; function getEngType() {
    let x = 'undefined'; x = typeof chrome !== x && chrome.runtime ? 1 : typeof global !== x ? 2 : typeof ScriptApp !== x ? 3 : 4; return { 'engType': x, 'engName': ['CHROME', 'NODE', 'GOOGLE', 'HTML',][x - 1], };
} x = getEngType(); globalThis['engType'] = x.engType; globalThis['engName'] = x.engName; if (!eng) {
    process.noDeprecation = true; let _fsTemp = await import('fs'); globalThis['_fs'] = _fsTemp; let m; m = await import('path'); globalThis[`_path`] = m; m = await import('module');
    globalThis[`_createRequire`] = m.createRequire;
} globalThis['currentFile'] = function (err) { return err.stack.match(/([^ \n])*([a-z]*:\/\/\/?)*?[a-z0-9\/\\]*\.js/ig)?.[0].replace(/[()]/g, ''); }; globalThis['firstFileCall'] = currentFile(firstFileCall);

// DEFINIR → LETTER | ROOT | FUNCTION | PROJECT | FILE | LINE
if (engType < 3) {
    await import('./getPath.js'); let rGP = await getPath({ 'e': new Error(), 'isFunction': true, }), conf = rGP.res.confOk, devMaster = conf.master; conf = conf.connection;

    let securityPass = `${conf.securityPass}`, devicesObjSend = conf.devices[conf.devices.is[engName].sendTo], devicesValuesSend = Object.values(devicesObjSend), devicesKeysSend = {};
    Object.keys(devicesObjSend).forEach((k, i) => { devicesKeysSend[k] = i; }); let devicesObjGet = conf.devices[engName], devicesValuesGet = Object.values(devicesObjGet), devicesKeysGet = {};
    Object.keys(devicesObjGet).forEach((k, i) => { devicesKeysGet[k] = i; }); let devices = [[conf.devices.is[engName].sendTo, devicesKeysSend, devicesValuesSend,], [engName, devicesKeysGet, devicesValuesGet,],];
    let serverLoc = conf.server['1'], hostLoc = `${serverLoc.host}`, portLoc = `${serverLoc.port}`, hostPortLoc = `${hostLoc}:${portLoc}`, serverWeb = conf.server['2'], serverWebEstrelar = conf.server['3'].host;
    let hostWeb = `${serverWeb.host}`, portWeb = `${serverWeb.port}`, hostPortWeb = `${hostWeb}:${portWeb}`, secConnect = conf.secConnect, secReconnect = conf.secReconnect, secRetConnection = conf.secRetConnection;
    let secPing = conf.secPing, secPingTimeout = conf.secPingTimeout, secLoop = conf.secLoop, kbPartsMessage = conf.kbPartsMessage, minClearPartsMessages = conf.minClearPartsMessages;
    let devMy = conf.devMy, par0 = `${conf.par0}`, par1 = `${securityPass}-${conf.par1}`, par2 = `${securityPass}-${conf.par2}`, par3 = `${securityPass}-${conf.par3}`, par4 = `${securityPass}-${conf.par4}`;
    let par5 = `${securityPass}-${conf.par5}`, par6 = `${securityPass}-${conf.par6}`, par7 = `${securityPass}-${conf.par7}`, par8 = `${conf.par8}`, hostPort = `${letter === 'D' ? hostPortLoc : hostPortWeb}/?roo=`;
    let devSend = `${hostPort}${devMy}-${devices[0][0]}-${devices[0][2][0]}`, devSever = `${hostPort}${devMaster}-${devices[eng ? 0 : 1][0]}-${devices[eng ? 0 : 1][2][0]}`, par9 = `${conf.par9}`, par10 = `${conf.par10}`;
    let par11 = `${conf.par11}`;
    globalThis['gW'] = { // MANTER APÓS O 'devSend'
        ...gW, securityPass, 'serverWeb': serverWeb.host, portWeb, 'serverLoc': serverLoc.host, serverWebEstrelar, portLoc, devMaster, 'devSlave': engName, devSend, devices, hostPortWeb, hostPortLoc, secConnect,
        secReconnect, secRetConnection, secPing, secPingTimeout, secLoop, kbPartsMessage, minClearPartsMessages, devMy, devSever, par0, par1, par2, par3, par4, par5, par6, par7, par8, par9, par10, par11,
        'cloneProject': firstFileCall.split('/').pop().replace('_TEMP', '').replace('.js', ''), // ← 'server', 'serverC6', 'serverC6_New2' ...
    };
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// ############### GLOBAL OBJECT ###############
// let gOListener = [], gOObj = {}; function gOList(listener) { gOListener.push(listener); } function notificarListeners(prop, value) {
//     if (gO.inf.alert) { console.log('globalObject [export] ALTERADO →', gO.inf); } for (let listener of gOListener) { listener(prop, value); }
// } let gO = new Proxy(gOObj, { set(target, prop, value) { target[prop] = value; notificarListeners(prop, value); return true; }, }); gO.inf = {}; // let cs = await configStorage(['']); console.log(cs)
// gOList(async function () { console.log('globalObject [import] ALTERADO →', gO.inf) }); gO.inf['NovaChave'] = { 'a': 'b' }; gO.inf['NovaChave'] = ['a', 'b', 'c',]; console.log(gO.inf)

// ############### RATE LIMIT ###############
function rateLimiter(inf = {}) {
    let { max, sec, } = inf; let n, i = sec * 1000, t = [], b = 'BLOQUEADO ATÉ ', x = 'PERMITIDO', r, m, f = ts => new Date(ts).toLocaleString('pt-BR').replace(/^(\d{2}\/\d{2}).*?(\d{2}:\d{2}:\d{2}).*$/, '$1 $2');
    return { 'check': () => { n = Date.now(); while (t[0] < n - i) { t.shift(); } r = t.length < max; if (r) { t.push(n); m = x; } else { m = b + f(t[0] + i); } return { 'ret': r, 'msg': m, }; }, 'reset': () => t = [], };
} // let rate = rateLimiter({ 'max': 2, 'sec': 5 }); function testRate() { console.log(rate.check()); console.log(rate.check()); console.log(rate.check()); }; testRate(); rate.reset() // LIMPAR TODO O REGISTRO E LIBERAR

// ############### NÚMERO ALEATÓRIO | ID ALEATÓRIO ###############
function randomNumber(min, max) { return Math.trunc(Math.random() * ((getTypeof(max) === 'number' ? max : min + 1) - min + 1) + min); } // console.log(randomNumber(2, 5))
function randomId({ characters, notNumber, notLetter, includesTimestamp, }) {
    let c = characters, n = notNumber, l = notLetter, chars = '', res = ''; if (n && l) { return chars; } if (!n) { chars += '0123456789'; }
    if (!l) { chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; } for (let i = 0; i < c; i++) { res += chars[Math.trunc(Math.random() * chars.length)]; } return `${includesTimestamp ? `${Date.now()}_` : ''}${res}`;
} // console.log(randomId({ 'characters': 5, 'notNumber': true, 'notLetter': false, 'includesTimestamp': true, }));

// ############### LISTENER ###############
let lists = {}; function listenerMonitorar(namLis, callback) { if (!lists[namLis]) { lists[namLis] = []; } lists[namLis].push(callback); }
async function listenerAcionar(namLis, inf, call) { if (lists[namLis]) { for (let callFun of lists[namLis]) { let res = await callFun(namLis, inf); if (getTypeof(call) === 'function') { call(res); } return res; } } }

// ############### AWAIT TIMEOUT ###############
function awaitTimeout(inf = {}) {
    let { listenerName, secondsAwait, } = inf; return new Promise((resolve) => {
        let timeout; listenerMonitorar(listenerName, async (namLis, param1) => { clearTimeout(timeout); resolve({ 'ret': true, 'msg': 'TIMEOUT_FOI_LIMPO', 'res': param1, }); });
        timeout = setTimeout(() => { resolve({ 'ret': false, 'msg': 'TIMEOUT_EXPIROU', }); }, secondsAwait * 1000);
    });
} // async function runOk() {  console.log('INICIO'); let retAwaitTimeout = await awaitTimeout({ 'secondsAwait': 5, 'listenerName': 'NOME AQUI' }); console.log(retAwaitTimeout); }; runOk();
// async function liberarTimeout() { setTimeout(() => { listenerAcionar('NOME AQUI', 'INF1', 'INF2'); }, 2000);}; liberarTimeout();

// ############### CALCULAR TEMPO DE INICIALIZAÇÃO | PATH DA BIBLIOTECA NODE ###############
function startupTime(b, c) { let a = c - b, s = Math.trunc(a / 1000), m = a % 1000, f = m.toString().padStart(3, '0'); return `${s}.${f}`; } function libPath(i = {}) {
    let { p, m, l, } = i; p = `${fileProjetos}/${p}/node_modules/${m}${m.includes('@') ? `/${l}` : ``}`; p = `file:///${p}/${JSON.parse(_fs.readFileSync(`${p}/package.json`)).main.replace(/^(\.\/|\/)/, '')}`; return p;
}

// {IMPORT FUNÇÕES} → DINAMICAMENTE QUANDO NECESSÁRIO | FUNÇÃO GENÉRICA (QUANDO O ENGINE ESTIVER ERRADO) * ENCAMINHAR PARA DEVICE
let qtd0 = 0; async function importFun(infOk = {}) {
    let { engOk, path, inf, project, } = infOk; qtd0++; let name = path.match(/([^\\/]+)(?=\.[^\\.]+$)/)[0]; if (qtd0 > 50) { console.log(`IMPORT FUN: ERRO | EM LOOP!!! '${path}'`); codeStop(); }
    if (engOk) { await import((eng ? `${gW.root}://${gW.functions}` : `file://${fileProjetos}/${project === 'NAO_DEFINIDO' ? 'Chrome_Extension' : project}`) + `/${path.replace('./', '')}`); return globalThis[name](inf); }
    else { let retDevAndFun = await devFun({ 'e': import.meta.url, 'enc': true, 'data': { name, 'par': inf, }, }); return retDevAndFun; }
}

// {IMPORT BIBLIOTECAS} → [NODE] DINAMICAMENTE QUANDO NECESSÁRIO
let qtd1 = 0; async function importLibs(...args) {
    let libs = args[0], libsT = libs; qtd1++; if (qtd1 > 50) { console.log(`IMPORT LIBS: ERRO | EM LOOP [1]!!!`); codeStop(); } for (let m in libs) {
        qtd1++; if (qtd1 > 50) { console.log(`IMPORT LIBS: ERRO | EM LOOP [2]!!!`); codeStop(); } for (let l in libs[m]) {
            qtd1++; if (qtd1 > 50) { console.log(`IMPORT LIBS: ERRO | EM LOOP [3]!!!`); codeStop(); } let mL = false; if (l !== 'pro') {
                let pro = libs[m]['pro'] === true ? gW.project : libs[m]['pro'], b0 = libs[m][l] === 1, b1 = globalThis[`_${l}`]; if (b0 && !b1) {
                    mL = true; if (!eng) { mL = await import(pro ? libPath({ 'p': pro, m, l, }) : m); } globalThis[`_${l}`] = eng ? globalThis[`${l}`] : (m === l) ? mL : mL[l] || mL.default[l] || mL.default;
                } if (globalThis[`_${l}`]) { Object.keys(libsT[m] || {}).length === 2 && libsT?.[m]?.pro && delete libsT[m].pro; delete libsT?.[m]?.[l], Object.keys(libsT[m] || {}).length || delete libsT[m]; }
                // console.log(`${mL ? '✅' : '❌'} | EXISTE (${b1 ? 'SIM' : 'NAO'}) | (${m}${pro && !eng ? '⚠️ ' : ''}) [${l}] | _(${args[1]})_ |`, JSON.stringify(libsT));
            }
        }
    } return libsT;
}

// SUBSTITUIR VARIÁVEIS
function replaceVars(inf = {}) {
    let { content = '', } = inf; let a = letter, b = fileProjetos, c = fileChrome_Extension, d = fileWindows;
    return content.replace(/[!%](letter|letra)[!%]/g, a).replace(/[!%](fileProjetos)[!%]/g, b).replace(/[!%](fileChrome_Extension)[!%]/g, c).replace(/[!%](fileWindows)[!%]/g, d);
}

// PEGAR PARTE DE TEXTO DE STRING
function stringGet(t, m, x, y = 0) {
    let s = String(t); if (!x) { x = 1; } if (m === '>') { return s.slice(0, x); } if (m === '<') { return s.slice(-x); } if (m === '>|') { return s.slice(x - 1, y); }
    if (m === '|<') { return s.slice(s.length - y, s.length - x + 1); } if (m === '>+') { return s.slice(x - 1, x - 1 + y + 1); }
    if (m === '+<') { let f = s.length - x + 1; return s.slice(Math.max(0, f - y - 1), f); } return '';
} // let s = '123456789'; console.log(stringGet(s, '>', 3)); /* 123 */ console.log(stringGet(s, '<', 3)); /* 789 */ console.log(stringGet(s, '>|', 2, 5)); /* 2345 */ console.log(stringGet(s, '|<', 2, 5)); /* 5678 */
// console.log(stringGet(s, '>+', 3, 2)); /* 345 */ console.log(stringGet(s, '>+', 3, 999)); /* 3456789 */ console.log(stringGet(s, '+<', 3, 2)); /* 567 */ console.log(stringGet(s, '+<', 3, 999)); /* 567 */

// PEGAR O NOME DA PASTA PAI DE UM PATH
function fDirname(p) { p = p.replace(/\\/g, '/'); if (!p.includes('/')) { return p; } let dir = p.slice(0, p.lastIndexOf('/')); return dir || p; } // console.log(fDirname(`D:/PASTA_1/PASTA_2/arquivo.txt`));

// JUNTAR PATH COM NOME DO ARQUIVO
function fJoin(...parts) { return parts.map(p => p.replace(/\\/g, '/').replace(/\/+$/g, '')).filter(Boolean).join('/').replace(/\/+/g, '/'); } // console.log(fJoin('D:/PASTA_1/PASTA_2//', 'arquivo.txt'));

// PARSE DE PARAMETROS (URL OU STRING)
function paramsObj(s) {
    if (!s || typeof s !== 'string') { return {}; } let q = s.split('?').pop(); let obj = {};
    for (let p of q.split('&')) { if (!p || !p.includes('=')) { continue; } let [k, v = '',] = p.split('='); if (!k) { continue; } obj[decodeURIComponent(k)] = decodeURIComponent(v); } return obj;
} // console.log(paramsObj(`google.com/?key1=VAL1&key2=VAL2&key3=`)); console.log(paramsObj(`key1=VAL1&key2=VAL2&key3=`));

globalThis['gO'] = { 'inf': {}, }; Object.assign(globalThis, {
    /* ## GLOBAL OBJECT */   // gOList,
    /* ## LISTENER */        listenerMonitorar, listenerAcionar,
    /* ## FUNÇÕES */         clearConsole, getTypeof, codeStop, rateLimiter, randomNumber, randomId, awaitTimeout, startupTime, importFun, importLibs, replaceVars, stringGet, fDirname, fJoin, paramsObj,
});

// ********************** OBRIGATÓRIO FICAR APOS O EXPORT GLOBAL (não subir!!!) NÃO USAR !!! | NÃO COMENTAR! NECESSÁRIO QUANDO NÃO FOR 'Chrome_Extension'
function all1() { } globalThis['all1'] = all1; if (!globalThis.all2 && engType < 3) { await import('./@export.js'); }
// *****************************************************************************************

// javascript: (function () {
//     function pw(j, pw, ph, u) {
//         let w = (pw / 100) * j.top.screen.width, h = (ph / 100) * j.top.screen.height; let y = j.top.outerHeight / 2 + j.top.screenY - (h / 2), x = j.top.outerWidth / 2 + j.top.screenX - (w / 2);
//         return j.open(u, '', `width=${w},height=${h},top=${y},left=${x}`)
//     }; pw(globalThis, 40, 40, 'http://12.345.678.910:1234')
// })()


// -----------------------------------------------------------------------------------------------------------------------------------

// async function fun1(inf) { await new Promise(r => setTimeout(r, 3000)); return { 'name': 'fun1', inf, }; }
// async function fun2(inf) { await new Promise(r => setTimeout(r, 4000)); return { 'name': 'fun2', inf, }; }
// async function fun3(inf) { await new Promise(r => setTimeout(r, 1000)); return { 'name': 'fun3', inf, }; }

// let response, promisesArr, pars = [{ 'a': 'b', }, { 'c': 'd', },];

// /* MESMA FUNÇÃO: NÃO */ promisesArr = [[fun1, pars[0],], [fun2, pars[1],], [fun3, pars[1],],];
// /* MESMA FUNÇÃO: SIM */ promisesArr = pars.map(p => [fun1, p,]);

// ESPERAR TODAS RETORNAREM (NA ORDEM DE RETORNO)
// let response = await(async () => {
//     let arr = []; await Promise.allSettled(promisesArr.map(([f, a,], idx) => f(a).then(r => arr.push({ idx, 'ret': true, 'msg': 'OK', 'res': r, })).
//         catch(e => arr.push({ idx, 'ret': false, 'msg': `ERRO | ${e}`, })))); return arr;
// })();
// console.log('RESULTADOS:', response);

// -----------------------------------------------------------------------------------------------------------------------------------


