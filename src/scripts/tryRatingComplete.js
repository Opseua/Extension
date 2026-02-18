// let infTryRatingComplete, retTryRatingComplete;
// infTryRatingComplete = { e, 'infTryRatingComplete': 'https://URL_EVIDENCIA_AQUI', };
// retTryRatingComplete = await tryRatingComplete(infTryRatingComplete); console.log(retTryRatingComplete);

// IMPORTAR OBJETOS COM AS OPÇÕES E RESPOSTAS
let opts = {}, imp = ['Search20',];
for (let [index, v,] of imp.entries()) { await import(`../objects/tryRating/opt_${v}.js`); opts[v] = globalThis[`opt_${v}`]; delete globalThis[`opt_${v}`]; }

let e = currentFile(new Error()), ee = e;
async function tryRatingComplete(inf = {}) {
    let ret = { 'ret': false, }; e = inf.e || e;
    try {
        let { infTryRatingComplete, } = inf; let infChromeActions, retChromeActions, judgesValues = { 'current': -1, 'comments': [], 'responses': [], 'values': [], };

        // PEGAR O NOME DO HIT APP | ############ (XPATH) ELEMENTO: PEGAR VALOR ############
        infChromeActions = { e, 'action': 'elementGetValue', 'target': `*tryrating*`, 'elementName': `//*[@id="app-root"]/div/div[4]/div[2]/div[1]/div/div[1]/div/div[1]/span[2]/span`, };
        retChromeActions = await chromeActions(infChromeActions); if (!retChromeActions.ret) { return retChromeActions; } let hitApp = retChromeActions.res[0].replace(/[^a-zA-Z0-9]/g, '');

        // RETORNAR CASO O OBJ DO HITAPP NÃO EXISTA
        if (!opts[hitApp]) { ret['msg'] = `TRYRATING COMPLETE: ERRO | FALTA O OBJ DO HITAPP '${hitApp}'`; return ret; } let opt = opts[hitApp];

        let infOk = {}; if (infTryRatingComplete.includes('{"')) { infOk = JSON.parse(infTryRatingComplete); } else if (infTryRatingComplete.includes('🟢')) {
            let gM = infTryRatingComplete.replace(/🔴|🔵/g, '🟢').split('🟢').map(x => x.trim()); infOk['name'] = gM[0]; infOk['category'] = gM[1]; infOk['address'] = gM[2]; infOk['urlGoogleMaps'] = gM[3];
        } else if (hitApp === 'Search20') { let gM = infTryRatingComplete; infOk['urlGoogleMaps'] = ['http://', 'https://', 'www.',].some(a => gM.toLowerCase().includes(a)) ? gM : false; }

        // ETAPA 1: PEGAR A DIV DOS JUDGES
        let judgesDiv = []; for (let index = 0; index < 10; index++) {
            retChromeActions = await chromeActions({ e, 'action': 'elementGetDivXpath', 'target': `*tryrating*`, 'elementName': `${opt.judgeXpath.replace('_INDEX_', index + 1)}`, }); if (!retChromeActions.ret) { break; }
            else if (!retChromeActions.res[0].startsWith('<div')) { break; } else { judgesDiv.push(retChromeActions.res[0]); }
        } if (judgesDiv.length === 0) { ret['msg'] = `JUDGE COMPLETE: ERRO | NENHUM JULGAMENTO ENCONTRADO`; }

        // ETAPA 2: PEGAR VALOR DOS ELEMENTOS
        async function judgeGetValues(inf = {}) {
            let { div, } = inf; let judgeValues = []; for (let [index, value,] of opt.judgeOptions.entries()) {
                let lastValue = '###'; for (let [index1, value1,] of value.actions.entries()) {
                    if (value.actionsMode === 'subDiv+content+attributeValue') {
                        if (value1.action === 'elementGetDiv') {
                            // → DIV: PEGAR (BRUTA) *** QUESTION
                            retChromeActions = await chromeActions({ e, 'action': value1.action, 'target': div, 'tag': value1.tag, 'content': value1.content, 'tagFather': value1.tagFather, });
                            if (!retChromeActions.ret) { lastValue = '###'; judgeValues.push({ 'valid': false, 'elementIndex': index, 'elementName': value1.content, 'elementId': '###', 'elementValue': '###', }); }
                            else { lastValue = retChromeActions.res[0]; }
                        } else if (value1.action === 'attributeGetValue' && lastValue !== '###') {
                            // → ATRIBUTO: PEGAR VALOR
                            retChromeActions = await chromeActions({ e, 'action': value1.action, 'target': lastValue, 'tag': value1.tag, 'attribute': value1.attribute, 'content': value1.content, });
                            if (!retChromeActions.ret) { lastValue = '###'; judgeValues.push({ 'valid': false, 'elementIndex': index, 'elementName': value1.content, 'elementId': '###', 'elementValue': '###', }); }
                            else { lastValue = retChromeActions.res[0]; }
                        } else if (value1.action === 'elementGetValue' && lastValue !== '###') {
                            // // → ELEMENTO: PEGAR VALOR
                            infChromeActions = {
                                e, 'action': value1.action, 'target': `*tryrating*`, 'attribute': value1.attribute, 'attributeValue': lastValue,
                                'attributeAdd': value1.attributeAdd, 'attributeValueAdd': value1.attributeValueAdd,
                            }; retChromeActions = await chromeActions(infChromeActions); let lastValueOld = lastValue, valid = retChromeActions.ret, elementName = value.actions[0].content;
                            if (!retChromeActions.ret) { lastValue = '###'; } else { lastValue = retChromeActions.res[0]; }
                            judgeValues.push({ valid, 'elementIndex': index, elementName, 'elementId': lastValueOld, 'elementValue': lastValue, });
                        }
                    }
                }
            } return { 'ret': true, 'msg': 'JUDGE GET VALUES: OK', 'res': judgeValues, };
        }

        // ETAPA 3: CRIAR AS RESPOSTAS
        async function judgeMakeResponse(inf = {}) {
            let { values, } = inf; let judgeResponses = []; for (let [index, value,] of values.entries()) {
                let breakBoolen = false; for (let [index1, value1,] of opt.judgeOptions.entries()) {
                    for (let [index2, value2,] of value1.actions.entries()) {
                        if (value1.actionsMode === 'subDiv+content+attributeValue' && value2.action === 'elementGetDiv' && value.elementName === value2.content) { breakBoolen = true; } if (breakBoolen) {
                            let response = value1[value.elementValue]; response = response !== undefined ? response : `############## FALTA RESPOSTA: ${value.elementName}`;
                            let valueOk = value; valueOk['elementResponse'] = response; judgeResponses.push(valueOk); break;
                        }
                    } if (breakBoolen) { break; }
                }
            } return { 'ret': true, 'msg': 'JUDGE MAKE RESPONSES: OK', 'res': judgeResponses, };
        }

        // ETAPA 3: CRIAR COMENTÁRIO (COM AS RESPOSTAS ANTERIORES)
        async function judgeMakeComment(inf = {}) {
            let { indexDiv, responses, } = inf; let comment = '', optionsErr = {}, replaceIs = '#REP#'; for (let [index, value,] of responses.entries()) {
                let eleName = value.elementName, eleResp = value.elementResponse, eleVal = value.elementValue; if (hitApp === 'Search20') {
                    if (value.valid && eleResp !== 'AAA') {
                        if (eleName === 'Business/POI is closed or does not exist') { replaceIs = infOk.urlGoogleMaps ? ' or does not exist' : ' is permanently closed or'; }
                        else if (eleName === 'Name Issue' && infOk.name) { optionsErr['name'] = `CORRECT NAME IS:\n* ${infOk.name}\n`; }
                        else if (eleName === 'Category Issue' && infOk.category) { optionsErr['category'] = `THIS IS THE CORRECT CATEGORY:\n* ${infOk.category}\n`; }
                        else if (eleName === 'Address Accuracy' && infOk.address && !eleResp.includes('OK: ')) { optionsErr['address'] = `CORRECT ADDRESS:\n* ${infOk.address}\n`; } // NÃO UNIR COM O IF A SEGUIR
                        if (eleName !== 'Comment and Link') { comment = `${comment}\n${eleResp}`; } else if (eleName === 'Comment and Link') {
                            if (eleVal === '' && judgesValues.current === -1) { judgesValues.current = indexDiv; } let view = '############## NÃO ENCONTRADA VIEWPORT | USER ##############'; let user = view;
                            let retCS = await configStorage({ e, 'action': 'get', 'key': 'TryRating_viewportUser', }); if (retCS.res) { retCS = retCS.res; view = retCS.viewport; user = retCS.user; }
                            comment = `Visualization is ${view} and the user is ${user} of the viewport\n${comment}`; let correct = optionsErr.name || optionsErr.category || optionsErr.address;
                            comment = `${comment}${correct ? '\n\n' : ''}${optionsErr.name || ''}${optionsErr.category || ''}${optionsErr.address || ''}`;
                            comment = `${comment}${infOk.urlGoogleMaps ? `${correct ? '\n' : '\n\n'}${infOk.urlGoogleMaps}` : ''}`; comment = comment.replace(replaceIs, '');
                        }
                    }
                }
            } return { 'ret': true, 'msg': 'JUDGE MAKE RESPONSE: OK', 'res': comment, };
        }

        for (let [index, value,] of judgesDiv.entries()) {
            let retJudgeGetValues = await judgeGetValues({ 'indexDiv': index, 'div': value, }), retJudgeMakeResponse = await judgeMakeResponse({ 'indexDiv': index, 'values': retJudgeGetValues.res, });
            let retJudgeMakeComment = await judgeMakeComment({ 'indexDiv': index, 'responses': retJudgeMakeResponse.res, });
            judgesValues.comments.push(retJudgeMakeComment.res); judgesValues.responses.push(retJudgeGetValues.res); judgesValues.values.push(retJudgeGetValues.res);
        }

        if (judgesValues.current === -1) {
            ret['msg'] = `Nenhum julgamento pendente`;
        } else if (JSON.stringify(judgesValues.comments[judgesValues.current]).includes('##############')) {
            ret['msg'] = `Falta resposta`;
        } else {
            ret['res'] = judgesValues;
            ret['msg'] = `TRYRATING COMPLET: OK`;
            ret['ret'] = true;
        }

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['tryRatingComplete'] = tryRatingComplete;


