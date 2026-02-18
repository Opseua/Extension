

async function backgroundRun() {
    globalThis['isModeIncognito'] = chrome.extension.inIncognitoContext; // chrome.runtime.reload(); // DEFINIR SE O CONTEXTO É MODO ANÔNIMO | REINICIAR A EXTENSÃO
    // await new Promise((resolve) => { chrome.storage.sync.clear(async () => { /* console.log('DEL 1'); */ resolve(true); }); }); // APAGAR STORAGE [SYNC]: LIMPAR
    await new Promise((resolve) => { chrome.storage.local.clear(async () => { /* console.log('DEL 2'); */ resolve(true); }); }); // APAGAR STORAGE [LOCAL]: LIMPAR

    globalThis.restartCode = () => { setTimeout(() => chrome.runtime.reload(), 2000); return { 'ret': true, 'msg': 'RESTART CODE: OK', }; }; function scheduleRun(timeStr = '00:05') { // AGENDAR GATILHO
        let [hour, min,] = timeStr.split(':').map(Number), now = new Date(), next = new Date(now); next.setHours(hour, min, 0, 0); function format(ts, type = 'date') {
            let d = new Date(ts); let pad = n => String(n).padStart(2, '0'); if (type === 'diff') {
                let h = pad(Math.trunc(ts / 3600000)), m = pad(Math.trunc((ts % 3600000) / 60000)), s = pad(Math.trunc((ts % 60000) / 1000)); return `${h}:${m}:${s}`;
            } return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
        } if (next.getTime() <= now.getTime()) { next.setDate(next.getDate() + 1); } console.log(`GATILHO (${format(next)}) → EM ${format(next.getTime() - now.getTime(), 'diff')}`);
        chrome.alarms.create('reloadAtTime', { 'when': next.getTime(), 'periodInMinutes': 24 * 60, }); chrome.alarms.onAlarm.addListener(alarm => { if (alarm.name === 'reloadAtTime') { restartCode(); } });
    } globalThis['scheduleRun'] = scheduleRun;

    // **********************************
    await import('../server.js');
    // **********************************



    // #*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*

    gO.inf['WebScraper_Chrome_Extension'] = { 'url': '*c6bank.my.site.com*', }; globalThis.indicationCheck = async (inf = {}) => {
        let { duration = 6, origin = '', } = inf; let add = [{ 'active': true, }, { 'focused': true, }, { 'state': 'maximized', },], fF = { 'firstFind': true, }, flt = { 'pinned': true, 'index': 0, 'incognito': false, };
        let iTA, rTA, atn = [{ 'sharedMedia': true, },], tA = { 'url': gO.inf.WebScraper_Chrome_Extension.url, }, fltOk = { ...flt, }; delete fltOk['incognito']; let tAFlt = { ...tA, ...flt, };
        let xNot = { 'title': `INDICAÇÃO AUTOMÁTICA`, duration, 'icon': `iconRed`, 'ntfy': false, }; if (isModeIncognito) { notification({ 'text': `Não use no modo anônimo!`, ...xNot, }); return false; }

        // CHECAR SE A ABA EXISTE E ESTÁ FIXADA NO INDEX 0
        iTA = { ...fF, 'filters': { ...tAFlt, }, 'actions': [...(origin === 'button' ? add : []), ...atn,], }; rTA = await tabActions(iTA); // console.log(1, rTA);

        // ABA EXISTE: [SIM] (E) ESTÁ COM sharedMedia: [SIM] → NADA A FAZER
        if (rTA?.res?.[0]?.sharedMedia) { return true; }

        // ABA EXISTE: [NÃO](OU) EXISTE E ESTÁ COM sharedMedia: [NÃO] → ABRIR / ATIVAR A ABA
        iTA = {
            ...fF, 'filters': { ...tAFlt, }, 'urlIfNotExist': 'https://c6bank.my.site.com/partners/s/lead/Lead/Default', 'actions': [...add, ...atn, ...Object.entries(fltOk).map(([k, v,]) => { return { [k]: v, }; }),],
        }; rTA = await tabActions(iTA); // console.log(2, rTA);
        if (!rTA?.res?.[0]?.sharedMedia && origin !== 'button') { notification({ 'text': `Pressione o ícone da extensão até aparecer o quadrado!`, ...xNot, }); return false; } return true;
    };

    // #*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*

    // PROXY: DEFINIR
    function proxySet(ativarProxy) {
        let bypassList = [`localhost`, `127.0.0.1`, `note-*`, `notebook-*`, `192.168*`, `${globalThis.gW.serverWeb}`, `${globalThis.gW.serverWebEstrelar}`,];
        let proxyHost = `${globalThis.gW.serverWebEstrelar}`; let proxyPort = 980; let proxyUser = 'Administrator'; let proxyPass = 'Pass2024PassReverse'; let directConfig = { 'mode': 'system', };
        let proxyConfig = { 'mode': 'fixed_servers', 'rules': { 'singleProxy': { 'scheme': 'http', 'host': proxyHost, 'port': proxyPort, }, bypassList, }, };
        let currentScope = isModeIncognito ? 'incognito_session_only' : 'regular'; let scopeMsg = isModeIncognito ? 'ANÔNIMO' : 'NORMAL';
        let configToApply = ativarProxy ? proxyConfig : directConfig; let actionMsg = ativarProxy ? 'Proxy ATIVADO' : 'Proxy DESATIVADO';
        chrome.proxy.settings.set({ 'value': configToApply, 'scope': currentScope, }, function () { // APLICAR NO CONTEXTO ATUAL
            if (chrome.runtime.lastError) { logConsole({ 'txt': `PROXY: [${scopeMsg}] ERRO AO APLICAR | ${chrome.runtime.lastError.message}`, }); }
            else { logConsole({ 'txt': `PROXY: [${scopeMsg}] OK | ${actionMsg}`, }); }
        }); let authListener = function (details) { // AUTENTICAÇÃO
            if (details.isProxy && details.challenger.host === proxyHost && details.challenger.port === proxyPort) {
                logConsole({ 'txt': `PROXY: [${scopeMsg}] OK | AUTENTICANDO PROXY PARA '${details.challenger.host}'`, }); return { 'authCredentials': { 'username': proxyUser, 'password': proxyPass, }, };
            } return {};
        }; if (!chrome.webRequest.onAuthRequired.hasListener(authListener)) { chrome.webRequest.onAuthRequired.addListener(authListener, { 'urls': ['<all_urls>',], }, ['blocking',]); }
    } proxySet(false);

    // #*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*

    chrome.browserAction.onClicked.addListener(async function (/*...inf*/) {
        // console.log(`EVENTO: click no ícone\n`, inf);

        // ABRIR ABA DO SISTEMA E ATIVAR O COMPARTILHAMENTO DE MÍDIA
        indicationCheck({ 'origin': 'button', });
    });

    async function forceUpdate() {
        // MENUS DE CONTEXTO DO ÍCONE DA EXTENSÃO: REMOVER TODOS (NECESSÁRIO ANTES DE CRIAR POR CAUSA DO ID QUE JÁ EXISTE!!!)
        let arrIds = ['item1', 'item2', 'item3', 'item4',];
        arrIds.forEach(id => { chrome.contextMenus.remove(id, function () { if (chrome.runtime.lastError) { } }); }); // chrome.contextMenus.removeAll(() => { }) // REMOVER TODOS DE UMA SÓ VEZ

        // MENUS DE CONTEXTO DO ÍCONE DA EXTENSÃO: CRIAR
        chrome.contextMenus.create({ 'id': `item1`, 'title': '🟢 Prompt', 'contexts': ['browser_action',], });
        chrome.contextMenus.create({ 'id': `item2`, 'title': '🔴 Proxy', 'contexts': ['browser_action',], });
        chrome.contextMenus.create({ 'id': `item3`, 'contexts': ['browser_action',], 'type': 'radio', 'parentId': `item2`, 'checked': true, 'title': `OFF`, });
        chrome.contextMenus.create({ 'id': `item4`, 'contexts': ['browser_action',], 'type': 'radio', 'parentId': `item2`, 'checked': false, 'title': `ON ${isModeIncognito ? '' : ' ⚠️'}`, });
    } forceUpdate(); // FORÇAR ATUALIZAÇÕES NO CÓDIGO E NA EXTENSÃO AO APERTAR F5 NO CONSOLE

    // -------------------- MENU DE CONTEXTO [ÍCONE DA EXTENSÃO] OU [BOTÃO DIREITO]  ---------------------------------------------------------------------
    // TIPOS DE 'contexts':
    // | ---------------- | ----------------------------------------------------------------------
    // | `all`            | Aparece em todos os contextos
    // | `page`           | Em qualquer lugar da página
    // | `selection`      | Quando o usuário seleciona texto
    // | `link`           | Quando o usuário clica com o botão direito em um link
    // | `editable`       | Em campos editáveis (input, textarea, contentEditable)
    // | `browser_action` | Ícone da extensão na barra de ferramentas do Chrome
    // | `page_action`    | Ícone da extensão na barra de ferramentas do Chrome (em páginas específicas)

    // // (Item normal)
    // chrome.contextMenus.create({ 'id': 'item1', 'title': 'TÍTULO_1', 'contexts': ['browser_action',], });
    // // ------------------------------------------------------------------------------------------------------------------------------------------
    // // [Checkbox]
    // chrome.contextMenus.create({ 'id': 'item2', 'title': 'TÍTULO_2', 'contexts': ['browser_action',], 'type': 'checkbox', 'checked': true, });
    // // ------------------------------------------------------------------------------------------------------------------------------------------
    // [Radio] Opção 1 | Opção 2
    // chrome.contextMenus.create({ 'id': 'item3', 'title': 'TÍTULO_3', 'contexts': ['browser_action',], 'type': 'radio', 'checked': true, });
    // chrome.contextMenus.create({ 'id': 'item4', 'title': 'TÍTULO_4', 'contexts': ['browser_action',], 'type': 'radio', 'checked': false, });
    // chrome.contextMenus.create({ 'id': 'item5', 'title': 'TÍTULO_5', 'contexts': ['browser_action',], 'type': 'radio', 'checked': false, });
    // // --------------------------------------------------------------------------------------------
    // // {Separador}
    // chrome.contextMenus.create({ 'type': 'separator', 'contexts': ['browser_action',], });
    // // ------------------------------------------------------------------------------------------------------------------------------------------
    // // [Submenu] Ajuda > Sobre o Google Chrome
    // chrome.contextMenus.create({ 'id': 'item6', 'title': 'TÍTULO_6', 'contexts': ['browser_action',], });
    // chrome.contextMenus.create({ 'id': 'item7', 'title': 'TÍTULO_7', 'contexts': ['browser_action',], 'parentId': 'item6', });

    // -------------------- EXECUTAR AÇÕES DO MENU DE CONTEXTO [ÍCONE DA EXTENSÃO] OU [BOTÃO DIREITO] ------------------------------------------------
    chrome.contextMenus.onClicked.addListener(async function (...inf) {
        let [props, /* tab */,] = inf; let { menuItemId, } = props;
        if (menuItemId === 'item1') { commands({ 'type': 'badge', 'origin': 'chrome', }); /* MOSTRAR prompt */ }
        if (['item3', 'item4',].includes(menuItemId)) { proxySet(menuItemId === 'item4'); }
    });

    chrome.tabs.onUpdated.addListener(function (...inf) {
        let { /* active, */ id, /* index, pinned, selected, */ status, /* title, */ url, } = inf[2];

        // if (?url.includes('www.google.com') && status === 'complete') {
        //     console.log(`EVENTO: URL aberto e 100% carregado na aba\n`, id);
        // }

        // FECHAR ABA DESNECESSÁRIA
        if (url?.includes(`.msftconnecttest.com`) || url?.includes(`.netcombowifi.com`)) { setTimeout(() => { chrome.tabs.remove(id, () => { if (chrome.runtime.lastError) { } }); }, (30 * 1000)); }

        // BAIXAR PDF COM A GUIDLINE
        if ([`/api/projectmanagement/guideline/`, `/api/catalog/datasets/`, `/tr-catalog-assets-`,].some(a => url?.toLowerCase()?.includes(a?.toLowerCase())) && status === 'complete') {
            notification({ 'title': `Baixando PDF`, 'text': `Aguarde...`, 'icon': `iconClock`, 'keepOld': true, 'ntfy': false, 'duration': 3, });
            chrome.downloads.download({ url, 'conflictAction': 'overwrite', }); chrome.tabs.remove(id);
        }
    });

    chrome.downloads.onChanged.addListener(async function (...inf) {
        let { id, state, } = inf[0];
        let x = chrome.downloads; if (state?.current !== 'complete') { return; } x.search({ id, }, async function (txt) {
            if (!txt || txt.length === 0) { return; } let { byExtensionName, filename, id, /* url, */ } = txt[0]; if (byExtensionName?.includes('BOT')) {
                if (!filename?.includes('[KEEP]') && !filename?.toLowerCase()?.endsWith('.pdf')) {
                    // setTimeout(function () { x.erase({ 'id': [id,], });/* logConsole({ e, ee, 'txt': `DOWNLOAD REMOVIDO DA LISTA` }); URL.revokeObjectURL(url) */ }, 5000);]
                    setTimeout(function () { x.erase({ id, });/* logConsole({ e, ee, 'txt': `DOWNLOAD REMOVIDO DA LISTA` }); URL.revokeObjectURL(url) */ }, 5000);
                }
            }
        });
    });

    // chrome.commands.onCommand.addListener(async function (...inf) {
    //     console.log(`EVENTO: atalho pressionado\n`, inf);
    // });

    // chrome.tabs.onActivated.addListener(async function (...inf) {
    //     console.log(`EVENTO: guia ativa alterada\n`, inf);
    // });

    // chrome.notifications.onClicked.addListener(async function (...inf) {
    //     console.log(`EVENTO: click na notificação\n`, inf);
    // });

    // chrome.notifications.onButtonClicked.addListener(async function (...inf) {
    //     console.log(`EVENTO: click no botão da notificação\n`, inf);
    // });

    // chrome.notifications.onClosed.addListener(async function (...inf) {
    //     console.log(`EVENTO: notificação fechada\n`, inf);
    // });

    // chrome.runtime.onMessage.addListener(async function (...inf) {
    //     console.log(`EVENTO: mensagem recebida\n`, inf);
    // });

    // chrome.webRequest.onBeforeRequest.addListener(async function (...inf) {
    //     let { requestId, tabId, url, method, } = inf[0];
    //     if (url.includes('.com/api/survey')) { // .com/api/announcement | .com/api/survey
    //         console.log(`EVENTO: requisição iniciada\n`, requestId, tabId, method, url);
    //     }
    // }, { 'urls': ['<all_urls>',], });

    // chrome.webRequest.onCompleted.addListener(async function (...inf) {
    //     let { requestId, tabId, url, method, } = inf[0];
    //     if (url.includes('.com/api/survey') || url.includes('.com/api/announcement')) { // .com/api/announcement | .com/api/survey
    //         console.log(`EVENTO: requisição concluída\n`, requestId, tabId, method, url);
    //         let retChromeActions = await chromeActions({ 'action': 'getBody', 'target': `*.com/app/announcemen*`, }); console.log(retChromeActions);
    //         // let retFile = await file({ 'action': 'write', 'path': 'arquivoNovo.html', 'content': retChromeActions.res, }); console.log(retFile);
    //         let msgLis = { 'fun': [{ 'securityPass': gW.securityPass, 'retInf': true, 'name': 'file', 'par': { 'action': 'write', 'path': 'arquivoNovo.html', 'content': 'CASA', }, },], };
    //         let retMessageSend = await messageSend({ 'destination': `127.0.0.1:1234/?roo=SALA`, 'message': msgLis, }); console.log(retMessageSend);
    //     }
    // }, { 'urls': ['<all_urls>',], });

    // PEGAR CONTEUDO DA ABA (SÓ FUNCIONA COM AÇÃO DO USUÁRIO COM A ABA ABERTA)
    // let e = currentFile(new Error()), ee = e; async function tabGetContent(inf = {}) {
    //     let ret = { 'ret': false, }; e = inf.e || e; try {
    //         let { 'id': tabId, filename, } = inf; let blob = await new Promise((resolve) => { chrome.pageCapture.saveAsMHTML({ tabId, }, (blob) => { resolve(blob); }); });
    //         let content = await blob.text(); ret['res'] = {}; if (filename) {
    //             let f = `${filename}.mhtml`; chrome.downloads.download({ 'url': `${'data:application/x-mimearchive;base64,' + btoa(content)}`, 'filename': f, }); ret['res']['filename'] = f;
    //         } ret['msg'] = `TAB GET CONTENT: OK`; ret['ret'] = true; ret['res']['content'] = `${content}`;
    //     } catch (catchErr) { let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res']; }
    //     return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
    // } let retTabGetContent = await tabGetContent({ 'id': tabId, 'filename': 'aaa', }); console.log(retTabGetContent);

}
backgroundRun();


