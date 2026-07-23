// eroi-master.js - Mostra al Master la panoramica di tutti gli eroi della sessione

import { ref, get, child } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

function calcolaModificatore(valore) {
    const num = parseInt(valore) || 10;
    const mod = Math.floor((num - 10) / 2);
    return mod >= 0 ? "+" + mod : "" + mod;
}

export function apriSchermataEroiMaster(database, stanzaId) {
    let modalEroi = document.getElementById('modal-eroi-master');

    if (!modalEroi) {
        modalEroi = document.createElement('div');
        modalEroi.id = 'modal-eroi-master';
        modalEroi.style.cssText = `
            position: fixed; top: 10%; left: 10%; width: 80%; height: 80%;
            background: #222; color: #fff; padding: 20px; border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.8); z-index: 1000; overflow-y: auto;
            font-family: sans-serif;
        `;

        modalEroi.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; padding-bottom: 10px;">
                <h2>Panoramica Eroi (Solo Master)</h2>
                <button id="chiudi-eroi-master" style="background: #d9534f; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">Chiudi</button>
            </div>
            <div id="lista-eroi-contenitore" style="margin-top: 15px;">
                <p>Caricamento eroi in corso...</p>
            </div>
        `;

        document.body.appendChild(modalEroi);

        document.getElementById('chiudi-eroi-master').addEventListener('click', () => {
            modalEroi.style.display = 'none';
        });
    }

    modalEroi.style.display = 'block';
    const contenitore = document.getElementById('lista-eroi-contenitore');
    contenitore.innerHTML = '<p>Caricamento eroi in corso...</p>';

    get(child(ref(database), 'stanze/' + stanzaId + '/personaggi')).then((snapshot) => {
        const personaggi = snapshot.val();
        
        if (!personaggi || Object.keys(personaggi).length === 0) {
            contenitore.innerHTML = '<p style="color: #aaa;">Nessun eroe registrato in questa sessione.</p>';
            return;
        }

        let html = "";
        for (const [nomeEroe, dati] of Object.entries(personaggi)) {
            if (nomeEroe === "Master") continue;

            const classe = dati.classe || "Non specificata";
            const razza = dati.razza || "Non specificata";
            const descrizione = dati.descrizione || "Nessuna descrizione.";
            const obiettivo = dati.obiettivo || "Nessun obiettivo.";
            
            // Pescano correttamente dall'oggetto "statistiche" salvato in script.js
            const stats = dati.statistiche || {};

            html += `
                <div style="background: #2a2a2a; border: 1px solid #444; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                    <h3 style="color: #ffcc00; margin-top: 0; border-bottom: 1px solid #444; padding-bottom: 8px;">${nomeEroe} <span style="font-size: 14px; color: #aaa; font-weight: normal;">(${razza} - ${classe})</span></h3>
                    <p style="margin: 5px 0;"><b>Descrizione:</b> ${descrizione}</p>
                    <p style="margin: 5px 0;"><b>Obiettivo:</b> ${obiettivo}</p>
                    <div style="margin-top: 10px; background: #333; padding: 10px; border-radius: 5px;">
                        <h4 style="margin: 0 0 8px 0; color: #ff9900; font-size: 14px;">Caratteristiche e Modificatori:</h4>
                        <div style="display: flex; flex-wrap: wrap; gap: 15px;">
            `;

            const listaCaratteristiche = ['forza', 'destrezza', 'costituzione', 'intelligenza', 'saggezza', 'carisma'];
            let trovate = false;

            listaCaratteristiche.forEach(car => {
                const val = stats[car];
                if (val !== undefined && val !== "") {
                    trovate = true;
                    const mod = calcolaModificatore(val);
                    html += `<div style="background: #222; padding: 5px 10px; border-radius: 4px; border: 1px solid #555;"><b>${car.toUpperCase()}:</b> ${val} <span style="color: #ffcc00;">(${mod})</span></div>`;
                }
            });

            if (!trovate) {
                html += `<span style="color: #888; font-size: 13px;">Nessuna caratteristica registrata.</span>`;
            }

            html += `
                        </div>
                    </div>
                </div>
            `;
        }

        contenitore.innerHTML = html;
    }).catch((error) => {
        console.error("Errore caricamento eroi:", error);
        contenitore.innerHTML = '<p style="color: #d9534f;">Errore nel caricamento dei dati degli eroi.</p>';
    });
}
