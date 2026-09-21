// abilities.js - Gestione abilità pulito senza campo di ricerca livello

const databaseAbilita = [
    // --- ABILITÀ DEL BARBARO ---
    { nome: "Furia", tipo: "Barbaro", categoria: "classe", livello: [1], descrizione: "Entra in una furia feroce: ottieni resistenza ai danni taglienti, contundenti e penetranti, vantaggio alle prove di Forza e bonus ai danni in mischia." },
    { nome: "Difesa Senza Armatura", tipo: "Barbaro", categoria: "classe", livello: [1], descrizione: "Quando non indossi armature, la tua CA è 10 + modificatore di Destrezza + modificatore di Costituzione (puoi usare uno scudo)." },
    { nome: "Attacco Irruento", tipo: "Barbaro", categoria: "classe", livello: [2], descrizione: "Ottieni vantaggio ai tiri per colpire in mischia basati su Forza nel tuo turno, ma i tiri contro di te hanno vantaggio." },
    { nome: "Pericolo Scampato", tipo: "Barbaro", categoria: "classe", livello: [2], descrizione: "Ottieni vantaggio ai tiri salvezza di Destrezza contro effetti che puoi vedere (se non sei accecato, stordito o assordato)." },
    { nome: "Cammino Primitivo", tipo: "Barbaro", categoria: "classe", livello: [3], descrizione: "Scegli una sottoclasse (es. Berserker o Totem Guerriero) che plasma la natura della tua furia." },
    { nome: "Incremento Caratteristica (Barbaro)", tipo: "Barbaro", categoria: "classe", livello: [4, 8, 12, 16, 19], descrizione: "Aumenta i punteggi di caratteristica o ottieni un talento (ai livelli 4, 8, 12, 16 e 19)." },
    { nome: "Attacco Extra", tipo: "Barbaro", categoria: "classe", livello: [5], descrizione: "Puoi attaccare due volte, anziché una, quando effettui l'azione di Attacco nel tuo turno." },
    { nome: "Movimento Veloce", tipo: "Barbaro", categoria: "classe", livello: [5], descrizione: "La tua velocità di movimento aumenta di 3 metri quando non indossi un'armatura pesante." },
    { nome: "Istinto Ferale", tipo: "Barbaro", categoria: "classe", livello: [7], descrizione: "Ottieni vantaggio ai tiri di Iniziativa e puoi agire nel primo turno anche se sorpreso, purché entri in furia." },
    { nome: "Critico Brutale", tipo: "Barbaro", categoria: "classe", livello: [9, 13, 17], descrizione: "Aggiungi dadi extra per i danni dell'arma quando metti a segno un colpo critico in mischia (da 1 a 3 dadi in base al livello)." },
    { nome: "Irremovibile", tipo: "Barbaro", categoria: "classe", livello: [11], descrizione: "Se scendi a 0 PF in furia puoi superare un TS di Costituzione per scendere a 1 PF anziché cadere privo di sensi." },
    { nome: "Furia Persistente", tipo: "Barbaro", categoria: "classe", livello: [15], descrizione: "La tua furia termina solo se cadi privo di sensi o se decidi tu stesso di interromperla." },
    { nome: "Potenza Vigorosa", tipo: "Barbaro", categoria: "classe", livello: [18], descrizione: "Se il totale di una tua prova di Forza è inferiore al tuo punteggio di Forza, puoi usare quel punteggio." },
    { nome: "Campione Primordiale", tipo: "Barbaro", categoria: "classe", livello: [20], descrizione: "I tuoi punteggi di Forza e Costituzione aumentano di 4 e il loro limite massimo passa da 20 a 24." },

    // --- ALTRE CLASSI E RAZZE D'ESEMPIO ---
    { nome: "Ispirazione Bardica", tipo: "Bardo", categoria: "classe", livello: [1], descrizione: "Ispira un alleato permettendogli di aggiungere un d6 a un tiro a sua scelta." },
    { nome: "Imposizione delle Mani", tipo: "Paladino", categoria: "classe", livello: [1], descrizione: "Riserva di potere curativo che guarisce ferite o rimuove malattie." },
    { nome: "Attacco Furtivo", tipo: "Ladro", categoria: "classe", livello: [1], descrizione: "Infliggi danni extra quando colpisci un nemico distratto o hai vantaggio." },
    { nome: "Palla di Fuoco", tipo: "Mago", categoria: "classe", livello: [5], descrizione: "Lancia una sfera infuocata che esplode nell'area bersaglio." },
    { nome: "Scurovisione", tipo: "Elfo", categoria: "razza", livello: [1], descrizione: "Puoi vedere nell'oscurità fioca come se fosse luce viva." },
    { nome: "Resistenza Nanica", tipo: "Nano", categoria: "razza", livello: [1], descrizione: "Vantaggio ai tiri salvezza contro il veleno e resistenza ai danni da veleno." },
    { nome: "Soffio di Ghiaccio", tipo: "Dragonide Bianco", categoria: "razza", livello: [1], descrizione: "Emetti un soffio congelante in un cono che infligge danni da freddo." }
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

    function renderizzaLista(filtroClasse = "", filtroRazza = "") {
        const fc = filtroClasse.toLowerCase().trim();
        const fr = filtroRazza.toLowerCase().trim();

        const elementiFiltrati = databaseAbilita.filter(item => {
            const tipoLower = item.tipo.toLowerCase();

            let matchTesto = true;
            if (fc !== "" && fr !== "") {
                matchTesto = tipoLower.includes(fc) || tipoLower.includes(fr);
            } else if (fc !== "") {
                matchTesto = tipoLower.includes(fc);
            } else if (fr !== "") {
                matchTesto = tipoLower.includes(fr);
            }

            return matchTesto;
        });

        const contenitoreRisultati = document.getElementById('risultati-ricerca-libera');
        if (!contenitoreRisultati) return;

        if (elementiFiltrati.length === 0) {
            contenitoreRisultati.innerHTML = `<p style="color: #aaa; text-align: center; padding: 20px;">Nessuna abilità trovata con questi criteri.</p>`;
            return;
        }

        contenitoreRisultati.innerHTML = elementiFiltrati.map(item => `
            <div style="margin-bottom: 15px; background: #2a2a2a; padding: 12px; border-radius: 5px; border-left: 4px solid #4da6ff;">
                <h3 style="margin: 0 0 5px 0;">
                    ${item.nome} 
                    <span style="font-size: 12px; color: #fff; background: #444; padding: 2px 6px; border-radius: 4px; margin-left: 5px;">${item.tipo}</span>
                    <span style="font-size: 12px; color: #fff; background: #555; padding: 2px 6px; border-radius: 4px; margin-left: 5px;">Liv. ${item.livello.join(', ')}</span>
                </h3>
                <p style="margin: 0;">${item.descrizione}</p>
            </div>
        `).join('');
    }

    // Qui il blocco HTML del modale ha SOLO Cerca Classe e Cerca Razza (il livello è sparito)
    modalAbilita.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; padding-bottom: 10px;">
            <h2>${isMaster ? "Database Globale Abilità" : "Cerca Abilità"}</h2>
            <button id="chiudi-abilita" style="background: #d9534f; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">Chiudi</button>
        </div>
        
        <div style="display: flex; gap: 15px; margin: 20px 0;">
            <div style="flex: 1;">
                <label style="display: block; margin-bottom: 5px; color: #4da6ff; font-weight: bold;">Cerca Classe:</label>
                <input type="text" id="ricerca-classe" placeholder="Es. Barbaro..." style="width: 100%; padding: 8px; font-size: 14px; border-radius: 5px; border: 1px solid #555; background: #333; color: white;">
            </div>
            <div style="flex: 1;">
                <label style="display: block; margin-bottom: 5px; color: #4da6ff; font-weight: bold;">Cerca Razza:</label>
                <input type="text" id="ricerca-razza" placeholder="Es. Dragonide Bianco..." style="width: 100%; padding: 8px; font-size: 14px; border-radius: 5px; border: 1px solid #555; background: #333; color: white;">
            </div>
        </div>

        <div id="risultati-ricerca-libera"></div>
    `;

    modalAbilita.style.display = 'block';

    document.getElementById('chiudi-abilita').onclick = () => {
        modalAbilita.style.display = 'none';
    };

    renderizzaLista();

    const inputClasse = document.getElementById('ricerca-classe');
    const inputRazza = document.getElementById('ricerca-razza');

    const triggerFiltro = () => {
        renderizzaLista(inputClasse.value, inputRazza.value);
    };

    inputClasse.oninput = triggerFiltro;
    inputRazza.oninput = triggerFiltro;
}
