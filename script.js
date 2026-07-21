import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue, update, child } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyAZq5MjHGMUJm6r_zZWvToPl76vbwVVJnU",
  authDomain: "dnd-toolset-ac6d4.firebaseapp.com",
  databaseURL: "https://dnd-toolset-ac6d4-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dnd-toolset-ac6d4",
  storageBucket: "dnd-toolset-ac6d4.firebasestorage.app",
  messagingSenderId: "647425557017",
  appId: "1:647425557017:web:17b1e903ef0e9e60e3e088",
  measurementId: "G-1F0K331B7Z"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const analytics = getAnalytics(app);

let isListening = false; 
let mioNome = localStorage.getItem('mioNomeDnd') || ""; 
const params = new URLSearchParams(window.location.search);
const stanzaIdDaUrl = params.get('stanza');

function nascondiTutteSchermate() {
    const schermate = ['home-screen', 'creazione-personaggio-screen', 'login-giocatore-screen', 'gioco-screen', 'disclaimer-screen'];
    schermate.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
}

// Gestione pulita del pulsante del disclaimer
const btnChiudi = document.getElementById('btnChiudiDisclaimer');
if (btnChiudi) {
    btnChiudi.addEventListener('click', () => {
        const disclaimer = document.getElementById('disclaimer-screen');
        if (disclaimer) disclaimer.style.display = 'none';

        // Se c'è una stanza nell'URL
        if (stanzaIdDaUrl) {
            // Se sei il Master o hai già un nome valido e registrato nella stanza, ascolti direttamente
            if (mioNome === "Master") {
                isListening = true;
                onValue(ref(database, 'stanze/' + stanzaIdDaUrl), (snapshot) => {
                    aggiornaUIStanza(snapshot.val(), stanzaIdDaUrl);
                });
            } else {
                // Altrimenti, OBBLIGHIAMO il giocatore a inserire il nome
                document.getElementById('login-giocatore-screen').style.display = 'block';
            }
        } else {
            // Se non c'è la stanza, apriamo la home normale (per creare l'avventura)
            document.getElementById('home-screen').style.display = 'block';
        }
    });
}

// Se la pagina viene ricaricata ed è il Master con la stanza attiva
if (mioNome === "Master" && stanzaIdDaUrl) {
    isListening = true;
    onValue(ref(database, 'stanze/' + stanzaIdDaUrl), (snapshot) => {
        aggiornaUIStanza(snapshot.val(), stanzaIdDaUrl);
    });
}
function aggiornaUIStanza(dati, stanzaId, linkStanza = "") {
    if (!dati || !dati.giocatori) return;
    
    const isMaster = (mioNome === "Master");
    nascondiTutteSchermate();

    if (dati.stato === 'attesa') {
        document.getElementById('home-screen').style.display = 'block';
        const lista = Object.entries(dati.giocatori).map(([nome, ruolo]) => {
            return `<li>${ruolo === "Master" ? "Master" : nome}</li>`;
        }).join('');

        const btnAvanzare = isMaster ? `<button id="btnAvanzaGioco">AVANZARE</button>` : "";

        document.getElementById('home-screen').innerHTML = `
            <h1>${dati.nome}</h1>
            ${linkStanza ? `<p>Link: <b>${linkStanza}</b></p>` : ""}
            <h3>Giocatori presenti:</h3>
            <ul>${lista}</ul>
            <p>Stato in attesa dei giocatori...</p>
            ${btnAvanzare}
        `;

        const btnAvanza = document.getElementById('btnAvanzaGioco');
        if (btnAvanza) {
            btnAvanza.addEventListener('click', () => {
                update(ref(database, 'stanze/' + stanzaId), { stato: 'creazione' });
            });
        }
    } 
    else if (dati.stato === 'creazione') {
        if (isMaster) {
            document.getElementById('home-screen').style.display = 'block';
            document.getElementById('home-screen').innerHTML = `<h1>${dati.nome}</h1><p>Fase di creazione personaggio in corso per i giocatori...</p>`;
        } else {
            const haCreatoPG = dati.personaggi && dati.personaggi[mioNome] && dati.personaggi[mioNome].creato;
            
            if (haCreatoPG) {
                document.getElementById('home-screen').style.display = 'block';
                document.getElementById('home-screen').innerHTML = `<h2>Personaggio salvato!</h2><p>In attesa che l'avventura si avvii...</p>`;
            } else {
                document.getElementById('creazione-personaggio-screen').style.display = 'block';
            }
        }
    }
    else if (dati.stato === 'gioco_attivo') {
        const giocoScreen = document.getElementById('gioco-screen');
        if (giocoScreen) {
            giocoScreen.style.display = 'block';
        }
    }
}

document.getElementById('btnCreaAvventura').addEventListener('click', () => {
    const nomeAvventura = document.getElementById('nuovaAvventuraNome').value;
    const numGiocatori = document.getElementById('numeroGiocatori').value;
    if (nomeAvventura.trim() === "" || numGiocatori < 2) return alert("Inserisci dati validi!");

    mioNome = "Master";
    localStorage.setItem('mioNomeDnd', mioNome);

    const stanzaId = Date.now().toString(); 
    const stanzaRef = ref(database, 'stanze/' + stanzaId);
    const linkStanza = window.location.href.split('?')[0] + "?stanza=" + stanzaId;
    
    const datiIniziali = {
        nome: nomeAvventura,
        giocatori: { "Master": "Master" }, 
        stato: 'attesa'
    };

    // Scriviamo su Firebase e passiamo subito il link alla UI
    set(stanzaRef, datiIniziali).then(() => {
        isListening = true;
        
        // Mostriamo subito la schermata di attesa con il link generato
        aggiornaUIStanza(datiIniziali, stanzaId, linkStanza);

        // Attiviamo il listener in tempo reale per gli altri cambiamenti
        onValue(stanzaRef, (snapshot) => {
            const datiAggiornati = snapshot.val();
            if (datiAggiornati) {
                aggiornaUIStanza(datiAggiornati, stanzaId, linkStanza);
            }
        });
    });
});
function controllaAccessoStanza() {
    document.getElementById('login-giocatore-screen').style.display = 'block';
}

document.getElementById('btnEntraStanza').addEventListener('click', () => {
    mioNome = document.getElementById('inputNomeGiocatore').value;
    if (mioNome.trim() === "") return alert("Inserisci un nome!");
    
    localStorage.setItem('mioNomeDnd', mioNome);

    document.getElementById('login-giocatore-screen').style.display = 'none';
    document.getElementById('home-screen').style.display = 'block';

    update(ref(database, 'stanze/' + stanzaIdDaUrl + '/giocatori'), { [mioNome]: "Giocatore" });

    if (!isListening) {
        isListening = true;
        onValue(ref(database, 'stanze/' + stanzaIdDaUrl), (snapshot) => {
            aggiornaUIStanza(snapshot.val(), stanzaIdDaUrl);
        });
    }
});

document.querySelectorAll('.stat').forEach(select => {
    select.addEventListener('change', (e) => {
        const val = e.target.value;
        document.querySelectorAll('.stat').forEach(s => {
            if (s !== e.target && s.value === val && val !== "") {
                alert("Valore già assegnato!");
                e.target.value = "";
            }
        });
    });
});

const descrizioniClassi = {
    "Barbaro": "<h4>Barbaro</h4><p><b>Caratteristiche chiave:</b> Forza e Costituzione.</p>",
    "Bardo": "<h4>Bardo</h4><p><b>Caratteristiche chiave:</b> Carisma e Destrezza.</p>",
    "Chierico": "<h4>Chierico</h4><p><b>Caratteristiche chiave:</b> Saggezza e Forza/Costituzione.</p>",
    "Druido": "<h4>Druido</h4><p><b>Caratteristiche chiave:</b> Saggezza e Costituzione.</p>",
    "Guerriero": "<h4>Guerriero</h4><p><b>Caratteristiche chiave:</b> Forza o Destrezza e Costituzione.</p>",
    "Ladro": "<h4>Ladro</h4><p><b>Caratteristiche chiave:</b> Destrezza e Intelligenza.</p>",
    "Mago": "<h4>Mago</h4><p><b>Caratteristiche chiave:</b> Intelligenza e Destrezza/Costituzione.</p>",
    "Monaco": "<h4>Monaco</h4><p><b>Caratteristiche chiave:</b> Destrezza e Saggezza.</p>",
    "Paladino": "<h4>Paladino</h4><p><b>Caratteristiche chiave:</b> Forza e Carisma.</p>",
    "Ranger": "<h4>Ranger</h4><p><b>Caratteristiche chiave:</b> Saggezza e Destrezza.</p>",
    "Stregone": "<h4>Stregone</h4><p><b>Caratteristiche chiave:</b> Carisma.</p>",
    "Warlock": "<h4>Warlock</h4><p><b>Caratteristiche chiave:</b> Carisma e Costituzione.</p>"
};

const descrizioniRazze = {
    "Nano": "<h4>Nano</h4><p><b>Bonus:</b> +2 Costituzione.</p>",
    "Elfo": "<h4>Elfo</h4><p><b>Bonus:</b> +2 Destrezza.</p>",
    "Halfling": "<h4>Halfling</h4><p><b>Bonus:</b> +2 Destrezza.</p>",
    "Umano": "<h4>Umano</h4><p><b>Bonus:</b> +1 a tutte le caratteristiche.</p>",
    "Dragonide Blu": "<h4>Dragonide Blu</h4><p><b>Bonus:</b> +2 Forza, +1 Carisma.</p>",
    "Dragonide Rosso": "<h4>Dragonide Rosso</h4><p><b>Bonus:</b> +2 Forza, +1 Carisma.</p>",
    "Dragonide Bianco": "<h4>Dragonide Bianco</h4><p><b>Bonus:</b> +2 Forza, +1 Carisma.</p>",
    "Gnomo": "<h4>Gnomo</h4><p><b>Bonus:</b> +2 Intelligenza.</p>",
    "Mezzelfo": "<h4>Mezzelfo</h4><p><b>Bonus:</b> +2 Carisma e +1 a due caratteristiche a scelta.</p>",
    "Mezzorco": "<h4>Mezzorco</h4><p><b>Bonus:</b> +2 Forza, +1 Costituzione.</p>",
    "Tiefling": "<h4>Tiefling</h4><p><b>Bonus:</b> +2 Carisma, +1 Intelligenza.</p>"
};

document.getElementById('btnInfoClasse').addEventListener('click', () => {
    const classeSelezionata = document.getElementById('classePG').value;
    const box = document.getElementById('infoClasseBox');

    if (!classeSelezionata) {
        box.innerHTML = "<p>Seleziona prima una classe dalla tendina!</p>";
        box.style.display = 'block';
        return;
    }

    if (descrizioniClassi[classeSelezionata]) {
        box.innerHTML = descrizioniClassi[classeSelezionata];
        box.style.display = box.style.display === 'none' ? 'block' : 'none';
    }
});

document.getElementById('btnInfoRazza').addEventListener('click', () => {
    const razzaSelezionata = document.getElementById('razzaPG').value;
    const box = document.getElementById('infoRazzaBox');

    if (!razzaSelezionata) {
        box.innerHTML = "<p>Seleziona prima una razza dalla tendina!</p>";
        box.style.display = 'block';
        return;
    }

    if (descrizioniRazze[razzaSelezionata]) {
        box.innerHTML = descrizioniRazze[razzaSelezionata];
        box.style.display = box.style.display === 'none' ? 'block' : 'none';
    }
});

document.getElementById('btnSalvaPG').addEventListener('click', () => {
    const nomePG = document.getElementById('nomePG').value;
    const descrizionePG = document.getElementById('descrizionePG').value;
    const obiettivoPG = document.getElementById('obiettivoPG').value;
    const classePG = document.getElementById('classePG').value;
    const razzaPG = document.getElementById('razzaPG').value;

    if (nomePG.trim() === "" || classePG === "" || razzaPG === "") {
        return alert("Inserisci almeno il nome del personaggio, la classe e la razza!");
    }

    const selectStats = document.querySelectorAll('#caratteristiche-container .stat');
    const caratteristiche = {
        forza: selectStats[0].value,
        costituzione: selectStats[1].value,
        destrezza: selectStats[2].value,
        intelligenza: selectStats[3].value,
        saggezza: selectStats[4].value,
        carisma: selectStats[5].value
    };

    const pgRef = ref(database, 'stanze/' + stanzaIdDaUrl + '/personaggi/' + mioNome);
    
    set(pgRef, {
        nomePG: nomePG,
        descrizione: descrizionePG,
        obiettivo: obiettivoPG,
        classe: classePG,
        razza: razzaPG,
        statistiche: caratteristiche,
        creato: true
    }).then(() => {
        alert("Personaggio salvato con successo!");
        document.getElementById('creazione-personaggio-screen').style.display = 'none';
        document.getElementById('home-screen').style.display = 'block';
        document.getElementById('home-screen').innerHTML = `<h2>Personaggio salvato!</h2><p>In attesa che l'avventura si avvii...</p>`;
    }).catch((error) => {
        alert("Errore durante il salvataggio: " + error.message);
    });
});
