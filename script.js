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

// Isotope JS
$(document).ready(function() {
    var $grid = $('.grid').isotope({
        itemSelector: '.grid-item',
        layoutMode: 'fitRows',
        transitionDuration: '0.6s',
        stagger: 30,
        hiddenStyle: { opacity: 0 },
        visibleStyle: { opacity: 1 }
    });

    // Variable para evitar la segunda transición
    var isAnimating = false;

    // Filtrar los elementos al hacer clic en los botones
    $('#gallery-filters').on('click', '.filter-btn', function() {
        if (isAnimating) return; // Evitar múltiples animaciones

        $('#gallery-filters .filter-btn').removeClass('active');
        $(this).addClass('active');
        var filterValue = $(this).attr('data-filter');

        isAnimating = true;

        // Forzar el reposicionamiento correcto antes de animar
        $grid.isotope('layout').promise().done(function() {
            $grid.isotope({ filter: filterValue });
            // Resetear el estado de animación después de la transición
            setTimeout(function() {
                isAnimating = false;
            }, 600); // Asegurarse de que el tiempo coincide con la duración de la transición
        });
    });
});


        document.addEventListener('DOMContentLoaded', function () {
            // Obtén todos los modales
            var modals = document.querySelectorAll('.modal');
    
            modals.forEach(function (modal) {
                // Reproduce el video cuando se muestra el modal
                modal.addEventListener('shown.bs.modal', function () {
                    var video = modal.querySelector('video');
                    if (video) {
                        video.play();
                    }
                });
    
                // Pausa el video cuando se oculta el modal
                modal.addEventListener('hidden.bs.modal', function () {
                    var video = modal.querySelector('video');
                    if (video) {
                        video.pause();
                        video.currentTime = 0; // Reinicia el video
                    }
                });
            });
        });

        // Abrir el modal
document.querySelectorAll('.grid-item img').forEach(image => {
    image.addEventListener('click', () => {
        document.getElementById('modal-img-overlay').classList.add('active');
        document.getElementById('modal-img').src = image.src;
    });
});

// Cerrar el modal
document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('modal-img-overlay').classList.remove('active');
});
