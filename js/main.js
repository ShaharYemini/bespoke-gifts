// Wait for the entire HTML document to be loaded and parsed
document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. SMOOTH SCROLLING FOR HERO BUTTON
    // =========================================
    const heroButton = document.querySelector('.hero a.btn');
    if (heroButton) {
        heroButton.addEventListener('click', (e) => {
            // Prevent the default jumpy behavior of the anchor link
            e.preventDefault();
            
            // Get the target section (#gallery)
            const targetId = heroButton.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Use the modern, built-in smooth scrolling method
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // =========================================
    // 2. FADE-IN ANIMATION ON SCROLL
    // =========================================
    // Create an observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    // Observe all sections and project cards
    const elementsToAnimate = document.querySelectorAll('section, .project-card');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

    // =========================================
    // 3. SIMPLE GALLERY MODAL (LIGHTBOX)
    // =========================================
    const projectLinks = document.querySelectorAll('.view-project-link');
    
    projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get project details from the card the user clicked on
            const card = link.closest('.project-card');
            const title = card.querySelector('h3').textContent;
            const description = card.querySelector('p').textContent;
            const imageSrc = card.querySelector('img').src;

            // Create the modal HTML
            const modalHTML = `
                <div class="modal-overlay">
                    <div class="modal-content">
                        <button class="modal-close">&times;</button>
                        <img src="${imageSrc}" alt="${title}">
                        <h2>${title}</h2>
                        <p>${description}</p>
                        
                        <!-- NEW: Disclaimer in Modal -->
                        <p><em>Please note: This is a conceptual demonstration to showcase what's possible. The project thumbnail is an AI-generated artistic representation.</em></p>
                    </div>
                </div>
            `;
            
            // Add the modal to the body
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling

            // Add event listeners for closing the modal
            const overlay = document.querySelector('.modal-overlay');
            const closeButton = document.querySelector('.modal-close');

            overlay.addEventListener('click', (event) => {
                if (event.target === overlay) {
                    closeModal(overlay);
                }
            });
            closeButton.addEventListener('click', () => closeModal(overlay));
        });
    });

    function closeModal(modalOverlay) {
        modalOverlay.classList.add('closing');
        modalOverlay.addEventListener('animationend', () => {
            modalOverlay.remove();
            document.body.style.overflow = 'auto';
        });
    }

    // =========================================
    // 4. CONTACT FORM HANDLING
    // =========================================
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const status = document.getElementById('form-status');
            const data = new FormData(form);
            
            try {
                status.textContent = 'Sending...';
                status.style.color = '#555';

                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    status.textContent = "Thank you! I'll be in touch soon.";
                    status.style.color = 'green';
                    form.reset();
                } else {
                    const responseData = await response.json();
                    if (responseData.errors) {
                        status.textContent = responseData.errors.map(error => error.message).join(", ");
                    } else {
                        status.textContent = 'Oops! There was a problem submitting your form.';
                    }
                    status.style.color = 'red';
                }
            } catch (error) {
                status.textContent = 'Oops! There was a problem submitting your form.';
                status.style.color = 'red';
            }
        });
    }

});