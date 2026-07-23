// oggetti-master.js - Gestisce l'elenco completo degli oggetti, costi e specifiche per il Master

export function apriSchermataOggettiMaster() {
    let modalOggetti = document.getElementById('modal-oggetti-master');
    
    if (!modalOggetti) {
        modalOggetti = document.createElement('div');
        modalOggetti.id = 'modal-oggetti-master';
        modalOggetti.style.cssText = `
            position: fixed; top: 10%; left: 10%; width: 80%; height: 80%;
            background: #222; color: #fff; padding: 20px; border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.8); z-index: 1000; overflow-y: auto;
            font-family: sans-serif;
        `;

        modalOggetti.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; padding-bottom: 10px;">
                <h2>Catalogo Oggetti (Solo Master)</h2>
                <button id="chiudi-oggetti-master" style="background: #d9534f; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">Chiudi</button>
            </div>
            
            <!-- Barra di ricerca -->
            <div style="margin: 15px 0;">
                <input type="text" id="input-ricerca-oggetti" placeholder="Cerca un oggetto (es. Pozione, Spada, Elmo...)" style="width: 100%; padding: 10px; font-size: 16px; border-radius: 5px; border: 1px solid #555; background: #333; color: white;">
            </div>

            <!-- Contenitore delle voci -->
            <div id="contenitore-oggetti-master">
                
                <!-- Esempio Oggetto 1 -->
                <div class="oggetto-item" style="margin-bottom: 25px; border-bottom: 1px solid #444; padding-bottom: 15px;">
                    <h3 style="color: #ff9900; margin-bottom: 5px;">Pozione di Guarigione Maggiore</h3>
                    <p style="color: #ccc; font-size: 14px;"><b>Come si ottiene:</b> Acquistabile nei empori cittadini o trovata nei forzigli dei dungeon.</p>
                    <p style="margin: 5px 0;"><b>Costo:</b> 50 Oro | <b>Specifiche:</b> Ripristina 4d4 + 4 Punti Vita all'istante.</p>
                </div>

                <!-- Esempio Oggetto 2 (Pronto da compilare) -->
                <div class="oggetto-item" style="margin-bottom: 25px; border-bottom: 1px solid #444; padding-bottom: 15px;">
                    <h3 style="color: #ff9900; margin-bottom: 5px;">[Nome Oggetto]</h3>
                    <p style="color: #ccc; font-size: 14px;"><b>Come si ottiene:</b> [Es. Bottino di un boss / Negozio]</p>
                    <p style="margin: 5px 0;"><b>Costo:</b> [Es. 100 Oro] | <b>Specifiche / Effetti:</b> [Es. Aumenta la Forza di +1 o dà bonus ai tiri]</p>
                </div>

            </div>
        `;

        document.body.appendChild(modalOggetti);

        // Chiusura
        document.getElementById('chiudi-oggetti-master').addEventListener('click', () => {
            modalOggetti.style.display = 'none';
        });

        // Ricerca in tempo reale
        const inputRicerca = document.getElementById('input-ricerca-oggetti');
        inputRicerca.addEventListener('input', (e) => {
            const testoCercato = e.target.value.toLowerCase();
            const elementiVoce = document.querySelectorAll('.oggetto-item');

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
        modalOggetti.style.display = 'block';
    }
}
