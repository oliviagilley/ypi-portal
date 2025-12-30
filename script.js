// DOM Elements
const steps = document.querySelectorAll('.step');
const progressBar = document.getElementById('progress-bar');
let currentStep = 1;
const totalSteps = 8;

// Form Data Object
const formData = {
    selectedVehicles: [],
    monthlyPayment: 400,
    downPayment: 0,
    personalInfo: {},
    addressInfo: {},
    employmentInfo: {},
    protectionOptions: {},
    additionalIncome: []
};

// Initialize the application
function init() {
    // Set up event listeners
    setupEventListeners();
    
    // Initialize the vehicle grid (in a real app, this would come from an API)
    initializeVehicleGrid();
    
    // Set up the state dropdown
    initializeStates();
    
    // Update the progress bar
    updateProgressBar();
}

// Set up event listeners
function setupEventListeners() {
    // Landing page buttons
    document.getElementById('start-application').addEventListener('click', startApplication);
    document.getElementById('other-options').addEventListener('click', showOtherOptions);
    
    // Navigation buttons
    document.getElementById('to-step-2').addEventListener('click', () => navigateTo(2));
    document.getElementById('to-step-3').addEventListener('click', () => navigateTo(3));
    document.getElementById('to-step-4').addEventListener('click', () => navigateTo(4));
    document.getElementById('to-step-5').addEventListener('click', () => navigateTo(5));
    document.getElementById('to-step-6').addEventListener('click', () => navigateTo(6));
    document.getElementById('to-step-7').addEventListener('click', () => navigateTo(7));
    document.getElementById('to-step-8').addEventListener('click', () => navigateTo(8));
    
    // Back buttons
    document.getElementById('back-to-1').addEventListener('click', () => navigateTo(1));
    document.getElementById('back-to-2').addEventListener('click', () => navigateTo(2));
    document.getElementById('back-to-3').addEventListener('click', () => navigateTo(3));
    document.getElementById('back-to-4').addEventListener('click', () => navigateTo(4));
    document.getElementById('back-to-5').addEventListener('click', () => navigateTo(5));
    document.getElementById('back-to-6').addEventListener('click', () => navigateTo(6));
    
    // Form inputs
    document.getElementById('monthly-payment').addEventListener('input', updatePaymentAmount);
    document.getElementById('payment-amount').addEventListener('input', updatePaymentSlider);
    document.getElementById('down-payment').addEventListener('input', updateDownPayment);
    
    // Protection options
    document.getElementById('extended-warranty').addEventListener('change', updateProtectionOptions);
    document.getElementById('gap-coverage').addEventListener('change', updateProtectionOptions);
    
    // Submit button
    document.getElementById('submit-application').addEventListener('click', submitApplication);
    
    // Employment status change
    document.querySelectorAll('input[name="employment-status"]').forEach(radio => {
        radio.addEventListener('change', updateEmploymentDetails);
    });
    
    // Payment type change
    document.getElementById('payment-type').addEventListener('change', updatePaymentType);
    
    // Income calculation
    document.getElementById('hourly-rate').addEventListener('input', calculateHourlyIncome);
    document.getElementById('hours-per-week').addEventListener('input', calculateHourlyIncome);
    document.getElementById('salary-amount').addEventListener('input', calculateSalaryIncome);
    document.getElementById('salary-period').addEventListener('change', calculateSalaryIncome);
    
    // Co-applicant
    document.querySelectorAll('input[name="co-applicant"]').forEach(radio => {
        radio.addEventListener('change', updateCoApplicantSection);
    });
    
    // Copy link button
    document.getElementById('copy-link-btn').addEventListener('click', copyCoApplicantLink);
    
    // Terms agreement
    document.getElementById('agree-terms').addEventListener('change', updateSubmitButton);
    
    // Address time change
    document.getElementById('address-years').addEventListener('input', checkAddressDuration);
    document.getElementById('address-months').addEventListener('input', checkAddressDuration);
    
    // Employment time change
    document.getElementById('time-at-job-years').addEventListener('input', checkEmploymentDuration);
    document.getElementById('time-at-job-months').addEventListener('input', checkEmploymentDuration);
    
    // Add income source button
    document.getElementById('add-income-source').addEventListener('click', addIncomeSource);
    
    // SSN formatting
    document.getElementById('ssn').addEventListener('input', formatSSN);
}

// Initialize the vehicle grid with sample data
function initializeVehicleGrid() {
    const vehicleGrid = document.getElementById('vehicle-grid');
    
    // Sample vehicle data (in a real app, this would come from an API)
    const vehicles = [
        { id: 1, make: 'Honda', model: 'Civic', year: 2023, price: 23950, image: 'https://via.placeholder.com/300x200?text=Honda+Civic' },
        { id: 2, make: 'Toyota', model: 'Camry', year: 2023, price: 25945, image: 'https://via.placeholder.com/300x200?text=Toyota+Camry' },
        { id: 3, make: 'Ford', model: 'F-150', year: 2023, price: 32990, image: 'https://via.placeholder.com/300x200?text=Ford+F150' },
        { id: 4, make: 'Chevrolet', model: 'Equinox', year: 2023, price: 26995, image: 'https://via.placeholder.com/300x200?text=Chevrolet+Equinox' },
        { id: 5, make: 'Nissan', model: 'Rogue', year: 2023, price: 27260, image: 'https://via.placeholder.com/300x200?text=Nissan+Rogue' },
        { id: 6, make: 'Hyundai', model: 'Tucson', year: 2023, price: 25350, image: 'https://via.placeholder.com/300x200?text=Hyundai+Tucson' }
    ];
    
    // Clear any existing content
    vehicleGrid.innerHTML = '';
    
    // Add vehicles to the grid
    vehicles.forEach(vehicle => {
        const vehicleCard = document.createElement('div');
        vehicleCard.className = 'col-md-4 mb-4';
        vehicleCard.innerHTML = `
            <div class="card vehicle-card" data-vehicle-id="${vehicle.id}">
                <img src="${vehicle.image}" class="card-img-top" alt="${vehicle.year} ${vehicle.make} ${vehicle.model}">
                <div class="card-body">
                    <h5 class="card-title">${vehicle.year} ${vehicle.make} ${vehicle.model}</h5>
                    <p class="card-text">Starting at $${vehicle.price.toLocaleString()}</p>
                    <button class="btn btn-outline-primary select-vehicle">Select</button>
                    <button class="btn btn-outline-secondary favorite-vehicle" style="display: none;">⭐ Favorite</button>
                </div>
            </div>
        `;
        
        vehicleGrid.appendChild(vehicleCard);
    });
    
    // Add event listeners to the vehicle cards
    document.querySelectorAll('.vehicle-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger if the click was on a button inside the card
            if (e.target.tagName === 'BUTTON') return;
            
            const vehicleId = parseInt(card.getAttribute('data-vehicle-id'));
            toggleVehicleSelection(vehicleId);
        });
    });
    
    // Add event listeners to the select buttons
    document.querySelectorAll('.select-vehicle').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = button.closest('.vehicle-card');
            const vehicleId = parseInt(card.getAttribute('data-vehicle-id'));
            toggleVehicleSelection(vehicleId);
        });
    });
    
    // Add event listeners to the favorite buttons
    document.querySelectorAll('.favorite-vehicle').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = button.closest('.vehicle-card');
            const vehicleId = parseInt(card.getAttribute('data-vehicle-id'));
            setFavoriteVehicle(vehicleId);
        });
    });
}

// Toggle vehicle selection
function toggleVehicleSelection(vehicleId) {
    const card = document.querySelector(`.vehicle-card[data-vehicle-id="${vehicleId}"]`);
    const index = formData.selectedVehicles.indexOf(vehicleId);
    
    if (index === -1) {
        // Add to selection if not already selected and we have less than 5
        if (formData.selectedVehicles.length < 5) {
            formData.selectedVehicles.push(vehicleId);
            card.classList.add('selected');
            card.querySelector('.favorite-vehicle').style.display = 'inline-block';
            
            // If this is the first vehicle, set it as favorite
            if (formData.selectedVehicles.length === 1) {
                setFavoriteVehicle(vehicleId);
            }
        }
    } else {
        // Remove from selection
        formData.selectedVehicles.splice(index, 1);
        card.classList.remove('selected');
        card.querySelector('.favorite-vehicle').style.display = 'none';
        
        // If the removed vehicle was the favorite, set a new favorite if available
        if (formData.favoriteVehicleId === vehicleId) {
            formData.favoriteVehicleId = formData.selectedVehicles.length > 0 ? formData.selectedVehicles[0] : null;
            updateFavoriteIndicators();
        }
    }
    
    // Update the next button state
    document.getElementById('to-step-2').disabled = formData.selectedVehicles.length === 0;
}

// Set the favorite vehicle
function setFavoriteVehicle(vehicleId) {
    if (formData.selectedVehicles.includes(vehicleId)) {
        formData.favoriteVehicleId = vehicleId;
        updateFavoriteIndicators();
    }
}

// Update the favorite indicators on vehicle cards
function updateFavoriteIndicators() {
    document.querySelectorAll('.vehicle-card').forEach(card => {
        const vehicleId = parseInt(card.getAttribute('data-vehicle-id'));
        const favoriteButton = card.querySelector('.favorite-vehicle');
        
        if (vehicleId === formData.favoriteVehicleId) {
            favoriteButton.classList.add('btn-warning');
            favoriteButton.classList.remove('btn-outline-secondary');
            favoriteButton.textContent = '⭐ Favorited';
        } else if (formData.selectedVehicles.includes(vehicleId)) {
            favoriteButton.classList.remove('btn-warning');
            favoriteButton.classList.add('btn-outline-secondary');
            favoriteButton.textContent = '⭐ Favorite';
        }
    });
}

// Update payment amount from slider
function updatePaymentAmount(e) {
    const paymentAmount = document.getElementById('payment-amount');
    paymentAmount.value = e.target.value;
    formData.monthlyPayment = parseInt(e.target.value);
    updatePaymentDisplay();
}

// Update payment slider from input
function updatePaymentSlider(e) {
    const paymentSlider = document.getElementById('monthly-payment');
    let value = parseInt(e.target.value) || 200;
    
    // Ensure the value is within the allowed range
    value = Math.max(200, Math.min(1000, value));
    
    paymentSlider.value = value;
    formData.monthlyPayment = value;
    updatePaymentDisplay();
}

// Update down payment
function updateDownPayment(e) {
    formData.downPayment = parseInt(e.target.value) || 0;
}

// Update payment display
function updatePaymentDisplay() {
    document.getElementById('base-payment-amount').textContent = `$${formData.monthlyPayment}/month`;
    updateTotalPayment();
}

// Update protection options
function updateProtectionOptions() {
    const extendedWarranty = document.getElementById('extended-warranty').checked;
    const gapCoverage = document.getElementById('gap-coverage').checked;
    
    formData.protectionOptions = {
        extendedWarranty,
        gapCoverage
    };
    
    updateTotalPayment();
}

// Update total payment with protection options
function updateTotalPayment() {
    let total = formData.monthlyPayment;
    
    if (formData.protectionOptions.extendedWarranty) {
        total += 49; // $49 for extended warranty
    }
    
    if (formData.protectionOptions.gapCoverage) {
        total += 25; // $25 for GAP coverage
    }
    
    document.getElementById('total-payment-amount').textContent = `$${total}/month`;
}

// Initialize US states dropdown
function initializeStates() {
    const states = [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
        'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
        'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
        'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
        'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
        'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
        'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ];
    
    const stateSelect = document.getElementById('state');
    
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });
}

// Update employment details based on employment status
function updateEmploymentDetails() {
    const employmentDetails = document.getElementById('employment-details');
    const employmentStatus = document.querySelector('input[name="employment-status"]:checked').value;
    
    // In a real app, you would update the form fields based on the employment status
    // For now, we'll just show/hide the employment details section
    if (employmentStatus === 'retired' || employmentStatus === 'other-income') {
        employmentDetails.style.display = 'none';
    } else {
        employmentDetails.style.display = 'block';
    }
}

// Navigate to a specific step
function navigateTo(step) {
    // Validate current step before proceeding
    if (!validateCurrentStep(currentStep)) {
        return;
    }
    
    // Save form data before navigating
    saveFormData(currentStep);
    
    // Hide all steps
    steps.forEach(step => step.classList.add('d-none'));
    
    // Show the target step
    document.getElementById(`step${step}`).classList.remove('d-none');
    
    // Update current step
    currentStep = step;
    
    // Update progress bar
    updateProgressBar();
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Validate the current step
function validateCurrentStep(step) {
    // In a real app, you would add validation for each step
    // For now, we'll just return true
    return true;
}

// Save form data
function saveFormData(step) {
    switch (step) {
        case 4:
            // Personal info
            formData.personalInfo = {
                firstName: document.getElementById('first-name').value,
                lastName: document.getElementById('last-name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value
            };
            break;
            
        case 5:
            // Address info
            formData.addressInfo = {
                streetAddress: document.getElementById('street-address').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zip: document.getElementById('zip').value,
                livedLessThan2Years: document.getElementById('lived-less-than-2-years').checked
            };
            break;
            
        case 6:
            // Employment info
            formData.employmentInfo = {
                employmentStatus: document.querySelector('input[name="employment-status"]:checked').value,
                employer: document.getElementById('employer').value,
                jobTitle: document.getElementById('job-title').value,
                monthlyIncome: document.getElementById('monthly-income').value,
                employmentYears: document.getElementById('employment-years').value
            };
            break;
    }
}

// Update the progress bar
function updateProgressBar() {
    const progressPercentage = (currentStep / totalSteps) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    progressBar.setAttribute('aria-valuenow', progressPercentage);
}

// Submit the application
function submitApplication() {
    // Save the final form data
    saveFormData(currentStep);
    
    // In a real app, you would send the form data to a server
    console.log('Form submitted:', formData);
    
    // Show thank you message
    document.getElementById('step7').classList.add('d-none');
    document.getElementById('thank-you').classList.remove('d-none');
    
    // Update progress bar to 100%
    progressBar.style.width = '100%';
    progressBar.setAttribute('aria-valuenow', 100);
}

// Start the application (from landing page)
function startApplication() {
    document.getElementById('landing-page').classList.add('d-none');
    document.querySelector('.cars-container').classList.add('d-none');
    document.getElementById('application-container').classList.remove('d-none');
    currentStep = 1;
    navigateTo(1);
}

