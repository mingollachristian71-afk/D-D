// dadi.js - Gestione dadi integrata con caratteristiche da database

import { ref, get, child } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

function calcolaModificatore(valore) {
    const num = parseInt(valore) || 10;
    const mod = Math.floor((num - 10) / 2);
    return mod >= 0 ? "+" + mod : "" + mod;
}

export function apriSchermataDadi(database, stanzaId, mioNome) {
    let modalDadi = document.getElementById('modal-lancio-dadi');

    if (!modalDadi) {
        modalDadi = document.createElement('div');
        modalDadi.id = 'modal-lancio-dadi';
        modalDadi.style.cssText = `
            position: fixed; top: 5%; left: 5%; width: 90%; max-width: 800px;
            background: #222; color: #fff; padding: 20px; border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.8); z-index: 2000; font-family: sans-serif;
            box-sizing: border-box; max-height: 90vh; overflow-y: auto;
        `;

        modalDadi.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; padding-bottom: 10px;">
                <h2 style="margin: 0; font-size: 20px; color: #ffcc00;">Lancio Dadi e Abilità</h2>
                <button id="chiudi-dadi" style="background: #d9534f; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">Chiudi</button>
            </div>
            
            <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-top: 15px;">
                <!-- COLONNA SINISTRA: SELEZIONE DADI -->
                <div style="flex: 1; min-width: 280px;">
                    <p style="font-size: 14px; color: #aaa; margin-bottom: 10px;"><b>1. Seleziona i Dadi:</b></p>
                    <div id="lista-selettori-dadi" style="display: flex; flex-direction: column; gap: 8px;"></div>
                </div>

                <!-- COLONNA DESTRA: MODIFICATORI CARATTERISTICHE -->
                <div style="flex: 1; min-width: 280px; background: #1a1a1a; padding: 12px; border-radius: 6px; border: 1px solid #444;">
                    <p style="font-size: 14px; color: #ff9900; margin-top: 0; margin-bottom: 10px;"><b>2. Seleziona Caratteristica (Opzionale):</b></p>
                    <div id="lista-modificatori-dadi" style="display: flex; flex-direction: column; gap: 8px;">
                        <p style="color: #888; font-size: 13px;">Caricamento caratteristiche...</p>
                    </div>
                </div>
            </div>

            <button id="btn-esegui-lancio" style="width: 100%; margin-top: 20px; background: #f0ad4e; color: #222; border: none; padding: 12px; font-weight: bold; font-size: 16px; border-radius: 5px; cursor: pointer;">Tira i Dadi!</button>

            <div id="risultato-dadi-container" style="margin-top: 20px; border-top: 1px solid #444; padding-top: 15px; display: none;">
                <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #5bc0de;">Risultati del Lancio:</h3>
                <div id="box-risultati" style="background: #111; padding: 12px; border-radius: 5px; font-size: 15px; min-height: 40px; word-break: break-word;"></div>
            </div>
        `;

        document.body.appendChild(modalDadi);

        // Chiusura modale
        document.getElementById('chiudi-dadi').addEventListener('click', () => {
            modalDadi.style.display = 'none';
        });

        // Configurazione selettori dadi (d4, d6, d8, d10, d12, d20, d100)
        const tipiDadi = [4, 6, 8, 10, 12, 20, 100];
        const containerSelettori = document.getElementById('lista-selettori-dadi');

        tipiDadi.forEach(facce => {
            const riga = document.createElement('div');
            riga.style.cssText = `
                display: flex; justify-content: space-between; align-items: center;
                background: #2a2a2a; padding: 6px 10px; border-radius: 6px; border: 1px solid #444;
            `;
            riga.innerHTML = `
                <span style="font-weight: bold; font-size: 15px; color: #ffcc00;">d${facce}</span>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <button class="btn-meno" data-facce="${facce}" style="background: #444; color: #fff; border: none; width: 28px; height: 28px; border-radius: 4px; font-weight: bold; cursor: pointer;">-</button>
                    <span id="qta-d${facce}" style="width: 20px; text-align: center; font-weight: bold; font-size: 15px;">0</span>
                    <button class="btn-piu" data-facce="${facce}" style="background: #444; color: #fff; border: none; width: 28px; height: 28px; border-radius: 4px; font-weight: bold; cursor: pointer;">+</button>
                </div>
            `;
            containerSelettori.appendChild(riga);
        });

        // Gestione tasti più/meno quantità dadi
        modalDadi.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-piu') || e.target.classList.contains('btn-meno')) {
                const facce = e.target.getAttribute('data-facce');
                const spanQta = document.getElementById(`qta-d${facce}`);
                let qta = parseInt(spanQta.textContent);

                if (e.target.classList.contains('btn-piu')) {
                    qta++;
                } else if (e.target.classList.contains('btn-meno') && qta > 0) {
                    qta--;
                }
                spanQta.textContent = qta;
            }
        });
    }

    modalDadi.style.display = 'block';

    // Caricamento in tempo reale dei modificatori del personaggio dal database
    const containerModificatori = document.getElementById('lista-modificatori-dadi');
    containerModificatori.innerHTML = '<p style="color: #888; font-size: 13px;">Caricamento caratteristiche...</p>';

    // Se è il Master, non ha una scheda PG propria, mostriamo modificatori a zero o generici
    if (mioNome === "Master") {
        disegnaModificatori({});
        return;
    }

    get(child(ref(database), 'stanze/' + stanzaId + '/personaggi/' + mioNome)).then((snapshot) => {
        const dati = snapshot.val() || {};
        const stats = dati.statistiche || {};
        disegnaModificatori(stats);
    }).catch(() => {
        disegnaModificatori({});
    });

    function disegnaModificatori(stats) {
        const caratteristiche = ['forza', 'destrezza', 'costituzione', 'intelligenza', 'saggezza', 'carisma'];
        let html = "";

        caratteristiche.forEach(car => {
            const val = stats[car] || 10;
            const modVal = ottieniModificatoreValore(val);
            const modStr = calcolaModificatore(val);

            html += `
                <label style="display: flex; align-items: center; gap: 8px; background: #222; padding: 6px 10px; border-radius: 4px; cursor: pointer; border: 1px solid #444;">
                    <input type="checkbox" name="modificatore-selezionato" value="${modVal}" data-nome="${car.toUpperCase()}">
                    <span style="text-transform: uppercase; flex: 1; font-size: 14px;"><b>${car}</b> (${val})</span>
                    <span style="font-size: 14px; color: #ffcc00; font-weight: bold;">${modStr}</span>
                </label>
            `;
        });

        containerModificatori.innerHTML = html;
    }

    function ottieniModificatoreValore(valore) {
        const num = parseInt(valore) || 10;
        return Math.floor((num - 10) / 2);
    }

    // Gestione Evento click sul tasto "Tira i Dadi!"
    const btnEsegui = document.getElementById('btn-esegui-lancio');
    const nuovoBtnEsegui = btnEsegui.cloneNode(true);
    btnEsegui.parentNode.replaceChild(nuovoBtnEsegui, btnEsegui);

    nuovoBtnEsegui.addEventListener('click', () => {
        const tipiDadi = [4, 6, 8, 10, 12, 20, 100];
        const boxRisultati = document.getElementById('box-risultati');
        const containerRisultati = document.getElementById('risultato-dadi-container');
        
        let htmlRisultati = "";
        let totaleGenerale = 0;
        let haTiratoQualcosa = false;

        // 1. Calcolo tiri dei dadi
        tipiDadi.forEach(facce => {
            const qta = parseInt(document.getElementById(`qta-d${facce}`).textContent);
            if (qta > 0) {
                haTiratoQualcosa = true;
                let singoliTiri = [];
                let sommaParziale = 0;

                for (let i = 0; i < qta; i++) {
                    const tiro = Math.floor(Math.random() * facce) + 1;
                    singoliTiri.push(tiro);
                    sommaParziale += tiro;
                }

                totaleGenerale += sommaParziale;
                htmlRisultati += `<div style="margin-bottom: 6px;"><b>${qta}d${facce}:</b> [${singoliTiri.join(', ')}] <span style="color: #ffcc00;">(Somma: ${sommaParziale})</span></div>`;
            }
        });

        if (!haTiratoQualcosa) {
            alert("Seleziona almeno un dado da tirare!");
            return;
        }

        // 2. Aggiunta dei modificatori spuntati
        const checkSelezionati = modalDadi.querySelectorAll('input[name="modificatore-selezionato"]:checked');
        if (checkSelezionati.length > 0) {
            let sommaModificatori = 0;
            let nomiModificatori = [];

            checkSelezionati.forEach(chk => {
                const valMod = parseInt(chk.value);
                const nomeMod = chk.getAttribute('data-nome');
                sommaModificatori += valMod;
                nomiModificatori.push(`${nomeMod} (${valMod >= 0 ? '+' + valMod : valMod})`);
            });

            totaleGenerale += sommaModificatori;
            htmlRisultati += `<div style="margin-top: 6px; color: #f0ad4e;"><b>Modificatori applicati:</b> ${nomiModificatori.join(', ')}</div>`;
        }

        htmlRisultati += `<div style="margin-top: 10px; border-top: 1px dashed #555; padding-top: 6px; font-size: 17px; color: #5bc0de;"><b>Totale Complessivo: ${totaleGenerale}</b></div>`;

        boxRisultati.innerHTML = htmlRisultati;
        containerRisultati.style.display = 'block';
    });
}
