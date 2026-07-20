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
const params = new URLSearchParams(window.location.search);
const stanzaIdDaUrl = params.get('stanza');

document.getElementById('btnChiudiDisclaimer').addEventListener('click', () => {
    document.getElementById('disclaimer-screen').style.display = 'none';
    if (stanzaIdDaUrl) {
        controllaAccessoStanza(); 
    } else {
        document.getElementById('home-screen').style.display = 'block';
    }
});

// Funzione helper per aggiornare la UI della stanza
function aggiornaUIStanza(dati, stanzaId, linkStanza = "") {
    const isMaster = dati.giocatori["Giocatore 1"] === "Master";
    const lista = Object.entries(dati.giocatori).map(([nome, ruolo]) => {
        return `<li>${ruolo === "Master" ? "Master" : nome}</li>`;
    }).join('');

    // Tasto Avanzare solo per il Master
    const btnAvanzare = isMaster ? `<button id="btnAvanzaGioco">AVANZARE</button>` : "";

    document.getElementById('home-screen').innerHTML = `
        <h1>${dati.nome}</h1>
        ${linkStanza ? `<p>Link: <b>${linkStanza}</b></p>` : ""}
        <h3>Giocatori presenti:</h3>
        <ul>${lista}</ul>
        <p>Stato: ${dati.stato}</p>
        ${btnAvanzare}
    `;

    // Evento tasto Avanzare
    const btnAvanza = document.getElementById('btnAvanzaGioco');
    if (btnAvanza) {
        btnAvanza.addEventListener('click', () => {
            update(ref(database, 'stanze/' + stanzaId), { stato: 'creazione' });
        });
    }

    // Se lo stato cambia in 'creazione', tutti vanno alla creazione PG
    if (dati.stato === 'creazione') {
        document.getElementById('home-screen').style.display = 'none';
        document.getElementById('creazione-personaggio-screen').style.display = 'block';
    }
}

document.getElementById('btnCreaAvventura').addEventListener('click', () => {
    const nomeAvventura = document.getElementById('nuovaAvventuraNome').value;
    const numGiocatori = document.getElementById('numeroGiocatori').value;
    if (nomeAvventura.trim() === "" || numGiocatori < 2) return alert("Inserisci dati validi!");

    const stanzaId = Date.now().toString(); 
    const stanzaRef = ref(database, 'stanze/' + stanzaId);
    const linkStanza = window.location.href.split('?')[0] + "?stanza=" + stanzaId;
    
    set(stanzaRef, {
        nome: nomeAvventura,
        giocatori: { "Giocatore 1": "Master" },
        stato: 'attesa'
    }).then(() => {
        onValue(stanzaRef, (snapshot) => {
            aggiornaUIStanza(snapshot.val(), stanzaId, linkStanza);
        });
    });
});

function controllaAccessoStanza() {
    document.getElementById('login-giocatore-screen').style.display = 'block';
}

document.getElementById('btnEntraStanza').addEventListener('click', () => {
    const nomeInserito = document.getElementById('inputNomeGiocatore').value;
    if (nomeInserito.trim() === "") return alert("Inserisci un nome!");

    document.getElementById('login-giocatore-screen').style.display = 'none';
    document.getElementById('home-screen').style.display = 'block';

    update(ref(database, 'stanze/' + stanzaIdDaUrl + '/giocatori'), { [nomeInserito]: "Attivo" });

    if (!isListening) {
        isListening = true;
        onValue(ref(database, 'stanze/' + stanzaIdDaUrl), (snapshot) => {
            aggiornaUIStanza(snapshot.val(), stanzaIdDaUrl);
        });
    }
});

// LOGICA CARATTERISTICHE (NO DUPLICATI)
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
