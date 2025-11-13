// let infCommandLine, retCommandLine;
// infCommandLine = {
//     e, // 'notBackground': true, 'awaitFinish': true, 'notAdm': true, 'withCmd': true, 'view': false, 'delay': 0, 'terminalPath': `!letter!:/PASTA 1`, 'notReplaceVars': true,
//     // ****************** NORMAL
//     // 'command': `notepad`,
//     // ****************** CMD {withCmd → true}
//     // 'command': `notepad & explorer`,
//     // ****************** (SEM ESPAÇO)
//     // 'command': `D:/ARQUIVOS/BAT.bat AAA`,
//     // 'command': `%fileWindows%/PORTABLE_Notepad++/notepad++.exe D:/AAA.txt`,
//     // 'command': `!fileProjetos!/WebSocket/src/z_OUTROS_server/OFF.vbs FORCE_STOP`,
//     // ****************** (COM ESPAÇO)
//     // 'command': `"D:/ARQUIVOS/BAT.bat" "AAA BBB"`,
//     // 'command': `"%fileWindows%/PORTABLE_Notepad++/notepad++.exe" "D:/AAA BBB.txt"`,
//     // 'command': `"!fileProjetos!/WebSocket/src/z_OUTROS_server/OFF.vbs" "FORCE_STOP" "AAA BBB"`,
//     // ****************** (MESMO PROCESSO)
//     'newMode': true, 'command': `!fileWindows!/PORTABLE_VLC/DISCO_C/Program Files/VideoLAN/VLC/vlc.exe`, // NÃO COLOCAR ENTRE ASPAS (O COMANDO NEM ARGS [EXCETO EM 'withCmd': true])!!!
//     'args': [`D:\\ARQUIVOS\\PROJETOS\\IPTV\\logs\\Video\\#_NAO_COPIAR\\Streamings\\_10_22-10.06.54.511.ts`, `--meta-title=XX:XX:XX [PROV] (AAA) Telecine Action`, `--extraintf=http`, `--http-port=8081`,],
// };
// retCommandLine = await commandLine(infCommandLine); console.log(retCommandLine);

let e = currentFile(new Error()), ee = e; let libs = { 'child_process': {}, };
async function commandLine(inf = {}) {
    let ret = { 'ret': false, }; e = inf.e || e;
    try {
        /* IMPORTAR BIBLIOTECA [NODE] */ if (libs['child_process']) { libs['child_process']['exec'] = 1; libs['child_process']['execFile'] = 1; libs = await importLibs(libs, 'commandLine'); }

        let { command, args = [], awaitFinish, notAdm, notBackground, view, delay = 0, terminalPath, withCmd = false, notReplaceVars, newMode, } = inf;

        if (!command) { ret['msg'] = `COMMAND LINE: ERRO | INFORMAR O 'command'`; return ret; } if (newMode) { notBackground = true; if (view === undefined) { view = true; } }

        if (!notBackground) {
            // PARAMETROS
            let ps = []; if (!view) { ps.push(`/NOCONSOLE`); } if (notAdm) { ps.push(`/NONELEVATED`); } else { ps.push(`/RUNAS`); } if (delay) { ps.push(`/DELAY=${delay}`); } if (awaitFinish) { ps.push(`/WAIT`); }
            if (terminalPath) { let ter = terminalPath; if (!ter.startsWith(`"`) || !ter.endsWith(`"`)) { ter = `"${ter}"`; } ter = ter.replace(/\//g, `\\`); ps.push(`/D=${ter}`); }

            // EXECUTAR COM CMD (EM CASOS ESPECÍFICOS)
            let includesDoubleQuotes = false; if (command.includes(`.vbs`) || command.includes(`.bat`) || command.includes(`.lnk`)) { includesDoubleQuotes = true; withCmd = true; }

            // ADICIONAR ASPAS EM VOLTA (EM CASOS ESPECÍFICOS)
            if (!withCmd || includesDoubleQuotes) { command = `"${command}"`; }

            // COMANDO FINAL
            command = `"%3_BACKGROUND%"${ps.length > 0 ? ' ' + ps.join(' ') : ''} ${withCmd ? `"cmd.exe /c ${command}"` : `${command}`}`;
        }

        // SUBSTITUIR VARIÁVEIS DE AMBIENTE (SE NÃO FOR TRUE)
        if (!notReplaceVars) {
            command = replaceVars({ 'content': command, });
        }

        if (!newMode) {
            await new Promise((resolve) => {
                let child = _exec(command, (error, stdout, stderr) => {
                    if (error) {
                        ret['msg'] = `COMMAND LINE: ERRO | ${error}`;
                        if (stderr) { ret['res'] = stderr; }
                    } else {
                        ret['msg'] = 'COMMAND LINE: OK';
                        if (stdout) { ret['res'] = stdout; }
                        ret['ret'] = true;
                    }
                    resolve();
                });
                child.stdout.on('data', () => { }); child.stderr.on('data', () => { });
            });
        } else {
            await new Promise((resolve) => {
                _execFile(command, args, { 'windowsHide': !view, 'shell': withCmd, }, (error, stdout, stderr) => {
                    if (error) {
                        ret['msg'] = `COMMAND LINE: ERRO | ${error}`;
                        if (stderr) { ret['res'] = stderr; }
                    } else {
                        ret['msg'] = 'COMMAND LINE: OK';
                        if (stdout) { ret['res'] = stdout; }
                        ret['ret'] = true;
                    }
                    resolve();
                });
            });
        }

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['commandLine'] = commandLine;


