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
