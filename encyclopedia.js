// encyclopedia.js - Gestisce l'Enciclopedia del mondo con ricerca istantanea (sezioni vuote pronte per la lore)

export function apriSchermataEnciclopedia() {
    let modalEnciclopedia = document.getElementById('modal-enciclopedia');
    
    if (!modalEnciclopedia) {
        modalEnciclopedia = document.createElement('div');
        modalEnciclopedia.id = 'modal-enciclopedia';
        modalEnciclopedia.style.cssText = `
            position: fixed; top: 10%; left: 10%; width: 80%; height: 80%;
            background: #222; color: #fff; padding: 20px; border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.8); z-index: 1000; overflow-y: auto;
            font-family: sans-serif;
        `;

        modalEnciclopedia.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; padding-bottom: 10px;">
                <h2>Enciclopedia del Mondo</h2>
                <button id="chiudi-enciclopedia" style="background: #d9534f; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">Chiudi</button>
            </div>
            
            <!-- Barra di ricerca stile Ctrl+F -->
            <div style="margin: 15px 0;">
                <input type="text" id="input-ricerca-enciclopedia" placeholder="Cerca nell'enciclopedia (es. storia, divinità, regni...)" style="width: 100%; padding: 10px; font-size: 16px; border-radius: 5px; border: 1px solid #555; background: #333; color: white;">
            </div>

            <!-- Contenitore delle voci dell'enciclopedia (pronte per essere riempite) -->
            <div id="contenitore-testo-enciclopedia">
                <div class="enciclopedia-item" style="margin-bottom: 20px; border-bottom: 1px solid #444; padding-bottom: 10px;">
                    <h3>Storia del Mondo</h3>
                    <p style="color: #aaa; font-style: italic;">[Inserisci qui la cronistoria, le ere passate o gli eventi catastrofici del tuo mondo]</p>
                </div>
                
                <div class="enciclopedia-item" style="margin-bottom: 20px; border-bottom: 1px solid #444; padding-bottom: 10px;">
                    <h3>Divinità e Pantheon</h3>
                    <p style="color: #aaa; font-style: italic;">[Inserisci qui i nomi degli dei, i loro domini e i precetti dei fedeli]</p>
                </div>

                <div class="enciclopedia-item" style="margin-bottom: 20px; border-bottom: 1px solid #444; padding-bottom: 10px;">
                    <h3>Geografia e Regni</h3>
                    <p style="color: #aaa; font-style: italic;">[Inserisci qui le descrizioni delle nazioni, delle città principali o delle terre sconosciute]</p>
                </div>

                <div class="enciclopedia-item" style="margin-bottom: 20px; border-bottom: 1px solid #444; padding-bottom: 10px;">
                    <h3>Fazioni e Gilde</h3>
                    <p style="color: #aaa; font-style: italic;">[Inserisci qui ordini cavallereschi, organizzazioni segrete o gilde di assassini]</p>
                </div>
            </div>
        `;

        document.body.appendChild(modalEnciclopedia);

        // Evento per chiudere la schermata
        document.getElementById('chiudi-enciclopedia').addEventListener('click', () => {
            modalEnciclopedia.style.display = 'none';
        });

        // Evento per la ricerca in tempo reale (stile Ctrl+F)
        const inputRicerca = document.getElementById('input-ricerca-enciclopedia');
        inputRicerca.addEventListener('input', (e) => {
            const testoCercato = e.target.value.toLowerCase();
            const elementiVoce = document.querySelectorAll('.enciclopedia-item');

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
        modalEnciclopedia.style.display = 'block';
    }
}
