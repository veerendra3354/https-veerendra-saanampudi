const header = document.querySelector('.app-header');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = [...document.querySelectorAll('.nav-link')];
const appContent = document.querySelector('.app-content');
const roleGate = document.querySelector('#role-gate');
const roleSwitch = document.querySelector('.role-switch');
const roleLabel = document.querySelector('#active-role-label');
const projectDialog = document.querySelector('#project-dialog');
const loader = document.querySelector('#reel-loader');
const brandIntro = document.querySelector('#brand-intro');
const main = document.querySelector('#main');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let currentRole = null;

const roleProfiles = {
    recruiter: {
        label: 'Recruiter',
        heroImage: 'veerendra.jpg',
        overline: 'PROJECTS FIRST · PROFILE',
        summary: "I'm Veerendra, a Computer Science Engineering (AI & ML) student who likes turning real-world questions into things you can build, test, and improve.",
        context: 'Short on time? Start with the project, then follow the skills and story behind it.',
        action: 'projects',
        actionLabel: 'View featured project',
        sectionOrder: ['projects', 'skills', 'expertise', 'story', 'about', 'contact']
    },
    student: {
        label: 'Student',
        heroImage: 'veerendra.jpg',
        overline: 'LEARNING PATH · SHARED CURIOSITY',
        summary: "I'm learning computer science (AI & ML) by making things, joining hackathons, and following questions into software, AI, and robotics.",
        context: 'Take the scenic route: college, project experiments, and the interests that keep me curious.',
        action: 'story',
        actionLabel: 'Explore the journey',
        sectionOrder: ['story', 'skills', 'projects', 'about', 'expertise', 'contact']
    },
    faculty: {
        label: 'Faculty',
        heroImage: 'veerendra.jpg',
        overline: 'ACADEMIC JOURNEY · PROJECT WORK',
        summary: 'A B.Tech journey in CSE (AI & ML) at Narayana Engineering College, Gudur (2024-2028), shaped by continuous learning, hackathon participation, and hands-on building in software and AI.',
        context: 'Start with the academic chapter, then see the skills and milestones along the way.',
        action: 'story',
        actionLabel: 'View academic journey',
        sectionOrder: ['story', 'expertise', 'projects', 'skills', 'about', 'contact']
    },
    collaborator: {
        label: 'Collaborator',
        heroImage: 'veerendra.jpg',
        overline: 'SHARED INTERESTS · OPEN CONVERSATION',
        summary: "I'm curious about software, AI, and robotics—and always up for a good conversation about a problem worth solving.",
        context: "Meet the person, peek at the project, then let's compare notes.",
        action: 'about',
        actionLabel: 'Get to know me',
        sectionOrder: ['about', 'projects', 'expertise', 'skills', 'story', 'contact']
    }
};

function setMenuOpen(isOpen) {
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    navMenu.classList.toggle('is-open', isOpen);
    header.classList.toggle('menu-open', isOpen);
}

menuToggle.addEventListener('click', () => {
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

navLinks.forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false);
        menuToggle.focus();
    }
});

function updateHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

function updateNavCurrent(sectionId) {
    navLinks.forEach((link) => {
        const isCurrent = link.getAttribute('href') === `#${sectionId}`;
        link.classList.toggle('active', isCurrent);
        if (isCurrent) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
    });
}

const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
        const visibleSections = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visibleSections[0]) updateNavCurrent(visibleSections[0].target.id);
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, .2, .5, .8] });

    sections.forEach((section) => sectionObserver.observe(section));
}

function applyRole(roleKey) {
    const profile = roleProfiles[roleKey];
    if (!profile) return;
    currentRole = roleKey;
    document.body.dataset.viewer = roleKey;
    roleLabel.textContent = profile.label;
    roleSwitch.setAttribute('aria-label', `Change portfolio view, currently ${profile.label}`);
    document.querySelector('.feature-portrait img').src = profile.heroImage;
    document.querySelector('#role-overline').textContent = profile.overline;
    document.querySelector('#role-summary').textContent = profile.summary;
    document.querySelector('#role-context').textContent = profile.context;

    const primaryAction = document.querySelector('#role-primary-action');
    primaryAction.href = `#${profile.action}`;
    primaryAction.innerHTML = `<i class="fa-solid fa-play" aria-hidden="true"></i> ${profile.actionLabel}`;

    profile.sectionOrder.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) appContent.append(section);
    });
    document.querySelectorAll('.skill-card[data-skill]').forEach((skill) => skill.setAttribute('aria-pressed', 'false'));
    const pCard = document.querySelector('.project-card[data-technologies]');
    if (pCard) pCard.hidden = false;
    const pEmpty = document.querySelector('#project-filter-empty');
    if (pEmpty) pEmpty.hidden = true;
    const sStatus = document.querySelector('#skill-filter-status');
    if (sStatus) sStatus.textContent = 'Explore my core technical skills and tools.';

    document.querySelectorAll('.role-option').forEach((option) => {
        option.setAttribute('aria-pressed', String(option.dataset.role === roleKey));
    });
    updateNavCurrent('home');
}

function openRoleChooser() {
    setMenuOpen(false);
    if (!roleGate.open) roleGate.showModal();
}

let introFinished = false;
function finishBrandIntro() {
    if (introFinished) return;
    introFinished = true;
    brandIntro.close();
    document.querySelector('.app-header').inert = false;
    main.inert = false;
    document.querySelector('.app-footer').inert = false;
    openRoleChooser();
    document.querySelector('.role-option').focus();
}

function selectRole(roleKey) {
    if (!roleProfiles[roleKey]) return;
    applyRole(roleKey);
    roleGate.close();
    main.setAttribute('aria-busy', 'true');
    loader.hidden = false;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
    window.setTimeout(() => {
        loader.hidden = true;
        main.removeAttribute('aria-busy');
        document.querySelector('#role-primary-action').focus({ preventScroll: true });
        initializeReveals();
    }, reducedMotion ? 0 : 580);
}

let revealsInitialized = false;
function initializeReveals() {
    if (revealsInitialized) return;
    revealsInitialized = true;
    const revealTargets = document.querySelectorAll(
        '.catalog-section .shelf-heading, .project-card, .skill-card, .expertise-card, .education-card, .achievement-card, .profile-panel, .interest-card, .contact-banner'
    );
    revealTargets.forEach((element) => element.classList.add('reveal'));
    if (reducedMotion || !('IntersectionObserver' in window)) {
        revealTargets.forEach((element) => element.classList.add('is-visible'));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.08 });

    revealTargets.forEach((element) => revealObserver.observe(element));
}

document.querySelectorAll('.role-option').forEach((option) => {
    option.addEventListener('click', () => selectRole(option.dataset.role));
});

roleSwitch.addEventListener('click', openRoleChooser);
roleGate.addEventListener('click', (event) => {
    if (event.target === roleGate) event.preventDefault();
});
roleGate.addEventListener('cancel', (event) => {
    if (!currentRole) event.preventDefault();
});
roleGate.addEventListener('close', () => {
    if (currentRole) roleSwitch.focus({ preventScroll: true });
});

brandIntro.addEventListener('cancel', (event) => {
    event.preventDefault();
    finishBrandIntro();
});
document.querySelector('#intro-skip').addEventListener('click', finishBrandIntro);
brandIntro.addEventListener('close', () => {
    if (!introFinished) finishBrandIntro();
});
brandIntro.showModal();
document.querySelector('#intro-skip').focus();
window.setTimeout(finishBrandIntro, reducedMotion ? 1800 : 4800);

document.querySelectorAll('[data-dialog="project-dialog"]').forEach((button) => {
    button.addEventListener('click', () => {
        if (projectDialog && typeof projectDialog.showModal === 'function') projectDialog.showModal();
    });
});

const dialogCloseBtn = document.querySelector('.dialog-close');
if (dialogCloseBtn && projectDialog) {
    dialogCloseBtn.addEventListener('click', () => projectDialog.close());
    projectDialog.addEventListener('click', (event) => {
        if (event.target === projectDialog) projectDialog.close();
    });
}

const skillButtons = [...document.querySelectorAll('.skill-card[data-skill]')];
const projectCard = document.querySelector('.project-card[data-technologies]');
const projectEmptyState = document.querySelector('#project-filter-empty');
const skillFilterStatus = document.querySelector('#skill-filter-status');

skillButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const wasSelected = button.getAttribute('aria-pressed') === 'true';
        skillButtons.forEach((skill) => skill.setAttribute('aria-pressed', 'false'));
        const selectedSkill = wasSelected ? null : button.dataset.skill;
        if (selectedSkill) button.setAttribute('aria-pressed', 'true');

        if (projectCard) {
            const hasProject = !selectedSkill || projectCard.dataset.technologies.split(' ').includes(selectedSkill);
            projectCard.hidden = !hasProject;
            if (projectEmptyState) projectEmptyState.hidden = hasProject;
        }
        if (skillFilterStatus) {
            if (selectedSkill) {
                skillFilterStatus.textContent = `${button.querySelector('strong').textContent} is part of my technical toolkit.`;
            } else {
                skillFilterStatus.textContent = 'Explore my core technical skills and tools.';
            }
        }
    });
});

const feature = document.querySelector('.feature');
const portrait = document.querySelector('.feature-portrait');
const pointerAura = document.querySelector('.pointer-aura');
const pointerFine = window.matchMedia('(pointer: fine)').matches;

if (!reducedMotion && pointerFine) {
    let frame = 0;
    window.addEventListener('pointermove', (event) => {
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
            pointerAura.style.setProperty('--pointer-x', `${event.clientX}px`);
            pointerAura.style.setProperty('--pointer-y', `${event.clientY}px`);

            if (feature.matches(':hover')) {
                const bounds = feature.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / bounds.width - 0.5;
                const y = (event.clientY - bounds.top) / bounds.height - 0.5;
                portrait.style.transform = `translate3d(${x * 8}px, ${y * 8}px, 0)`;
            }
            frame = 0;
        });
    }, { passive: true });

    feature.addEventListener('pointerleave', () => {
        portrait.style.transform = '';
    });

    document.querySelectorAll('.expertise-card, .skill-card, .achievement-card').forEach((card) => {
        card.addEventListener('pointermove', (event) => {
            const bounds = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${event.clientX - bounds.left}px`);
            card.style.setProperty('--mouse-y', `${event.clientY - bounds.top}px`);
        });
    });

    const projectPoster = document.querySelector('.poster-button');
    const projectCardElement = document.querySelector('.project-card');
    if (projectPoster && projectCardElement) {
        projectPoster.addEventListener('pointermove', (event) => {
            const bounds = projectCardElement.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;
            projectCardElement.style.transform =
                `perspective(1200px) rotateX(${-y * 2.2}deg) rotateY(${x * 2.2}deg)`;
            const posterBounds = projectPoster.getBoundingClientRect();
            projectPoster.style.setProperty('--mouse-x', `${event.clientX - posterBounds.left}px`);
            projectPoster.style.setProperty('--mouse-y', `${event.clientY - posterBounds.top}px`);
        });
        projectPoster.addEventListener('pointerleave', () => {
            projectCardElement.style.transform = '';
        });
    }
}

document.querySelector('#current-year').textContent = new Date().getFullYear();


