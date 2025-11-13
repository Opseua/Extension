(function () {
    // 1. CHECAGEM DE DUPLICAÇÃO
    if (window.__DoubleCCopyActive) {
        return;
    }
    window.__DoubleCCopyActive = true;
    console.log('✅ FUNÇÃO DE CÓPIA RODANDO ✅');

    // --- CONFIGURAÇÕES E VARIÁVEIS ---
    let INTERVAL = 300;
    let KEY_CODE = 67; // C
    let lastTime = 0;

    // --- FUNÇÕES COMPACTADAS ---
    let isEdit = (el) => {
        let tag = el.tagName.toLowerCase();
        return tag === 'input' || tag === 'textarea' || el.isContentEditable;
    };

    let getSelText = () => (window.getSelection ? window.getSelection().toString() : '').trim();

    let fallbackCopy = (text) => {
        let ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
        } catch (e) {
            console.error('Falha na cópia.');
        } finally {
            document.body.removeChild(ta);
        }
    };

    let doCopy = (text) => {
        if (!text) { return; } // Se não houver texto, apenas retorna

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .catch(() => fallbackCopy(text));
        } else {
            fallbackCopy(text);
        }
    };

    // --- MANIPULADORES DE EVENTOS ---

    document.addEventListener('keydown', (e) => {
        if (isEdit(e.target)) { return; }

        if (e.keyCode === KEY_CODE &&
            !(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey)) {
            e.preventDefault();
        }
    });

    document.addEventListener('keyup', (e) => {

        if (e.keyCode === KEY_CODE) {
            // Se for atalho ou campo editável, ignore
            if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey || isEdit(e.target)) {
                return;
            }

            let currentTime = new Date().getTime();
            let timeDiff = currentTime - lastTime;
            let text = getSelText();

            if (timeDiff < INTERVAL && timeDiff > 0) {
                // DUPLO TOQUE
                if (text) {
                    doCopy(text);
                }
                lastTime = 0; // Reseta
            } else {
                // PRIMEIRO TOQUE
                lastTime = currentTime;
            }
        }
    });

})();