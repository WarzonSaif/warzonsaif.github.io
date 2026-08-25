/**
 * PooreYouTuber Tools - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSearchFilter();
    initCategoryFilter();
    initMobileNav();
    initBackToTop();
});

/* --- 1. Dark / Light Theme Toggle --- */
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    const body = document.body;

    const savedTheme = localStorage.getItem('poore_theme') || 'light-mode';
    if (savedTheme === 'dark-mode') {
        body.classList.add('dark-mode');
        if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
        if (themeText) themeText.textContent = 'Light Mode';
    } else {
        body.classList.remove('dark-mode');
        if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
        if (themeText) themeText.textContent = 'Dark Mode';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            if (body.classList.contains('dark-mode')) {
                body.classList.remove('dark-mode');
                localStorage.setItem('poore_theme', 'light-mode');
                if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
                if (themeText) themeText.textContent = 'Dark Mode';
            } else {
                body.classList.add('dark-mode');
                localStorage.setItem('poore_theme', 'dark-mode');
                if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
                if (themeText) themeText.textContent = 'Light Mode';
            }
        });
    }
}

/* --- 2. Live Tool Search Filter --- */
function initSearchFilter() {
    const searchInput = document.getElementById('tool-search-input');
    const toolCards = document.querySelectorAll('.tool-card');
    const noResults = document.getElementById('no-tools-found');

    if (!searchInput || toolCards.length === 0) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        let visibleCount = 0;

        toolCards.forEach(card => {
            const title = card.getAttribute('data-title') || card.querySelector('h3')?.textContent.toLowerCase() || '';
            const desc = card.getAttribute('data-desc') || card.querySelector('p')?.textContent.toLowerCase() || '';
            const category = card.getAttribute('data-category') || '';

            if (title.includes(query) || desc.includes(query) || category.includes(query)) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    });
}

/* --- 3. Category Filter Buttons --- */
function initCategoryFilter() {
    const catButtons = document.querySelectorAll('.cat-filter-btn');
    const toolCards = document.querySelectorAll('.tool-card');
    const searchInput = document.getElementById('tool-search-input');

    if (catButtons.length === 0 || toolCards.length === 0) return;

    catButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            catButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const selectedCat = btn.getAttribute('data-category');
            if (searchInput) searchInput.value = '';

            toolCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (selectedCat === 'all' || cardCat === selectedCat) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* --- 4. Mobile Navigation Toggle --- */
function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

/* --- 5. Back to Top Button --- */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.style.display = 'flex';
        } else {
            btn.style.display = 'none';
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* --- 6. Helper: Toast Notifications --- */
function showToast(message, type = 'info') {
    let toast = document.getElementById('global-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'global-toast';
        toast.className = 'toast-notice';
        document.body.appendChild(toast);
    }

    toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-info'}"></i> <span>${message}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/* --- 7. Helper: Copy To Clipboard --- */
function copyToClipboard(text, customMsg = 'Copied to clipboard!') {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(customMsg, 'success');
        }).catch(() => {
            fallbackCopyTextToClipboard(text, customMsg);
        });
    } else {
        fallbackCopyTextToClipboard(text, customMsg);
    }
}

function fallbackCopyTextToClipboard(text, customMsg) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showToast(customMsg, 'success');
    } catch (err) {
        showToast('Failed to copy text', 'error');
    }
    document.body.removeChild(textArea);
}
