document.addEventListener('DOMContentLoaded', function(){
    
    const USUARIO = [{usuario: 'test', password: '1234'},
                    {usuario: 'cosa', password: 'cosa'}
    ];
    
    const form = document.getElementById('loginForm');

    const error = document.getElementById('error');

    form.addEventListener('submit', function(e){
        e.preventDefault();
        const user= document.getElementById('usuario').value;
        const pass= document.getElementById('password').value;

        const usuarioValido = USUARIO.find(u => u.usuario === user && u.password ===pass);

        if (usuarioValido) {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('username', user)
            
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