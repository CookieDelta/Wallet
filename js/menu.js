$(document).ready(function() { //animacion
    //debug
    console.log('menu.js cargado')

    if (!localStorage.getItem('loggedIn')) {
        $('body').addClass('page-exit');
        setTimeout(function(){
            window.location.href = 'login.html';
        }, 500);
        return;
    }

    function actualizarSaldo() {
        //const saldoElement = document.getElementById('saldo');
        const saldoElement = $('#saldo');
        const saldo = parseFloat(localStorage.getItem('saldo')) || 0;
        //saldoElement.textContent = saldo.toFixed(0);
        saldoElement.text(`$${saldo.toFixed(0)}`);

        saldoElement.css({
            'transform': 'scale(1.1)',
            'transition': 'transform 0.3s ease'});
        setTimeout(function(){
            saldoElement.css('transform', 'scale(1)');
        }, 300);
    }

    /* function logout() {
        localStorage.removeItem('loggedIn');
        // localStorage.removeItem('saldo');
        // localStorage.removeItem('transacciones');
        */

/* //logout 2
    window.logout = function(e){
        if (e) e.preventDefault();

        //Salida
        $('body').addClass('page-exit');

        localStorage.removeItem('loggedIn');

        setTimeout(function(){
            window.location.href = 'index.html';
        }, 500);
        return false;
    };
  */

    $('#logoutLink').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Cerrando sesión...');
        
        // Animación de salida
        $('body').addClass('page-exit');
        
        // Limpiar datos de sesión
        localStorage.removeItem('loggedIn');
        
        // Redirigir después de la animación
        setTimeout(function(){
            window.location.href = 'index.html';
        }, 500);
        
        return false;
    });

    actualizarSaldo();

     $(window).on('pageshow', actualizarSaldo);
    
    //$('body').removeClass('page-enter');

    setTimeout(function() {
        $('body').removeClass('page-enter');
    }, 100);
});

//document.addEventListener('DOMContentLoaded', actualizarSaldo);

//window.addEventListener('pageshow', actualizarSaldo);