import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyAZq5MjHGMUJm6r_zZWvToPl76vbwVVJnU",
    authDomain: "dnd-toolset-ac6d4.firebaseapp.com",
    databaseURL: "https://dnd-toolset-ac6d4-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "dnd-toolset-ac6d4",
    storageBucket: "dnd-toolset-ac6d4.firebasestorage.app",
    messagingSenderId: "647425557017",
    appId: "1:647425557017:web:17b1e903ef0e9e60e3e088"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Questa riga è fondamentale!
const analytics = getAnalytics(app);

// Adesso chiamiamo la funzione che controlla il link:
controllaAccessoStanza();

// Colleghiamo i bottoni usando gli ID (questo funziona con type="module")
document.getElementById('btnChiudiDisclaimer').addEventListener('click', () => {
    document.getElementById('disclaimer-screen').style.display = 'none';
    document.getElementById('home-screen').style.display = 'block';
});

document.getElementById('btnCreaAvventura').addEventListener('click', () => {
    const nomeAvventura = document.getElementById('nuovaAvventuraNome').value;
    const numGiocatori = document.getElementById('numeroGiocatori').value;
    
    if (nomeAvventura.trim() === "" || numGiocatori < 2) {
        alert("Inserisci un nome e almeno 2 giocatori!");
        return;
    }

    const stanzaId = Date.now().toString(); 
    
    // Salviamo la stanza con il limite giocatori
    set(ref(database, 'stanze/' + stanzaId), {
        nome: nomeAvventura,
        totaleGiocatori: numGiocatori,
        master: "Giocatore 1",
        stato: 'attesa'
    }).then(() => {
        // Creiamo dinamicamente la schermata di attesa
        const linkStanza = window.location.href.split('?')[0] + "?stanza=" + stanzaId;
        
        document.getElementById('home-screen').innerHTML = `
            <h1>${nomeAvventura}</h1>
            <button onclick="navigator.clipboard.writeText('${linkStanza}')">Copia Link Invito</button>
            <p>Link: ${linkStanza}</p>
            <h3>Giocatori in attesa:</h3>
            <ul id="lista-giocatori"><li>Master (Tu)</li></ul>
        `;
    }).catch((error) => {
        alert("Errore: " + error.message);
    });
});
function controllaAccessoStanza() {
    const params = new URLSearchParams(window.location.search);
    const stanzaId = params.get('stanza');

    if (stanzaId) {
        document.getElementById('disclaimer-screen').style.display = 'none';
        document.getElementById('home-screen').style.display = 'block';
        
        // Andiamo a cercare la stanza nel database
        get(ref(database, 'stanze/' + stanzaId)).then((snapshot) => {
            if (snapshot.exists()) {
                const datiStanza = snapshot.val();
                document.getElementById('home-screen').innerHTML = `
                    <h1>${datiStanza.nome}</h1>
                    <p>Stanza trovata! Preparazione in corso...</p>
                `;
            } else {
                document.getElementById('home-screen').innerHTML = `<h1>Errore: Stanza non trovata!</h1>`;
            }
        }).catch((error) => {
            document.getElementById('home-screen').innerHTML = `<h1>Errore di connessione.</h1>`;
        });
    }
}
