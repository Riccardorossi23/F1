document.addEventListener('DOMContentLoaded', function() {
    // Menu hamburger per mobile - Combined implementation
    const hamburger = document.querySelector('.hamburger');
    const menuToggle = document.getElementById('menu-toggle-btn');
    const mainMenu = document.getElementById('main-menu');
    const menu = document.querySelector('.menu'); // From the new script

    // Support both implementations (hamburger might be used in different ways)
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            // Handle both menu implementations
            if (mainMenu) mainMenu.classList.toggle('active');
            if (menu) menu.classList.toggle('show');
        });
    }
    
    if (menuToggle && menuToggle !== hamburger) {
        menuToggle.addEventListener('click', function() {
            if (mainMenu) mainMenu.classList.toggle('active');
        });
    }

    // Close menu when clicking on a link
    const menuLinks = document.querySelectorAll('#main-menu a, .menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (mainMenu) mainMenu.classList.remove('active');
            if (menu) menu.classList.remove('show');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('nav') && !event.target.matches('.hamburger')) {
            if (mainMenu) mainMenu.classList.remove('active');
            if (menu) menu.classList.remove('show');
        }
    });

    // Animazione di ingresso per le sezioni
    const sections = document.querySelectorAll('.era-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(3rem)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });
    
//countdown gare//
    // Date programmate per i Gran Premi del 2025
    const raceDates = {
        "Melbourne Grand Prix Circuit": "2025-03-16T05:00:00Z",
        "Shanghai International Circuit": "2025-03-23T07:00:00Z",
        "Suzuka Circuit": "2025-04-06T06:00:00Z",
        "Bahrain International Circuit": "2025-04-13T15:00:00Z",
        "Jeddah Corniche Circuit": "2025-04-20T17:00:00Z",
        "Miami International Autodrome": "2025-05-04T19:00:00Z",
        "Autodromo Internazionale Enzo e Dino Ferrari": "2025-05-18T13:00:00Z",
        "Circuit de Monaco": "2025-05-25T13:00:00Z",
        "Circuit de Barcelona-Catalunya": "2025-06-01T13:00:00Z",
        "Circuit Gilles Villeneuve": "2025-06-15T18:00:00Z",
        "Red Bull Ring": "2025-06-29T13:00:00Z",
        "Silverstone Circuit": "2025-07-06T14:00:00Z",
        "Circuit de Spa-Francorchamps": "2025-07-27T13:00:00Z",
        "Hungaroring": "2025-08-03T13:00:00Z",
        "Circuit Zandvoort": "2025-08-31T13:00:00Z",
        "Autodromo di Monza": "2025-09-07T13:00:00Z",
        "Baku City Circuit": "2025-09-21T11:00:00Z",
        "Marina Bay Street Circuit": "2025-10-05T12:00:00Z",
        "Circuit of the Americas": "2025-10-19T19:00:00Z",
        "Autódromo Hermanos Rodríguez": "2025-10-26T19:00:00Z",
        "Autódromo José Carlos Pace": "2025-11-09T18:00:00Z",
        "Las Vegas Strip Circuit": "2025-11-22T03:00:00Z",
        "Losail International Circuit": "2025-11-30T15:00:00Z",
        "Yas Marina Circuit": "2025-12-07T13:00:00Z"
    };

    // Descrizioni per eventi Google Calendar
    const raceDescriptions = {
        "Melbourne Grand Prix Circuit": "Gran Premio d'Australia 2025 - Formula 1",
        "Shanghai International Circuit": "Gran Premio di Cina 2025 - Formula 1",
        "Suzuka Circuit": "Gran Premio del Giappone 2025 - Formula 1",
        "Bahrain International Circuit": "Gran Premio del Bahrain 2025 - Formula 1",
        "Jeddah Corniche Circuit": "Gran Premio dell'Arabia Saudita 2025 - Formula 1",
        "Miami International Autodrome": "Gran Premio di Miami 2025 - Formula 1",
        "Autodromo Internazionale Enzo e Dino Ferrari": "Gran Premio dell'Emilia Romagna 2025 - Formula 1",
        "Circuit de Monaco": "Gran Premio di Monaco 2025 - Formula 1",
        "Circuit de Barcelona-Catalunya": "Gran Premio di Spagna 2025 - Formula 1",
        "Circuit Gilles Villeneuve": "Gran Premio del Canada 2025 - Formula 1",
        "Red Bull Ring": "Gran Premio d'Austria 2025 - Formula 1",
        "Silverstone Circuit": "Gran Premio di Gran Bretagna 2025 - Formula 1",
        "Circuit de Spa-Francorchamps": "Gran Premio del Belgio 2025 - Formula 1",
        "Hungaroring": "Gran Premio d'Ungheria 2025 - Formula 1",
        "Circuit Zandvoort": "Gran Premio d'Olanda 2025 - Formula 1",
        "Autodromo di Monza": "Gran Premio d'Italia 2025 - Formula 1",
        "Baku City Circuit": "Gran Premio dell'Azerbaijan 2025 - Formula 1",
        "Marina Bay Street Circuit": "Gran Premio di Singapore 2025 - Formula 1",
        "Circuit of the Americas": "Gran Premio degli Stati Uniti 2025 - Formula 1",
        "Autódromo Hermanos Rodríguez": "Gran Premio del Messico 2025 - Formula 1",
        "Autódromo José Carlos Pace": "Gran Premio del Brasile 2025 - Formula 1",
        "Las Vegas Strip Circuit": "Gran Premio di Las Vegas 2025 - Formula 1",
        "Losail International Circuit": "Gran Premio del Qatar 2025 - Formula 1",
        "Yas Marina Circuit": "Gran Premio di Abu Dhabi 2025 - Formula 1"
    };

    // Funzione per aggiornare singolo countdown
    function updateCountdown(element, targetDate) {
        const now = new Date();
        const difference = targetDate.getTime() - now.getTime();
        
        if (difference <= 0) {
            element.innerHTML = '<span class="completed-race">Gara in corso</span>';
            return;
        }
        
        // Calcola giorni, ore, minuti e secondi
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        // Aggiorna l'elemento HTML
        element.innerHTML = `
            <div class="countdown-container">
                <div class="countdown-label">Countdown alla gara:</div>
                <div class="countdown-timer">
                    <div class="countdown-unit">
                        <span class="countdown-value">${days.toString().padStart(2, '0')}</span>
                        <span class="countdown-unit-label">giorni</span>
                    </div>
                    <div class="countdown-separator">:</div>
                    <div class="countdown-unit">
                        <span class="countdown-value">${hours.toString().padStart(2, '0')}</span>
                        <span class="countdown-unit-label">ore</span>
                    </div>
                    <div class="countdown-separator">:</div>
                    <div class="countdown-unit">
                        <span class="countdown-value">${minutes.toString().padStart(2, '0')}</span>
                        <span class="countdown-unit-label">minuti</span>
                    </div>
                    <div class="countdown-separator">:</div>
                    <div class="countdown-unit">
                        <span class="countdown-value">${seconds.toString().padStart(2, '0')}</span>
                        <span class="countdown-unit-label">secondi</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Funzione per aggiungere un evento a Google Calendar
    function addToGoogleCalendar(circuitName, date, description) {
        // Formatta la data per Google Calendar
        const startDate = date.toISOString().replace(/-|:|\.\d\d\d/g, '');
        
        // Calcola la data di fine (assumiamo che una gara duri 2 ore)
        const endDate = new Date(date.getTime() + (2 * 60 * 60 * 1000)).toISOString().replace(/-|:|\.\d\d\d/g, '');
        
        // Crea URL per Google Calendar
        const url = 'https://www.google.com/calendar/render?action=TEMPLATE' +
            '&text=' + encodeURIComponent(description) +
            '&dates=' + startDate + '/' + endDate +
            '&details=' + encodeURIComponent('Formula 1 Grand Prix at ' + circuitName) +
            '&location=' + encodeURIComponent(circuitName);
        
        // Apri una nuova finestra con l'URL di Google Calendar
        window.open(url, '_blank');
    }

    // Funzione unificata per aggiornare tutti i countdown
    function updateAllCountdowns() {
        // Per i countdown nei circuiti
        const circuitSections = document.querySelectorAll('.circuit-section');
        
        circuitSections.forEach(section => {
            const titleElement = section.querySelector('.circuit-title');
            if (!titleElement) return;
            
            const titleText = titleElement.textContent.trim();
            
            for (const circuitName in raceDates) {
                if (titleText.includes(circuitName)) {
                    const raceDate = new Date(raceDates[circuitName]);
                    const countdownDiv = section.querySelector('.race-countdown');
                    
                    if (countdownDiv) {
                        const today = new Date();
                        if (raceDate < today) {
                            if (!countdownDiv.querySelector('.completed-race')) {
                                countdownDiv.innerHTML = '<span class="completed-race">Gara conclusa</span>';
                            }
                        } else {
                            updateCountdown(countdownDiv, raceDate);
                        }
                    }
                    break;
                }
            }
        });
        
        // Per i countdown generici (con data-date o data-race-date)
        const countdownElements = document.querySelectorAll('.countdown-timer');
        
        countdownElements.forEach(element => {
            const dateAttr = element.getAttribute('data-date') || element.getAttribute('data-race-date');
            if (!dateAttr) return;
            
            const targetDate = new Date(dateAttr);
            const now = new Date();
            
            // Calcola la differenza in millisecondi
            let diff = targetDate - now;
            
            // Se la data è passata, mostra messaggio appropriato
            if (diff <= 0) {
                // Verifica se l'elemento ha una struttura interna specifica
                if (element.querySelector('.days')) {
                    element.innerHTML = "Gara in corso o completata";
                } else {
                    element.textContent = "00:00:00:00";
                }
                return;
            }
            
            // Calcola giorni, ore, minuti e secondi
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            diff -= days * (1000 * 60 * 60 * 24);
            
            const hours = Math.floor(diff / (1000 * 60 * 60));
            diff -= hours * (1000 * 60 * 60);
            
            const minutes = Math.floor(diff / (1000 * 60));
            diff -= minutes * (1000 * 60);
            
            const seconds = Math.floor(diff / 1000);
            
            // Formatta con zeri iniziali
            const formattedDays = String(days).padStart(2, '0');
            const formattedHours = String(hours).padStart(2, '0');
            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(seconds).padStart(2, '0');
            
            // Aggiorna il testo del countdown in base al formato dell'elemento
            if (element.querySelector('.days')) {
                // Formato con elementi separati
                element.querySelector('.days').textContent = formattedDays;
                element.querySelector('.hours').textContent = formattedHours;
                element.querySelector('.minutes').textContent = formattedMinutes;
                element.querySelector('.seconds').textContent = formattedSeconds;
            } else {
                // Formato semplice con testo
                element.textContent = `${formattedDays}:${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
            }
        });
    }

    // Inizializzazione per i circuiti
    const circuitSections = document.querySelectorAll('.circuit-section');
    
    circuitSections.forEach(section => {
        // Ottieni il titolo del circuito
        const titleElement = section.querySelector('.circuit-title');
        if (!titleElement) return;
        
        const titleText = titleElement.textContent.trim();
        
        // Cerca il titolo del circuito nelle date delle gare
        for (const circuitName in raceDates) {
            if (titleText.includes(circuitName)) {
                const raceDate = new Date(raceDates[circuitName]);
                const circuitImage = section.querySelector('.circuit-image');
                
                // Crea un div per il countdown se non esiste già
                 let countdownDiv = section.querySelector('.race-countdown');
                if (!countdownDiv) {
                    countdownDiv = document.createElement('div');
                    countdownDiv.className = 'race-countdown';
                    
                    // Aggiungi il countdown solo sotto il contenuto esistente
                    const circuitContent = section.querySelector('.circuit-content');
                    if (circuitContent) {
                        circuitContent.appendChild(countdownDiv);
                    }
                }
                
                // Crea il div del bottone sotto l'immagine se non esiste già
                if (circuitImage && !circuitImage.querySelector('.button-container')) {
                    const buttonContainer = document.createElement('div');
                    buttonContainer.className = 'button-container';
                    circuitImage.appendChild(buttonContainer);
                    
                    // Verifica se la gara è già passata
                    const today = new Date();
                    if (raceDate < today) {
                        // La gara è già passata, mostra il link alle classifiche
                        countdownDiv.innerHTML = '<span class="completed-race">Gara conclusa</span>';
                        
                        const classLink = document.createElement('a');
                        classLink.href = '/classifiche.html';
                        classLink.className = 'race-button results-button';
                        classLink.textContent = 'Vai alle classifiche';
                        buttonContainer.appendChild(classLink);
                    } else {
                        // La gara è nel futuro, mostra il countdown
                        updateCountdown(countdownDiv, raceDate);
                        
                        // Aggiungi il bottone per Google Calendar
                        const calendarButton = document.createElement('button');
                        calendarButton.className = 'race-button calendar-button';
                        calendarButton.textContent = 'Salva su Google Calendar';
                        calendarButton.onclick = function() {
                            addToGoogleCalendar(circuitName, raceDate, raceDescriptions[circuitName]);
                        };
                        buttonContainer.appendChild(calendarButton);
                    }
                }
                
                break;
            }
        }
    });
    
    // Aggiorna subito all'avvio
    updateAllCountdowns();
    
    // Aggiorna ogni secondo
    setInterval(updateAllCountdowns, 1000);

    // Trova tutti i container degli slideshow nella pagina
    const slideshowContainers = document.querySelectorAll('.slideshow-container');
    
    // Per ogni slideshow, inizializza le funzionalità
    slideshowContainers.forEach(container => {
        const slides = container.querySelectorAll('.slide');
        const indicators = container.querySelectorAll('.indicator');
        const prevButton = container.querySelector('.prev-slide');
        const nextButton = container.querySelector('.next-slide');
        
        let currentSlideIndex = 0;
        
        // Funzione per mostrare una slide specifica
        function showSlide(index) {
            // Rimuovi la classe active da tutte le slide
            slides.forEach(slide => {
                slide.classList.remove('active');
            });
            
            // Rimuovi la classe active da tutti gli indicatori
            indicators.forEach(indicator => {
                indicator.classList.remove('active');
            });
            
            // Aggiungi la classe active alla slide corrente e al suo indicatore
            slides[index].classList.add('active');
            if (indicators[index]) {
                indicators[index].classList.add('active');
            }
            
            // Aggiorna l'indice della slide corrente
            currentSlideIndex = index;
        }
        
        // Funzione per passare alla slide successiva
        function nextSlide() {
            let newIndex = currentSlideIndex + 1;
            if (newIndex >= slides.length) {
                newIndex = 0; // Torna alla prima slide se siamo all'ultima
            }
            showSlide(newIndex);
        }
        
        // Funzione per passare alla slide precedente
        function prevSlide() {
            let newIndex = currentSlideIndex - 1;
            if (newIndex < 0) {
                newIndex = slides.length - 1; // Vai all'ultima slide se siamo alla prima
            }
            showSlide(newIndex);
        }
        
        // Aggiungi event listener ai pulsanti di navigazione
        if (prevButton) {
            prevButton.addEventListener('click', function(e) {
                e.preventDefault();
                prevSlide();
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', function(e) {
                e.preventDefault();
                nextSlide();
            });
        }
        
        // Aggiungi event listener agli indicatori
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function() {
                showSlide(index);
            });
        });
        
        // Opzionale: avvia lo slideshow automatico
        let slideInterval = setInterval(nextSlide, 5000); // Cambia slide ogni 5 secondi
        
        // Opzionale: metti in pausa lo slideshow quando il mouse è sopra
        container.addEventListener('mouseenter', function() {
            clearInterval(slideInterval);
        });
        
        // Opzionale: riprendi lo slideshow quando il mouse esce
        container.addEventListener('mouseleave', function() {
            slideInterval = setInterval(nextSlide, 5000);
        });
    });

    // Inizializza gli elementi di scorrimento per i loghi delle scuderie
    initTeamLogosScroll();
});

/**
 * Funzione per scorrere orizzontalmente i loghi delle scuderie
 * @param {string} direction - Direzione di scorrimento ('left' o 'right')
 */
function scrollTeamLogos(direction) {
    // Ottiene il contenitore dei loghi delle scuderie
    const teamLogosContainer = document.querySelector('.team-logos');
    
    if (!teamLogosContainer) return;
    
    // Definisce la quantità di scorrimento (larghezza di un logo + spazio)
    // Utilizzando una larghezza media del logo di 70px più 10px di spazio
    const scrollAmount = 80;
    
    // Scorrimento in base alla direzione
    if (direction === 'left') {
        teamLogosContainer.scrollLeft -= scrollAmount;
    } else if (direction === 'right') {
        teamLogosContainer.scrollLeft += scrollAmount;
    }

    // Aggiorna immediatamente la visibilità delle frecce dopo lo scorrimento
    updateScrollArrows();
}

// Funzione globale per aggiornare la visibilità delle frecce di scorrimento
function updateScrollArrows() {
    const teamLogosContainer = document.querySelector('.team-logos');
    const leftArrow = document.querySelector('.scroll-left');
    const rightArrow = document.querySelector('.scroll-right');
    
    if (!teamLogosContainer || !leftArrow || !rightArrow) return;
    
    // Verifica se è necessario lo scorrimento
    const isOverflowing = teamLogosContainer.scrollWidth > teamLogosContainer.clientWidth;
    
    // Mostra/nascondi le frecce in base alla dimensione e alla posizione di scorrimento
    if (isOverflowing) {
        // Gestisce la visibilità diretta invece dell'opacità per un comportamento più chiaro
        leftArrow.style.display = teamLogosContainer.scrollLeft > 5 ? 'flex' : 'none';
        rightArrow.style.display = 
            teamLogosContainer.scrollLeft + teamLogosContainer.clientWidth < teamLogosContainer.scrollWidth - 5 
            ? 'flex' : 'none';
    } else {
        // Se non c'è overflow, nascondi entrambe le frecce
        leftArrow.style.display = 'none';
        rightArrow.style.display = 'none';
    }
}

// Funzione di inizializzazione per lo scorrimento dei loghi delle scuderie
function initTeamLogosScroll() {
    const teamLogosContainer = document.querySelector('.team-logos');
    const leftArrow = document.querySelector('.scroll-left');
    const rightArrow = document.querySelector('.scroll-right');
    
    if (!teamLogosContainer || !leftArrow || !rightArrow) return;
    
    // Imposta esplicitamente il gestore eventi click per le frecce
    leftArrow.onclick = function() {
        scrollTeamLogos('left');
    };
    
    rightArrow.onclick = function() {
        scrollTeamLogos('right');
    };
    
    // Aggiungi la classe CSS per renderlo visibile (se non è già presente)
    leftArrow.classList.add('scroll-arrow');
    rightArrow.classList.add('scroll-arrow');
    
    // Controlla immediatamente se è necessario lo scorrimento
    updateScrollArrows();
    
    // Ascolta gli eventi di scorrimento
    teamLogosContainer.addEventListener('scroll', updateScrollArrows);
    
    // Aggiorna al ridimensionamento della finestra
    window.addEventListener('resize', updateScrollArrows);
    
    // Esegue periodicamente un controllo per assicurarsi che le frecce siano correttamente visualizzate
    // Utile per situazioni in cui il contenuto cambia dinamicamente
    const checkInterval = setInterval(updateScrollArrows, 500);
    
    // Ferma il controllo periodico dopo 10 secondi (quando si presume che la pagina sia stabile)
    setTimeout(() => clearInterval(checkInterval), 10000);
}
//--------------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------------------------------------------------------------------------------------//
    // ==================== VARIABILI GLOBALI ====================

// Variabili per la dashboard F1
let dashboardData = {
    drivers: [],
    constructors: [],
    races: []
};

// Variabili per il sistema di autenticazione e biglietti
let currentTab = 'login';
let currentUser = null;
let circuits = [];
let selectedCircuit = null;
let tickets = [];
let ticketQuantities = {};
let ticketToDelete = null;

// ==================== INIZIALIZZAZIONE ====================

document.addEventListener('DOMContentLoaded', function() {
    // Determina il tipo di pagina basandosi sul pathname
    const pathname = window.location.pathname;
    
    if (pathname.includes('/login.html') || pathname === '/') {
        initializeLoginPage();
    } else if (pathname.includes('/admin.html')) {
        initializeAdminPage();
    } else if (pathname.includes('/biglietti.html')) {
        initializeTicketsPage();
    } else if (pathname.includes('dashboard.html') || pathname.includes('/classifiche.html')) {
        initializeDashboard();
    } 
});

function checkUserAuthentication(requireAuth = false) {
    const userData = sessionStorage.getItem('currentUser');
    
    if (!userData) {
        if (requireAuth) {
            // Reindirizza al login solo se l'autenticazione è richiesta
            window.location.href = '/login.html';
            return false;
        }
        return false; // Utente non autenticato ma non richiesta autenticazione
    }
    
    try {
        currentUser = JSON.parse(userData);
        return true;
    } catch (error) {
        console.error('Errore nel parsing dei dati utente:', error);
        if (requireAuth) {
            logout();
        }
        return false;
    }
}

function initializeLoginPage() {
    // LOGIN
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // REGISTRAZIONE
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Validazione password
    const registerPassword = document.getElementById('registerPassword');
    const minLengthReq = document.getElementById('minLength');
    if (registerPassword && minLengthReq) {
        registerPassword.addEventListener('input', function () {
            const password = this.value;
            if (password.length >= 6) {
                minLengthReq.classList.add('valid');
            } else {
                minLengthReq.classList.remove('valid');
            }
        });
    }

    // Conferma password
    const confirmPassword = document.getElementById('confirmPassword');
    if (registerPassword && confirmPassword) {
        confirmPassword.addEventListener('input', function () {
            if (registerPassword.value !== this.value && this.value.length > 0) {
                this.setCustomValidity('Le password non coincidono');
            } else {
                this.setCustomValidity('');
            }
        });
    }
}

function initializeAdminPage() {
    // Per l'admin, l'autenticazione è sempre richiesta
    if (!checkUserAuthentication(true)) return;
    
    if (currentUser.Ruolo === 'admin') {
        document.getElementById('adminName').textContent = currentUser.Nome;
        loadAdminInterface();
    } else {
        window.location.href = '/login.html';
    }
}

function initializeTicketsPage() {
    // Per i biglietti, l'autenticazione è sempre richiesta
    if (!checkUserAuthentication(true)) return;
    
    if (document.getElementById('userName')) {
        document.getElementById('userName').textContent = currentUser.Nome;
    }
    
    loadCircuits();
    
    // Inizializza il form di pagamento se presente
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePayment);
    }
}

function initializeDashboard() {
    // La dashboard non richiede autenticazione
    // Controlla se l'utente è autenticato ma non forza il login
    checkUserAuthentication(false);
    initApp();
}

// ==================== DASHBOARD F1 ====================

function initApp() {
    loadData();
    
    // Aggiungi event listeners per i filtri
    const filterCircuit = document.getElementById('filterCircuit');
    const filterTeam = document.getElementById('filterTeam');
    const filterNation = document.getElementById('filterNation');
    
    if (filterCircuit) filterCircuit.addEventListener('change', handleCircuitFilter);
    if (filterTeam) filterTeam.addEventListener('change', handleTeamFilter);
    if (filterNation) filterNation.addEventListener('change', handleNationFilter);
}

function loadData() {
    loadDrivers();
    loadRaces();
    updateStats();
}

async function loadDrivers(filtroTeam = null, filtroNazione = null) {
    try {
        const [classificheRes, pilotiRes, costruttoriRes] = await Promise.all([
            fetch('http://localhost:3000/ClassificaPiloti2025'),
            fetch('http://localhost:3000/Piloti'),
            fetch('http://localhost:3000/Costruttori')
        ]);

        if (!classificheRes.ok || !pilotiRes.ok || !costruttoriRes.ok) {
            throw new Error(`Errore HTTP: Classifiche ${classificheRes.status}, Piloti ${pilotiRes.status}, Costruttori ${costruttoriRes.status}`);
        }

        const classifiche = await classificheRes.json();
        const piloti = await pilotiRes.json();
        const costruttori = await costruttoriRes.json();

        const tbody = document.querySelector('#driversTable tbody');
        if (!tbody) return;

        const pilotiMap = new Map(piloti.map(p => [p.PilotaID, p]));
        const costruttoriMap = new Map(costruttori.map(c => [c.CostruttoreID, c]));

        let driversData = classifiche.map(classifica => {
            const pilota = pilotiMap.get(classifica.PilotaID) || {};
            const costruttore = costruttoriMap.get(classifica.CostruttoreID) || {};
            return {
                ...classifica,
                NomePilota: pilota.Nome || 'N/A',
                CognomePilota: pilota.Cognome || '',
                NazionalitaPilota: pilota.Nazionalita || 'N/A',
                NomeCostruttore: costruttore.Nome || 'N/A'
            };
        });

        // Applica filtri
        if (filtroTeam) {
            driversData = driversData.filter(driver => driver.CostruttoreID == filtroTeam);
        }
        
        if (filtroNazione) {
            driversData = driversData.filter(driver => driver.NazionalitaPilota === filtroNazione);
        }

        driversData.sort((a, b) => {
            if (a.Posizione !== null && b.Posizione !== null) return a.Posizione - b.Posizione;
            if (a.Posizione !== null) return -1;
            if (b.Posizione !== null) return 1;
            return parseFloat(b.PuntiTotali) - parseFloat(a.PuntiTotali);
        });

        tbody.innerHTML = '';
        
        // Aggiungi header informativo se ci sono filtri attivi
        if (filtroTeam || filtroNazione) {
            const teamName = filtroTeam ? costruttoriMap.get(parseInt(filtroTeam))?.Nome || 'Team sconosciuto' : '';
            const nazione = filtroNazione || '';
            
            let filtroInfo = '';
            if (filtroTeam && filtroNazione) {
                filtroInfo = `🏁 Piloti del team ${teamName} dalla ${nazione}`;
            } else if (filtroTeam) {
                filtroInfo = `🏁 Piloti del team ${teamName}`;
            } else if (filtroNazione) {
                filtroInfo = `🏁 Piloti dalla ${nazione}`;
            }
            
            const headerRow = `
                <tr style="background-color: #f8f9fa; font-weight: bold;">
                    <td colspan="5" style="text-align: center; padding: 1rem;">
                        ${filtroInfo} (${driversData.length} piloti trovati)
                    </td>
                </tr>
            `;
            tbody.innerHTML += headerRow;
        }
        
        driversData.forEach((driver, index) => {
            const posizione = driver.Posizione !== null ? driver.Posizione : (index + 1);
            const punti = parseFloat(driver.PuntiTotali) || 0;
            const row = `
                <tr>
                    <td>${posizione}</td>
                    <td>${driver.NomePilota} ${driver.CognomePilota}</td>
                    <td>${driver.NomeCostruttore}</td>
                    <td>${driver.NazionalitaPilota}</td>
                    <td>${punti}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

        // Aggiorna il contatore solo se non ci sono filtri attivi
        if (!filtroTeam && !filtroNazione) {
            const totalDriversElem = document.getElementById('totalDrivers');
            if (totalDriversElem) totalDriversElem.textContent = driversData.length;
        }
        
        // Popola i filtri solo al primo caricamento
        if (!filtroTeam && !filtroNazione) {
            populateTeamFilter(costruttori);
            populateNationFilter(piloti);
        }

    } catch (err) {
        console.error('Errore dettagliato nel caricamento dei piloti:', err);
        const tbody = document.querySelector('#driversTable tbody');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red; padding: 1.25rem;">Errore: ${err.message}</td></tr>`;
        }
    }
}

async function loadConstructors() {
    try {
        const res = await fetch('http://localhost:3000/ClassificaCostruttori2025');
        if (!res.ok) throw new Error('Errore nel caricamento: ' + res.status);
        const data = await res.json();

        data.sort((a, b) => b.PuntiTotali - a.PuntiTotali);
        data.forEach((c, i) => c.Posizione = i + 1);

        const tbody = document.querySelector('#constructorsTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        data.forEach(team => {
            const row = `
                <tr>
                    <td>${team.Posizione}</td>
                    <td>${team.NomeCostruttore || 'N/A'}</td>
                    <td>${team.Nazionalita || 'N/A'}</td>
                    <td>${team.PuntiTotali}</td>
                    <td>${team.Vittorie}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

        const totalTeamsElem = document.getElementById('totalTeams');
        if (totalTeamsElem) {
            totalTeamsElem.textContent = data.length;
        }
    } catch (err) {
        console.error('Errore nel caricamento dei costruttori:', err);
        const tbody = document.querySelector('#constructorsTable tbody');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="5" style="color:red;text-align:center;">Errore nel caricamento</td></tr>`;
        }
    }
}

async function loadRaces(filtroCircuito = null) {
    try {
        let url = 'http://localhost:3000/RisultatiGare';
        if (filtroCircuito) {
            url += `?circuito=${filtroCircuito}`;
        }
        
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Errore ${res.status} nel recupero dei risultati gara`);

        const data = await res.json();
        const tbody = document.querySelector('#racesTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (filtroCircuito && data.length > 0) {
            // Mostra la classifica completa del circuito selezionato
            const circuitoInfo = data[0];
            
            // Ordina per posizione finale
            data.sort((a, b) => {
                if (a.PosizioneFinale !== null && b.PosizioneFinale !== null) {
                    return a.PosizioneFinale - b.PosizioneFinale;
                }
                if (a.PosizioneFinale !== null && b.PosizioneFinale === null) {
                    return -1;
                }
                if (a.PosizioneFinale === null && b.PosizioneFinale !== null) {
                    return 1;
                }
                return 0;
            });
            
            // Aggiungi header informativo
            const headerRow = `
            <tr style="background-color: #f8f9fa; font-weight: bold;">
                <td colspan="5" style="text-align: center; padding: 1rem;">
                    🏁 Classifica ${circuitoInfo.NomeCircuito} - ${circuitoInfo.Nazione} (${new Date(circuitoInfo.Data).toLocaleDateString()})
                </td>
            </tr>
        `;
            tbody.innerHTML += headerRow;
            
            data.forEach(result => {
                const posizione = result.PosizioneFinale !== null ? result.PosizioneFinale + '°' : 'DNF';
                const row = `
                    <tr>
                        <td>${posizione}</td>
                        <td>${result.NomePilota} ${result.Cognome}</td>
                        <td>${result.Team}</td>
                        <td>${result.NazionalitaPilota || 'N/A'}</td>
                        <td>${result.PuntiOttenuti || 0} pt</td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
            
        } else {
            // Mostra riepilogo dei vincitori di tutte le gare
            const racesMap = new Map();

            data.forEach(result => {
                const circuitoID = result.CircuitoID;
                if (!racesMap.has(circuitoID) || result.PosizioneFinale === 1) {
                    racesMap.set(circuitoID, {
                        round: circuitoID,
                        nazione: result.Nazione,
                        granPremio: result.NomeCircuito,
                        data: result.Data,
                        vincitore: result.PosizioneFinale === 1 ? result.NomePilota + ' ' + result.Cognome : racesMap.get(circuitoID)?.vincitore || '-'
                    });
                }
            });

            const racesArray = Array.from(racesMap.values());
            racesArray.sort((a, b) => a.round - b.round);

            racesArray.forEach(race => {
                const row = `
                    <tr>
                        <td>${race.round}</td>
                        <td>${race.nazione}</td>
                        <td>${race.granPremio}</td>
                        <td>${new Date(race.data).toLocaleDateString()}</td>
                        <td>${race.vincitore}</td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });

            const totalRacesElem = document.getElementById('totalRaces');
            if (totalRacesElem) totalRacesElem.textContent = racesArray.length;
        }

    } catch (err) {
        console.error('Errore durante il caricamento delle gare:', err);
        const tbody = document.querySelector('#racesTable tbody');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">${err.message}</td></tr>`;
        }
    }
}

// Gestori filtri dashboard
function handleCircuitFilter() {
    const selectedCircuit = document.getElementById('filterCircuit').value;
    
    const racesTableHeader = document.querySelector('#racesTable thead tr');
    if (!racesTableHeader) return;
    
    if (selectedCircuit) {
        racesTableHeader.innerHTML = `
            <th>Pos</th>
            <th>Pilota</th>
            <th>Team</th>
            <th>Nazionalità</th>
            <th>Punti</th>
        `;
        loadRaces(selectedCircuit);
    } else {
        racesTableHeader.innerHTML = `
            <th>Round</th>
            <th>Nazione</th>
            <th>Gran Premio</th>
            <th>Data</th>
            <th>Vincitore</th>
        `;
        loadRaces();
    }
}

function handleTeamFilter() {
    const selectedTeam = document.getElementById('filterTeam').value;
    const selectedNation = document.getElementById('filterNation').value;
    loadDrivers(selectedTeam, selectedNation);
}

function handleNationFilter() {
    const selectedTeam = document.getElementById('filterTeam').value;
    const selectedNation = document.getElementById('filterNation').value;
    loadDrivers(selectedTeam, selectedNation);
}

function populateTeamFilter(costruttori) {
    const filterTeam = document.getElementById('filterTeam');
    if (!filterTeam) return;
    
    filterTeam.innerHTML = '<option value="">Tutti i team</option>';
    costruttori.forEach(costruttore => {
        const option = document.createElement('option');
        option.value = costruttore.CostruttoreID;
        option.textContent = costruttore.Nome;
        filterTeam.appendChild(option);
    });
}

function populateNationFilter(piloti) {
    const filterNation = document.getElementById('filterNation');
    if (!filterNation) return;
    
    filterNation.innerHTML = '<option value="">Tutte le nazioni</option>';
    const nazioni = [...new Set(piloti.map(p => p.Nazionalita).filter(n => n))];
    nazioni.sort().forEach(nazione => {
        const option = document.createElement('option');
        option.value = nazione;
        option.textContent = nazione;
        filterNation.appendChild(option);
    });
}

function populateCircuitFilter(circuiti) {
    const select = document.getElementById('filterCircuit');
    if (!select) return;
    
    select.innerHTML = '<option value="">Tutti i circuiti</option>';

    circuiti.forEach(circuito => {
        const option = document.createElement('option');
        option.value = circuito.id;
        option.textContent = circuito.nome;
        select.appendChild(option);
    });
}

function updateStats() {}

// Funzioni UI Dashboard
window.showTab = function (tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) selectedTab.classList.add('active');
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(tabName)) btn.classList.add('active');
    });
    
    if (tabName === 'constructors') {
        loadConstructors();
    } else if (tabName === 'races') {
        const filterCircuit = document.getElementById('filterCircuit');
        if (filterCircuit) filterCircuit.value = '';
        loadRaces();
    } else if (tabName === 'drivers') {
        const filterTeam = document.getElementById('filterTeam');
        const filterNation = document.getElementById('filterNation');
        if (filterTeam) filterTeam.value = '';
        if (filterNation) filterNation.value = '';
        loadDrivers();
    }
};

window.resetFilters = function() {
    const filterTeam = document.getElementById('filterTeam');
    const filterNation = document.getElementById('filterNation');
    const filterCircuit = document.getElementById('filterCircuit');
    
    if (filterTeam) filterTeam.value = '';
    if (filterNation) filterNation.value = '';
    if (filterCircuit) filterCircuit.value = '';
    
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab) {
        if (activeTab.id === 'driversTab') {
            loadDrivers();
        } else if (activeTab.id === 'racesTab') {
            const racesTableHeader = document.querySelector('#racesTable thead tr');
            if (racesTableHeader) {
                racesTableHeader.innerHTML = `
                    <th>Round</th>
                    <th>Nazione</th>
                    <th>Gran Premio</th>
                    <th>Data</th>
                    <th>Vincitore</th>
                `;
            }
            loadRaces();
        }
    }
};

// Inizializza i circuiti per la dashboard
document.addEventListener('DOMContentLoaded', () => {
    const circuiti2025 = [
        { id: "1", nome: "Melbourne" },
        { id: "2", nome: "Shangai" },
        { id: "3", nome: "Suzuka" },
        { id: "4", nome: "Jeddah" },
        { id: "5", nome: "Bahrain" },
        { id: "6", nome: "Miami" },
        { id: "7", nome: "Imola" },
        { id: "8", nome: "Monaco" },
        { id: "9", nome: "Barcellona" },
        { id: "10", nome: "Montreal" },
        { id: "11", nome: "Red Bull Ring" },
        { id: "12", nome: "Silverstone" },
        { id: "13", nome: "Spa-Francorchamps" },
        { id: "14", nome: "Hungaroring" },
        { id: "15", nome: "Zandvoort" },
        { id: "16", nome: "Monza" },
        { id: "17", nome: "Baku" },
        { id: "18", nome: "Singapore" },
        { id: "19", nome: "Austin (COTA)" },
        { id: "20", nome: "Messico City" },
        { id: "21", nome: "Brasil" },
        { id: "22", nome: "Las Vegas" },
        { id: "23", nome: "Lusail" },
        { id: "24", nome: "Abu Dhabi" }
    ];

    if (document.getElementById('filterCircuit')) {
        populateCircuitFilter(circuiti2025);
    }
});

// ==================== GESTIONE AUTENTICAZIONE ====================

function switchTab(tab) {
    if (currentTab === tab) return;

    const buttons = document.querySelectorAll('.tab-button');
    const forms = document.querySelectorAll('.form-section');

    buttons.forEach(btn => btn.classList.remove('active'));
    forms.forEach(form => form.classList.remove('active'));

    const targetButton = document.querySelector(`[onclick="switchTab('${tab}')"]`);
    const targetForm = document.getElementById(`${tab}Form`);
    
    if (targetButton) targetButton.classList.add('active');
    if (targetForm) targetForm.classList.add('active');

    currentTab = tab;
    clearMessage();
}

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const button = document.getElementById('loginButton');
    
    setLoading(button, true);
    
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Email: email,
                Password: password
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            sessionStorage.setItem('currentUser', JSON.stringify(result.user));
            
            showMessage('Login effettuato con successo! Reindirizzamento...', 'success');
            
            if (result.user.Ruolo === 'admin') {
                setTimeout(() => {
                    window.location.href = '/admin.html';
                }, 1500);
            } else {
                setTimeout(() => {
                    window.location.href = '/biglietti.html';
                }, 1500);
            }
        } else {
            showMessage(result.error || 'Errore durante il login', 'error');
        }
    } catch (error) {
        console.error('Errore login:', error);
        showMessage('Errore di connessione. Riprova più tardi.', 'error');
    } finally {
        setLoading(button, false);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const nome = document.getElementById('registerNome').value;
    const cognome = document.getElementById('registerCognome').value;
    const email = document.getElementById('registerEmail').value;
    const cartaId = document.getElementById('registerCartaId').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const button = document.getElementById('registerButton');
    
    const cartaRegex = /^[A-Z]{2}[0-9]{5}[A-Z]{2}$/;
    if (!cartaRegex.test(cartaId)) {
        showMessage("⚠️ Il codice della carta d'identità deve essere nel formato: 2 lettere, 5 numeri, 2 lettere (es. AB12345CD)", 'error');
        return;
    }

    if (password !== confirmPassword) {
        showMessage('⚠️ Le password non coincidono', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('⚠️ La password deve essere di almeno 6 caratteri', 'error');
        return;
    }

    setLoading(button, true);

    try {
        const response = await fetch('/utenti', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Nome: nome,
                Cognome: cognome,
                Email: email,
                Password: password,
                CartaIdentitàID: cartaId
            })
        });

        const result = await response.json();

        if (response.ok) {
            showMessage('✅ Registrazione completata! Ora puoi effettuare il login.', 'success');
            const form = document.getElementById('registerForm').querySelector('form');
            if (form) form.reset();
            setTimeout(() => {
                switchTab('login');
                const loginEmail = document.getElementById('loginEmail');
                if (loginEmail) loginEmail.value = email;
            }, 2000);
        } else {
            showMessage(result.error || 'Errore durante la registrazione', 'error');
        }
    } catch (error) {
        console.error('Errore registrazione:', error);
        showMessage('Errore di connessione. Riprova più tardi.', 'error');
    } finally {
        setLoading(button, false);
    }
}

// ==================== GESTIONE CIRCUITI E BIGLIETTI ====================

async function loadCircuits() {
    try {
        const response = await fetch('/Circuiti');
        
        if (!response.ok) {
            throw new Error('Errore nel caricamento dei circuiti');
        }
        
        circuits = await response.json();
        
        const container = document.getElementById('circuitsContainer');
        if (!container) return;
        
        if (circuits.length === 0) {
            container.innerHTML = '<p>Nessun circuito disponibile al momento.</p>';
            return;
        }

        container.innerHTML = '';
        container.className = 'circuits-grid';

        circuits.forEach(circuit => {
            const card = document.createElement('div');
            card.className = 'circuit-card';
            card.onclick = () => selectCircuit(circuit);
            
            card.innerHTML = `
                <div class="circuit-name">${circuit.Nome}</div>
                <div class="circuit-info">
                    📍 ${circuit.Nazione}<br>
                    📅 ${new Date(circuit.Giorno).toLocaleDateString('it-IT')}
                </div>
            `;
            
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Errore nel caricamento dei circuiti:', error);
        showMessage('Errore nel caricamento dei circuiti. Verifica la connessione.', 'error');
    }
}

async function selectCircuit(circuit) {
    document.querySelectorAll('.circuit-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    event.target.closest('.circuit-card').classList.add('selected');
    selectedCircuit = circuit;
    
    await loadTickets(circuit.CircuitoID);
}

async function loadTickets(circuitId) {
    try {
        console.log("Circuit ID usato:", circuitId);
        const response = await fetch(`/bigliettiF1/circuito/${circuitId}`);
        console.log("Status fetch:", response.status);

        if (!response.ok) {
            throw new Error('Errore nel caricamento dei bigliettiF1');
        }
        
        tickets = await response.json();
        
        const container = document.getElementById('ticketsContainer');
        const grid = document.getElementById('ticketsGrid');
        
        if (!container || !grid) return;
        
        container.style.display = 'block';
        
        if (tickets.length === 0) {
            grid.innerHTML = '<p>Nessun biglietto disponibile per questo circuito.</p>';
            return;
        }

        grid.innerHTML = '';
        ticketQuantities = {};

        tickets.forEach(ticket => {
            ticketQuantities[ticket.BigliettoID] = 0;
            
            const card = document.createElement('div');
            card.className = 'ticket-card';
            
            const availabilityClass = ticket.Disponibilita > 0 ? 'ticket-availability' : 'ticket-unavailable';
            const availabilityText = ticket.Disponibilita > 0 
                ? `✅ Disponibili: ${ticket.Disponibilita}`
                : '❌ Esaurito';
            
            card.innerHTML = `
                <div class="ticket-sector">${getSectorIcon(ticket.TipoPosto)} ${ticket.TipoPosto}</div>
                <div class="ticket-price">€${Number(ticket.Prezzo).toFixed(2)}</div>
                <div class="${availabilityClass}">${availabilityText}</div>
                
                ${ticket.Disponibilita > 0 ? `
                    <div class="quantity-selector">
                        <button type="button" class="quantity-btn" onclick="changeQuantity(${ticket.BigliettoID}, -1)">-</button>
                        <div class="quantity-display" id="qty-${ticket.BigliettoID}">0</div>
                        <button type="button" class="quantity-btn" onclick="changeQuantity(${ticket.BigliettoID}, 1)">+</button>
                    </div>
                    <button class="buy-btn" onclick="buyTicket(${ticket.BigliettoID})" id="btn-${ticket.BigliettoID}" disabled>
                        Aggiungi al Carrello
                    </button>
                ` : `
                    <button class="buy-btn" disabled>Non Disponibile</button>
                `}
            `;
            
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Errore nel caricamento dei bigliettiF1:', error);
        showMessage('Errore nel caricamento dei bigliettiF1. Riprova più tardi.', 'error');
    }
}

function changeQuantity(ticketId, change) {
    const ticket = tickets.find(t => t.BigliettoID === ticketId);
    const currentQty = ticketQuantities[ticketId];
    const newQty = Math.max(0, Math.min(ticket.Disponibilita, currentQty + change));
    
    ticketQuantities[ticketId] = newQty;
    document.getElementById(`qty-${ticketId}`).textContent = newQty;
    
    const buyBtn = document.getElementById(`btn-${ticketId}`);
    buyBtn.disabled = newQty === 0;
    buyBtn.textContent = newQty === 0 ? 'Aggiungi al Carrello' : `Acquista ${newQty} bigliett${newQty > 1 ? 'i' : 'o'}`;
}

function buyTicket(ticketId) {
    const ticket = tickets.find(t => t.BigliettoID === ticketId);
    const quantity = ticketQuantities[ticketId];
    
    if (quantity === 0) return;
    
    const total = ticket.Prezzo * quantity;
    
    document.getElementById('purchaseDetails').innerHTML = `
        <div style="margin-bottom: 1rem;">
            <strong>Utente:</strong> ${currentUser.Nome} ${currentUser.Cognome}<br>
            <strong>Email:</strong> ${currentUser.Email}<br>
            <strong>Circuito:</strong> ${selectedCircuit.Nome}<br>
            <strong>TipoPosto:</strong> ${ticket.TipoPosto}<br>
            <strong>Quantità:</strong> ${quantity}<br>
            <strong>Prezzo unitario:</strong> €${Number(ticket.Prezzo).toFixed(2)}<br>
            <strong>Totale:</strong> €${total.toFixed(2)}
        </div>
    `;
    
    // Memorizza i dati per l'acquisto
    document.getElementById('paymentModal').ticketData = {
        ticketId,
        quantity,
        total
    };
    
    document.getElementById('paymentModal').style.display = 'flex';
}

// ==================== GESTIONE PAGAMENTO ====================

// Inizializza il form di pagamento
document.addEventListener('DOMContentLoaded', function() {
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const cardNumber = document.getElementById('cardNumber').value;
            const modal = document.getElementById('paymentModal');
            const ticketData = modal.ticketData;
            
            if (cardNumber.length !== 9) {
                showMessage('Il numero di carta deve essere di 9 cifre', 'error');
                return;
            }
            
            // Disabilita il pulsante durante l'elaborazione
            const submitBtn = document.querySelector('.confirm-btn');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Elaborazione...';
            
            try {
                const response = await fetch('/acquista-bigliettiF1', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        CartaIdentitàID: currentUser.CartaIdentitàID,
                        BigliettoID: ticketData.ticketId,
                        Quantita: ticketData.quantity,
                        NumeroCarta: cardNumber
                    })
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    showMessage(`Acquisto completato con successo! Totale speso: €${result.totaleSpeso.toFixed(2)}`, 'success');
                    closeModal();
                    // Ricarica i bigliettiF1 per aggiornare la disponibilità
                    await loadTickets(selectedCircuit.CircuitoID);
                    // Reset delle quantità
                    Object.keys(ticketQuantities).forEach(key => {
                        ticketQuantities[key] = 0;
                    });
                } else {
                    showMessage(result.error || 'Errore durante l\'acquisto', 'error');
                }
            } catch (error) {
                console.error('Errore nell\'acquisto:', error);
                showMessage('Errore di rete durante l\'acquisto. Riprova più tardi.', 'error');
            } finally {
                // Riabilita il pulsante
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
});

function closeModal() {
    document.getElementById('paymentModal').style.display = 'none';
    document.getElementById('cardNumber').value = '';
}

// ==================== INTERFACCIA ADMIN ====================

async function loadAdminInterface() {
    try {
        const response = await fetch('/admin/biglietti-completi');
        
        if (!response.ok) {
            throw new Error('Errore nel caricamento dei biglietti');
        }
        
        const biglietti = await response.json();
        displayAdminTickets(biglietti);
    } catch (error) {
        console.error('Errore nel caricamento dell\'interfaccia admin:', error);
        showMessage('Errore nel caricamento dei dati. Verifica la connessione.', 'error');
    }
}

function displayAdminTickets(biglietti) {
    const container = document.getElementById('adminTicketsContainer');
    
    if (biglietti.length === 0) {
        container.innerHTML = '<p>Nessun biglietto disponibile.</p>';
        return;
    }

    // Raggruppa i biglietti per circuito
    const bigliettiPerCircuito = biglietti.reduce((acc, ticket) => {
        const circuitoKey = `${ticket.CircuitoID}-${ticket.NomeCircuito}`;
        if (!acc[circuitoKey]) {
            acc[circuitoKey] = {
                info: {
                    nome: ticket.NomeCircuito,
                    nazione: ticket.Nazione,
                    giorno: ticket.Giorno,
                    stato: ticket.StatoGara
                },
                biglietti: []
            };
        }
        acc[circuitoKey].biglietti.push(ticket);
        return acc;
    }, {});

    container.innerHTML = '';

    Object.values(bigliettiPerCircuito).forEach(gruppo => {
        const circuitSection = document.createElement('div');
        circuitSection.className = 'admin-circuit-section';
        
        const statusClass = gruppo.info.stato === 'passata' ? 'past-race' : 
                           gruppo.info.stato === 'oggi' ? 'today-race' : 'future-race';
        
        const statusText = gruppo.info.stato === 'passata' ? '🏁 GARA GIÀ AVVENUTA' : 
                          gruppo.info.stato === 'oggi' ? '🏁 GARA OGGI' : '🏎️ GARA FUTURA';
        
        circuitSection.innerHTML = `
            <div class="admin-circuit-header ${statusClass}">
                <h3>${gruppo.info.nome}</h3>
                <div class="circuit-details">
                    📍 ${gruppo.info.nazione} | 📅 ${new Date(gruppo.info.giorno).toLocaleDateString('it-IT')}
                </div>
                <div class="race-status">${statusText}</div>
            </div>
            <div class="admin-tickets-grid" id="tickets-${gruppo.info.nome.replace(/\s+/g, '')}">
            </div>
        `;
        
        container.appendChild(circuitSection);
        
        const ticketsGrid = circuitSection.querySelector('.admin-tickets-grid');
        
        gruppo.biglietti.forEach(ticket => {
            const ticketCard = document.createElement('div');
            ticketCard.className = `admin-ticket-card ${gruppo.info.stato === 'passata' ? 'disabled' : ''}`;
            ticketCard.id = `ticket-card-${ticket.BigliettoID}`;
            
            const isDisabled = gruppo.info.stato === 'passata';
            
            ticketCard.innerHTML = `
                <div class="ticket-sector-admin">
                    ${getSectorIcon(ticket.TipoPosto)} ${ticket.TipoPosto}
                </div>
                <div class="admin-input-group">
                    <label>Prezzo (€)</label>
                    <input type="number" 
                           value="${ticket.Prezzo}" 
                           id="price-${ticket.BigliettoID}" 
                           step="0.01" 
                           min="0"
                           ${isDisabled ? 'disabled' : ''}>
                </div>
                <div class="admin-input-group">
                    <label>Disponibilità</label>
                    <input type="number" 
                           value="${ticket.Disponibilita}" 
                           id="availability-${ticket.BigliettoID}" 
                           min="0"
                           ${isDisabled ? 'disabled' : ''}>
                </div>
                <div class="admin-actions">
                    <button class="admin-save-btn" 
                            onclick="salvaModificheBiglietto(${ticket.BigliettoID})"
                            ${isDisabled ? 'disabled' : ''}>
                        ${isDisabled ? 'Gara Conclusa' : '💾 Salva'}
                    </button>
                    <button class="admin-delete-btn" 
                            onclick="eliminaBiglietto(${ticket.BigliettoID}, '${ticket.TipoPosto}', '${gruppo.info.nome}')"
                            ${isDisabled ? 'disabled' : ''}>
                        🗑️ Elimina
                    </button>
                </div>
                <div id="delete-warning-${ticket.BigliettoID}" class="ticket-delete-warning" style="display: none;">
                    <p><strong>Sei sicuro di voler eliminare definitivamente questo biglietto?</strong></p>
                    <br>
                    <strong>Circuito:</strong> ${gruppo.info.nome}<br>
                    <strong>Settore:</strong> ${ticket.TipoPosto}<br><br>
                    <span style="color: #ff6b6b;">⚠️ Questa azione non può essere annullata!</span>
                    <div class="inline-delete-buttons">
                        <button class="modal-btn confirm" onclick="confermaEliminazione(${ticket.BigliettoID})">Conferma</button>
                        <button class="modal-btn cancel" onclick="annullaEliminazione(${ticket.BigliettoID})">Annulla</button>
                    </div>
                </div>
            `;
            
            ticketsGrid.appendChild(ticketCard);
        });
    });
}

async function salvaModificheBiglietto(bigliettoId, event) {
    const prezzoInput = document.getElementById(`price-${bigliettoId}`);
    const disponibilitaInput = document.getElementById(`availability-${bigliettoId}`);
    
    const prezzo = parseFloat(prezzoInput.value);
    const disponibilita = parseInt(disponibilitaInput.value);
    
    if (isNaN(prezzo) || prezzo < 0) {
        showMessage('Il prezzo deve essere un numero valido maggiore o uguale a 0', 'error');
        return;
    }
    
    if (isNaN(disponibilita) || disponibilita < 0) {
        showMessage('La disponibilità deve essere un numero valido maggiore o uguale a 0', 'error');
        return;
    }
    
    try {
        const bodyData = {
            Prezzo: prezzo,
            Disponibilita: disponibilita
        };

        const response = await fetch(`/admin/biglietti/${bigliettoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        });

        let result = {};
        try {
            const contentType = response.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
                result = await response.json();
            }
        } catch (_) {}

        if (response.ok) {
            showMessage("✅ Modifica salvata con successo", "success");

            const button = event?.target;
            if (button) {
                const originalText = button.textContent;
                button.textContent = '✅ Salvato!';
                button.style.backgroundColor = '#28a745';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.backgroundColor = '';
                }, 2000);
            }
        } else {
            showMessage(result?.error || "Errore nel salvataggio", "error");
        }

    } catch (_) {
        showMessage('Errore di connessione durante il salvataggio', 'error');
    }
}


// ==================== GESTIONE CANCELLAZIONE BIGLIETTI ====================

function eliminaBiglietto(bigliettoId, tipoPosto, nomeCircuito) {
    // Nascondi eventuali altri warning aperti
    document.querySelectorAll('.ticket-delete-warning').forEach(warning => {
        warning.style.display = 'none';
    });
    
    // Mostra il warning inline per questo biglietto
    const warningDiv = document.getElementById(`delete-warning-${bigliettoId}`);
    warningDiv.style.display = 'block';
    
    // Scorri verso il warning per renderlo visibile
    warningDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function confermaEliminazione(bigliettoId) {
    const confirmBtn = document.querySelector(`#delete-warning-${bigliettoId} .modal-btn.confirm`);
    const originalText = confirmBtn.textContent;
    
    confirmBtn.disabled = true;
    confirmBtn.textContent = '⏳ Eliminazione...';
    
    try {
        const response = await fetch(`/bigliettiF1/${bigliettoId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showMessage('✅ Biglietto eliminato con successo', 'success');
            // Ricarica l'interfaccia admin per aggiornare la lista
            loadAdminInterface();
        } else {
            const result = await response.json();
            showMessage(result.error || 'Errore durante l\'eliminazione', 'error');
        }
    } catch (error) {
        console.error('Errore nell\'eliminazione:', error);
        showMessage('Errore di connessione durante l\'eliminazione', 'error');
    } finally {
        confirmBtn.disabled = false;
        confirmBtn.textContent = originalText;
    }
}

function annullaEliminazione(bigliettoId) {
    const warningDiv = document.getElementById(`delete-warning-${bigliettoId}`);
    warningDiv.style.display = 'none';
}

// ==================== GESTIONE AGGIUNTA BIGLIETTI ====================
function adminLogout() {
    if (confirm('Sei sicuro di voler uscire dalla modalità amministratore?')) {
        sessionStorage.removeItem('currentUser');
        showMessage('Logout amministratore effettuato', 'success');
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 1000);
    }
}

// ==================== FUNZIONI UTILITY ====================

function setLoading(button, loading) {
    if (loading) {
        button.innerHTML = '<span class="loading"></span>Attendere...';
        button.disabled = true;
    } else {
        button.innerHTML = currentTab === 'login' ? 'Accedi' : 'Registrati';
        button.disabled = false;
    }
}

function showMessage(text, type) {
    const container = document.getElementById('messageContainer');
    container.innerHTML = `<div class="message ${type}">${text}</div>`;
    
    setTimeout(() => {
        if (type === 'error') {
            clearMessage();
        }
    }, 5000);
}

function clearMessage() {
    const container = document.getElementById('messageContainer');
    if (container) {
        container.innerHTML = '';
    }
}

function getSectorIcon(sector) {
    switch(sector) {
        case 'Paddock': return '🏆';
            case 'Gradinate': return '🏟️';
            case 'Prato': return '🌱';
            default: return '🎫';
        }
    }

    function logout() {
        if (confirm('Sei sicuro di voler uscire?')) {
            sessionStorage.removeItem('currentUser');
            showMessage('Logout effettuato con successo', 'success');
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 1000);
        }
    }

    // Gestione tasto ESC per chiudere eventuali warning di eliminazione
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.ticket-delete-warning').forEach(warning => {
                if (warning.style.display === 'block') {
                    warning.style.display = 'none';
                }
            });
        }
    });