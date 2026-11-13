const menuButton = document.querySelector('.menu-button');
const topbar = document.querySelector('.topbar');
const estimateForm = document.querySelector('#estimate-form');

menuButton.addEventListener('click', () => {
    const isOpen = topbar.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.textContent = isOpen ? 'Close' : 'Menu';
});

document.querySelectorAll('nav a').forEach((link) => link.addEventListener('click', () => {
    topbar.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = 'Menu';
}));

document.querySelector('nav a[href="#services"]').addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('#services').scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', '#services');
});

const emailjsPublicKey = 'LyjO55R6HN5D2p_VK';
const emailjsServiceId = 'service_4nlmjgm';
const emailjsTemplateId = 'template_m5922y2';
emailjs.init({ publicKey: emailjsPublicKey });

estimateForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formMessage = estimateForm.querySelector('.form-message');
    const submitButton = estimateForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
        await emailjs.sendForm(emailjsServiceId, emailjsTemplateId, estimateForm);

        formMessage.textContent = 'Thanks. Your estimate request is on its way.';
        estimateForm.reset();
    } catch (error) {
        formMessage.textContent = 'Something went wrong. Please call us or try again.';
    } finally {
        submitButton.disabled = false;
        setTimeout(() => {
            formMessage.textContent = '';
        }, 5000);
    }
});

(() => {
    const images = [...document.querySelectorAll('.work-grid .project img')];
    if (!images.length) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image viewer');
    lightbox.hidden = true;
    lightbox.innerHTML = `
        <button type="button" class="lightbox-close" aria-label="Close">&times;</button>
        <button type="button" class="lightbox-nav lightbox-prev" aria-label="Previous image">&#8249;</button>
        <img class="lightbox-img" alt="" />
        <button type="button" class="lightbox-nav lightbox-next" aria-label="Next image">&#8250;</button>
        <span class="lightbox-count"></span>`;
    document.body.appendChild(lightbox);

    const full = lightbox.querySelector('.lightbox-img');
    const count = lightbox.querySelector('.lightbox-count');
    const closeButton = lightbox.querySelector('.lightbox-close');
    let index = 0;
    let lastFocus = null;

    const show = (i) => {
        index = (i + images.length) % images.length;
        full.src = images[index].currentSrc || images[index].src;
        full.alt = images[index].alt;
        count.textContent = `${index + 1} / ${images.length}`;
    };

    const open = (i) => {
        lastFocus = document.activeElement;
        show(i);
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        closeButton.focus();
    };

    const close = () => {
        lightbox.hidden = true;
        full.removeAttribute('src');
        document.body.style.overflow = '';
        if (lastFocus) lastFocus.focus();
    };

    images.forEach((img, i) => {
        const figure = img.closest('.project');
        figure.tabIndex = 0;
        figure.setAttribute('role', 'button');
        figure.setAttribute('aria-label', `View full size image ${i + 1}`);
        figure.style.cursor = 'zoom-in';
        figure.addEventListener('click', () => open(i));
        figure.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open(i);
            }
        });
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });
    closeButton.addEventListener('click', close);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => show(index - 1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => show(index + 1));

    document.addEventListener('keydown', (e) => {
        if (lightbox.hidden) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') show(index - 1);
        else if (e.key === 'ArrowRight') show(index + 1);
    });
})();
