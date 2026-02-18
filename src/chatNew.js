/* eslint-disable custom/regraA */

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function clearConsole() { if ((typeof chrome !== 'undefined')) { console.clear(); } else { let p = process.stdout; p.write('\u001b[2J\u001b[0;0H'); p.write('\x1Bc'); } } let msgQtd = 0;
let runCleCon = console.log; console.log = (...a) => { runCleCon.apply(console, a); msgQtd++; if (msgQtd >= 100) { clearConsole(); msgQtd = 0; console.log('CONSOLE LIMPO!\n'); } }; clearConsole();
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
globalThis['firstFileCall'] = new Error(); await import('./resources/@export.js'); let e = firstFileCall, ee = e;



import { writeFile, readFile } from 'fs/promises';

let fileChats = 'logs/chats.json', cacheChats = null, saveTimeout = null, saveInterval = 3000, chatLocks = new Map(), last = 0; let sleep = ms => new Promise(r => setTimeout(r, ms));

let obj = {

    'models': {
        // (Google | Perplexity) [Gemini]
        'gemini-2.0-flash': { 'default': { 'modelId': 'gemini-2.0-flash', 'provider': 'google', }, },
        'gemini-2.5-flash': { 'default': { 'modelId': 'gemini-2.5-flash', 'provider': 'google', }, 'perplexity': { 'modelId': 'google/gemini-2.5-flash', }, },
        'gemini-2.5-pro': { 'default': { 'modelId': 'gemini-2.5-pro', 'provider': 'google', }, 'perplexity': { 'modelId': 'google/gemini-2.5-pro', }, },
        'gemini-3-flash': { 'default': { 'modelId': 'gemini-3-flash-preview', 'provider': 'google', }, 'perplexity': { 'modelId': 'google/gemini-3-flash-preview', }, },
        'gemini-3-pro': { 'default': { 'modelId': 'gemini-3-pro-preview', 'provider': 'google', }, 'perplexity': { 'modelId': 'google/gemini-3-pro-preview', }, },

        // (GitHub | Perplexity) [GPT] {OpenAI}
        'gpt-4.1': { 'default': { 'modelId': 'openai/gpt-4.1', 'provider': 'gitHub', }, },
        'gpt-4.1-mini': { 'default': { 'modelId': 'openai/gpt-4.1-mini', 'provider': 'gitHub', }, },
        'gpt-5': { 'default': { 'modelId': 'openai/gpt-5', 'provider': 'gitHub', }, },
        'gpt-5-mini': { 'default': { 'modelId': 'openai/gpt-5-mini', 'provider': 'gitHub', }, 'perplexity': { 'modelId': 'openai/gpt-5-mini', }, },
        'gpt-5.1': { 'default': { 'modelId': 'openai/gpt-5.1', 'provider': 'perplexity', }, },
        'gpt-5.2': { 'default': { 'modelId': 'openai/gpt-5.2', 'provider': 'perplexity', }, },

        // (Perplexity) [Sonar]
        'sonar': { 'default': { 'modelId': 'perplexity/sonar', 'provider': 'perplexity', }, },
        'sonar-pro': { 'default': { 'modelId': 'sonar-pro', 'provider': 'perplexity', }, },
        'sonar-reasoning': { 'default': { 'modelId': 'sonar-reasoning-pro', 'provider': 'perplexity', }, },
        'sonar-research': { 'default': { 'modelId': 'sonar-deep-research', 'provider': 'perplexity', }, },

        // (Perplexity) [Claude] {Anthropic}
        'claude-opus': { 'default': { 'modelId': 'anthropic/claude-opus-4-5', 'provider': 'perplexity', }, },
        'claude-sonnet': { 'default': { 'modelId': 'anthropic/claude-sonnet-4-5', 'provider': 'perplexity', }, },
        'claude-haiku': { 'default': { 'modelId': 'anthropic/claude-haiku-4-5', 'provider': 'perplexity', }, },

        // (Perplexity) [Grok] {xAI}
        'grok': { 'default': { 'modelId': 'xai/grok-4-1-fast-non-reasoning', 'provider': 'perplexity', }, },

        // (Python) [Gemini] {Perplexity}
        'python': { 'default': { 'modelId': 'python', 'provider': 'python', }, },
    },
};

// ---------------
function triggerSafeSave() {
    if (saveTimeout || !cacheChats) { return; }
    saveTimeout = setTimeout(async () => { try { await writeFile(fileChats, JSON.stringify(cacheChats, null, 4)); } catch { debug(`❌ Erro ao salvar chats`); } finally { saveTimeout = null; } }, saveInterval);
} function debug(msg) {
    let d = new Date();
    let ts = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}.${d.getMilliseconds().toString().padStart(3, '0')}`;
    console.log(`[${ts}] ${msg}`);
} async function getChats() { if (cacheChats) { return cacheChats; } try { cacheChats = JSON.parse(await readFile(fileChats, 'utf8')); } catch { cacheChats = {}; } return cacheChats; }
// ---------------

async function askRestWithAbort({ provider = null, model, add, messages, controller, }) {
    return new Promise(async (resolve, reject) => {
        if (controller?.signal?.aborted) { return reject(new Error('ABORTADO_IMEDIATAMENTE')); }
        try {
            if (!obj.models[model]) { return reject(new Error(`MODEL NÃO ENCONTRADO '${model}`)); }
            let url, headers, body, content, legacy, x = messages, modelId = obj.models[model]; provider = provider || obj.models[model].default.provider;
            if (!modelId[provider]) { provider = modelId.default.provider; modelId = modelId.default.modelId; } else { modelId = modelId[provider].modelId; } let { token, } = obj.providers[provider];
            if (!obj.providers[provider]) { return reject(new Error(`PROVIDER NÃO ENCONTRADO '${provider}`)); } if (provider === 'perplexity' && model.includes(`sonar-`)) { legacy = true; } model = modelId;

            // URL
            if (['google',].includes(provider)) {
                url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${token}`;
            } else if (['perplexity',].includes(provider)) {
                url = !legacy ? `https://api.perplexity.ai/v1/responses` : `https://api.perplexity.ai/chat/completions`;
            } else if (['gitHub',].includes(provider)) {
                url = `https://models.github.ai/inference/chat/completions`;
            } else if (['python',].includes(provider)) {
                url = `http://127.0.0.1:8000/api/query_sync_post`;
            }

            // HEADERS
            if (['google',].includes(provider)) {
                headers = {};
            } else if (['perplexity', 'gitHub',].includes(provider)) {
                headers = { 'Authorization': token, };
            }
            headers = { ...headers, 'Content-Type': 'application/json', };

            // BODY
            if (['google',].includes(provider)) {
                body = { 'contents': x.map(m => ({ 'role': m.role === 'assistant' ? 'model' : 'user', 'parts': [{ 'text': m.content, },], })), };
            } else if (['perplexity',].includes(provider)) {
                body = { model, ...(!legacy ? { 'input': x.map(m => ({ 'type': 'message', 'role': m.role, 'content': m.content, })), } : { 'messages': x.map(m => ({ 'role': m.role, 'content': m.content, })), }), };
            } else if (['gitHub',].includes(provider)) {
                // body = { model, messages, };
                body = { model, 'messages': x.map(m => ({ 'role': m.role, 'content': m.content, })), };
            } else if (['python',].includes(provider)) {
                body = {
                    ...add, 'q': x[x.length - 1].content, 'account_name': last % 2 === 0 ? 'personal' : 'personal2', 'mode': 'pro',
                    'model': last === 0 ? 'sonar' : last === 1 ? 'gemini30flash' : last === 2 ? 'gpt52' : last === 3 ? 'claude45sonnet' : 'grok41nonreasoning',
                };
                last++;
            }

            // REQUISIÇÃO
            let retApi = await api({ e, 'method': 'POST', 'code': true, 'object': true, url, headers, body, 'maxConnect': 60, 'maxResponse': 60, }); // console.log(JSON.stringify(body)); // TESTES
            if (!(retApi?.res?.code === 200)) { return reject(new Error(`${retApi?.res?.code || retApi.msg}`)); } retApi = retApi.res.body; add = {};

            // RESPOSTA
            if (['google',].includes(provider)) {
                content = retApi.candidates[0].content.parts[0].text;
            } else if (['perplexity',].includes(provider)) {
                content = !legacy ? retApi.output[0].content[0].text : retApi.choices[0].message.content;
            } else if (['gitHub',].includes(provider)) {
                content = retApi.choices[0].message.content;
            } else if (['python',].includes(provider)) {
                content = retApi.resposta; add = { 'backend_uuid': retApi.backend_uuid, 'frontend_context_uuid': retApi.frontend_context_uuid, };
            }

            resolve({ provider, add, content, });
        } catch (err) {
            if (err.name === 'AbortError') { reject(new Error('MORTE_SUBITA: Processo encerrado pelo sistema')); } else { reject(err); }
        }
    });
}

async function chat(args) {
    let prompt = typeof args.prompt === 'string' ? args.prompt : ''; let models = Array.isArray(args.models) ? args.models : [];
    let chatId = (typeof args.chatId === 'string' || typeof args.chatId === 'number') ? args.chatId : null; let maxAwait = (Number.isInteger(args.maxAwait) && args.maxAwait > 0) ? args.maxAwait : 10000;
    let onlyFirstResponse = typeof args.onlyFirstResponse === 'boolean' ? args.onlyFirstResponse : false; let sendOnlyLast = (Number.isInteger(args.sendOnlyLast) && args.sendOnlyLast > 0) ? args.sendOnlyLast : 100;
    let delay = (Number.isInteger(args.delay) && args.delay > 0) ? args.delay : 1500; let timerId, globalController = new AbortController(), timeoutAtingido = false;
    if (!prompt) { return { 'ret': false, 'msg': "CHAT: ERRO | INFORMAR 'prompt'", }; } if (models.length === 0) { return { 'ret': false, 'msg': "CHAT: ERRO | INFORMAR 'models'", }; }
    try {
        let data = await getChats(); if (!data.chats) { data.chats = {}; } let allChats = data.chats;
        if (chatId && !allChats[chatId]) { return { 'ret': false, 'msg': `CHAT: ERRO | NÃO ENCONTRADO chatId '${chatId}'`, }; } let finalIdChat = chatId || `chat_${Date.now()}`, botsRecebidos = {};
        let tempoLimitePromise = new Promise((resolve) => {
            timerId = setTimeout(() => { timeoutAtingido = true; globalController.abort(); resolve('TIMEOUT'); debug(`⏰ EXPIRADO`); }, maxAwait);
            globalController.signal.desarmarTimer = (motivo) => { clearTimeout(timerId); if (motivo === 'PRIMEIRO_VENCEU') { globalController.abort(); } resolve(motivo); };
        });

        let botTasks = models.map(async (arr, index) => {
            let { provider, model, } = arr; if (!provider || !model) { throw new Error(`INFORMAR O '${!provider ? 'provider' : 'model'}'`); }
            let lockKey = `${finalIdChat}_${model}`; if (chatLocks.has(lockKey)) { await chatLocks.get(lockKey); }
            let task = (async () => {
                await sleep(index * delay); let handleAbort = (prov) => { debug(`🛑 ABORTADO: ${model} [${prov}]`); }; let boundAbort = handleAbort.bind(null, provider);
                globalController.signal.addEventListener('abort', boundAbort, { 'once': true, });
                try {
                    if (!obj.models[model]) { throw new Error(`NÃO ENCONTRADO MODEL '${model}'`); } let exist = allChats[finalIdChat]?.[model];
                    let history = (exist?.messagens || []).slice(-(sendOnlyLast * 2)); let startBot = Date.now(); debug(`📡 ENVIANDO: [${provider}] ${model}`);
                    let answer = await askRestWithAbort({ provider, model, 'add': exist?.add || {}, 'messages': [...history, { 'role': 'user', 'content': prompt, },], });
                    if (globalController.signal.aborted) { return; } globalController.signal.removeEventListener('abort', boundAbort);
                    botsRecebidos[`_${index}`] = { index, 'provider': answer.provider, model, 'delayMs': Date.now() - startBot, 'add': answer.add, 'content': answer.content, };
                    debug(`✅ RECEBIDO: [${provider}] ${model} (${Date.now() - startBot}ms)`); if (onlyFirstResponse) { globalController.signal.desarmarTimer('PRIMEIRO_VENCEU'); }
                } catch (e) {
                    globalController.signal.removeEventListener('abort', boundAbort);
                    if (!globalController.signal.aborted) { botsRecebidos[`_${index}`] = { index, model, 'error': e.message, }; debug(`❌ PROBLEMA: [${provider}] ${model} → ${e.message}`); }
                } finally {
                    globalController.signal.removeEventListener('abort', boundAbort);
                }
            })();
            chatLocks.set(lockKey, task); return task;
        });

        if (onlyFirstResponse) { await tempoLimitePromise; }
        else { await Promise.race([tempoLimitePromise, Promise.allSettled(botTasks).then(() => { if (!timeoutAtingido) { globalController.signal.desarmarTimer('TODOS_CONCLUIDOS'); } }),]); }

        let peloMenosUmSucesso = false, botsResponse = models.map((model, idx) => {
            let b = botsRecebidos[`_${idx}`]; if (!b || b.error) { return { 'ret': false, 'msg': `CHAT[BOT]: ERRO | ${b?.error || (timeoutAtingido ? 'TIMEOUT' : 'DESCARTADO')}`, }; }
            peloMenosUmSucesso = true; if (!allChats[finalIdChat]) { allChats[finalIdChat] = {}; } if (!allChats[finalIdChat][model]) { allChats[finalIdChat][model] = { 'add': b.add, 'messagens': [], }; }
            allChats[finalIdChat][model].messagens.push({ 'role': 'user', 'content': prompt, }, { 'role': 'assistant', 'content': b.content, });
            return { 'ret': true, 'msg': `CHAT[BOT]: OK`, 'res': { 'delayMs': b.delayMs, 'provider': b.provider, 'content': b.content, }, };
        });

        if (peloMenosUmSucesso) { triggerSafeSave(); } if (!peloMenosUmSucesso) { return { 'ret': false, 'msg': `CHAT: ERRO | NENHUM BOT DEU SUCESSO`, 'res': { 'bots': botsResponse, }, }; }

        return { 'ret': true, 'msg': 'CHAT: OK', 'res': { 'chatId': finalIdChat, 'bots': botsResponse, }, };

    } catch (e) {
        return { 'ret': false, 'msg': `CHAT: ERRO | ${e.message} `, };
    } finally {
        clearTimeout(timerId);
    }
}

// --- EXEMPLO DE USO ---
let retChat; let guide = await readFile(`D:/ARQUIVOS/PROJETOS/Sniffer_Python/logs/Plataformas/z_OUTROS/TryRating/BroadMatchRatings/z_AI.txt`, 'utf8');
let instrucao = `Preciso da sua ajuda para completar um tipo de tarefa especifica, as instruções são essas. Para facilitar o entendimento da resposta seja o mais direto possível, quero respostas curtas e diretas, no máximo 10 palavras, não quero explicação do que você entendeu. Seja bem direto!\n\n --- \n\n${guide}`;
retChat = await chat({
    'chatIdA': 'chat_1771363175565',
    'maxAwait': 25000,
    'onlyFirstResponseA': true,
    'sendOnlyLast': 100,
    'delay': 1,

    // [ 'gemini-3-flash', 'gpt-4.1', 'sonar' ]

    'provider': 'perplexity',
    'models': [
        // --- Gemini
        // 'gemini-2.0-flash', // (Google) ⚠️

        // 'gemini-2.5-flash', // (Google | Perplexity) ✅
        // 'gemini-2.5-pro', // (Google | Perplexity) ✅

        // 'gemini-3-flash', // *** (Google | Perplexity) ✅
        // 'gemini-3-pro', // (Google | Perplexity) ✅

        // --------- GPT
        // 'gpt-4.1', // *** (GitHub) ✅

        // 'gpt-4.1-mini', // (GitHub) ✅

        // 'gpt-5-mini', // (GitHub | Perplexity) ✅

        //'gpt-5.1', // (Perplexity) ✅

        // 'gpt-5.2', // (Perplexity) ✅

        // --------- Sonar
        // 'sonar', // *** (Perplexity) ✅

        // 'sonar-pro', // (Perplexity) ✅

        // 'sonar-reasoning', // (Perplexity) {É LENTO PARA RESPONDER!} ✅

        // 'sonar-research', // (Perplexity) ✅

        // --------- Claude
        // 'claude-opus', // *** (Perplexity) ✅

        // 'claude-sonnet', // (Perplexity) ✅

        // 'claude-haiku', // (Perplexity) ✅

        // --------- Grok
        // 'grok', // *** (Perplexity) ✅

        // --------- {PYTHON}
        // 'python',
        // 'python',
        // 'python',
        // 'python',
        // 'python',
        { 'providerA': 'perplexity', 'modelA': 'aaa', },

    ],
    'prompt': `
        ${instrucao}
    `,

    'prompt': `
        De acordo com as instruções qual a melhor avaliação para (envie APENAS o resultado [Good, Acceptable OU Bad] mais nada!). Sua função é analisar o que exatamente é a Keyword e a Expansion, e determinar o melhor resultado:

        Keyword: ligacao falsa
        Expansion: gravar ligacao
    `,

    'prompt': `
     Hora
        `,

});

if (!retChat.ret) { console.log(`❌`, JSON.stringify(retChat, null, 2)); }
else { (retChat.res?.bots || []).forEach((b, i) => { let t; if (!b.ret) { t = `[BOT ${i}] ⚠️  ${b.msg}`; } else { t = `[BOT ${i}] ✅ ${String(b.res.delayMs).padStart(5, '0')}ms - ${b.res.content}`; } console.log(t); }); }

// Gemini → **********************
// GPT    → **************
// Claude → ****************
// Grok   → *******************

setInterval(() => { }, (2 * (1000)));