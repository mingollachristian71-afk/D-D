// rules.js - Gestisce la schermata delle regole e la ricerca in tempo reale

export function apriSchermataRegole() {
    // 1. Controlla se la schermata esiste già, altrimenti la crea al volo
    let modalRegole = document.getElementById('modal-regole');
    
    if (!modalRegole) {
        modalRegole = document.createElement('div');
        modalRegole.id = 'modal-regole';
        modalRegole.style.cssText = `
            position: fixed; top: 10%; left: 10%; width: 80%; height: 80%;
            background: #222; color: #fff; padding: 20px; border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.8); z-index: 1000; overflow-y: auto;
            font-family: sans-serif;
        `;

        modalRegole.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; padding-bottom: 10px;">
                <h2>Manuale delle Regole</h2>
                <button id="chiudi-regole" style="background: #d9534f; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">Chiudi</button>
            </div>
            
            <!-- Barra di ricerca stile Ctrl+F -->
            <div style="margin: 15px 0;">
                <input type="text" id="input-ricerca-regole" placeholder="Cerca regola (es. punti ferita, combattimento...)" style="width: 100%; padding: 10px; font-size: 16px; border-radius: 5px; border: 1px solid #555; background: #333; color: white;">
            </div>

            <!-- Contenuto delle regole -->
            <div id="contenitore-testo-regole">
                <div class="regola-item" style="margin-bottom: 15px;">
                    <h3>Punti Ferita (HP)</h3>
                    <p>I punti ferita misurano la salute del tuo eroe. Quando subisci danni, i tuoi HP diminuiscono. Se arrivano a 0, il personaggio cade inconscio.</p>
                </div>
                <div class="regola-item" style="margin-bottom: 15px;">
                    <h3>Modificatori delle Caratteristiche</h3>
                    <p>Ogni caratteristica ha un modificatore calcolato sottraendo 10 dal punteggio e dividendo per 2 (arrotondato per difetto). Esempio: 14 dà un modificatore di +2.</p>
                </div>
                <div class="regola-item" style="margin-bottom: 15px;">
                    <h3>Combattimento e Turni</h3>
                    <p>Il combattimento si svolge a round. Si tira l'iniziativa per determinare l'ordine di turno. Nel proprio turno ci si può muovere e compiere un'azione.</p>
                </div>
            </div>
        `;

        document.body.appendChild(modalRegole);

        // Evento per chiudere la schermata
        document.getElementById('chiudi-regole').addEventListener('click', () => {
            modalRegole.style.display = 'none';
        });

        // Evento per la ricerca in tempo reale (stile Ctrl+F)
        const inputRicerca = document.getElementById('input-ricerca-regole');
        inputRicerca.addEventListener('input', (e) => {
            const testoCercato = e.target.value.toLowerCase();
            const elementiRegole = document.querySelectorAll('.regola-item');

            elementiRegole.forEach(item => {
                const testoRegola = item.textContent.toLowerCase();
                if (testoRegola.includes(testoCercato)) {
                    item.style.display = 'block'; // Mostra se corrisponde
                } else {
                    item.style.display = 'none';  // Nasconde se non corrisponde
                }
            });
        });
    } else {
        // Se esiste già, la rimostriamo semplicemente
        modalRegole.style.display = 'block';
    }
}
