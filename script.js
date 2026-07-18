import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

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
const database = getDatabase(app);
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
// Aggiungila in fondo al file script.js
function controllaAccessoStanza() {
    const params = new URLSearchParams(window.location.search);
    const stanzaId = params.get('stanza'); // Nota: nel tuo codice la chiami "stanza"

    if (stanzaId) {
        console.log("Stai entrando nella stanza: " + stanzaId);
        // Qui dovresti nascondere la home-screen e mostrare la schermata di gioco
        document.getElementById('disclaimer-screen').style.display = 'none';
        document.getElementById('home-screen').style.display = 'block';
        document.getElementById('home-screen').innerHTML = `<h1>Caricamento stanza ${stanzaId}...</h1>`;
        
        // Qui in futuro aggiungerai la funzione per leggere i dati da Firebase
    }
}
