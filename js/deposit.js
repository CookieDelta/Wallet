document.addEventListener('DOMContentLoaded', function(){
    if(!localStorage.getItem('loggedIn')) window.location.href = 'login.html';

    const form = document.getElementById('depositForm');
    const mensaje = document.getElementById('mensaje');

    const obtenerSaldoActual = () => parseFloat(localStorage.getItem('saldo')) || 0;

    const mostrarSaldoActual = () => {
        const saldo = obtenerSaldoActual();
        const saldoInfo = document.createElement('p');
        saldoInfo.id = 'saldoInfo';
        saldoInfo.innerHTML = `<strong>Saldo actual: $${saldo.toFixed(2)}</strong>`;
        form.insertBefore(saldoInfo, form.firstChild);
    };



    let transacciones = [];
    try { 
        const transStr = localStorage.getItem('transacciones');
        if (transStr) {
            transacciones = JSON.parse(transStr);
        }
    } catch (e) {
        console.error('Error con la transaccion', e);
        transacciones = [];
    }
    mostrarSaldoActual();
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const monto = parseFloat(document.getElementById('monto').value);
        if (isNaN(monto)|| monto <=0) {
            mensaje.textContent = 'Por favor ingresa un monto válido';
            return;
        }

        const saldoActual = parseFloat(localStorage.getItem('saldo')) || 0;
        const nuevoSaldo = saldoActual + monto;

        localStorage.setItem('saldo', nuevoSaldo);

        transacciones.unshift({
            tipo:'Depósito',
            monto: monto,
            fecha: new Date().toLocaleString(),
            descripcion: "Depósito a cuenta propia"
        });
        localStorage.setItem('transacciones', JSON.stringify(transacciones));

        // Modal de éxito
        const segundos = 5;
        let tiempoRestante = segundos;

        const modalHTML = `
        <div class="modal fade show" id="successModal" tabindex="-1" style="display: block; background-color: rgba(0,0,0,0.5)">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 rounded-4 shadow-lg">
                    <div class="modal-body p-4 text-center">
                        <div class="mb-3">
                            <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex p-3">
                                <span class="display-6">💰</span>
                            </div>
                        </div>
                        <h4 class="fw-bold text-success mb-2">¡Depósito exitoso!</h4>
                        <p class="mb-1">Se depositaron <strong>$${monto.toFixed(0)}</strong> en tu cuenta</p>
                        <p class="mb-3">Nuevo saldo: <strong class="text-success">$${nuevoSaldo.toFixed(0)}</strong></p>
                        
                        <div class="progress mb-3" style="height: 6px;">
                            <div class="progress-bar bg-success" id="countdownBar" style="width: 100%"></div>
                        </div>
                        
                        <p class="text-muted small mb-0">
                            Redirigiendo en <span id="countdownText">${tiempoRestante}</span> segundos...
                        </p>
                    </div>
                </div>
            </div>
        </div>
        `;

        // Agregar modal al body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Countdown
        const countdownInterval = setInterval(() => {
            tiempoRestante--;
            document.getElementById('countdownText').textContent = tiempoRestante;
            const porcentaje = (tiempoRestante / segundos) * 100;
            document.getElementById('countdownBar').style.width = `${porcentaje}%`;
            
            if (tiempoRestante <= 0) {
                clearInterval(countdownInterval);
                window.location.href = 'menu.html';
            }
        }, 1000);

        form.reset();
       
        mensaje.textContent = '';
        mensaje.style.color = '';

    });

});