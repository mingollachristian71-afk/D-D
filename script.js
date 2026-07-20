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
let mioNome = ""; // Salviamo il nome dell'utente
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

function aggiornaUIStanza(dati, stanzaId, linkStanza = "") {
    const isMaster = (mioNome === "Master");
    const lista = Object.entries(dati.giocatori).map(([nome, ruolo]) => {
        return `<li>${ruolo === "Master" ? "Master" : nome}</li>`;
    }).join('');

    const btnAvanzare = isMaster ? `<button id="btnAvanzaGioco">AVANZARE</button>` : "";

    document.getElementById('home-screen').innerHTML = `
        <h1>${dati.nome}</h1>
        ${linkStanza ? `<p>Link: <b>${linkStanza}</b></p>` : ""}
        <h3>Giocatori presenti:</h3>
        <ul>${lista}</ul>
        <p>Stato: ${dati.stato}</p>
        ${btnAvanzare}
    `;

    const btnAvanza = document.getElementById('btnAvanzaGioco');
    if (btnAvanza) {
        btnAvanza.addEventListener('click', () => {
            update(ref(database, 'stanze/' + stanzaId), { stato: 'creazione' });
        });
    }    
    // GESTIONE CAMBIO SCHERMATA RIGOROSA
    if (dati.stato === 'creazione') {
        document.getElementById('home-screen').style.display = 'none';
        
        if (isMaster) {
            document.getElementById('master-chat-screen').style.display = 'block';
            document.getElementById('creazione-personaggio-screen').style.display = 'none';
            document.getElementById('msgMaster').style.display = 'block';
            document.getElementById('btnInviaChat').style.display = 'block';
        } else {
            document.getElementById('creazione-personaggio-screen').style.display = 'block';
            document.getElementById('master-chat-screen').style.display = 'none'; 
            document.getElementById('chat-box').style.display = 'block'; 
            document.getElementById('msgMaster').style.display = 'none';
            document.getElementById('btnInviaChat').style.display = 'none';
        }
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
    giocatori: { "Master": "Master" }, // Salviamo il nome "Master" come chiave
    stato: 'attesa'
}).then(() => {
    // ...
});

function controllaAccessoStanza() {
    document.getElementById('login-giocatore-screen').style.display = 'block';
}

document.getElementById('btnEntraStanza').addEventListener('click', () => {
    mioNome = document.getElementById('inputNomeGiocatore').value;
    if (mioNome.trim() === "") return alert("Inserisci un nome!");

    document.getElementById('login-giocatore-screen').style.display = 'none';
    document.getElementById('home-screen').style.display = 'block';

    // Assicurati che quando entri, il tuo nome NON sia "Master"
    update(ref(database, 'stanze/' + stanzaIdDaUrl + '/giocatori'), { [mioNome]: "Giocatore" });

    if (!isListening) {
        isListening = true;
        onValue(ref(database, 'stanze/' + stanzaIdDaUrl), (snapshot) => {
            aggiornaUIStanza(snapshot.val(), stanzaIdDaUrl);
        });
    }
});

// LOGICA CHAT
document.getElementById('btnInviaChat').addEventListener('click', () => {
    const msg = document.getElementById('msgMaster').value;
    if (msg.trim() === "") return;
    update(ref(database, 'stanze/' + stanzaIdDaUrl + '/chat'), { ultimoMessaggio: msg });
    document.getElementById('msgMaster').value = "";
});

onValue(ref(database, 'stanze/' + stanzaIdDaUrl + '/chat'), (snapshot) => {
    const chatDati = snapshot.val();
    if (chatDati) {
        document.getElementById('chat-box').innerHTML = `<p><b>Master:</b> ${chatDati.ultimoMessaggio}</p>`;
    }
});

// LOGICA CARATTERISTICHE
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
