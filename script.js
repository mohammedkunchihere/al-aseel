document.addEventListener('DOMContentLoaded', function() {
    const galleryImages = document.querySelectorAll('.gallery-grid img');
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="close">&times;</span>
            <div class="nav-buttons">
                <div class="prev">&#10094;</div>
                <div class="next">&#10095;</div>
            </div>
            <img class="lightbox-img" src="" alt="">
            <div class="caption"></div>
            <div class="thumbnails"></div>
        </div>
    `;
    document.body.appendChild(lightbox);

    // Create thumbnails
    galleryImages.forEach((img, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.className = 'thumbnail';
        thumbnail.src = img.src;
        thumbnail.alt = img.alt;
        thumbnail.dataset.index = index;
        lightbox.querySelector('.thumbnails').appendChild(thumbnail);
    });

    let currentIndex = 0;
    const thumbnails = lightbox.querySelectorAll('.thumbnail');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const caption = lightbox.querySelector('.caption');

    function updateLightbox(index) {
        currentIndex = index;
        const img = galleryImages[currentIndex];
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        caption.textContent = img.alt;

        // Update active thumbnail
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === currentIndex);
        });

        // Scroll to active thumbnail
        const activeThumb = thumbnails[currentIndex];
        activeThumb.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }

    // Open lightbox when clicking gallery images
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            updateLightbox(index);
        });
    });

    // Thumbnail navigation
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            updateLightbox(index);
        });
    });

    // Navigation buttons
    lightbox.querySelector('.prev').addEventListener('click', (e) => {
        e.stopPropagation();
        updateLightbox((currentIndex - 1 + galleryImages.length) % galleryImages.length);
    });

    lightbox.querySelector('.next').addEventListener('click', (e) => {
        e.stopPropagation();
        updateLightbox((currentIndex + 1) % galleryImages.length);
    });

    // Close lightbox
    lightbox.querySelector('.close').addEventListener('click', () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    });

    // Close when clicking outside
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            switch(e.key) {
                case 'Escape':
                    lightbox.style.display = 'none';
                    document.body.style.overflow = '';
                    break;
                case 'ArrowLeft':
                    updateLightbox((currentIndex - 1 + galleryImages.length) % galleryImages.length);
                    break;
                case 'ArrowRight':
                    updateLightbox((currentIndex + 1) % galleryImages.length);
                    break;
            }
        }
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    lightboxImg.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    lightboxImg.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        
        if (diff > 50) { // Swipe left
            updateLightbox((currentIndex + 1) % galleryImages.length);
        } else if (diff < -50) { // Swipe right
            updateLightbox((currentIndex - 1 + galleryImages.length) % galleryImages.length);
        }
    }, { passive: true });
});