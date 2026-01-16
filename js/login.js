document.addEventListener('DOMContentLoaded', function(){
    
    const USUARIO = {usuario: 'test', password: '1234'};
    
    const form = document.getElementById('loginForm');

    const error = document.getElementById('error');

    form.addEventListener('submit', function(e){
        e.preventDefault();
        const user= document.getElementById('usuario').value;
        const pass= document.getElementById('password').value;

        if (user === USUARIO.usuario && pass === USUARIO.password) {
            localStorage.setItem('loggedIn', 'true');
            
            if (!localStorage.getItem('saldo')){
                localStorage.setItem('saldo', '1000');
            }
            if (!localStorage.getItem('transacciones')){
            localStorage.setItem('transacciones', JSON.stringify([]));
            }
            window.location.href = 'menu.html';
            
        } 
        else {
            error.textContent = 'Usuario o contraseña inválida';
            error.style.display = 'block';
        }
    });

});