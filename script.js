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

estimateForm.addEventListener('submit', (event) => {
    event.preventDefault();
    estimateForm.querySelector('.form-message').textContent = 'Thanks. Your estimate request is on its way.';
    estimateForm.reset();
});