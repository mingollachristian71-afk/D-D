// bestiario.js - Gestisce il Bestiario dei mostri con statistiche e ricerca

export function apriSchermataBestiario() {
    let modalBestiario = document.getElementById('modal-bestiario');
    
    if (!modalBestiario) {
        modalBestiario = document.createElement('div');
        modalBestiario.id = 'modal-bestiario';
        modalBestiario.style.cssText = `
            position: fixed; top: 10%; left: 10%; width: 80%; height: 80%;
            background: #222; color: #fff; padding: 20px; border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.8); z-index: 1000; overflow-y: auto;
            font-family: sans-serif;
        `;

        modalBestiario.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; padding-bottom: 10px;">
                <h2>Bestiario delle Creature</h2>
                <button id="chiudi-bestiario" style="background: #d9534f; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">Chiudi</button>
            </div>
            
            <!-- Barra di ricerca -->
            <div style="margin: 15px 0;">
                <input type="text" id="input-ricerca-bestiario" placeholder="Cerca una bestia (es. Goblin, Drago, Orco...)" style="width: 100%; padding: 10px; font-size: 16px; border-radius: 5px; border: 1px solid #555; background: #333; color: white;">
            </div>

            <!-- Contenitore delle voci del bestiario -->
            <div id="contenitore-testo-bestiario">
                
                <!-- Esempio di creatura 1 -->
                <div class="bestiario-item" style="margin-bottom: 25px; border-bottom: 1px solid #444; padding-bottom: 15px;">
                    <h3 style="color: #ff9900; margin-bottom: 5px;">Goblin Scavatore</h3>
                    <p style="color: #ccc; font-size: 14px;"><b>Chi è e cosa fa:</b> Piccole creature umanoidi e cobolidi che infestano le caverne oscure. Vivono in predoneria e tendono agguati ai viandanti solitari rubando qualsiasi oggetto di valore.</p>
                    <p style="margin: 5px 0;"><b>Vita (HP):</b> 15 | <b>Classe Armatura (CA):</b> 13</p>
                    <p style="margin: 5px 0;"><b>Abilità / Tratti:</b> <i>Furtività Rapida</i> - Ottiene vantaggio nei tiri per nascondersi nell'ombra.</p>
                    <p style="margin: 5px 0;"><b>Dadi di Danno:</b> Pugnale arrugginito: 1d4 + 2 danni perforanti.</p>
                </div>

                <!-- Esempio di creatura 2 (Pronta da compilare) -->
                <div class="bestiario-item" style="margin-bottom: 25px; border-bottom: 1px solid #444; padding-bottom: 15px;">
                    <h3 style="color: #ff9900; margin-bottom: 5px;">[Nome della Bestia]</h3>
                    <p style="color: #ccc; font-size: 14px;"><b>Chi è e cosa fa:</b> [Racconto della creatura, origine e comportamento]</p>
                    <p style="margin: 5px 0;"><b>Vita (HP):</b> [Es. 45] | <b>Classe Armatura (CA):</b> [Es. 15]</p>
                    <p style="margin: 5px 0;"><b>Abilità / Tratti:</b> [Descrizione delle abilità speciali]</p>
                    <p style="margin: 5px 0;"><b>Dadi di Danno:</b> [Es. Artiglio: 2d6 + 3 danni taglienti]</p>
                </div>

            </div>
        `;

        document.body.appendChild(modalBestiario);

        // Evento per chiudere la schermata
        document.getElementById('chiudi-bestiario').addEventListener('click', () => {
            modalBestiario.style.display = 'none';
        });

        // Evento per la ricerca in tempo reale
        const inputRicerca = document.getElementById('input-ricerca-bestiario');
        inputRicerca.addEventListener('input', (e) => {
            const testoCercato = e.target.value.toLowerCase();
            const elementiVoce = document.querySelectorAll('.bestiario-item');

            elementiVoce.forEach(item => {
                const testoVoce = item.textContent.toLowerCase();
                if (testoVoce.includes(testoCercato)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    } else {
        modalBestiario.style.display = 'block';
    }
}
