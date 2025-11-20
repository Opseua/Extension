// → NO FINAL DO ARQUIVO

let e = currentFile(new Error()), ee = e; let expirationTimestamp = 0, token;
async function googleSheetsNew(inf = {}) {
    let ret = { 'ret': false, }; e = inf.e || e;
    try {
        let { action, id, tab, range, values, lineStart, lineEnd, qtdLines, destinations = [{},], raw, ignoreFormatting = false, attempts = 2, } = inf; let nameF = `GOOGLE SHEET NEW`, isArr = Array.isArray(range);
        let errAll = '', retSheetNew, baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${id}`, actions = ['get', 'update', 'addInLastLine', 'addInNewLine', 'deleteLines', 'copy',];

        function checkToken(timestamp) { return (timestamp > (Math.floor(Date.now() / 1000) - 120)); /* MENOS 2 MINUTOS */ } function formattingData(values) {
            return values.map(row => row.map(v => { // {APÓSTROFE NA FRETE NÃO DA PROBLEMA}
                if (typeof v === 'number' && Number.isInteger(v) && String(v).length > 14) { return `'${v}`; }
                if (typeof v === 'string') { if (!isNaN(Number(v))) { return `'${v}`; } let vTemp = v.toLowerCase(); if (vTemp === 'true' || vTemp === 'false') { return `'${v}`; } } return v;
            }));
        } function identifyErr() {
            let err = errAll.toString(); return (err.includes('entity was not found') || err.includes('Unable to parse range') || err.includes('contains an invalid argument') || err.includes('INVALID_ARGUMENT')) ?
                `<ERR>RANGE INVÁLIDO OU INEXISTENTE` : (err.includes('not have permission') || err.includes('to edit a protected')) ? `<ERR>SEM PERMISSÃO` : err.includes(`"code":401`) ? `<ERR>TOKEN INVÁLIDO` :
                    err.includes(`Cannot delete a row that doesn't exist`) ? `<ERR>LINHA NÃO EXISTE` : err.includes(`ECONNRESE`) ? `<ERR>CONEXÃO INTERROMPIDA` : err.includes(`ENOTFOUND`) ? `<ERR>SEM CONEXÃO` :
                        (err.includes(`The service is currently unavailable`) || err.includes(`Error 502`) || err.includes(`Internal error encountered`) ||
                            err.includes(`The server encountered a temporary error and could not complete`)) ? `<ERR>API INDISPONÍVEL` : `NÃO IDENTIFICADO`;
        } async function _sheetNew({ method, url, body, }) {
            let ret = { 'ret': false, }; try {
                let infApi = { e, method, 'code': true, 'object': true, url, 'headers': { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', }, body, }; let retApi = await api(infApi);
                if (retApi.ret) { ret['ret'] = true; ret['res'] = retApi.res.body; } else { errAll = JSON.stringify(retApi); }
            } catch (catchErr) { errAll = catchErr; } return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
        } function rangeParse(r) {
            let [t, a,] = r.split('!'); if (!a) { a = t; t = false; } let [p1, p2 = '',] = a.split(':'); let re = /^([A-Z]+)?(\d+)?$/i; let m1 = p1.match(re) || [], m2 = p2.match(re) || [];
            let c1 = m1[1]?.toUpperCase() || false, c2 = m2[1]?.toUpperCase() || false; let l1 = m1[2] ? +m1[2] : false, l2 = m2[2] ? +m2[2] : false; if (l1 && l2 && l2 < l1) { l2 = l1; }
            let tab = t || false; let colSta = c1 || false; let colEnd = c2 || false; let linSta = l1 || 1; let linEnd = l2 || false; let res = { tab, colSta, linSta, colEnd, linEnd, }; return res;
        }

        // VALIDAÇÕES
        let errPars = false; let act = actions.includes(action); if (!errPars && !act) { errPars = `'action' → [${actions}]`; } if (!errPars && !id) { errPars = `'id'`; }
        if (!errPars && !tab) { errPars = `'tab'`; } if (!errPars && ['get', 'update', 'copy',].includes(action) && (!range || isArr && range.length === 0)) { errPars = `'range'`; }
        if (!errPars && ['update', 'addInLastLine', 'addInNewLine',].includes(action) && !values) { errPars = `'values'`; } if (!errPars && action === 'deleteLines') {
            let x = !(lineStart > 0) ? `'lineStart'` : !(lineEnd > 0 || qtdLines > 0) ? `'lineEnd' OU 'qtdLines'` : !(Number(tab) > 0) ? `'tab' (number)` : false; if (x) { errPars = `${x}`; }
        } if (!errPars && action === 'copy') { for (let [index, d,] of destinations.entries()) { let f = ['id', 'tab', 'range',].find(k => !d[k]); if (f) { errPars = `'${f}' DE TODOS 'destinations'`; break; } } }
        if (errPars) { ret['msg'] = `${nameF}${act ? ` [${action}]` : ''}: ERRO | INFORMAR O ${errPars}`; return ret; }

        // CORRIGIR RANGE(s) ('A:B10' → 'A1:B10')
        range = (isArr ? range : [range,]).map(v => { let r = rangeParse(v); return `${r.colSta}${r.linSta}${r.colEnd ? `:${r.colEnd}${r.linEnd || ''}` : ''}`; }); if (!isArr) { range = range[0]; }

        // TOKEN
        if (!checkToken(expirationTimestamp)) {
            await logConsole({ e, ee, 'txt': `TOKEN: GLOBAL INVÁLIDO`, }); let retConStor = await configStorage({ e, 'action': 'get', 'key': '*', });
            if (!retConStor.ret) { ret['msg'] = `${nameF} [${action}]: ERRO | → ${retConStor.msg}`; return ret; } let { tokenGoogle, googleAppScriptId, } = retConStor.res; token = tokenGoogle.accountService.token;
            expirationTimestamp = tokenGoogle.accountService.expirationTimestamp; let isValid = checkToken(expirationTimestamp); if (isValid) { logConsole({ e, ee, 'txt': `TOKEN: ARMAZENADO VÁLIDO!`, }); } else {
                await logConsole({ e, ee, 'txt': `TOKEN: GERANDO...`, }); let infApi = {
                    e, 'method': 'POST', 'object': true, 'url': `https://script.google.com/macros/s/${googleAppScriptId}/exec`, 'body': { 'action': 'run', 'name': 'getTokenGoogle', 'par': {}, 'maxResponse': 5, },
                }; let retApi = await api(infApi); let tokenGoogleTemp = retApi?.res?.body?.res; if (!tokenGoogleTemp) { ret['msg'] = `${nameF} [${action}]: ERRO | AO GERAR NOVO TOKEN`; return ret; }
                token = tokenGoogleTemp.accountService.token; expirationTimestamp = tokenGoogleTemp.accountService.expirationTimestamp;
                if (!(await configStorage({ e, 'action': 'set', 'key': 'tokenGoogle', 'value': tokenGoogleTemp, })).ret) { ret['msg'] = `${nameF} [${action}]: ERRO | AO SALVAR NOVO TOKEN`; return ret; }
                await logConsole({ e, ee, 'txt': `TOKEN: GERADO!`, });
            } let { mon, day, hou, min, sec, } = dateHour(expirationTimestamp).res; await logConsole({ e, ee, 'txt': `TOKEN: VÁLIDO ATÉ: ${day}/${mon} ${hou}:${min}:${sec}`, });
        }

        if (action === 'get') {
            range = isArr ? range.map(r => `${tab}!${r}`) : [`${tab}!${range}`,];
            let url = `${baseUrl}/values${isArr ? `:batchGet?ranges=${range.map(encodeURIComponent).join('&ranges=')}` : `/${range[0]}`}`; retSheetNew = await _sheetNew({ 'method': 'GET', url, });
            if (retSheetNew.ret) { ret['ret'] = true; retSheetNew = retSheetNew.res; ret['res'] = isArr ? (retSheetNew.valueRanges || []).map(v => v.values || []) : (retSheetNew.values || []); }
        } else if (action === 'update') {
            range = isArr ? range.map(r => `${tab}!${r}`) : [`${tab}!${range}`,]; let valuesArr = isArr ? values : [values,], url = `${baseUrl}/values:batchUpdate`;
            let body = { 'valueInputOption': raw ? 'RAW' : 'USER_ENTERED', 'data': range.map((r, i) => ({ 'range': r, 'values': valuesArr[i], })), }; retSheetNew = await _sheetNew({ 'method': 'POST', url, body, });
            if (retSheetNew.ret) { ret['ret'] = true; retSheetNew = retSheetNew.res; ret['res'] = { 'updatedRanges': retSheetNew.responses.map(r => r.updatedRange), }; }
        } else if (['addInLastLine', 'addInNewLine',].includes(action)) {
            range = `${tab}!A:A`; let url = `${baseUrl}/values/${range}:append?valueInputOption=${raw ? 'RAW' : 'USER_ENTERED'}${action === 'addInNewLine' ? '&insertDataOption=INSERT_ROWS' : ''}`;
            if (!ignoreFormatting) { values = formattingData(values); } let body = { values, }; retSheetNew = await _sheetNew({ 'method': 'POST', url, body, });
            if (retSheetNew.ret) { ret['ret'] = true; retSheetNew = retSheetNew.res; ret['res'] = { 'updatedRange': retSheetNew.updates.updatedRange, }; }
        } else if (action === 'deleteLines') {
            let startIndex = lineStart - 1; if (qtdLines > 0) { lineEnd = startIndex + qtdLines; } if (lineEnd <= startIndex) { ret['msg'] = `${nameF} [${action}]: ERRO | LINHAS INVÁLIDAS`; return ret; }
            let endIndex = lineEnd; let req = [{ 'deleteDimension': { 'range': { 'sheetId': Number(tab), 'dimension': 'ROWS', startIndex, endIndex, }, }, },];
            let url = `${baseUrl}:batchUpdate`; let body = { 'requests': req, }; retSheetNew = await _sheetNew({ 'method': 'POST', url, body, });
            if (retSheetNew.ret) { ret['ret'] = true; ret['res'] = { lineStart, 'lineEnd': endIndex, 'qtdLines': endIndex - startIndex, }; }
        } else if (action === 'copy') {
            let res = { 'updatedRanges': [], }, retOk1 = await googleSheetsNew({ e, 'action': 'get', id, tab, range, });
            if (!retOk1.ret) { ret['msg'] = `${nameF} [${action}]: ERRO | → ${retOk1.msg}`; return ret; } for (let [index, value,] of destinations.entries()) {
                let { id, tab, range, } = value; let retOk2 = await googleSheetsNew({ e, 'action': 'update', id, tab, range, 'values': retOk1.res, });
                if (!retOk2.ret) { ret['msg'] = `${nameF} [${action}]: ERRO | → ${retOk2.msg}`; ret['res'] = res; return ret; } res.updatedRanges.push(retOk2.res.updatedRanges);
            } ret['ret'] = true; ret['res'] = res;
        }

        // TENTAR NOVAMENTE EM CASO DE ERRO | MANTER 'legacy' true PORQUE NO WebScraper O WEBSOCKET NÃO ESTÁ CONECTADO
        if (ret.ret) { ret['msg'] = `${nameF} [${action}]: OK`; } else {
            let err = identifyErr(); let errOk = err.includes(`<ERR>`); err = err?.replace(`<ERR>`, ''); if (err.includes(`TOKEN INVÁLIDO`)) { attempts = 1; } attempts--;
            let idTabRange = `'${id}' '${tab}'${!range ? '' : ` '${range}'`}${!lineStart ? '' : ` '${lineStart}' → '${lineStart + qtdLines}'`}`, text = `TENTATIVAS RESTANTES [${attempts}] → ${err}\n\n${idTabRange}`;
            if (attempts < 1) { await notification({ e, 'legacy': true, 'title': `# SHEETS (${gW.devMaster}) [NODE]`, text, }); } logConsole({ e, ee, txt: `${text}${errOk ? '' : `\n\n*** ERRO SHEETS\n${errAll}`}`, });
            if (attempts > 0) { await new Promise(r => setTimeout(r, (3 * (1000)))); ret = (await googleSheetsNew({ ...inf, attempts, })); } else { ret['msg'] = `${nameF} [${action}]: ERRO | ${err} ${idTabRange}`; }
        }

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['googleSheetsNew'] = googleSheetsNew;

// let infGoogleSheetsNew, retGoogleSheetsNew; let id = `1UhPc9w3Vn9V6e8mTe7NauNE10m2aUgA9ijO9ua5zug4`; let tab = `TESTE_1`;
// infGoogleSheetsNew = {
//     e, 'action': 'get', 'id': `${id}`, 'tab': `${tab}`, 'range': `A1`, // `A1` → CÉLULA ÚNICA | `A1:A2` → LINHA | `A:A` → COLUNA | [`A:B`, `C:D`,] → RANGES
// };
// infGoogleSheetsNew = {
//     e, 'action': `update`, 'id': `${id}`, 'tab': `${tab}`, 'raw': false, // ← FORÇA OS VALORES COMO ESTÃO (string → string | true → 'true' | '1+1' → '1+1')
//     'range': `A5`, 'values': [
//         [`A5`, `B5`, `C5`,],
//         [`A6`, `B6`, `C6`,],
//         [`A7`, `B7`, `C7`,],
//     ],
//     'range': [`E5`, `H5`,], 'values': [
//         [
//             [`E5`, `F5`,],
//             [`E6`, `F6`,],
//             [`E7`, `F7`,],
//         ],
//         [
//             [`H5`, `I5`,],
//             [`H6`, `I6`,],
//             [`H7`, `I7`,],
//         ],
//     ],
// };
// infGoogleSheetsNew = {
//     'action': `addInLastLine`, 'id': `${id}`, 'tab': `${tab}`, 'raw': false, // ← FORÇA OS VALORES COMO ESTÃO (string → string | true → 'true' | '1+1' → '1+1' | '=SOMA(1; 2)' → '=SOMA(1; 2)')
//     'values': [
//         ['', '(→ NUMBER)                       ', 1,],
//         ['', '(→ NUMBER)                       ', 1234567890,],      // ATÉ 14 DÍGITOS
//         ['', '(→ STRING) {COM APÓSTROFE}       ', 123456789012345,], // +14 DÍGITOS
//         ['', '(→ STRING) {COM APÓSTROFE}       ', `1`,],
//         ['', '(→ STRING) {COM APÓSTROFE}       ', `01`,], // MANTEM O ZERO: SIM
//         ['', '(→ FÓRMULA) [NUMBER]             ', `=SOMA(1; 2)`,],
//         ['', '(→ BOOLEAN) [TRUE]               ', true,],
//         ['', '(→ STRING) {COM APÓSTROFE}       ', `false`,],
//         ['', '(→ STRING) {COM APÓSTROFE}       ', `TRUE`,],
//         ['', '(→ VAZIO)                        ', ``,],
//         ['', '(→ VAZIO)                        ', null,],
//         ['', '(→ VAZIO)                        ', undefined,],
//         ['', '(→ STRING)                       ', `null`,],
//         ['', '(→ STRING)                       ', `undefined`,],
//     ],
// };
// infGoogleSheetsNew = {
//     e, 'action': 'deleteLines', 'id': `${id}`, 'tab': 1177349655, 'lineStart': 2, 'lineEnda': 1, 'qtdLines': 6,
// };
// infGoogleSheetsNew = {
//     e, 'action': 'copy', 'id': `${id}`, 'tab': `${tab}`, 'range': [`A:A`, `C:D`, `F:F`,],
//     'destinations': [
//         { 'id': `${id}`, 'tab': `TESTE_2`, 'range': [`B:B`, `H:I`, `K:K`,], 'raw': false, }, // ← FORÇA OS VALORES COMO ESTÃO (string → string | true → 'true' | '1+1' → '1+1' | '=SOMA(1; 2)' → '=SOMA(1; 2)')
//         { 'id': `${id}`, 'tab': `TESTE_3`, 'range': [`C:C`, `E:F`, `H:I`,], 'raw': false, }, // ← FORÇA OS VALORES COMO ESTÃO (string → string | true → 'true' | '1+1' → '1+1' | '=SOMA(1; 2)' → '=SOMA(1; 2)')
//     ],
// };
// retGoogleSheetsNew = await googleSheetsNew(infGoogleSheetsNew); console.log(JSON.stringify(retGoogleSheetsNew));









// --- NÃO APAGAR ---
// function colOffset(c) { let n = 0; for (let i = 0; i < c.length; i++) { n = n * 26 + (c.charCodeAt(i) - 65 + 1); } return n - 1; }
// async function getTabId(inf = {}) {
//     let ret = { 'ret': false, }; let { id, tab, } = inf; let res = await _sheets.spreadsheets.get({ 'spreadsheetId': id, }); let aba = res.data.sheets.find(s => s.properties.title === tab);
//     if (!aba) { ret['msg'] = `GET ID TAB: ERRO | ABA '${tab}' NÃO ENCONTRADA`; } else { ret['ret'] = true; ret['msg'] = `GET ID TAB: OK`; ret['res'] = { 'tab': aba.properties.sheetId, }; } return ret;
// } 


