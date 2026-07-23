// appunti.js - Gestisce gli appunti personali (eroi e master) salvati tramite il comando globale del Master

import { ref, update } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

export function apriSchermataAppunti(database, stanzaId, mioNome, isMaster, datiStanza) {
    let modalAppunti = document.getElementById('modal-appunti');
    
    // Recupera il testo salvato in precedenza dal database (se esiste)
    let testoAttuale = "";
    if (isMaster) {
        testoAttuale = datiStanza.appuntiMaster || "";
    } else {
        if (datiStanza.personaggi && datiStanza.personaggi[mioNome]) {
            testoAttuale = datiStanza.personaggi[mioNome].appuntiPersonali || "";
        }
    }

    if (!modalAppunti) {
        modalAppunti = document.createElement('div');
        modalAppunti.id = 'modal-appunti';
        modalAppunti.style.cssText = `
            position: fixed; top: 10%; left: 10%; width: 80%; height: 80%;
            background: #222; color: #fff; padding: 20px; border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.8); z-index: 1000; display: flex; flex-direction: column;
            font-family: sans-serif;
        `;

        modalAppunti.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; padding-bottom: 10px; margin-bottom: 15px;">
                <h2>${isMaster ? 'Appunti di Sessione (Master)' : 'Appunti Personali di ' + mioNome}</h2>
                <button id="chiudi-appunti" style="background: #d9534f; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">Chiudi</button>
            </div>
            
            <div style="flex: 1; display: flex; flex-direction: column;">
                <p style="color: #aaa; font-size: 14px; margin-bottom: 5px;">
                    Scrivi qui i tuoi promemoria, i nomi di città o indizi. Si salveranno nel database quando il Master premerà il tasto globale "Salva sessione".
                </p>
                <textarea id="testo-appunti-personali" placeholder="Scrivi qui i tuoi appunti..." style="width: 100%; flex: 1; padding: 15px; font-size: 16px; border-radius: 5px; border: 1px solid #555; background: #333; color: white; resize: none; box-sizing: border-box;"></textarea>
            </div>
        `;

        document.body.appendChild(modalAppunti);

        // Evento per chiudere la schermata
        document.getElementById('chiudi-appunti').addEventListener('click', () => {
            modalAppunti.style.display = 'none';
        });
    } else {
        modalAppunti.style.display = 'flex';
        // Aggiorna il titolo se viene riaperta
        const h2 = modalAppunti.querySelector('h2');
        if (h2) h2.textContent = isMaster ? 'Appunti di Sessione (Master)' : 'Appunti Personali di ' + mioNome;
    }

    // Inserisce il testo attuale nella textarea
    const textarea = document.getElementById('testo-appunti-personali');
    if (textarea) {
        textarea.value = testoAttuale;
    }
}

// Funzione richiamata dal Master quando preme "Salva sessione" per raccogliere e salvare gli appunti di tutti
export function raccogliESalvaAppunti(database, stanzaId, isMaster, mioNome) {
    const textarea = document.getElementById('testo-appunti-personali');
    if (!textarea) return; // Se la schermata non è mai stata aperta, non fa nulla

    const testoInserito = textarea.value;

    if (isMaster) {
        // Salva gli appunti del Master
        return update(ref(database, 'stanze/' + stanzaId), {
            appuntiMaster: testoInserito
        });
    } else {
        // Salva gli appunti personali del singolo eroe nella sua sezione dei personaggi
        return update(ref(database, 'stanze/' + stanzaId + '/personaggi/' + mioNome), {
            appuntiPersonali: testoInserito
        });
    }
}
