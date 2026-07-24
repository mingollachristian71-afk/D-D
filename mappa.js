// mappa.js - Gestisce la modale della mappa con supporto zoom (mouse/pinch) e pan (trascinamento)

export function apriMappa() {
    let modalMappa = document.getElementById('modal-mappa-gioco');

    if (!modalMappa) {
        modalMappa = document.createElement('div');
        modalMappa.id = 'modal-mappa-gioco';
        modalMappa.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.9); z-index: 2000; display: flex;
            flex-direction: column; align-items: center; justify-content: center;
            font-family: sans-serif; overflow: hidden;
        `;

        modalMappa.innerHTML = `
            <div style="position: absolute; top: 15px; right: 20px; z-index: 2010;">
                <button id="chiudi-mappa" style="background: #d9534f; color: white; border: none; padding: 10px 15px; cursor: pointer; border-radius: 5px; font-weight: bold; font-size: 16px;">Chiudi Mappa</button>
            </div>
            <div id="mappa-container" style="width: 100%; height: 100%; overflow: hidden; display: flex; align-items: center; justify-content: center; touch-action: none; position: relative;">
                <img id="immagine-mappa" src="" alt="Mappa di Gioco" style="max-width: 90%; max-height: 90%; object-fit: contain; cursor: grab; transform-origin: center; transition: transform 0.05s ease-out;" />
            </div>
        `;

        document.body.appendChild(modalMappa);

        // Chiusura modale
        document.getElementById('chiudi-mappa').addEventListener('click', () => {
            modalMappa.style.display = 'none';
        });

        // --- GESTIONE ZOOM E TRASCINAMENTO (Desktop & Mobile) ---
        const img = document.getElementById('immagine-mappa');
        let scale = 1;
        let panning = false;
        let pointX = 0;
        let pointY = 0;
        let startX = 0;
        let startY = 0;

        // Funzione per aggiornare la trasformazione dell'immagine
        function setTransform() {
            img.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
        }

        // 1. Zoom con la rotellina del mouse (Desktop)
        img.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomIntensity = 0.1;
            if (e.deltaY < 0) {
                scale += zoomIntensity;
            } else {
                scale = Math.max(1, scale - zoomIntensity);
            }
            if (scale === 1) {
                pointX = 0;
                pointY = 0;
            }
            setTransform();
        });

        // 2. TrascINamento con il mouse (Pan)
        img.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startX = e.clientX - pointX;
            startY = e.clientY - pointY;
            panning = true;
            img.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (!panning) return;
            pointX = e.clientX - startX;
            pointY = e.clientY - startY;
            setTransform();
        });

        window.addEventListener('mouseup', () => {
            panning = false;
            img.style.cursor = 'grab';
        });

        // 3. Supporto Touch per Telefono (Pinch-to-zoom & Pan con un dito)
        let initialDistance = null;

        img.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                // Movimento con un dito
                panning = true;
                startX = e.touches[0].clientX - pointX;
                startY = e.touches[0].clientY - pointY;
            } else if (e.touches.length === 2) {
                // Zoom con due dita (Pinch)
                panning = false;
                initialDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
            }
        });

        img.addEventListener('touchmove', (e) => {
            if (panning && e.touches.length === 1) {
                pointX = e.touches[0].clientX - startX;
                pointY = e.touches[0].clientY - startY;
                setTransform();
            } else if (e.touches.length === 2 && initialDistance) {
                const currentDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                const factor = currentDistance / initialDistance;
                scale = Math.min(Math.max(1, scale * factor), 5); // Limiti zoom tra 1x e 5x
                initialDistance = currentDistance;
                setTransform();
            }
        });

        img.addEventListener('touchend', () => {
            panning = false;
            initialDistance = null;
        });
    }

    // Inserisci qui il link o il percorso del file immagine della mappa quando ce l'avrai
    const imgElement = document.getElementById('immagine-mappa');
    imgElement.src = 'tuamappa.png'; // <--- Sostituisci con il percorso del tuo file immagine (es. png/jpg)

    modalMappa.style.display = 'flex';
}
