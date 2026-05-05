document.addEventListener('DOMContentLoaded', () => {
    // 1. Render Catalog
    const grid = document.getElementById('catalog-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    function renderCatalog(filter = 'all') {
        grid.innerHTML = '';

        // Take a maximum of items to display to not overload
        const maxItems = filter === 'all' ? 24 : 100;
        let count = 0;

        catalogData.forEach(item => {
            if (filter !== 'all' && item.category !== filter) return;
            if (count >= maxItems) return;

            const categoryNames = {
                '1x1': translations[currentLang].cat_name_1x1,
                '2x2': translations[currentLang].cat_name_2x2,
                '4x4': translations[currentLang].cat_name_4x4,
                'glass': translations[currentLang].cat_name_glass,
                'honeycomb': translations[currentLang].cat_name_honeycomb,
                'drop': translations[currentLang].cat_name_drop,
                'textured': translations[currentLang].cat_name_textured,
                'other': translations[currentLang].cat_name_other
            };

            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-img">
                    <img src="${item.path}" alt="${item.name}" loading="lazy" onerror="this.src='логотип/design.png'">
                </div>
                <div class="product-info">
                    <span class="product-category">${categoryNames[item.category] || item.category}</span>
                    <h3 class="product-title">${item.name}</h3>
                </div>
            `;
            grid.appendChild(card);
            count++;
        });
    }

    // Initial render
    if (typeof catalogData !== 'undefined') {
        renderCatalog('all');
    }

    // 2. Filter Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class
            btn.classList.add('active');
            // Re-render
            const filter = btn.getAttribute('data-filter');
            renderCatalog(filter);
        });
    });

    // 3. Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '1rem 0';
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
        } else {
            navbar.style.padding = '1.5rem 0';
            navbar.style.boxShadow = 'none';
        }
    });

    // 4. Smooth scrolling for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 5. Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');

    // Attach click to grid using event delegation
    grid.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        if (!card) return;

        const img = card.querySelector('img');
        const title = card.querySelector('.product-title').innerText;

        lightboxImg.src = img.src;
        lightboxCaption.innerText = title;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent scrolling
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) {
            closeLightbox();
        }
    });

    // 6. Contact Modal Logic
    const orderBtn = document.getElementById('order-btn');
    const navContactsBtn = document.getElementById('nav-contacts-btn');
    const contactModal = document.getElementById('contact-modal');
    const closeContactModal = document.getElementById('close-contact-modal');

    const openContactModal = (e) => {
        e.preventDefault();
        contactModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    if (orderBtn) {
        orderBtn.addEventListener('click', openContactModal);
    }

    if (navContactsBtn) {
        navContactsBtn.addEventListener('click', openContactModal);
    }

    const closeContact = () => {
        contactModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (closeContactModal) {
        closeContactModal.addEventListener('click', closeContact);
    }

    if (contactModal) {
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) closeContact();
        });
    }

    // 7. Download PDFs Logic
    const downloadPdfBtn = document.getElementById('download-pdf-btn');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const filesToDownload = [
                "KATALOG PREMIUM MOSAIC.pdf",
                "Каталог Кристал.pdf"
            ];

            filesToDownload.forEach(fileUrl => {
                const a = document.createElement('a');
                a.href = fileUrl;
                a.download = '';
                a.target = '_blank'; // Fallback for some browsers
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
        });
    }

    // 8. Translation Logic
    const langSwitch = document.getElementById('lang-switch');

    function updateTexts() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang] && translations[currentLang][key]) {
                if (key === 'about_p1_html' || key === 'hero_h1') {
                    el.innerHTML = translations[currentLang][key];
                } else {
                    el.textContent = translations[currentLang][key];
                }
            }
        });

        // Update document lang
        document.documentElement.lang = currentLang;

        // Re-render catalog to update category names
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        const filter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
        renderCatalog(filter);
    }

    if (langSwitch) {
        langSwitch.addEventListener('click', () => {
            if (currentLang === 'ru') {
                currentLang = 'uz';
                langSwitch.textContent = 'RU';
            } else {
                currentLang = 'ru';
                langSwitch.textContent = 'UZ';
            }
            updateTexts();
        });

        // Initial setup
        updateTexts();
    }
});
