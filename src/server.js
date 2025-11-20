let startup = new Date(); globalThis['firstFileCall'] = new Error(); await import('./resources/@export.js'); let e = firstFileCall, ee = e;

async function serverRun(inf = {}) {
    let ret = { 'ret': false, }; e = inf.e || e;
    try {
        await logConsole({ e, ee, 'txt': `**************** SERVER **************** [${startupTime(startup, new Date())}]`, });

        // IMPEDIR 'serverRun' DE PROSSEGUIR (A CADA x MINUTOS)
        async function notRun() { if (['AWS',].includes(gW.devMaster)) { await claroAuth(); } await new Promise(r => setTimeout(r, (5 * (60 * 1000)))); await notRun(); }
        if (['NOTE_HP', 'AWS',].includes(gW.devMaster) || isModeIncognito) { logConsole({ e, ee, 'txt': `❌❌❌ IGNORANDO EXECUÇÃO DO server.js ❌❌❌`, }); await notRun(); }

        // RESETAR BADGE
        chromeActions({ e, 'action': 'badge', 'text': '', }); // z_testeElementAction({}); return; // TESTES

        // ATALHO PRESSIONADO
        chrome.commands.onCommand.addListener(async function (...inf) {
            try {
                // logConsole({ e, ee, 'txt': `ON START: ATALHO PRESSIONADO` })
                if (inf[0] === 'atalho_1') {
                    command1({ 'origin': 'chrome', });

                    // chrome.tabs.executeScript({
                    //     code: `(function () {
                    //             function pw(j, pw, ph, u) {let w = (pw / 100) * j.top.screen.width, h = (ph / 100) * j.top.screen.height; 
                    //             let y = j.top.outerHeight / 2 + j.top.screenY - (h / 2), x = j.top.outerWidth / 2 + j.top.screenX - (w / 2);
                    //             return j.open(u, '', 'width=' + w + ',height=' + h + ',top=' + y + ',left=' + x); }; pw(globalThis, 30, 35, 'http://127.0.0.1:1234/?act=page&roo=&mes=0'); })();`
                    // });

                } else if (inf[0] === 'atalho_2') { command2(); } else { logConsole({ e, ee, 'txt': `ACAO DO ATALHO NAO DEFINIDA`, }); }
            } catch (catchErr) { await regexE({ inf, 'e': catchErr, }); }
        });

        // *************************

        // CLIENT (NÃO POR COMO 'await'!!!) [MANTER NO FINAL]
        await new Promise(r => { setTimeout(r, 50); }); client({ e, }); await new Promise(r => { setTimeout(r, 1000); });

        // REINICIAR EXTENSÃO | CHECAR SE O BOT DA INDICAÇÃO ESTÁ PREPARADO
        // setTimeout(() => { tabActions({ 'filters': { 'url': gO.inf.WebScraper_Chrome_Extension.url, }, 'actions': [{ 'sharedMedia': false, },], }); console.log('sharedMedia: OFF'); }, 20000); // TESTES
        if ((`${gW.devGet[0]}`).includes('ESTRELAR_')) {
            logConsole({ e, ee, 'txt': `ACIONADO → REINICIAR EXTENSÃO | CHECAR SE O BOT DA INDICAÇÃO ESTÁ PREPARADO`, });
            scheduleRun('00:00'); let delay = (1 * 60 * 1000); // delay = 15000; // ← TESTES
            setInterval(async () => { indicationCheck({}); }, delay); // A CADA x MINUTO(s)
        }

        // MANTER ORDEM DA ABA
        if ((await new Promise((resolve) => { chrome.identity.getProfileUserInfo(u => { if (chrome.runtime.lastError) { resolve(null); return; } resolve(u.email || false); }); }))?.includes('1@gmail.com')) {
            logConsole({ e, ee, 'txt': `MONITOR DE ABAS ATIVADO`, }); async function enforceTabOrder() {
                let TAB_URL = 'https://www.tryrating.com/', B = chrome.tabs, W = chrome.windows, isMoving = false; let moveTab = (tabId, index, retries = 0) => {
                    if (retries >= 10) { return (isMoving = false); }
                    B.move(tabId, { index, }, () => {
                        if (chrome.runtime.lastError) { if (chrome.runtime.lastError.message.includes('Tabs cannot be edited')) { setTimeout(() => moveTab(tabId, index, retries + 1), 200); } else { isMoving = false; } }
                        else { isMoving = false; }
                    });
                }; let checkAndMove = () => {
                    if (isMoving) { return; } isMoving = true;
                    W.getCurrent({ populate: false, }, (win) => {
                        if (!win) { return (isMoving = false); } B.query({ windowId: win.id, }, (tabs) => {
                            let targetTab = tabs.find(t => t.url.startsWith(TAB_URL)); if (!targetTab) { return (isMoving = false); } let pinnedCount = tabs.filter(t => t.pinned).length;
                            let targetIndex = pinnedCount; if (targetTab.index !== targetIndex) { setTimeout(() => moveTab(targetTab.id, targetIndex), 50); } else { isMoving = false; }
                        });
                    });
                }; let tabListener = () => { if (!isMoving) { checkAndMove(); } }; B.onCreated.addListener(tabListener); // B.onRemoved.addListener(tabListener); B.onMoved.addListener(tabListener);
            } enforceTabOrder();
        }

        ret['ret'] = true;
        ret['msg'] = `SERVER: OK`;

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}
// TODAS AS FUNÇÕES PRIMÁRIAS DO 'server.js' / 'serverC6.js' / 'serverJsf.js' DEVEM SE CHAMAR 'serverRun'!!!
serverRun();


