document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('loggedIn')) {
        window.location.href = 'login.html';
        return;
    }
    
    const form = document.getElementById('sendForm');
    const mensaje = document.getElementById('mensaje');
    const obtenerSaldoActual = () => parseFloat(localStorage.getItem('saldo')) || 0;
    
    const mostrarSaldoActual = () => {
        const saldo = obtenerSaldoActual();
        const saldoInfo = document.createElement('p');
        saldoInfo.id = 'saldoInfo'
        saldoInfo.innerHTML = `<strong> Saldo disponible: $${saldo.toFixed(0)}</strong>`;
        form.insertBefore(saldoInfo, form.firstChild);
    };

    let transacciones = [];
    try {
        const transStr = localStorage.getItem('transacciones');
        if (transStr) transacciones = JSON.parse(transStr);
    } catch (e) {
        console.error('Error transacciones:', e);
    }
    mostrarSaldoActual()
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombreDest').value;
        const rut = document.getElementById('rut').value;
        const banco = document.getElementById('banco').value;
        const tipoCuenta = document.getElementById('tipoCuenta').value;
        const monto = parseFloat(document.getElementById('monto').value);

        const saldoActual = obtenerSaldoActual();
        
        
        if (monto > saldoActual) {
            mensaje.textContent = `Saldo insuficiente. Tienes $${saldoActual}`;
            mensaje.style.color = 'red';
            return;
        }
        
        
        const nuevoSaldo = saldoActual - monto;
        localStorage.setItem('saldo', nuevoSaldo);
        
        
        transacciones.unshift({
            tipo: 'Transferencia',  
            contacto: nombre,        
            rut: rut,               
            banco: banco,           
            tipoCuenta: tipoCuenta, 
            cuenta: `${tipoCuenta} ${rut}`, 
            monto: monto,
            fecha: new Date().toLocaleString(),
            descripcion: `Transferencia a ${nombre}`
        });
        localStorage.setItem('transacciones', JSON.stringify(transacciones));
        
        mensaje.textContent = `¡Transferencia exitosa! $${monto} a ${nombre}. Nuevo saldo: $${nuevoSaldo} Espere mientras es redirigido a la página principal...`;
        mensaje.style.color = 'green';
        
        form.reset();
        setTimeout(() => window.location.href = 'menu.html', 5000);
    });
});
