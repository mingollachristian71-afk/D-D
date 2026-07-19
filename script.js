import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue, update, child } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";

// ... import ...

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const analytics = getAnalytics(app);

// Aspettiamo che l'HTML sia caricato prima di controllare l'URL
window.addEventListener('DOMContentLoaded', () => {
    controllaAccessoStanza();
});

// Colleghiamo i bottoni
document.getElementById('btnChiudiDisclaimer').addEventListener('click', () => {
    document.getElementById('disclaimer-screen').style.display = 'none';
    document.getElementById('home-screen').style.display = 'block';
});

// ... resto del codice del bottone btnCreaAvventura ...
document.getElementById('btnCreaAvventura').addEventListener('click', () => {
    const nomeAvventura = document.getElementById('nuovaAvventuraNome').value;
    const numGiocatori = document.getElementById('numeroGiocatori').value;
    
    if (nomeAvventura.trim() === "" || numGiocatori < 2) {
        alert("Inserisci un nome e almeno 2 giocatori!");
        return;
    }

    // Torniamo a usare Date.now() per avere stanze uniche ogni volta
    const stanzaId = Date.now().toString(); 
    
    set(ref(database, 'stanze/' + stanzaId), {
        nome: nomeAvventura,
        totaleGiocatori: numGiocatori,
        giocatori: {
            "Giocatore 1": "Master"
        },
        stato: 'attesa'
    }).then(() => {
        // Ora il link punterà all'ID univoco appena creato
        const linkStanza = window.location.href.split('?')[0] + "?stanza=" + stanzaId;
        
        document.getElementById('home-screen').innerHTML = `
            <h1>${nomeAvventura}</h1>
            <p>Link (invialo ai giocatori): <br> <b>${linkStanza}</b></p>
            <h3>Giocatori in attesa:</h3>
            <ul id="lista-giocatori"><li>Giocatore 1 (Master)</li></ul>
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
        
        const stanzaRef = ref(database, 'stanze/' + stanzaId);
        
        // 1. Appena il telefono entra, scriviamo nel database che c'è un "Giocatore 2"
        // Controlliamo prima se esiste già per non sovrascrivere
        get(child(ref(database), 'stanze/' + stanzaId + '/giocatori/Giocatore 2')).then((snapshot) => {
            if (!snapshot.exists()) {
                update(ref(database, 'stanze/' + stanzaId + '/giocatori'), {
                    "Giocatore 2": "Attivo"
                });
            }
        });

        // 2. Ascoltiamo il database per vedere tutti i giocatori in tempo reale
        onValue(stanzaRef, (snapshot) => {
            if (snapshot.exists()) {
                const datiStanza = snapshot.val();
                const giocatoriObj = datiStanza.giocatori || {};
                const listaHTML = Object.keys(giocatoriObj)
                    .map(nome => `<li>${nome}</li>`)
                    .join('');
                
                document.getElementById('home-screen').innerHTML = `
                    <h1>${datiStanza.nome}</h1>
                    <h3>Giocatori presenti:</h3>
                    <ul>${listaHTML}</ul>
                    <p>Stato: ${datiStanza.stato}</p>
                `;
            }
        });
    }
}
