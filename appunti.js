// appunti.js - Gestisce gli appunti personali che rimangono fissi finché il gioco è aperto

import { ref, update } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

// Oggetti in memoria locale per mantenere il testo attivo durante la sessione di gioco
let appuntiMasterLocali = "";
let appuntiEroiLocali = {};

export function apriSchermataAppunti(database, stanzaId, mioNome, isMaster) {
    let modalAppunti = document.getElementById('modal-appunti');

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
                <h2 id="titolo-appunti">Appunti</h2>
                <button id="chiudi-appunti" style="background: #d9534f; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">Chiudi</button>
            </div>
            
            <div style="flex: 1; display: flex; flex-direction: column;">
                <p style="color: #aaa; font-size: 14px; margin-bottom: 5px;">
                    Scrivi qui i tuoi promemoria. Il testo rimarrà salvato qui finché la sessione di gioco resta aperta.
                </p>
                <textarea id="testo-appunti-personali" placeholder="Scrivi qui..." style="width: 100%; flex: 1; padding: 15px; font-size: 16px; border-radius: 5px; border: 1px solid #555; background: #333; color: white; resize: none; box-sizing: border-box;"></textarea>
            </div>
        `;

        document.body.appendChild(modalAppunti);

        // Evento per chiudere la schermata (nasconde solo la finestra senza perdere nulla)
        document.getElementById('chiudi-appunti').addEventListener('click', () => {
            modalAppunti.style.display = 'none';
        });

        // Ascolta in tempo reale quello che scrivi e lo memorizza subito nella memoria del browser
        const textarea = document.getElementById('testo-appunti-personali');
        textarea.addEventListener('input', (e) => {
            const testo = e.target.value;
            if (isMaster) {
                appuntiMasterLocali = testo;
            } else {
                appuntiEroiLocali[mioNome] = testo;
            }
        });
    }

    // Mostra la modale
    modalAppunti.style.display = 'flex';
    const titolo = document.getElementById('titolo-appunti');
    const textarea = document.getElementById('testo-appunti-personali');
    
    if (titolo) {
        titolo.textContent = isMaster ? 'Appunti di Sessione (Master)' : 'Appunti Personali di ' + mioNome;
    }
    
    // Riempie la textarea con il testo salvato in precedenza nella sessione corrente
    if (textarea) {
        if (isMaster) {
            textarea.value = appuntiMasterLocali;
        } else {
            textarea.value = appuntiEroiLocali[mioNome] || "";
        }
    }
}

// Funzione opzionale se un domani vorrai inviarli su Firebase
export function raccogliESalvaAppunti(database, stanzaId, isMaster, mioNome) {
    if (isMaster) {
        return update(ref(database, 'stanze/' + stanzaId), { appuntiMaster: appuntiMasterLocali });
    } else {
        const testoEroe = appuntiEroiLocali[mioNome] || "";
        return update(ref(database, 'stanze/' + stanzaId + '/personaggi/' + mioNome), { appuntiPersonali: testoEroe });
    }
}
