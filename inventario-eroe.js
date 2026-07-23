// inventario-eroe.js - Gestisce l'inventario personale e il denaro dell'eroe (memoria locale)

let oroEroiLocale = {};
let oggettiEroiLocali = {};

export function apriSchermataInventarioEroe(mioNome) {
    let modalInventario = document.getElementById('modal-inventario-eroe');

    if (!modalInventario) {
        modalInventario = document.createElement('div');
        modalInventario.id = 'modal-inventario-eroe';
        modalInventario.style.cssText = `
            position: fixed; top: 10%; left: 10%; width: 80%; height: 80%;
            background: #222; color: #fff; padding: 20px; border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.8); z-index: 1000; display: flex; flex-direction: column;
            font-family: sans-serif;
        `;

        modalInventario.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; padding-bottom: 10px; margin-bottom: 15px;">
                <h2 id="titolo-inventario-eroe">Inventario di Eroe</h2>
                <button id="chiudi-inventario-eroe" style="background: #d9534f; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">Chiudi</button>
            </div>
            
            <!-- Casella del Denaro (Oro) -->
            <div style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                <label for="input-oro-eroe" style="font-weight: bold; color: #ffcc00; font-size: 16px;">Oro posseduto:</label>
                <input type="number" id="input-oro-eroe" placeholder="0" style="width: 120px; padding: 8px; font-size: 16px; border-radius: 5px; border: 1px solid #555; background: #333; color: white; text-align: center;">
            </div>

            <!-- Casella Grande degli Oggetti -->
            <div style="flex: 1; display: flex; flex-direction: column;">
                <p style="color: #aaa; font-size: 14px; margin-bottom: 5px;">
                    Elenca qui tutti gli oggetti che possiedi, le armi e le pozioni. Rimarrà salvato finché la sessione è aperta.
                </p>
                <textarea id="textarea-oggetti-eroe" placeholder="Scrivi qui i tuoi oggetti..." style="width: 100%; flex: 1; padding: 15px; font-size: 16px; border-radius: 5px; border: 1px solid #555; background: #333; color: white; resize: none; box-sizing: border-box;"></textarea>
            </div>
        `;

        document.body.appendChild(modalInventario);

        // Chiusura
        document.getElementById('chiudi-inventario-eroe').addEventListener('click', () => {
            modalInventario.style.display = 'none';
        });

        // Eventi per salvare in tempo reale nella memoria locale mentre si digita
        const inputOro = document.getElementById('input-oro-eroe');
        inputOro.addEventListener('input', (e) => {
            oroEroiLocale[mioNome] = e.target.value;
        });

        const textareaOggetti = document.getElementById('textarea-oggetti-eroe');
        textareaOggetti.addEventListener('input', (e) => {
            oggettiEroiLocali[mioNome] = e.target.value;
        });
    }

    // Mostra la modale e aggiorna i campi per l'eroe corrente
    modalInventario.style.display = 'flex';
    document.getElementById('titolo-inventario-eroe').textContent = 'Inventario Personale di ' + mioNome;

    const inputOro = document.getElementById('input-oro-eroe');
    const textareaOggetti = document.getElementById('textarea-oggetti-eroe');

    if (inputOro) inputOro.value = oroEroiLocale[mioNome] || "";
    if (textareaOggetti) textareaOggetti.value = oggettiEroiLocali[mioNome] || "";
}
