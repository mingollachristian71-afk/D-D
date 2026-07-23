// abilities.js - Gestisce la schermata delle abilità con due barre di ricerca separate (Classe e Razza) per tutti

const databaseAbilita = [
    { nome: "Scatto Furioso", tipo: "Barbaro", categoria: "classe", descrizione: "Entra in un furore animalesco ottenendo vantaggio ai tiri di Forza." },
    { nome: "Ispirazione Bardica", tipo: "Bardo", categoria: "classe", descrizione: "Ispira un alleato permettendogli di aggiungere un d6 a un tiro a sua scelta." },
    { nome: "Imposizione delle Mani", tipo: "Paladino", categoria: "classe", descrizione: "Riserva di potere curativo che guarisce ferite o rimuove malattie." },
    { nome: "Attacco Furtivo", tipo: "Ladro", categoria: "classe", descrizione: "Infliggi danni extra quando colpisci un nemico distratto o hai vantaggio." },
    { nome: "Palla di Fuoco", tipo: "Mago", categoria: "classe", descrizione: "Lancia una sfera infuocata che esplode nell'area bersaglio." },
    { nome: "Scurovisione", tipo: "Elfo", categoria: "razza", descrizione: "Puoi vedere nell'oscurità fioca come se fosse luce viva." },
    { nome: "Resistenza Nanica", tipo: "Nano", categoria: "razza", descrizione: "Vantaggio ai tiri salvezza contro il veleno e resistenza ai danni da veleno." },
    { nome: "Soffio di Ghiaccio", tipo: "Dragonide Bianco", categoria: "razza", descrizione: "Emetti un soffio congelante in un cono che infligge danni da freddo." }
];

export function apriSchermataAbilita(isMaster) {
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

    // Struttura comune con le due barre di ricerca per Classe e Razza
    let contenutoHTML = `
        <div style="display: flex; gap: 20px; margin-bottom: 20px;">
            <div style="flex: 1;">
                <label style="display: block; margin-bottom: 5px; color: #4da6ff; font-weight: bold;">Cerca Classe:</label>
                <input type="text" id="ricerca-classe" placeholder="Es. Paladino..." style="width: 100%; padding: 8px; font-size: 14px; border-radius: 5px; border: 1px solid #555; background: #333; color: white;">
            </div>
            <div style="flex: 1;">
                <label style="display: block; margin-bottom: 5px; color: #4da6ff; font-weight: bold;">Cerca Razza:</label>
                <input type="text" id="ricerca-razza" placeholder="Es. Dragonide Bianco..." style="width: 100%; padding: 8px; font-size: 14px; border-radius: 5px; border: 1px solid #555; background: #333; color: white;">
            </div>
        </div>

        <div id="risultati-ricerca-libera">
            ${databaseAbilita.map(item => `
                <div class="abilita-filtro-item" data-tipo="${item.tipo.toLowerCase()}" style="margin-bottom: 15px; background: #2a2a2a; padding: 12px; border-radius: 5px; border-left: 4px solid #4da6ff;">
                    <h3 style="margin: 0 0 5px 0;">${item.nome} <span style="font-size: 12px; color: #fff; background: #444; padding: 2px 6px; border-radius: 4px;">${item.tipo}</span></h3>
                    <p style="margin: 0;">${item.descrizione}</p>
                </div>
            `).join('')}
        </div>
    `;

    modalAbilita.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; padding-bottom: 10px;">
            <h2>${isMaster ? "Database Globale Abilità (Filtri Classe/Razza)" : "Cerca Abilità per Classe e Razza"}</h2>
            <button id="chiudi-abilita" style="background: #d9534f; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">Chiudi</button>
        </div>
        <div style="margin-top: 15px;">
            ${contenutoHTML}
        </div>
    `;

    modalAbilita.style.display = 'block';

    // Chiusura modale
    document.getElementById('chiudi-abilita').addEventListener('click', () => {
        modalAbilita.style.display = 'none';
    });

    // Filtro combinato per le due barre (attivo per chiunque apra la schermata)
    const inputClasse = document.getElementById('ricerca-classe');
    const inputRazza = document.getElementById('ricerca-razza');

    function aggiornaFiltriAbilita() {
        const testoClasse = inputClasse.value.toLowerCase().trim();
        const testoRazza = inputRazza.value.toLowerCase().trim();
        const elementi = document.querySelectorAll('.abilita-filtro-item');

        elementi.forEach(item => {
            const tipoItem = item.getAttribute('data-tipo');

            // Se entrambe le barre sono vuote, mostra tutto
            if (testoClasse === "" && testoRazza === "") {
                item.style.display = 'block';
                return;
            }

            let mostra = false;
            if (testoClasse !== "" && tipoItem.includes(testoClasse)) mostra = true;
            if (testoRazza !== "" && tipoItem.includes(testoRazza)) mostra = true;

            item.style.display = mostra ? 'block' : 'none';
        });
    }

    if (inputClasse && inputRazza) {
        inputClasse.addEventListener('input', aggiornaFiltriAbilita);
        inputRazza.addEventListener('input', aggiornaFiltriAbilita);
    }
}
