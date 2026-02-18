// let infModel, retModel
// infModel = { e, 'chaveUm': 'valorUm', 'chaveDois': 'valorDois' }
// retModel = await model(infModel); console.log(retModel)

let e = currentFile(new Error()), ee = e; let libs = { 'net': {}, };
async function model(inf = {}) {
    let ret = { 'ret': false, }, nameFun = `MODEL`; e = inf.e || e;
    try {
        /* IMPORTAR BIBLIOTECA [NODE] */  if (libs['net']) { libs['net']['net'] = 1; libs = await importLibs(libs, 'serverRun [Sniffer_Python]'); }

        let { text = 'aaa', folder = 'bbb', } = inf;

        let retRegex = regex({ e, 'pattern': `UM(.*?)TRES`, text, 'nada': folder, }); console.log(retRegex);

        ret['res'] = `resposta aqui`;
        ret['msg'] = `${nameFun}: OK`;
        ret['ret'] = true;

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['model'] = model;


