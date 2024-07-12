document.addEventListener('DOMContentLoaded', function() {
    console.log('El documento está completamente cargado y analizado');
});

document.addEventListener('DOMContentLoaded', function() {
    const loader = document.getElementById('loader');

    // Detectar el final de la animación de la barra de carga
    loader.addEventListener('animationend', function() {
        document.body.classList.remove('blurred');
        loader.style.display = 'none';
    });
});

// Obtener el año actual
const currentYear = new Date().getFullYear();
// Insertar el año actual en el span con id "current-year"
document.getElementById('current-year').textContent = currentYear;
