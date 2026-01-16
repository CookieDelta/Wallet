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
        contenedor.innerHTML = `
            <div class="text-center py-5">
                <span class="display-1">📭</span>
                <h4 class="mt-3 text-muted">No hay transacciones aún</h4>
                <p class="text-muted">Realiza tu primer depósito o transferencia</p>
                <a href="menu.html" class="btn btn-primary rounded-4 mt-2">Volver al menú</a>
            </div>
        `;
        return;
    }

    const totalDepositos = transacciones
        .filter(t => t.tipo === 'Depósito')
        .reduce((sum, t) => sum + t.monto, 0);
    
    const totalTransferencias = transacciones
        .filter(t => t.tipo === 'Transferencia')
        .reduce((sum, t) => sum + t.monto, 0);
    
    const saldoNeto = totalDepositos - totalTransferencias;
    
    document.getElementById('totalDepositos').textContent = `$${totalDepositos.toFixed(0)}`;
    document.getElementById('totalTransferencias').textContent = `$${totalTransferencias.toFixed(0)}`;
    document.getElementById('saldoNeto').textContent = `$${saldoNeto.toFixed(0)}`;

    let tablaHTML = `
        <div class="table-responsive">
            <table class="table table-hover align-middle" id="tablaTransacciones">
                <thead class="table-light">
                    <tr>
                        <th class="rounded-start-4">Tipo</th>
                        <th>Destinatario</th>
                        <th>Banco</th>
                        <th>Cuenta/RUT</th>
                        <th>Monto</th>
                        <th class="rounded-end-4">Fecha</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // ultimas 10
    transacciones.slice(0, 10).forEach(t => {  
        let destinatario = '-';
        let bancoInfo = '-';
        let cuentaInfo = '-';
        let tipoBadge = '';
        let montoColor = '';
        let montoSigno = '';
        
        if (t.tipo === 'Depósito') {
            destinatario = 'Cuenta propia';
            tipoBadge = '<span class="badge bg-success">Depósito</span>';
            montoColor = 'text-success';
            montoSigno = '+';
        } else if (t.tipo === 'Transferencia') {
            destinatario = t.contacto || 'Sin nombre';
            bancoInfo = t.banco || '-';
            cuentaInfo = t.cuenta || (t.rut ? `RUT: ${t.rut}` : '-');
            tipoBadge = '<span class="badge bg-danger">Transferencia</span>';
            montoColor = 'text-danger';
            montoSigno = '-';
        } else {
            destinatario = t.contacto || '-';
            bancoInfo = t.banco || '-';
            cuentaInfo = t.cuenta || '-';
            tipoBadge = `<span class="badge bg-secondary">${t.tipo}</span>`;
            montoColor = 'text-secondary';
        }
        
        tablaHTML += `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <span class="tipo-transaccion" style="display: none;">${t.tipo}</span>
                        ${tipoBadge}
                    </div>
                </td>
                <td class="fw-medium">${destinatario}</td>
                <td>${bancoInfo}</td>
                <td><small class="text-muted">${cuentaInfo}</small></td>
                <td class="fw-bold ${montoColor}">${montoSigno}$${t.monto.toFixed(0)}</td>
                <td><small class="text-muted">${t.fecha}</small></td>
            </tr>
        `;
    });
    
    tablaHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    contenedor.innerHTML = tablaHTML;
    
    
    if (window.filtrarTransacciones) {
        window.filtrarTransacciones('todos');
    }
});