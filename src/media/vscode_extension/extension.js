let vscode = require('vscode');

function activate(context) {

    let cmd = vscode.commands.registerCommand('vscode_extension.trocarAspas', async () => {

        let editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        let sel = editor.selection;
        if (sel.isEmpty) {
            vscode.window.showInformationMessage('Selecione o objeto que quer converter para JSON.');
            return;
        }

        let doc = editor.document;
        let texto = doc.getText(sel);

        // 1) remove ponto-e-vírgula final e espaços
        let t = texto.replace(/;\s*$/, '').trim();

        // 2) remove vírgulas finais antes de } ou ]
        //    ex: { "a":1, }  -> { "a":1 }
        t = t.replace(/,(\s*[}\]])/g, '$1');

        // 3) troca aspas simples por duplas (simples, mas eficaz na maioria dos casos)
        t = t.replace(/'([^']*)'/g, (_, inner) => {
            // escapa possíveis aspas duplas internas no conteúdo
            let safe = inner.replace(/"/g, '\\"');
            return '"' + safe + '"';
        });

        // 4) tenta parse estrito JSON
        try {
            let obj = JSON.parse(t);
            let pretty = JSON.stringify(obj, null, 4);

            await editor.edit(edit => {
                edit.replace(sel, pretty);
            });

            return;
        } catch (err) {
            // continuar para fallback
        }

        // 5) fallback opcional: avaliar como JS (perigoso)
        let escolha = await vscode.window.showWarningMessage(
            'Não foi possível converter estritamente para JSON. Deseja tentar avaliar o trecho como JavaScript (pode executar código)?',
            'Não', 'Sim - avaliar'
        );

        if (escolha !== 'Sim - avaliar') {
            vscode.window.showErrorMessage('Conversão cancelada. Corrija o objeto ou selecione apenas o literal JSON.');
            return;
        }

        // tenta avaliar como JS literal (pode executar código — usado sob sua responsabilidade)
        try {
            // envolver em parênteses para garantir avaliação de objeto literal
            let fn = new Function('return (' + t + ');');
            let obj = fn();

            // se chegou aqui, converte para JSON
            let pretty = JSON.stringify(obj, null, 4);

            await editor.edit(edit => {
                edit.replace(sel, pretty);
            });

        } catch (err) {
            vscode.window.showErrorMessage('Ainda não foi possível converter o trecho selecionado: ' + String(err.message));
        }

    });

    context.subscriptions.push(cmd);
}

module.exports = { activate, };
