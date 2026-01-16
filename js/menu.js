if (!localStorage.getItem('loggedIn')) {
    window.location.href = 'login.html';
}

function actualizarSaldo() {
    const saldoElement = document.getElementById('saldo');
    const saldo = parseFloat(localStorage.getItem('saldo')) || 0;
    saldoElement.textContent = saldo.toFixed(0);
}

function logout() {
    localStorage.removeItem('loggedIn');
    // localStorage.removeItem('saldo');
    // localStorage.removeItem('transacciones');
}

document.addEventListener('DOMContentLoaded', actualizarSaldo);

window.addEventListener('pageshow', actualizarSaldo);