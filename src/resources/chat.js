// * JS [CRHOME/NODE]
// nextWay                → gpt-3.5-turbo / gpt-4o-free / gemini-pro   [https://github.com/zachey01/gpt4free.js]
// openAi                 → gpt-4o-mini

// * PYTHON
// telegram               → gpt-4o
// g4f                    → gpt-4o
// zukijourney (12/min)   → gpt-4
// naga (3/min)           → gpt-4                                       [https://naga.ac/dashboard/models]

// let infChat, retChat;
// infChat = { e, 'provider': 'nextWay', 'model': 'gpt-4o-free', 'messagePrompt': `Qual a idade de Saturno?`, };
// retChat = await chat(infChat); console.log(retChat);

// IMPORTAR PROVEDORES ADICIONAIS
await import('./chats/@import.js'); globalThis['zachey01___gpt4free_js'] = GPT4js; delete globalThis['GPT4js'];

let e = currentFile(new Error()), ee = e; let objOpenAi = false, objChatPython = false;
async function chat(inf = {}) {
    let ret = { 'ret': false, }; e = inf.e || e;
    try {
        let provider = '', model, messagePrompt, infIsArray = Array.isArray(inf); if (!infIsArray) { ({ provider, model, messagePrompt, } = inf); }

        let retApi, infApi;
        if (provider === 'openAi') {
            // ######## OPEN.AI
            if (objOpenAi === false) { objOpenAi = await configStorage({ e, 'action': 'get', 'key': 'chatOpenAi', }); if (!objOpenAi.ret) { return objOpenAi; } else { objOpenAi = objOpenAi.res; } } infApi = {
                e, 'method': 'POST', 'url': `https://api.openai.com/v1/chat/completions`, 'headers': { 'Content-Type': 'application/json', 'Authorization': `Bearer ${objOpenAi.Authorization}`, },
                'body': { 'model': model || 'gpt-4o-mini', 'messages': [{ 'role': 'user', 'content': messagePrompt, },], 'temperature': 0.7, }, 'object': true,
            }; retApi = await api(infApi); if (!retApi.ret) { return retApi; } else { retApi = retApi.res; } let res = retApi.body;
            if ('choices' in res) {
                ret['res'] = res.choices[0].message.content;
                ret['msg'] = `CHAT [OPEN AI]: OK`;
                ret['ret'] = true;
            } else { // CHROME
                ret['msg'] = `CHAT [OPEN AI]: ERRO | ${res.error.message}`;
            }
        } else if (provider === 'nextWay') {
            // ######## GPT4js
            provider = 'Nextway'; let pass = false; messagePrompt = Array.isArray(messagePrompt) ? 'messagePrompt' : [{ 'role': 'user', 'content': messagePrompt, },];
            try { let pro = zachey01___gpt4free_js.createProvider(provider); pass = await pro.chatCompletion(messagePrompt, { provider, 'model': model || 'gpt-4o-free', }); } catch { }
            if (!pass) {
                ret['msg'] = `CHAT [NEXTWAY]: ERRO | AO GERAR RESPOSTA`;
            } else {
                ret['ret'] = true;
                ret['msg'] = `CHAT [NEXTWAY]: OK`;
                ret['res'] = pass;
            }
        } else {
            // ######## Python [G4f/GitHub/Telegram]
            if (objChatPython === false) { objChatPython = await configStorage({ e, 'action': 'get', 'key': 'chatPython', }); if (!objChatPython.ret) { return objChatPython; } else { objChatPython = objChatPython.res; } }
            retApi = await api({ e, 'method': 'POST', 'url': `http://127.0.0.1:${objChatPython.portServerHttp}/chat`, 'body': inf, 'object': true, });
            if (!retApi.ret) { return retApi; } else { retApi = retApi.res; if (retApi.body) { retApi = retApi.body; } } return retApi;
            // if (objChatPython === false) { objChatPython = await configStorage({ e, 'action': 'get', 'key': 'chatPython', }); if (!objChatPython.ret) { return objChatPython; } else { objChatPython = objChatPython.res; } }
            // infApi = (infIsArray ? inf : [inf,]).map((v) => ({ e, 'method': 'POST', 'url': `http://127.0.0.1:${objChatPython.portServerHttp}/chat`, 'object': true, 'maxConnect': inf.maxConnect, 'body': { ...v, }, }));
            // retApi = await api(infApi); if (!retApi.ret) { return retApi; } retApi = retApi.res;
            // retApi = retApi.map((v) => ({ 'index': v.idx, 'ret': !v.ret ? false : v.res.body.ret, 'msg:': !v.ret ? v.msg : v.res.body.msg, ...(v?.res?.body?.ret && { 'res': v.res.body.res, }), }));
            // ret['ret'] = retApi.some(v => v.ret === true);
            // ret['msg'] = `CHAT [PYTHON]: ${ret.ret ? 'OK' : `ERRO |${!infIsArray ? retApi[0].msg : ' ***'}`}`;
            // if (ret.ret) { ret['res'] = !infIsArray ? retApi[0].res : retApi; }
        }
    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['chat'] = chat;


