// abilities.js - Gestisce la schermata delle abilità filtrate per classe/razza o visibili interamente dal Master

// Database di esempio con le abilità (puoi arricchirlo con tutte quelle che vuoi)
const databaseAbilita = [
    { nome: "Scatto Furioso", tipo: "Barbaro", descrizione: "Entra in un furore animalesco ottenendo vantaggio ai tiri di Forza." },
    { nome: "Ispirazione Bardica", tipo: "Bardo", descrizione: "Ispira un alleato permettendogli di aggiungere un d6 a un tiro a sua scelta." },
    { nome: "Imposizione delle Mani", tipo: "Paladino", descrizione: "Riserva di potere curativo che guarisce ferite o rimuove malattie." },
    { nome: "Attacco Furtivo", tipo: "Ladro", descrizione: "Infliggi danni extra quando colpisci un nemico distratto o hai vantaggio." },
    { nome: "Palla di Fuoco", tipo: "Mago", description: "Lancia una sfera infuocata che esplode nell'area bersaglio." },
    { nome: "Scurovisione", tipo: "Elfo", descrizione: "Puoi vedere nell'oscurità fioca come se fosse luce viva." },
    { nome: "Resistenza Nanica", tipo: "Nano", descrizione: "Vantaggio ai tiri salvezza contro il veleno e resistenza ai danni da veleno." }
];

export function apriSchermataAbilita(isMaster, classeEroe, razzaEroe) {
    let modalAbilita = document.getElementById('modal-abilita');
    
    if (!modalAbilita) {
        modalAbilita = document.createElement('div');
        modalAbilita.id = 'modal-abilita';
        modalAbilita.style.cssText = `
            position: fixed; top: 10%; left: 10%; width: 80%; height: 80%;
            background: #222; color: #fff; padding: 20px; border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.8); z-index: 1000; overflow-y: auto;
            font-family: sans-serif;
        `;
        document.body.appendChild(modalAbilita);
    }

    // Se è il Master, mostriamo la barra di ricerca in alto
    let htmlBarraRicerca = "";
    if (isMaster) {
        htmlBarraRicerca = `
            <div style="margin: 15px 0;">
                <input type="text" id="input-ricerca-abilita" placeholder="Cerca abilità (es. Mago, Furia...)" style="width: 100%; padding: 10px; font-size: 16px; border-radius: 5px; border: 1px solid #555; background: #333; color: white;">
            </div>
        `;
    } else {
        htmlBarraRicerca = `<p style="color: #aaa;">Abilità sbloccate per la tua classe (${classeEroe || "Nessuna"}) e razza (${razzaEroe || "Nessuna"}):</p>`;
    }

    // Filtriamo le abilità in base a chi le sta guardando
    let abilitàDaMostrare = [];
    if (isMaster) {
        abilitàDaMostrare = databaseAbilita; // Il Master vede tutto
    } else {
        // L'eroe vede solo quelle che corrispondono alla sua classe o alla sua razza
        abilitàDaMostrare = databaseAbilita.filter(item => 
            item.tipo.toLowerCase() === (classeEroe || "").toLowerCase() || 
            item.tipo.toLowerCase() === (razzaEroe || "").toLowerCase()
        );
    }

    let htmlListaAbilita = "";
    if (abilitàDaMostrare.length === 0) {
        htmlListaAbilita = `<p>Nessuna abilità trovata per questo profilo.</p>`;
    } else {
        htmlListaAbilita = abilitàDaMostrare.map(item => `
            <div class="abilita-item" style="margin-bottom: 15px; border-bottom: 1px solid #444; padding-bottom: 10px;">
                <h3>${item.nome} <span style="font-size: 12px; color: #aaa; background: #444; padding: 2px 6px; border-radius: 4px;">${item.tipo}</span></h3>
                <p>${item.descrizione}</p>
            </div>
        `).join('');
    }

    modalAbilita.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; padding-bottom: 10px;">
            <h2>${isMaster ? "Database Globale Abilità" : "Le Tue Abilità"}</h2>
            <button id="chiudi-abilita" style="background: #d9534f; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">Chiudi</button>
        </div>
        
        ${htmlBarraRicerca}

        <div id="contenitore-lista-abilita">
            ${htmlListaAbilita}
        </div>
    `;

    modalAbilita.style.display = 'block';

    // Evento per chiudere la schermata
    document.getElementById('chiudi-abilita').addEventListener('click', () => {
        modalAbilita.style.display = 'none';
    });

    // Se è il Master, attiviamo la ricerca in tempo reale
    if (isMaster) {
        const inputRicerca = document.getElementById('input-ricerca-abilita');
        inputRicerca.addEventListener('input', (e) => {
            const testoCercato = e.target.value.toLowerCase();
            const elementiAbilita = document.querySelectorAll('.abilita-item');

            elementiAbilita.forEach(item => {
                const testoItem = item.textContent.toLowerCase();
                if (testoItem.includes(testoCercato)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}
