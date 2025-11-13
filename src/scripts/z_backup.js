/* eslint-disable camelcase */

// let retBackup = await z_backup({ e, 'mode': `HIDEaaa`, }); console.log(retBackup);
// CMD → node %fileChrome_Extension%/src/scripts/z_backup.js HIDEaaa

let e, ee, pars; if (process?.argv?.[1]?.includes('backup.js')) { globalThis['firstFileCall'] = new Error(); await import('../resources/@export.js'); e = firstFileCall, ee = e; pars = process.argv; await z_backup(); }

async function z_backup(inf = {}) {
    let ret = { 'ret': false, }; e = inf.e || e;
    let err, show = true, m = `!fileChrome_Extension!/src/scripts/BAT/fileMsg.vbs`; if ((pars?.[2] || '').toLowerCase() === 'hide' || (inf?.mode || '').toLowerCase() === 'hide') { show = false; }
    try {
        let n = `%nircmd%`, s = `sendkeypress lwin`, w = `wait 1500`, retDateHour = dateHour().res; retDateHour = `MES ${retDateHour.mon} - DIA ${retDateHour.day} - HORA ${retDateHour.hou}.${retDateHour.min}`;
        let backupDestination = `${fileProjetos}/z_OUTROS/BACKUPS_${gW.devMaster}/${retDateHour}`, c, p = backupDestination;

        function getBackupPaths(base, includes, excludes) {
            let ps = [], normBase = _path.normalize(base); for (let pat of includes) {
                let dir = pat.replace(/\/\*\*?$/, '').replace(/^\//, ''), full = fJoin(normBase, dir); if (!_fs.existsSync(full)) { continue; } ps.push(full);
                if (pat.includes('/**')) { ps.push(...getRecursivePaths(full)); } else if (pat.includes('/*') && _fs.statSync(full).isDirectory()) { _fs.readdirSync(full).forEach(f => ps.push(fJoin(full, f))); }
            } ps = [...new Set(ps),]; return ps.filter(p => !shouldExclude(p, excludes, normBase)).sort();
        } function getRecursivePaths(dir) {
            let all = []; for (let i of _fs.readdirSync(dir)) { let fp = fJoin(dir, i); all.push(fp); if (_fs.existsSync(fp) && _fs.statSync(fp).isDirectory()) { all.push(...getRecursivePaths(fp)); } } return all;
        } function shouldExclude(fp, patterns, base) {
            let rel = _path.relative(base, fp).toLowerCase(), name = _path.basename(fp).toLowerCase(), full = fp.toLowerCase(); for (let pat of patterns) {
                let clean = pat.replace(/^!/, '').replace(/^[\/\\]/, '').toLowerCase();
                if (clean.includes('*')) { let regexOk = new RegExp('^' + clean.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$', 'i'); if (regexOk.test(name) || regexOk.test(rel)) { return true; } }
                else if ([rel, name, full,].some(v => v.endsWith(clean) || v === clean)) { return true; }
            } return false;
        } function copyFile(src, dest) { let dir = fDirname(dest); if (!_fs.existsSync(dir)) { _fs.mkdirSync(dir, { 'recursive': true, }); } _fs.copyFileSync(src, dest); }

        async function executeBackup({ backupPath, backupName, patternsIncludes, patternsExcludes, backupDestination, }) {
            let txt = '', result = getBackupPaths(backupPath, patternsIncludes, patternsExcludes), destRoot = fJoin(backupDestination, backupName); for (let src of result) {
                let rel = _path.relative(backupPath, src), dest = fJoin(destRoot, rel); if (_fs.statSync(src).isDirectory()) { if (!_fs.existsSync(dest)) { _fs.mkdirSync(dest, { 'recursive': true, }); } }
                else { copyFile(src, dest); let ok = src.split('\\').reverse()[0]; ok = `${src.replace(`\\${ok}`, '')}`; if (!txt.includes(ok)) { txt = `${txt}${ok}`; console.log(`OK: [${backupName}] → ${ok}`); } }
            } return result;
        }

        let rules = {
            'backupDestination': `${backupDestination}`,
            'backups': [
                {
                    'backupName': 'PROJETOS', 'backupPath': `${fileProjetos}`,
                    'patternsIncludes': [
                        '/Chat_Python/*', '/Chat_Python/src/**', '/Chat_Python/logs/chats.json', '/Chat_Python/logs/session.session', '/Chrome_Extension/*', '/Chrome_Extension/src/**',
                        '/Sniffer_Python/*', '/Sniffer_Python/src/**', '/URA_Reversa/*', '/URA_Reversa/src/**', '/WebScraper/*', '/WebScraper/src/**', '/WebSocket/*', '/WebSocket/src/**',
                    ],
                    'patternsExcludes': [
                        '!*desktop.ini', '!/.git', '!/logs', '!/*node_modules', '!*teste*.*', '!*__pycache__*', '!*har_and_cookies*', '!*teste*',
                    ],
                },
                {
                    'backupName': 'WINDOWS', 'backupPath': `${fileWindows}`,
                    'patternsIncludes': [
                        '/BAT/RECORRENTES/**', '/BAT/RUN_PORTABLE/*', '/BAT/clearTemp.bat', '/BAT/firewallAllowBlockDelete.ps1', '/PORTABLE_z_SetPath/**',
                    ],
                    'patternsExcludes': [
                        '!*desktop.ini', '!/*.exe',
                    ],
                },
                {
                    'backupName': 'MENU_INICIAR', 'backupPath': `C:/Users/${process.env.USERNAME}/AppData/Roaming/Microsoft/Windows/Start Menu/Programs`,
                    'patternsIncludes': [
                        '/**',
                    ],
                    'patternsExcludes': [
                        '!*desktop.ini',
                    ],
                },
            ],
        };

        // FAZER BACKUPS | ABRIR MENU INICIAR → TIRAR PRINT → FECHAR MENU INICIAR
        for (let bkp of rules.backups) { await executeBackup({ ...bkp, 'backupDestination': rules.backupDestination, }); }
        await commandLine({ e, 'awaitFinish': true, 'command': `${show ? `${n} ${s} & ${n} ${w} & ` : ''}${n} savescreenshot "${p}/screenshot.png"${show ? ` & ${n} ${s}` : ''}`, 'withCmd': true, });

        // ZIPAR PASTA
        await new Promise(r => { setTimeout(r, 500); }); console.log(`ZIPANDO...`); c = `!fileWindows!/PORTABLE_WinRAR/z_OUTROS/PORTABLE_7-Zip/App/7-Zip64/7z.exe`;
        c = await commandLine({ e, 'awaitFinish': true, 'command': `"${c}" a -tzip "${p}.zip" "${p}/*"`, });
        if (!c.ret) { err = `ERRO | AO ZIPAR`; ret['msg'] = `BACKUP: ${err}`; console.log(err); commandLine({ e, 'command': `"${m}" "${err}"`, }); } else if (!(await file({ e, 'action': 'del', 'path': p, })).ret) {
            err = `ERRO | AO APAGAR PASTA ANTIGA`; ret['msg'] = `BACKUP: ${err}`; console.log(err); if (show) { commandLine({ e, 'command': `"${m}" "${err}"`, }); }
        } else { p = p.split('/').pop(); p = `CONCLUIDO → '${p}.zip'`; console.log(p); if (show) { commandLine({ e, 'command': `"${m}" "${p}"`, }); } ret['res'] = p; ret['msg'] = `BACKUP: OK`; ret['ret'] = true; }

    } catch (catchErr) {
        err = `ERRO | AO FAZER BACKUPS`; console.log(err, '\n', catchErr); if (show) { commandLine({ e, 'command': `"${m}" "${err}"`, }); }
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['z_backup'] = z_backup;


