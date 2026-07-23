// scheda-eroe.js - Mostra all'eroe la sua scheda personale completa di caratteristiche e modificatori

import { ref, get, child } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

function calcolaModificatore(valore) {
    const num = parseInt(valore) || 10;
    const mod = Math.floor((num - 10) / 2);
    return mod >= 0 ? "+" + mod : "" + mod;
}

export function apriSchermataSchedaEroe(database, stanzaId, mioNome) {
    let modalScheda = document.getElementById('modal-scheda-eroe');

    if (!modalScheda) {
        modalScheda = document.createElement('div');
        modalScheda.id = 'modal-scheda-eroe';
        modalScheda.style.cssText = `
            position: fixed; top: 10%; left: 10%; width: 80%; height: 80%;
            background: #222; color: #fff; padding: 20px; border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.8); z-index: 1000; overflow-y: auto;
            font-family: sans-serif;
        `;

        modalScheda.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; padding-bottom: 10px;">
                <h2 id="titolo-mia-scheda">La mia Scheda</h2>
                <button id="chiudi-scheda-eroe" style="background: #d9534f; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">Chiudi</button>
            </div>
            <div id="contenuto-mia-scheda" style="margin-top: 15px;">
                <p>Caricamento della tua scheda in corso...</p>
            </div>
        `;

        document.body.appendChild(modalScheda);

        document.getElementById('chiudi-scheda-eroe').addEventListener('click', () => {
            modalScheda.style.display = 'none';
        });
    }

    modalScheda.style.display = 'block';
    const contenuto = document.getElementById('contenuto-mia-scheda');
    document.getElementById('titolo-mia-scheda').textContent = 'Scheda Personaggio: ' + mioNome;
    contenuto.innerHTML = '<p>Caricamento della tua scheda in corso...</p>';

    get(child(ref(database), 'stanze/' + stanzaId + '/personaggi/' + mioNome)).then((snapshot) => {
        const dati = snapshot.val();

        if (!dati) {
            contenuto.innerHTML = '<p style="color: #aaa;">Nessun dato trovato per il tuo personaggio in questa sessione.</p>';
            return;
        }

        const classe = dati.classe || "Non specificata";
        const razza = dati.razza || "Non specificata";
        const descrizione = dati.descrizione || "Nessuna descrizione.";
        const obiettivo = dati.obiettivo || "Nessun obiettivo.";
        const stats = dati.statistiche || {};

        let html = `
            <div style="background: #2a2a2a; border: 1px solid #444; border-radius: 8px; padding: 20px;">
                <h3 style="color: #ffcc00; margin-top: 0; border-bottom: 1px solid #444; padding-bottom: 8px;">${mioNome} <span style="font-size: 14px; color: #aaa; font-weight: normal;">(${razza} - ${classe})</span></h3>
                <p style="margin: 10px 0;"><b>Descrizione:</b> ${descrizione}</p>
                <p style="margin: 10px 0;"><b>Obiettivo:</b> ${obiettivo}</p>
                
                <div style="margin-top: 20px; background: #333; padding: 15px; border-radius: 5px;">
                    <h4 style="margin: 0 0 10px 0; color: #ff9900; font-size: 16px;">Caratteristiche e Modificatori:</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 15px;">
        `;

        const listaCaratteristiche = ['forza', 'destrezza', 'costituzione', 'intelligenza', 'saggezza', 'carisma'];
        let trovate = false;

        listaCaratteristiche.forEach(car => {
            const val = stats[car];
            if (val !== undefined && val !== "") {
                trovate = true;
                const mod = calcolaModificatore(val);
                html += `<div style="background: #222; padding: 8px 12px; border-radius: 4px; border: 1px solid #555; font-size: 16px;"><b>${car.toUpperCase()}:</b> ${val} <span style="color: #ffcc00;">(${mod})</span></div>`;
            }
        });

        if (!trovate) {
            html += `<span style="color: #888;">Nessuna caratteristica registrata.</span>`;
        }

        html += `
                    </div>
                </div>
            </div>
        `;

        contenuto.innerHTML = html;
    }).catch((error) => {
        console.error("Errore caricamento scheda eroe:", error);
        contenuto.innerHTML = '<p style="color: #d9534f;">Errore nel recupero dei dati della tua scheda.</p>';
    });
}
