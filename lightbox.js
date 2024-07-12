document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const closeBtn = lightbox.querySelector('.close');

    const openLightbox = function(imgUrl, imgTitle) {
        lightboxImg.src = imgUrl;
        lightboxImg.alt = imgTitle;
        lightbox.style.display = 'flex';
    };

    const closeLightbox = function() {
        lightbox.style.display = 'none';
        lightboxImg.src = '';
        lightboxImg.alt = '';
    };

    galleryItems.forEach(function(item) {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            const imgUrl = this.querySelector('a').getAttribute('href');
            const imgTitle = this.querySelector('a').getAttribute('data-title');
            openLightbox(imgUrl, imgTitle);
        });
    });

    closeBtn.addEventListener('click', function() {
        closeLightbox();
    });

    lightbox.addEventListener('click', function(event) {
        if (event.target !== lightboxImg && event.target !== closeBtn) {
            closeLightbox();
        }
    });

    // Gallery Filter
    function filterImages(category) {
        galleryItems.forEach(function(item) {
            const categories = item.getAttribute('data-categories').split(',');
            if (categories.includes(category) || category === 'all') {
                item.style.display = 'inline-block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const activeButton = document.querySelector('.filter-btn.active');
            if (activeButton) {
                activeButton.classList.remove('active');
            }
            this.classList.add('active');
            const category = this.getAttribute('data-filter');
            filterImages(category);
        });
    });

    // Iniciar con el filtro "Todos"
    filterImages('all');
});
