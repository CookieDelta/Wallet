document.addEventListener('DOMContentLoaded', function(){
    if(!localStorage.getItem('loggedIn')) window.location.href = 'login.html';

    const form = document.getElementById('depositForm');
    const mensaje = document.getElementById('mensaje');

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

        mensaje.textContent = 'Has realizado un deposito por: $ ' +monto +  ' Nuevo saldo: $ '+nuevoSaldo+ '   Espere mientras es redirigido a la página principal...'; 

        form.reset();
        setTimeout(() => window.location.href = 'menu.html', 5000);

    });

});