// dadi.js - Gestisce la modale di selezione e tiro dei dadi

export function apriSchermataDadi() {
    let modalDadi = document.getElementById('modal-lancio-dadi');

    if (!modalDadi) {
        modalDadi = document.createElement('div');
        modalDadi.id = 'modal-lancio-dadi';
        modalDadi.style.cssText = `
            position: fixed; top: 10%; left: 10%; width: 80%; max-width: 500px;
            background: #222; color: #fff; padding: 20px; border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.8); z-index: 2000; font-family: sans-serif;
            box-sizing: border-box; max-height: 80vh; overflow-y: auto;
        `;

        modalDadi.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; padding-bottom: 10px;">
                <h2 style="margin: 0; font-size: 20px; color: #ffcc00;">Lancio Dadi</h2>
                <button id="chiudi-dadi" style="background: #d9534f; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">Chiudi</button>
            </div>
            
            <div style="margin-top: 15px;">
                <p style="font-size: 14px; color: #aaa; margin-bottom: 15px;">Seleziona la quantità per ogni tipo di dado che desideri tirare:</p>
                
                <div id="lista-selettori-dadi" style="display: flex; flex-direction: column; gap: 10px;">
                    <!-- Generati dinamicamente via JS -->
                </div>

                <button id="btn-esegui-lancio" style="width: 100%; margin-top: 20px; background: #f0ad4e; color: #222; border: none; padding: 12px; font-weight: bold; font-size: 16px; border-radius: 5px; cursor: pointer;">Tira i Dadi!</button>
            </div>

            <div id="risultato-dadi-container" style="margin-top: 20px; border-top: 1px solid #444; padding-top: 15px; display: none;">
                <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #ff9900;">Risultati del Lancio:</h3>
                <div id="box-risultati" style="background: #111; padding: 10px; border-radius: 5px; font-size: 15px; min-height: 40px; word-break: break-word;"></div>
            </div>
        `;

        document.body.appendChild(modalDadi);

        // Chiusura modale
        document.getElementById('chiudi-dadi').addEventListener('click', () => {
            modalDadi.style.display = 'none';
        });

        // Configurazione dei tipi di dadi disponibili in D&D
        const tipiDadi = [4, 6, 8, 10, 12, 20, 100];
        const containerSelettori = document.getElementById('lista-selettori-dadi');

        tipiDadi.forEach(facce => {
            const riga = document.createElement('div');
            riga.style.cssText = `
                display: flex; justify-content: space-between; align-items: center;
                background: #2a2a2a; padding: 8px 12px; border-radius: 6px; border: 1px solid #444;
            `;
            riga.innerHTML = `
                <span style="font-weight: bold; font-size: 16px; color: #ffcc00;">d${facce}</span>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button class="btn-meno" data-facce="${facce}" style="background: #444; color: #fff; border: none; width: 30px; height: 30px; border-radius: 4px; font-weight: bold; cursor: pointer;">-</button>
                    <span id="qta-d${facce}" style="width: 25px; text-align: center; font-weight: bold; font-size: 16px;">0</span>
                    <button class="btn-piu" data-facce="${facce}" style="background: #444; color: #fff; border: none; width: 30px; height: 30px; border-radius: 4px; font-weight: bold; cursor: pointer;">+</button>
                </div>
            `;
            containerSelettori.appendChild(riga);
        });

        // Gestione pulsanti più / meno quantità
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

        // Azione del tiro dadi
        document.getElementById('btn-esegui-lancio').addEventListener('click', () => {
            const boxRisultati = document.getElementById('box-risultati');
            const containerRisultati = document.getElementById('risultato-dadi-container');
            
            let htmlRisultati = "";
            let totaleGenerale = 0;
            let haTiratoQualcosa = false;

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

            htmlRisultati += `<div style="margin-top: 10px; border-top: 1px dashed #555; padding-top: 6px; font-size: 16px; color: #5bc0de;"><b>Totale Complessivo: ${totaleGenerale}</b></div>`;

            boxRisultati.innerHTML = htmlRisultati;
            containerRisultati.style.display = 'block';
        });
    }

    modalDadi.style.display = 'block';
}
