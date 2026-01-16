$(document).ready(function() {
    if (!localStorage.getItem('loggedIn')) {
        window.location.href = 'login.html';
        return;
    }
    
    const form = $('#sendForm');
    const mensaje = $('#mensaje');
    const obtenerSaldoActual = () => parseFloat(localStorage.getItem('saldo')) || 0;
    
    const contactosGuardados = [
        { nombre: "Juan Pérez Rodríguez", rut: "12.345.678-5", banco: "Banco Estado", tipoCuenta: "vista" },
        { nombre: "María González López", rut: "23.456.789-3", banco: "Santander", tipoCuenta: "corriente" },
        { nombre: "Carlos Silva Martínez", rut: "34.567.890-1", banco: "Banco de Chile", tipoCuenta: "ahorro" },
        { nombre: "Ana Torres Fernández", rut: "45.678.901-9", banco: "BCI", tipoCuenta: "vista" },
        { nombre: "Pedro Díaz Rojas", rut: "56.789.012-7", banco: "Scotiabank", tipoCuenta: "corriente" }
    ];

    let contactos = [];
    try {
        const contactosStr = localStorage.getItem('contactos');
        if (contactosStr) {
            contactos = JSON.parse(contactosStr);
        } else {
            contactos = contactosGuardados;
            localStorage.setItem('contactos', JSON.stringify(contactos));
        }
    } catch (e) {
        console.error('Error cargando contactos:', e);
        contactos = contactosGuardados;
    }

    const mostrarSaldoActual = () => {
        const saldo = obtenerSaldoActual();
        $('#saldoInfo').remove();
        
        const saldoInfo = $('<p>').attr('id', 'saldoInfo')
            .html(`<strong> Saldo disponible: $${saldo.toFixed(0)}</strong>`);
        form.prepend(saldoInfo);
    };

    // Función para validar y formatear RUT chileno, se verificará que cumpla con el algoritmo chileno (ACEPTARÁ SOLO RUTS VALIDOS/REALES)
function validarYFormatearRUT(rut) {
    // Limpiar el RUT: quitar puntos, guiones y espacios
    let rutLimpio = rut.replace(/[\.\-]/g, '').toUpperCase();
    
    // Separar el número del dígito verificador
    let cuerpo = rutLimpio.slice(0, -1);
    let dv = rutLimpio.slice(-1);
    
    // Validar num
    if (!/^\d+$/.test(cuerpo)) {
        return { valido: false, mensaje: 'El RUT debe contener números' };
    }
    
    // Validar que el dígito verificador sea número o K
    if (!/^[0-9K]$/.test(dv)) {
        return { valido: false, mensaje: 'Dígito verificador inválido' };
    }
    
    // Calcular dígito verificador esperado
    let suma = 0;
    let multiplo = 2;
    
    // Recorrer el cuerpo de derecha a izquierda
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i)) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    
    // Calcular dígito verificador esperado
    let dvEsperado = 11 - (suma % 11);
    let dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
    
    // Comparar dígito verificador
    if (dvCalculado !== dv) {
        return { valido: false, mensaje: 'RUT inválido' };
    }
    
    // Formatear RUT con puntos y guión
    let rutFormateado = '';
    for (let i = cuerpo.length - 1, j = 1; i >= 0; i--, j++) {
        rutFormateado = cuerpo.charAt(i) + rutFormateado;
        if (j % 3 === 0 && i !== 0) {
            rutFormateado = '.' + rutFormateado;
        }
    }
    
    rutFormateado = rutFormateado + '-' + dv;
    
    return { 
        valido: true, 
        rutFormateado: rutFormateado,
        rutNumerico: cuerpo,
        dv: dv
    };
}

// Función para formatear RUT mientras se escribe (input event)
function formatearRUTInput(rutInput) {
    let rut = rutInput.value;
    
    // Si está vacío, no hacer nada
    if (!rut) return;
    
    // Quitar todo excepto números y K
    let rutLimpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();
    
    // Si no hay nada después de limpiar, limpiar el campo
    if (!rutLimpio) {
        rutInput.value = '';
        return;
    }
    
    // Separar cuerpo y dv (último carácter)
    let cuerpo = rutLimpio.slice(0, -1);
    let dv = rutLimpio.slice(-1);
    
    // Formatear cuerpo con puntos
    let cuerpoFormateado = '';
    for (let i = cuerpo.length - 1, j = 1; i >= 0; i--, j++) {
        cuerpoFormateado = cuerpo.charAt(i) + cuerpoFormateado;
        if (j % 3 === 0 && i !== 0) {
            cuerpoFormateado = '.' + cuerpoFormateado;
        }
    }
    
    // Si hay cuerpo, agregar guión y dv
    if (cuerpoFormateado) {
        rutInput.value = cuerpoFormateado + '-' + dv;
    } else {
        rutInput.value = dv; // Solo el dv si no hay cuerpo
    }
    
    // Mover cursor al final
    rutInput.setSelectionRange(rutInput.value.length, rutInput.value.length);
}

    // Función para mostrar todos los contactos
    function mostrarTodosContactos() {
        const lista = $('#listaContactos .list-group');
        lista.empty();
        
        if (contactos.length === 0) {
            lista.append(`
                <div class="list-group-item text-muted text-center py-3">
                    No hay contactos guardados
                </div>
            `);
        } else {
            contactos.forEach((contacto, index) => {
                const item = $(`
                    <button type="button" class="list-group-item list-group-item-action contacto-item py-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>${contacto.nombre}</strong><br>
                                <small class="text-muted">RUT: ${contacto.rut} • Banco: ${contacto.banco}</small>
                            </div>
                            <span class="text-primary">→</span>
                        </div>
                    </button>
                `);
                
                item.data('contacto', contacto);
                lista.append(item);
            });
        }
        
        $('#listaContactos').show();
    }

    // Función para buscar contactos (FILTRAR)
    function buscarContactos(termino) {
        const lista = $('#listaContactos .list-group');
        lista.empty();
        
        if (!termino || termino.trim() === '') {
            mostrarTodosContactos();
            return;
        }
    
        const terminoLower = termino.toLowerCase();
        const coincidencias = contactos.filter(contacto => 
            contacto.nombre.toLowerCase().includes(terminoLower) || 
            contacto.rut.includes(termino) ||
            contacto.banco.toLowerCase().includes(terminoLower)
        );
        
        if (coincidencias.length === 0) {
            lista.append(`
                <div class="list-group-item text-muted text-center py-3">
                    No se encontraron contactos
                </div>
            `);
        } else {
            coincidencias.forEach((contacto, index) => {
                const item = $(`
                    <button type="button" class="list-group-item list-group-item-action contacto-item py-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>${contacto.nombre}</strong><br>
                                <small class="text-muted">RUT: ${contacto.rut} • Banco: ${contacto.banco}</small>
                            </div>
                            <span class="text-primary">→</span>
                        </div>
                    </button>
                `);
                
                item.data('contacto', contacto);
                lista.append(item);
            });
        }
        
        $('#listaContactos').show();
    }

    function autocompletarCampos(contacto) {
        $('#contactoCombo').val(contacto.nombre);
        $('#nombreDest').val(contacto.nombre);
        const rutFormateado = formatearRUTDesdeContacto(contacto.rut);
        $('#rut').val(contacto.rut);
        $('#banco').val(contacto.banco);
        $('#tipoCuenta').val(contacto.tipoCuenta);
        $('#listaContactos').hide();
        $('#monto').focus();

        $('#rut').removeClass('is-invalid is-valid');
        $('#rutError').remove();
    }

    // Función auxiliar para formatear RUT desde contacto
    function formatearRUTDesdeContacto(rut) {
        if (rut.includes('-')) {
            return rut;
        }
        
        // Formatear RUT sin formato
        let rutLimpio = rut.replace(/[\.\-]/g, '').toUpperCase();
        let cuerpo = rutLimpio.slice(0, -1);
        let dv = rutLimpio.slice(-1);
        
        // Formatear con puntos
        let cuerpoFormateado = '';
        for (let i = cuerpo.length - 1, j = 1; i >= 0; i--, j++) {
            cuerpoFormateado = cuerpo.charAt(i) + cuerpoFormateado;
            if (j % 3 === 0 && i !== 0) {
                cuerpoFormateado = '.' + cuerpoFormateado;
            }
        }
        
        return cuerpoFormateado + '-' + dv;
    }

    // Eventos para el campo combinado
    $('#contactoCombo').on('focus', function() {
        mostrarTodosContactos();
    });
    
    $('#contactoCombo').on('input', function() {
        buscarContactos($(this).val());
    });
    
    $('#contactoCombo').on('keydown', function(e) {
        if (e.key === 'Escape') {
            $('#listaContactos').hide();
        }
    });
    
    // Seleccionar contacto de la lista
    $(document).on('click', '.contacto-item', function() {
        const contacto = $(this).data('contacto');
        autocompletarCampos(contacto);
    });
    
    //hidelist
    $(document).on('click', function(e) {
        if (!$(e.target).closest('#contactoCombo, #listaContactos').length) {
            $('#listaContactos').hide();
        }
    });
    
    // Limpiar campo de contacto
    $('#contactoCombo').on('dblclick', function() {
        $(this).val('');
        $('#nombreDest').val('');
        $('#rut').val('');
        $('#banco').val('');
        $('#tipoCuenta').val('');
    });

    // Botones de monto rápido
    $(document).on('click', '.quick-amount', function(e) {
        e.preventDefault();
        const amount = $(this).data('amount');
        
        if (amount) {
            $('#monto').val(amount).focus();
            
            $(this).addClass('btn-primary').removeClass('btn-outline-primary');
            setTimeout(() => {
                $(this).removeClass('btn-primary').addClass('btn-outline-primary');
            }, 300);
        }
    });

    // Funciones de error
    function mostrarModalError(mensaje) {
        const modalHTML = `
        <div class="modal fade show" id="errorModal" tabindex="-1" style="display: block; background-color: rgba(0,0,0,0.5)">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 rounded-4 shadow-lg">
                    <div class="modal-body p-4 text-center">
                        <div class="mb-3">
                            <div class="bg-danger bg-opacity-10 rounded-circle d-inline-flex p-3">
                                <span class="display-6">❌</span>
                            </div>
                        </div>
                        <h4 class="fw-bold text-danger mb-2">Error en la transferencia</h4>
                        <p class="mb-3">${mensaje}</p>
                        
                        <button class="btn btn-danger rounded-4 px-4" onclick="$('#errorModal').remove()">
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        $('#errorModal').remove();
        $('body').append(modalHTML);
    }

    function mostrarModalErrorSaldo(montoSolicitado, saldoDisponible) {
        const modalHTML = `
        <div class="modal fade show" id="errorModal" tabindex="-1" style="display: block; background-color: rgba(0,0,0,0.5)">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 rounded-4 shadow-lg">
                    <div class="modal-body p-4 text-center">
                        <div class="mb-3">
                            <div class="bg-danger bg-opacity-10 rounded-circle d-inline-flex p-3">
                                <span class="display-6">💰</span>
                            </div>
                        </div>
                        <h4 class="fw-bold text-danger mb-2">Saldo insuficiente</h4>
                        
                        <div class="alert alert-danger border-0 rounded-4 mb-3">
                            <p class="mb-1"><strong>Monto solicitado:</strong> $${montoSolicitado.toFixed(0)}</p>
                            <p class="mb-0"><strong>Saldo disponible:</strong> $${saldoDisponible.toFixed(0)}</p>
                        </div>
                        
                        <p class="mb-3 text-muted">
                            <strong>⚠️ Importante:</strong> Solo puedes transferir hasta $${saldoDisponible.toFixed(0)}
                        </p>
                        
                        <div class="d-flex gap-2 justify-content-center">
                            <button class="btn btn-danger rounded-4 px-4" onclick="$('#errorModal').remove()">
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        $('#errorModal').remove();
        $('body').append(modalHTML);
    }

    let transacciones = [];
    try {
        const transStr = localStorage.getItem('transacciones');
        if (transStr) transacciones = JSON.parse(transStr);
    } catch (e) {
        console.error('Error transacciones:', e);
    }
    
    mostrarSaldoActual();

    // Formatear RUT mientras se escribe
    $('#rut').on('input', function() {
        formatearRUTInput(this);
    });
    
    // Limpiar error y clases cuando se empieza a escribir
    
    $('#rut').on('focus', function() {
        $(this).removeClass('is-invalid is-valid');
        $('#rutError').remove();
    });

    // Validar RUT cuando pierde el foco
    $('#rut').on('blur', function() {
        const rut = $(this).val();
        if (rut.trim()) {
            const resultado = validarYFormatearRUT(rut);
            if (!resultado.valido) {
                mostrarErrorRUT(resultado.mensaje);
                $(this).addClass('is-invalid');
            } else {
                $(this).val(resultado.rutFormateado);
                $(this).removeClass('is-invalid');
                $(this).addClass('is-valid');
            }
        }
    });

    // Función para mostrar error de RUT
    function mostrarErrorRUT(mensaje) {
        // Remover mensajes anteriores
        $('#rutError').remove();
        
        // Crear mensaje de error
        const errorHTML = `
            <div id="rutError" class="invalid-feedback d-block">
                <small class="text-danger">${mensaje}</small>
            </div>
        `;

        $('#rut').after(errorHTML);
}

    // Evento submit del formulario
    form.on('submit', function(e) {
        e.preventDefault();
        
        const nombre = $('#nombreDest').val();
        const rut = $('#rut').val();
        const banco = $('#banco').val();
        const tipoCuenta = $('#tipoCuenta').val();
        const monto = parseFloat($('#monto').val());

        const saldoActual = obtenerSaldoActual();

        // Validar RUT
        if (rut.trim()) {
        const rutValido = validarYFormatearRUT(rut);
            if (!rutValido.valido) {
                mostrarErrorRUT(rutValido.mensaje);
                $('#rut').addClass('is-invalid').focus();
                return;
        }
        // Formatear RUT correctamente
        $('#rut').val(rutValido.rutFormateado);
    }
        
        if (!nombre || !rut || !banco || !tipoCuenta || isNaN(monto) || monto <= 0) {
            mostrarModalError('Por favor, completa todos los campos correctamente.');
            return;
        }
        
        if (monto > saldoActual) {
            mostrarModalErrorSaldo(monto, saldoActual);
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
                                <span class="display-6">✅</span>
                            </div>
                        </div>
                        <h4 class="fw-bold text-success mb-2">¡Transferencia exitosa!</h4>
                        <p class="mb-1">Se transfirieron <strong>$${monto.toFixed(0)}</strong> a <strong>${nombre}</strong></p>
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

        $('body').append(modalHTML);

        const countdownInterval = setInterval(() => {
            tiempoRestante--;
            $('#countdownText').text(tiempoRestante);
            const porcentaje = (tiempoRestante / segundos) * 100;
            $('#countdownBar').css('width', `${porcentaje}%`);
            
            if (tiempoRestante <= 0) {
                clearInterval(countdownInterval);
                window.location.href = 'menu.html';
            }
        }, 1000);

        form[0].reset();
        $('#contactoCombo').val('');
        mostrarSaldoActual();
    });

    const saldo = obtenerSaldoActual();
    $('#saldoDisplay').html(`<span class="fs-3 fw-bold text-success">$${saldo.toFixed(0)}</span>`);
});