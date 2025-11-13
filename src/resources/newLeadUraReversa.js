let e = currentFile(new Error()), ee = e;
async function newLeadUraReversa(inf = {}) {
    let ret = { 'ret': false, }; e = inf.e || e;
    try {
        let { leadsArr = [[],], origem = 'PROCESS', } = inf;

        let { mon, monNam, day, } = dateHour().res; let keyName = `leadsUraReversa`, pathConfig = `!fileProjetos!/URA_Reversa/logs/JavaScript/MES_${mon}_${monNam}/DIA_${day}/${keyName}.json`;

        if (origem !== 'PROCESS') {
            // JSON: SALVAR LEADS
            await configStorage({ e, 'path': pathConfig, 'action': 'addInObj', 'key': keyName, 'value': leadsArr.reduce((v, linha) => { v[linha[3].replace(/\D/g, '')] = linha; return v; }, {}), });
            ret['ret'] = true; ret['msg'] = `NEW LEAD URA REVERSA: OK (PROCESSAMENTO PENDENTE)`; return ret;
        }

        // PEGAR LEADS DA URA_REVERSA (APENAS DO DIA)
        let retGoogleSheetsNew; let id = `1wEiSgZHeaUjM6Gl1Y67CZZZ7UTsDweQhRYKqaTu3_I8`; let tab = `URA_REVERSA`; // day = '05';
        retGoogleSheetsNew = await googleSheetsNew({ e, 'action': 'get', 'id': `${id}`, 'tab': `${tab}`, 'range': [`B1:B`, `D1:D`,], });
        if (!retGoogleSheetsNew.ret || !(retGoogleSheetsNew?.res?.length > 0)) { return retGoogleSheetsNew; }

        // CRIAR OBJETO COM { 'TELEFONE1': true, 'TELEFONE2': true }
        let [dataLead, telefone,] = retGoogleSheetsNew.res; let filtrado = dataLead.map((_, i) => [dataLead[i][0], telefone[i][0],]).filter(([a, b,]) => a?.includes(`${day}/${mon}`) && b);
        let leadsSheets = Object.fromEntries(filtrado.map(([_, b,]) => [b.replace(/\D/g, ''), true,]));

        // JSON: PEGAR LEADS
        let leadsConfig = await configStorage({ e, 'path': `${pathConfig}`, 'action': 'get', 'key': keyName, }); leadsConfig = leadsConfig?.res || {}; let qtdLeadsConfig = Object.keys(leadsConfig);

        // MANTER APENAS LEADS QUE NÃO ESTÃO NA PLANILHA
        let leadsOk = qtdLeadsConfig.filter(chave => { return !leadsSheets[`${chave}`]; }).map(chave => { return leadsConfig[chave]; });

        // MANDAR PARA PLANILHA APENAS NOVOS LEADS
        let leadsOkSend = leadsOk.map(val => { return val.map(item => { return { 'value': item, }; }); });
        // if (leadsOkSend.length > 0) { await googleSheets({ e, 'action': 'addInNewLine', 'id': `${id}`, 'tab': `${tab}`, 'values': leadsOkSend, }); }

        await logConsole({ e, ee, txt: `PLANILHA (TUDO): ${retGoogleSheetsNew?.res?.[0]?.length - 4} | PLANILHA (DATA ALVO): ${filtrado.length} | CONFIG: ${qtdLeadsConfig.length} | NOVOS: ${leadsOk.length}`, });

        for (let [index, value,] of leadsOkSend.entries()) {
            let infApi = {
                e, 'method': 'POST', 'url': `https://estrelar-n8n.muugtk.easypanel.host/webhook/90201846-2cda-4e17-a664-9d22679ef851`, 'headers': { 'Content-Type': 'application/json', }, 'body': {
                    'origem': value[0], 'dataLead': value[1], 'cnpj': value[2], 'telefone': value[3], 'razaoSocial': value[4], 'email': value[5],
                },
            }; await api(infApi); await new Promise(r => setTimeout(r, (15 * (1000))));
        }

        ret['ret'] = true;
        ret['msg'] = `PROCESS LEADS URA REVERSA: OK`;

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['newLeadUraReversa'] = newLeadUraReversa;


