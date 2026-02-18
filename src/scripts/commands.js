let e = currentFile(new Error()), ee = e;
async function commands(inf = {}) {
  let ret = { 'ret': false, }; e = inf.e || e;
  try {
    let { type, origin, } = inf;

    let retChromeActions;
    if (origin === 'chrome') {
      retChromeActions = await chromeActions({ e, 'action': 'prompt', 'title': `NOME DO COMANDO`, });

      if (!retChromeActions.ret) {
        return retChromeActions;
      } else {
        retChromeActions = retChromeActions.res;
      }
    }

    let r = retChromeActions.toLowerCase();
    if (r === 'zz' || r === 'xx' || r === 'cc' || ['http://', 'https://', 'www.',].some(a => r.includes(a))) {
      // → GERAR O COMENTÁRIO DO 'tryRatingComplete'

      // DEFINIR DESTINO (USUÁRIO 3 DO CHROME)
      let devSendOther, devices = gW.devices[1]; let retChromeActionsOk = await chromeActions({ e, 'action': 'user', });
      for (let c in devices[1]) { if (c.includes(retChromeActionsOk.res)) { let valor = devices[1][c]; devSendOther = 3; devSendOther = gW.devGet[1].replace(devices[2][valor], devices[2][devSendOther]); } }

      // ENVIAR MENSAGEM COM O COMANDO
      let message = {
        'fun': [{
          'securityPass': gW.securityPass, 'retInf': true, 'name': 'tryRatingComplete', 'par': { 'infTryRatingComplete': retChromeActions, },
        },],
      };

      let retListenerAcionar = await tryRatingComplete({ e, 'infTryRatingComplete': message.fun[0].par.infTryRatingComplete, });

      if (retListenerAcionar.ret) {
        await clipboard({ e, 'action': 'set', 'value': retListenerAcionar.res.comments[retListenerAcionar.res.current], });
      }

      notification({ e, 'duration': retListenerAcionar.ret ? 1 : 2, 'icon': `icon${retListenerAcionar.ret ? 'BOT' : 'Red'}`, 'retInf': false, 'title': `Complete Judge`, 'text': retListenerAcionar.msg, 'ntfy': false, });

    } else if ((/^(?:[^\t]*\t){4}[^\t]*$/).test(retChromeActions)) {

      // INDICAÇÃO AUTOMÁTICA
      await clientInputChrome({ 'lead': retChromeActions, 'origin': 'ATALHO', });

    }

    ret['msg'] = `COMMAND 1: OK`;
    ret['ret'] = true;

  } catch (catchErr) {
    let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
  }

  return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['commands'] = commands;


