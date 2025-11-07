const tarjeta = document.querySelector('#tarjeta'),
    // btnAbrirFormulario = document.querySelector('#btn-abrir-formulario'),
    formulario = document.querySelector('#formulario-tarjeta'),
    numeroTarjeta = document.querySelector('#tarjeta .numero'),
    nombreTarjeta = document.querySelector('#tarjeta .nombre'),
    logoMarca = document.querySelector('#logo-marca'),
    firma = document.querySelector('#tarjeta .firma p'),
    mesExpiracion = document.querySelector('#tarjeta .mes'),
    yearExpiracion = document.querySelector('#tarjeta .year');
ccv = document.querySelector('#tarjeta .ccv');

// * Volteamos la tarjeta para mostrar el frente.
const mostrarFrente = () => {
    if (tarjeta && tarjeta.classList.contains('active')) {
        tarjeta.classList.remove('active');
    }
}

// * Rotacion de la tarjeta
if (tarjeta) {
    tarjeta.addEventListener('click', () => {
        tarjeta.classList.toggle('active');
    });
}

// btnAbrirFormulario.classList.toggle('active');
if (formulario) {
    formulario.classList.toggle('active');
}
// * Boton de abrir formulario
// btnAbrirFormulario.addEventListener('click', () => {
//     btnAbrirFormulario.classList.toggle('active');
//     formulario.classList.toggle('active');
// });

// * Select del mes generado dinamicamente.
// for (let i = 1; i <= 12; i++) {
//     let opcion = document.createElement('option');
//     opcion.value = i;
//     opcion.innerText = i;
//     formulario.selectMes.appendChild(opcion);
// }

// * Select del año generado dinamicamente.
// const yearActual = new Date().getFullYear();
// for (let i = yearActual; i <= yearActual + 8; i++) {
//     let opcion = document.createElement('option');
//     opcion.value = i;
//     opcion.innerText = i;
//     formulario.selectYear.appendChild(opcion);
// }

// * Input numero de tarjeta
if (formulario && formulario.inputNumero) {
    formulario.inputNumero.addEventListener('keyup', (e) => {
    let valorInput = e.target.value;

    formulario.inputNumero.value = valorInput
        // Eliminamos espacios en blanco
        .replace(/\s/g, '')
        // Eliminar las letras
        .replace(/\D/g, '')
        // Ponemos espacio cada cuatro numeros
        .replace(/([0-9]{4})/g, '$1 ')
        // Elimina el ultimo espaciado
        .trim();

    if (numeroTarjeta) {
        numeroTarjeta.textContent = valorInput;
    }

    if (valorInput == '') {
        if (numeroTarjeta) {
            numeroTarjeta.textContent = '#### #### #### ####';
        }
        if (logoMarca) {
            logoMarca.innerHTML = '';
        }
    }

    // visa
    var re = new RegExp("^4");
    if (valorInput.match(re) != null && logoMarca) {
        logoMarca.innerHTML = '';
        const imagen = document.createElement('img');
        imagen.src = 'assets/images/card/logos/visa.png';
        logoMarca.appendChild(imagen);
    }
    // Mastercard 
    // Updated for Mastercard 2017 BINs expansion
    if (valorInput[0] == 5 && logoMarca) {
        logoMarca.innerHTML = '';
        const imagen = document.createElement('img');
        imagen.src = 'assets/images/card/logos/mastercard.png';
        logoMarca.appendChild(imagen);
    }
    // AMEX
    re = new RegExp("^3[47]")
    if (valorInput.match(re) != null && logoMarca) {
        logoMarca.innerHTML = '';
        const imagen = document.createElement('img');
        imagen.src = 'assets/images/card/logos/american-express.png';
        logoMarca.appendChild(imagen);
    }

    // Diners
    re = new RegExp("^36");
    if (valorInput.match(re) != null && logoMarca) {
        logoMarca.innerHTML = '';
        const imagen = document.createElement('img');
        imagen.src = 'assets/images/card/logos/diners.png';
        logoMarca.appendChild(imagen);
    }



    // Volteamos la tarjeta para que el usuario vea el frente.
    mostrarFrente();
    });
}

// * Input nombre de tarjeta
if (formulario && formulario.inputNombre) {
    formulario.inputNombre.addEventListener('keyup', (e) => {
    let valorInput = e.target.value;

    formulario.inputNombre.value = valorInput.replace(/[0-9]/g, '');
    if (nombreTarjeta) {
        nombreTarjeta.textContent = valorInput;
    }
    if (firma) {
        firma.textContent = valorInput;
    }

    if (valorInput == '' && nombreTarjeta) {
        nombreTarjeta.textContent = 'Jhon Doe';
    }

    mostrarFrente();
    });
}

// * Select mes
if (formulario && formulario.selectMes) {
    formulario.selectMes.addEventListener('change', (e) => {
    if (mesExpiracion) {
        mesExpiracion.textContent = e.target.value;
    }
    mostrarFrente();
    });
}

// * Select Año
if (formulario && formulario.selectYear) {
    formulario.selectYear.addEventListener('change', (e) => {
    if (yearExpiracion) {
        yearExpiracion.textContent = e.target.value.slice(2);
    }
    mostrarFrente();
    });
}

// * CCV
if (formulario && formulario.inputCCV) {
    formulario.inputCCV.addEventListener('keyup', () => {
    if (tarjeta && !tarjeta.classList.contains('active')) {
        tarjeta.classList.toggle('active');
    }

    formulario.inputCCV.value = formulario.inputCCV.value
        // Eliminar los espacios
        .replace(/\s/g, '')
        // Eliminar las letras
        .replace(/\D/g, '');

    if (ccv) {
        ccv.textContent = formulario.inputCCV.value;
    }
    });
}