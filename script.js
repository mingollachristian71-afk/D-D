import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue, update, child } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";

// 1. Configurazione definita PER PRIMA
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

// 2. Inizializzazione che usa la configurazione sopra
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const analytics = getAnalytics(app);

// --- TUTTO IL RESTO DEL CODICE ---

const params = new URLSearchParams(window.location.search);
const stanzaIdDaUrl = params.get('stanza');

window.addEventListener('DOMContentLoaded', () => {
    console.log("Pagina caricata");
});

document.getElementById('btnChiudiDisclaimer').addEventListener('click', () => {
    document.getElementById('disclaimer-screen').style.display = 'none';
    if (stanzaIdDaUrl) {
        controllaAccessoStanza(); 
    } else {
        document.getElementById('home-screen').style.display = 'block';
    }
});

document.getElementById('btnCreaAvventura').addEventListener('click', () => {
    const nomeAvventura = document.getElementById('nuovaAvventuraNome').value;
    const numGiocatori = document.getElementById('numeroGiocatori').value;
    
    if (nomeAvventura.trim() === "" || numGiocatori < 2) {
        alert("Inserisci un nome e almeno 2 giocatori!");
        return;
    }

    const stanzaId = Date.now().toString(); 
    const stanzaRef = ref(database, 'stanze/' + stanzaId); // Riferimento alla stanza
    
    set(stanzaRef, {
        nome: nomeAvventura,
        totaleGiocatori: numGiocatori,
        giocatori: { "Giocatore 1": "Master" },
        stato: 'attesa'
    }).then(() => {
        // Ora colleghiamo l'ascoltatore in tempo reale anche sul PC
        onValue(stanzaRef, (snapshot) => {
            const dati = snapshot.val();
            const lista = Object.keys(dati.giocatori).map(n => `<li>${n}</li>`).join('');
            document.getElementById('home-screen').innerHTML = `
                <h1>${dati.nome}</h1>
                <h3>Giocatori presenti:</h3>
                <ul>${lista}</ul>
                <p>Stato: ${dati.stato}</p>
            `;
        });
    });
});

function controllaAccessoStanza() {
    document.getElementById('disclaimer-screen').style.display = 'none';
    document.getElementById('home-screen').style.display = 'block';
    const stanzaRef = ref(database, 'stanze/' + stanzaIdDaUrl);
    
    get(child(ref(database), 'stanze/' + stanzaIdDaUrl + '/giocatori/Giocatore 2')).then((snapshot) => {
        if (!snapshot.exists()) {
            update(ref(database, 'stanze/' + stanzaIdDaUrl + '/giocatori'), { "Giocatore 2": "Attivo" });
        }
    });

    onValue(stanzaRef, (snapshot) => {
        if (snapshot.exists()) {
            const dati = snapshot.val();
            const lista = Object.keys(dati.giocatori).map(n => `<li>${n}</li>`).join('');
            document.getElementById('home-screen').innerHTML = `
                <h1>${dati.nome}</h1>
                <h3>Giocatori presenti:</h3>
                <ul>${lista}</ul>
                <p>Stato: ${dati.stato}</p>
            `;
        }
    });
}
