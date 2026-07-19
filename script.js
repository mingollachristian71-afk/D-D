import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue, update, child } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const analytics = getAnalytics(app);

// Variabile globale per il parametro nell'URL
const params = new URLSearchParams(window.location.search);
const stanzaIdDaUrl = params.get('stanza');

// L'evento DOMContentLoaded ora è pulito: non chiama controllaAccessoStanza()
window.addEventListener('DOMContentLoaded', () => {
    console.log("Pagina caricata, in attesa del click sul disclaimer.");
});
document.getElementById('btnCreaAvventura').addEventListener('click', () => {
    const nomeAvventura = document.getElementById('nuovaAvventuraNome').value;
    const numGiocatori = document.getElementById('numeroGiocatori').value;
    
    if (nomeAvventura.trim() === "" || numGiocatori < 2) {
        alert("Inserisci un nome e almeno 2 giocatori!");
        return;
    }

    const stanzaId = Date.now().toString(); 
    
    set(ref(database, 'stanze/' + stanzaId), {
        nome: nomeAvventura,
        totaleGiocatori: numGiocatori,
        giocatori: {
            "Giocatore 1": "Master"
        },
        stato: 'attesa'
    }).then(() => {
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
    if (stanzaIdDaUrl) {
        document.getElementById('disclaimer-screen').style.display = 'none';
        document.getElementById('home-screen').style.display = 'block';
        
        const stanzaRef = ref(database, 'stanze/' + stanzaIdDaUrl);
        
        // Aggiungiamo il Giocatore 2 solo dopo il click
        get(child(ref(database), 'stanze/' + stanzaIdDaUrl + '/giocatori/Giocatore 2')).then((snapshot) => {
            if (!snapshot.exists()) {
                update(ref(database, 'stanze/' + stanzaIdDaUrl + '/giocatori'), {
                    "Giocatore 2": "Attivo"
                });
            }
        });

        // Sincronizzazione in tempo reale
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
