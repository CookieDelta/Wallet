/* Transiciones globales para páginas, con JQuery */

// GLOBAL.JS - Maneja transiciones entre páginas para TODO el sitio

$(document).ready(function() {
    console.log('Global.js cargado - Transiciones activadas');
    
    // Agregar clase de transición a todas las páginas
    $('body').addClass('page-transition');
    
    // Crear overlay de carga si no existe
    if ($('#pageLoadingOverlay').length === 0) {
        $('body').append(`
            <div id="pageLoadingOverlay">
                <div class="loading-content">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <p class="mt-3">Cargando...</p>
                </div>
            </div>
        `);
    }
    
    // Función para navegar con transición
    window.navigateWithTransition = function(url, callback) {
        // Mostrar overlay
        $('#pageLoadingOverlay').fadeIn(300);
        
        // Animación de salida
        $('body').addClass('page-exit');
        
        // Esperar animación y navegar
        setTimeout(function() {
            if (callback && typeof callback === 'function') {
                callback();
            }
            window.location.href = url;
        }, 400);
        
        return false;
    };
    
    // SOLO aplicar a enlaces específicos con clase .page-link
    $('a.page-link').on('click', function(e) {
        e.preventDefault();
        const href = $(this).attr('href');
        window.navigateWithTransition(href);
    });
    
    // Para botones con clase .page-btn
    $('button.page-btn, .btn.page-btn').on('click', function() {
        const url = $(this).data('href') || $(this).attr('href');
        if (url) {
            window.navigateWithTransition(url);
        }
    });
    
    // Remover clase de entrada después de cargar
    setTimeout(function() {
        $('body').removeClass('page-enter');
    }, 100);
    
    // Para debugging
    console.log('Transiciones configuradas para:');
    console.log('- Enlaces con clase .page-link:', $('a.page-link').length);
    console.log('- Botones con clase .page-btn:', $('.page-btn').length);
});