document.addEventListener('DOMContentLoaded', function(){
    if(!localStorage.getItem('loggedIn')){
        window.location.href = 'login.html';
            return;
    }

    const contenedor = document.getElementById('contenedorTabla');

    let transacciones = [];
    try {
        const transStr = localStorage.getItem('transacciones');
        if (transStr) transacciones = JSON.parse(transStr);
    } catch (e) {
        console.error('Error', e);
    }
    if (transacciones.length === 0) {
        contenedor.innerHTML = '<p>No hay transacciones aún</p>';
        return;
    }

    //Tabla
    let tablaHTML = '<table border="1">';
    tablaHTML += '<tr><th>Tipo</th><th>Destinatario</th><th>Banco</th><th>Cuenta/RUT</th><th>Monto</th><th>Fecha</th></tr>';
    
    transacciones.slice(0, 10).forEach(t => {  
        let destinatario = '-';
        let bancoInfo = '-';
        let cuentaInfo = '-';
        
        if (t.tipo === 'Depósito') {
            destinatario = 'Cuenta propia';
        } else if (t.tipo === 'Transferencia') {
            destinatario = t.contacto || 'Sin nombre';
            bancoInfo = t.banco || '-';
            cuentaInfo = t.cuenta || (t.rut ? `RUT: ${t.rut}` : '-');
        } else {
            // Para transacciones antiguas
            destinatario = t.contacto || '-';
            bancoInfo = t.banco || '-';
            cuentaInfo = t.cuenta || '-';
        }
        
        tablaHTML += `<tr>
            <td>${t.tipo}</td>
            <td>${destinatario}</td>
            <td>${bancoInfo}</td>
            <td>${cuentaInfo}</td>
            <td>$${t.monto}</td>
            <td>${t.fecha}</td>
        </tr>`;
    });
    
    tablaHTML += '</table>';
    contenedor.innerHTML = tablaHTML;
});