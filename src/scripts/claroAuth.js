let e = currentFile(new Error()), ee = e;
async function claroAuth(inf = {}) {
    let ret = { 'ret': false, }; e = inf.e || e;
    try {
        let infApi, retApi, url; let ignoreCheckConnection = false; ignoreCheckConnection = true;

        // CHECAR CONEXÃO
        if (!ignoreCheckConnection) {
            url = `http://142.250.190.147/generate_204`; // url = `http://www.msftconnecttest.com/redirect`; // 189.23.51.30
            infApi = { e, 'method': 'GET', 'object': true, url, 'hideHeaders': false, }; retApi = await api(infApi);
            if (!retApi.ret || [204,].includes(retApi?.res?.code)) { logConsole({ e, ee, 'txt': `REQ: 1 → ${!retApi.ret ? `${retApi.msg}` : `COM INTERNET`}`, }); return ret; }

        } else {
            // REDIRECIONAMENTO 1 (SEM O SESSION)
            url = `https://www.clarowifi.com.br/r/redir/portal/nokia7750?f=YT1yam9uZXRjb21tdW5pdHljb21icjtiPTIwMS4xNy4zNi4xODg7Yz1jMDo0YTowMDozYzpmMToxMjtkPTAwOjAwOjAwOjAwOjAwOjAwO289MQ==`;
            infApi = { e, 'method': 'GET', 'object': true, url, 'hideHeaders': false, }; retApi = await api(infApi);
            if (!ignoreCheckConnection) { logConsole({ e, ee, 'txt': `URL: 2 → ${url}`, }); }
            if (!retApi.ret || ![200, 302,].includes(retApi?.res?.code)) { logConsole({ e, ee, 'txt': `REQ: 2 → ${!retApi.ret ? `${retApi.msg}` : `ERRO REDIRECIONAMENTO 1`}`, }); return ret; }
        }

        // REDIRECIONAMENTO 2 (COM O SESSION)
        url = `${retApi?.res?.url}`; let pars = paramsObj(url);
        infApi = { e, 'method': 'GET', 'object': true, url, 'hideHeaders': false, }; retApi = await api(infApi);
        if (!ignoreCheckConnection) { logConsole({ e, ee, 'txt': `URL: 3 → ${url}`, }); }
        if (!retApi.ret || ![200, 302,].includes(retApi?.res?.code)) { logConsole({ e, ee, 'txt': `REQ: 3 → ${!retApi.ret ? `${retApi.msg}` : `ERRO REDIRECIONAMENTO 2`}`, }); return ret; }

        // AUTENTICAÇÃO
        url = `https://api-nomad.netcombowifi.com.br/portal/authenticate/community`;
        infApi = {
            e, 'method': 'POST', 'object': true, url, 'hideHeaders': false, 'body': { 'login': `${gW.par9}`, 'password': `${gW.par10}`, },
            'headers': { 'Content-Type': 'application/json', 'p': 'PROF_NOMAD_CUSTOM', 'type': 'CLARO_RESIDENCIAL', 'session': `${pars['f']}`, },
        };
        retApi = await api(infApi);
        if (!ignoreCheckConnection) { logConsole({ e, ee, 'txt': `URL: 4 → ${url}`, }); }
        if (!retApi.ret || ![200,].includes(retApi?.res?.code)) { logConsole({ e, ee, 'txt': `REQ: 4 → ${retApi.ret ? `${retApi.msg}` : `ERRO AUTENTICAÇÃO`}`, }); return ret; }

        // NAVEGAR
        url = `https://api-nomad.netcombowifi.com.br/portal/community/navigate`;
        infApi = {
            e, 'method': 'POST', 'object': true, url, 'hideHeaders': false, 'body': {},
            'headers': { 'Content-Type': 'application/json', 'session': `${pars['f']}`, 'Authorization': `Bearer ${retApi.res.body.data.nomadToken}`, },
        };
        retApi = await api(infApi);
        if (!ignoreCheckConnection) { logConsole({ e, ee, 'txt': `URL: 5 → ${url}`, }); }
        if (!retApi.ret || ![200,].includes(retApi?.res?.code) || retApi?.res?.body?.code !== 'SUCCESS') { logConsole({ e, ee, 'txt': `REQ: 5 → ${retApi.ret ? `${retApi.msg}` : `ERRO NAVEGAR`}`, }); return ret; }

        logConsole({ e, ee, 'txt': `LIBERADO!`, });

        ret['msg'] = `CLARO AUTH: OK`;
        ret['ret'] = true;

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['claroAuth'] = claroAuth;


