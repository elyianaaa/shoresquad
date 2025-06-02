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

// Smooth scrolling for navigation and CTA button
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

// Add click handlers for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        smoothScroll(this.getAttribute('href'));
    });
});

// Add click handler for CTA button
document.querySelector('.cta-button').addEventListener('click', () => {
    smoothScroll('#map');
    
    // Highlight the map info with a subtle animation
    const mapInfo = document.querySelector('.map-info');
    mapInfo.style.animation = 'highlight 2s ease';
});

// TODO: Implement map functionality using a mapping service API
async function initMap() {
    // This will be implemented with a mapping service like Google Maps or Leaflet
    console.log('Map initialization pending...');
}

// Fetch weather data from data.gov.sg
async function initWeather() {
    weatherWidget.innerHTML = `
        <div class="weather-info">
            <p class="weather-desc">Fetching latest weather data...</p>
            <div class="loading-spinner"></div>
        </div>
    `;

    try {
        // Fetch both forecast and temperature data
        const [forecastResponse, tempResponse] = await Promise.all([
            fetch('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast'),
            fetch('https://api.data.gov.sg/v1/environment/air-temperature')
        ]);
        
        if (!forecastResponse.ok || !tempResponse.ok) {
            throw new Error('Failed to fetch weather data');
        }
        
        const [forecastData, tempData] = await Promise.all([
            forecastResponse.json(),
            tempResponse.json()
        ]);
        
        if (!forecastData.items?.length || !tempData.items?.length) {
            throw new Error('Invalid data format received');
        }

        // Get the forecast for Pasir Ris
        const forecast = forecastData.items[0].forecasts.find(f => 
            f.area.toLowerCase().includes('pasir ris')
        );

        // Get the latest temperature reading (using the first station's data)
        const temperature = tempData.items[0].readings[0].value;

        if (!forecast) {
            throw new Error('Forecast for Pasir Ris not found');
        }

        // Update the weather widget
        weatherWidget.innerHTML = `
            <div class="weather-info">
                <p class="weather-temp">${temperature.toFixed(1)}°C</p>
                <p class="weather-desc">${forecast.forecast}</p>
                <div class="weather-details">
                    <p><strong>Area:</strong> ${forecast.area}</p>
                </div>
                <p class="weather-update">Last updated: ${new Date(forecastData.items[0].timestamp).toLocaleTimeString()}</p>
                <p class="weather-source">Source: NEA Weather Forecast</p>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherWidget.innerHTML = `
            <div class="weather-info">
                <p class="weather-desc">Weather data unavailable</p>
                <div class="weather-details">
                    <p>We're having trouble getting the latest weather information.</p>
                    <p>Please try refreshing the page.</p>
                </div>
                <button onclick="initWeather()" class="retry-button">Retry</button>
                <p class="weather-source">Source: NEA Weather Forecast</p>
            </div>
        `;
    }
}

// Set up weather auto-refresh
function setupWeatherRefresh() {
    // Initial weather fetch
    initWeather();
    
    // Refresh every 30 minutes (1800000 milliseconds)
    const REFRESH_INTERVAL = 30 * 60 * 1000;
    
    // Set up periodic refresh
    setInterval(initWeather, REFRESH_INTERVAL);
    
    // Also refresh when the tab becomes visible again
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            initWeather();
        }
    });
}

// Initialize features
window.addEventListener('load', () => {
    initMap();
    setupWeatherRefresh();
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
    revealOnScroll.observe(section);
});

// Add click handlers for registration buttons
document.querySelectorAll('.register-button').forEach(button => {
    button.addEventListener('click', function() {
        const eventDetails = this.closest('.cleanup-event');
        const location = eventDetails.querySelector('strong').textContent;
        const date = eventDetails.querySelector('.date').textContent;
        const currentParticipants = eventDetails.querySelector('.participants');
        
        // Update registration status
        this.textContent = 'Registered!';
        this.style.backgroundColor = '#98FF98';
        this.disabled = true;
        
        // Update participant count
        const count = parseInt(currentParticipants.textContent) + 1;
        currentParticipants.textContent = `${count} participants registered`;
        
        // Show confirmation
        alert(`Thank you for registering!\n\nLocation: ${location}\nDate: ${date}\n\nWe'll send you an email with more details.`);
    });
});
