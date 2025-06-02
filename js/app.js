// Main App JavaScript

// DOM Elements
const cleanupMap = document.getElementById('cleanup-map');
const weatherWidget = document.getElementById('weather-widget');
const cleanupCount = document.getElementById('cleanup-count');
const volunteerCount = document.getElementById('volunteer-count');
const trashCollected = document.getElementById('trash-collected');

// Animation function for counting up numbers
function animateNumber(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const updateNumber = () => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.round(target).toLocaleString();
            return;
        }
        element.textContent = Math.round(current).toLocaleString();
        requestAnimationFrame(updateNumber);
    };

    updateNumber();
}

// Intersection Observer for animations
const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.id === 'cleanup-count') {
                animateNumber(cleanupCount, 150);
            } else if (entry.target.id === 'volunteer-count') {
                animateNumber(volunteerCount, 1200);
            } else if (entry.target.id === 'trash-collected') {
                animateNumber(trashCollected, 5000);
            }
        }
    });
};

const observer = new IntersectionObserver(observerCallback, {
    threshold: 0.5
});

// Observe elements
observer.observe(cleanupCount);
observer.observe(volunteerCount);
observer.observe(trashCollected);

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// TODO: Implement map functionality using a mapping service API
async function initMap() {
    // This will be implemented with a mapping service like Google Maps or Leaflet
    console.log('Map initialization pending...');
}

// TODO: Implement weather widget using a weather API
async function initWeather() {
    // This will be implemented with a weather service API
    console.log('Weather widget initialization pending...');
    weatherWidget.innerHTML = '<p>Weather data coming soon...</p>';
}

// Initialize features
window.addEventListener('load', () => {
    initMap();
    initWeather();
});

// Add smooth reveal animations for sections
const revealOnScroll = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    },
    {
        threshold: 0.1
    }
);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transition = 'opacity 0.5s ease-in-out';
    revealOnScroll.observe(section);
});
