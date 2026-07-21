import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue, update, child } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";

function nascondiTutteSchermate() {
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('master-chat-screen').style.display = 'none';
    document.getElementById('creazione-personaggio-screen').style.display = 'none';
    document.getElementById('login-giocatore-screen').style.display = 'none';
}

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

// Avvio automatico se il nome è già salvato
if (mioNome !== "" && stanzaIdDaUrl) {
    isListening = true;
    onValue(ref(database, 'stanze/' + stanzaIdDaUrl), (snapshot) => {
        aggiornaUIStanza(snapshot.val(), stanzaIdDaUrl);
    });
}

document.getElementById('btnChiudiDisclaimer').addEventListener('click', () => {
    document.getElementById('disclaimer-screen').style.display = 'none';
    if (stanzaIdDaUrl) {
        controllaAccessoStanza(); 
    } else {
        document.getElementById('home-screen').style.display = 'block';
    }
});

function aggiornaUIStanza(dati, stanzaId, linkStanza = "") {
    if (!dati || !dati.giocatori) return;
    
    const isMaster = (mioNome === "Master");
    
    // 1. Reset visibilità
    nascondiTutteSchermate();

    // 2. Logica Stato "Attesa"
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
            <p>Stato: ${dati.stato}</p>
            ${btnAvanzare}
        `;

        const btnAvanza = document.getElementById('btnAvanzaGioco');
        if (btnAvanza) {
            btnAvanza.addEventListener('click', () => {
                update(ref(database, 'stanze/' + stanzaId), { stato: 'creazione' });
            });
        }
    } 
    // 3. Logica Stato "Creazione"
    else if (dati.stato === 'creazione') {
        if (isMaster) {
            document.getElementById('master-chat-screen').style.display = 'block';
        } else {
            const haCreatoPG = dati.personaggi && dati.personaggi[mioNome] && dati.personaggi[mioNome].creato;
            
            if (haCreatoPG) {
                // Schermata di attesa pulita senza chat
                document.getElementById('home-screen').style.display = 'block';
                document.getElementById('home-screen').innerHTML = `<h2>Personaggio salvato!</h2><p>In attesa che il Master avvii l'avventura...</p>`;
            } else {
                document.getElementById('creazione-personaggio-screen').style.display = 'block';
            }
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
    
    set(stanzaRef, {
        nome: nomeAvventura,
        giocatori: { "Master": "Master" }, 
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

// Database dei testi dettagliati per Classi e Razze
const descrizioniClassi = {
    "Barbaro": "<h4>Barbaro</h4><p><b>Caratteristiche chiave:</b> Forza e Costituzione.</p><p><b>Vantaggi:</b> L'<b>Ira</b> conferisce vantaggi nei tiri di Forza, bonus ai danni e soprattutto <b>dimezza i danni fisici</b> subiti (contundenti, perforanti e taglienti). Dispone inoltre della <i>Difesa Senza Armatura</i> e dell'<i>Attacco Irruento</i>.</p>",
    "Bardo": "<h4>Bardo</h4><p><b>Caratteristiche chiave:</b> Carisma e Destrezza.</p><p><b>Vantaggi:</b> Dispone dell'<i>Ispirazione Bardica</i> per potenziare gli alleati, del tratto <i>Tuttofare</i> per competere in qualsiasi abilità e di una vasta gamma di incantesimi arcani e di supporto.</p>",
    "Chierico": "<h4>Chierico</h4><p><b>Caratteristiche chiave:</b> Saggezza e Forza/Costituzione.</p><p><b>Vantaggi:</b> Sceglie un <i>Dominio Divino</i> che sblocca poteri unici, può usare la <i>Canalizza Divinità</i> e conosce l'intera lista di incantesimi della sua classe potendoli cambiare a ogni riposo lungo.</p>",
    "Druido": "<h4>Druido</h4><p><b>Caratteristiche chiave:</b> Saggezza e Costituzione.</p><p><b>Vantaggi:</b> La potentissima <i>Forma Selvatica</i> permette di trasformarsi in animali per esplorare o combattere, unita a una solida magia di controllo della natura e cure.</p>",
    "Guerriero": "<h4>Guerriero</h4><p><b>Caratteristiche chiave:</b> Forza o Destrezza e Costituzione.</p><p><b>Vantaggi:</b> Ottiene uno <i>Stile di Combattimento</i> specializzato, l'<i>Azione Rinnovata</i> per curarsi autonomamente e la capacità di effettuare più attacchi di qualsiasi altra classe nello stesso turno.</p>",
    "Ladro": "<h4>Ladro</h4><p><b>Caratteristiche chiave:</b> Destrezza e Intelligenza.</p><p><b>Vantaggi:</b> Maestro del <i>Attacco Furtivo</i> per infliggere danni massicci, grande mobilità grazie all'<i>Azione Rapida</i> (scatto/nascondiglio come azione bonus) e moltissime competenze nelle abilità.</p>",
    "Mago": "<h4>Mago</h4><p><b>Caratteristiche chiave:</b> Intelligenza e Destrezza/Costituzione.</p><p><b>Vantaggi:</b> Possiede il parco magie più vasto del gioco tramite il suo <i>Libro degli Incantesimi</i>, può imparare nuove magie trovando pergamene e recupera slot magici con il <i>Recupero Arcano</i>.</p>",
    "Monaco": "<h4>Monaco</h4><p><b>Caratteristiche chiave:</b> Destrezza e Saggezza.</p><p><b>Vantaggi:</b> Sfrutta i punti <i>Ki</i> per attacchi extra, schivate fulminee e mobilità estrema. Le sue <i>Arti Marziali</i> rendono letali i colpi a mani nude.</p>",
    "Paladino": "<h4>Paladino</h4><p><b>Caratteristiche chiave:</b> Forza e Carisma.</p><p><b>Vantaggi:</b> Celebre per la <i>Punizione Divina</i> che brucia slot incantesimo per infliggere enormi danni radianti. Offre un'<i>Aura di Protezione</i> ai tiri salvezza degli alleati vicini e cure con l'<i>Imposizione delle Mani</i>.</p>",
    "Ranger": "<h4>Ranger</h4><p><b>Caratteristiche chiave:</b> Saggezza e Destrezza.</p><p><b>Vantaggi:</b> Specializzato in <i>Esploratore Nato</i> e <i>Nemico Giurato</i> per tracciare e infliggere bonus contro specifiche creature, eccelle nel combattimento a distanza e ibrido natura-armi.</p>",
    "Stregone": "<h4>Stregone</h4><p><b>Caratteristiche chiave:</b> Carisma.</p><p><b>Vantaggi:</b> La sua magia è innata. Sfrutta i <i>Punti Stregoneria</i> e la <i>Metamagia</i> per alterare gli incantesimi in tempo reale (es. raddoppiandoli o rendendoli silenziosi).</p>",
    "Warlock": "<h4>Warlock</h4><p><b>Caratteristiche chiave:</b> Carisma e Costituzione.</p><p><b>Vantaggi:</b> Ottiene poteri da un patto oscuro. I suoi slot incantesimo si ricaricano completamente anche con un semplice <i>riposo breve</i>, e dispone di <i>Invocazioni Mistiche</i> uniche.</p>"
};

const descrizioniRazze = {
    "Nano": "<h4>Nano</h4><p><b>Bonus:</b> +2 Costituzione.</p><p><b>Vantaggi:</b> <i>Scurovisore</i> (vede al buio), <i>Resistenza Nanica</i> (vantaggio e resistenza contro i veleni) e competenza con armi tradizionali.</p>",
    "Elfo": "<h4>Elfo</h4><p><b>Bonus:</b> +2 Destrezza.</p><p><b>Vantaggi:</b> <i>Scurovisore</i>, competenza in Percezione, immunità al sonno magico e <i>Trance</i> (medita 4 ore anziché dormire).</p>",
    "Halfling": "<h4>Halfling</h4><p><b>Bonus:</b> +2 Destrezza.</p><p><b>Vantaggi:</b> Tratto <i>Fortunato</i> (può ritirare i dadi che fanno 1 naturale) e la capacità di muoversi attraverso lo spazio di creature più grandi.</p>",
    "Umano": "<h4>Umano</h4><p><b>Bonus:</b> +1 a tutte le caratteristiche.</p><p><b>Vantaggi:</b> Massima versatilità e adattabilità a qualsiasi classe senza punti deboli fissi.</p>",
    "Dragonide Blu": "<h4>Dragonide Blu</h4><p><b>Bonus:</b> +2 Forza, +1 Carisma.</p><p><b>Vantaggi:</b> <i>Resistenza ai danni da Fulmine</i> e la capacità di scatenare un soffio distruttivo di energia elettrica.</p>",
    "Dragonide Rosso": "<h4>Dragonide Rosso</h4><p><b>Bonus:</b> +2 Forza, +1 Carisma.</p><p><b>Vantaggi:</b> <i>Resistenza ai danni da Fuoco</i> e un devastante attacco a soffio con un cono di fuoco.</p>",
    "Dragonide Bianco": "<h4>Dragonide Bianco</h4><p><b>Bonus:</b> +2 Forza, +1 Carisma.</p><p><b>Vantaggi:</b> <i>Resistenza ai danni da Ghiaccio/Freddo</i> e un soffio congelante ad area.</p>",
    "Gnomo": "<h4>Gnomo</h4><p><b>Bonus:</b> +2 Intelligenza.</p><p><b>Vantaggi:</b> <i>Scurovisore</i> e <i>Astuzia Gnomesca</i> (vantaggio su tutti i tiri salvezza mentali contro la magia).</p>",
    "Mezzelfo": "<h4>Mezzelfo</h4><p><b>Bonus:</b> +2 Carisma e +1 a due caratteristiche a scelta.</p><p><b>Vantaggi:</b> <i>Scurovisore</i>, immunità al sonno magico e due competenze in abilità a scelta libera.</p>",
    "Mezzorco": "<h4>Mezzorco</h4><p><b>Bonus:</b> +2 Forza, +1 Costituzione.</p><p><b>Vantaggi:</b> Competenze in Intimidazione, <i>Resistenza Relentless</i> (se scendi a 0 PF scendi a 1 una volta al giorno) e dadi extra sui colpi critici.</p>",
    "Tiefling": "<h4>Tiefling</h4><p><b>Bonus:</b> +2 Carisma, +1 Intelligenza.</p><p><b>Vantaggi:</b> <i>Scurovisore</i>, <i>Resistenza ai danni da Fuoco</i> e l'eredità infernale per lanciare incantesimi innati come Thaumaturgy e Hellish Rebuke.</p>"
};

// Pulsanti info Classe e Razza
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

// Salvataggio del Personaggio da parte del Giocatore
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
        document.getElementById('home-screen').innerHTML = `<h2>Personaggio salvato!</h2><p>In attesa che il Master avvii l'avventura...</p>`;
    }).catch((error) => {
        alert("Errore durante il salvataggio: " + error.message);
    });
});
