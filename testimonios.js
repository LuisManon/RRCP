const testimonios = [
    { nombre: "Jonairys", imagen: "multimedia/testimonios/Jonairys.png", videoId: "pwSU8_viI2Q" },
    { nombre: "Maciel", imagen: "multimedia/testimonios/maciel.png", videoId: "pwSU8_viI2Q" },
    { nombre: "Wanda", imagen: "multimedia/testimonios/wanda.png", videoId: "pwSU8_viI2Q" },
    { nombre: "Maciel Again", imagen: "multimedia/testimonios/maciel.png", videoId: "pwSU8_viI2Q" }
];

// Función para generar testimonios y modales dinámicamente
function generarTestimonios() {
    const carousel = document.querySelector(".owl-carousel");
    const modalsContainer = document.getElementById("modalsContainer");

    testimonios.forEach((testimonio, index) => {
        const modalId = `videoModal${index + 1}`;
        const youtubeURL = `https://www.youtube.com/embed/${testimonio.videoId}?autoplay=1&rel=0`;

        // Agregar cada testimonio al carrusel con las mismas clases CSS
        const testimonioHTML = `
            <div class="bg-light rounded text-center position-relative rounded-image">
                <img class="img-fluid rounded-top price-image" src="${testimonio.imagen}" alt="${testimonio.nombre} Plan">
                <button class="btn play-button" data-bs-toggle="modal" data-bs-target="#${modalId}">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `;
        carousel.innerHTML += testimonioHTML;

        // Agregar el modal correspondiente con las mismas clases CSS
        const modalHTML = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-md">
                    <div class="modal-content bg-dark">
                        <div class="modal-body position-relative">
                            <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 p-3" 
                                data-bs-dismiss="modal" aria-label="Close"></button>
                            <iframe class="img-fluid rounded-top price-image" width="100%" height="315" 
                                src="${youtubeURL}" frameborder="0" 
                                allow="autoplay; encrypted-media" allowfullscreen>
                            </iframe>
                        </div>
                    </div>
                </div>
            </div>
        `;
        modalsContainer.innerHTML += modalHTML;
    });
}

// Ejecutar la función al cargar la página
document.addEventListener("DOMContentLoaded", generarTestimonios);
