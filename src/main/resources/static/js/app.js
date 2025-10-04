// API Base URL
const API_BASE = '/api/customer';

// Add log entry to activity log
function addLog(message, type = 'info') {
    const log = document.getElementById('activityLog');
    const timestamp = new Date().toLocaleTimeString();
    const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
    const colorClass = type === 'success' ? 'text-success' : type === 'error' ? 'text-danger' : 'text-info';
    
    log.innerHTML += `<div class="${colorClass}">[${timestamp}] ${icon} ${message}</div>`;
    log.scrollTop = log.scrollHeight;
}

// Search Customer Function
async function searchCustomer() {
    const customerId = document.getElementById('searchId').value.trim();
    
    if (!customerId) {
        alert('Please enter a customer ID');
        return;
    }
    
    // Show query flow
    document.getElementById('queryFlow').classList.remove('d-none');
    document.getElementById('step1').innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Step 1: Checking New DB...';
    document.getElementById('step2').classList.add('d-none');
    document.getElementById('step3').classList.add('d-none');
    document.getElementById('searchResult').classList.add('d-none');
    
    addLog(`Searching for customer: ${customerId}`, 'info');
    
    try {
        const response = await fetch(`${API_BASE}/${customerId}`);
        
        if (response.ok) {
            const data = await response.json();
            
            // Update query flow based on source
            if (data.source === 'NEW_DB') {
                document.getElementById('step1').innerHTML = '<i class="bi bi-check-circle-fill text-success"></i> Step 1: FOUND in New DB ✓';
                addLog(`Customer ${customerId} found in NEW database`, 'success');
            } else if (data.source === 'LEGACY_DB') {
                document.getElementById('step1').innerHTML = '<i class="bi bi-x-circle-fill text-warning"></i> Step 1: Not in New DB';
                document.getElementById('step2').classList.remove('d-none');
                document.getElementById('step2').innerHTML = '<i class="bi bi-check-circle-fill text-success"></i> Step 2: FOUND in Legacy DB ✓';
                document.getElementById('step3').classList.remove('d-none');
                document.getElementById('step3').innerHTML = '<i class="bi bi-check-circle-fill text-success"></i> Step 3: Transformed to new format ✓';
                addLog(`Customer ${customerId} found in LEGACY database, transformed`, 'success');
            }
            
            // Display result
            displayCustomer(data);
        } else {
            document.getElementById('step1').innerHTML = '<i class="bi bi-x-circle-fill text-danger"></i> Step 1: Not found in New DB';
            document.getElementById('step2').classList.remove('d-none');
            document.getElementById('step2').innerHTML = '<i class="bi bi-x-circle-fill text-danger"></i> Step 2: Not found in Legacy DB';
            
            const error = await response.json();
            showError(error.message || 'Customer not found');
            addLog(`Customer ${customerId} not found in any database`, 'error');
        }
    } catch (error) {
        showError('Failed to search customer');
        addLog(`Error searching customer: ${error.message}`, 'error');
    }
}

// Display customer data
function displayCustomer(customer) {
    const sourceColor = customer.source === 'NEW_DB' ? 'success' : 'warning';
    const sourceIcon = customer.source === 'NEW_DB' ? 'database-fill-up' : 'database-fill-down';
    const sourceText = customer.source === 'NEW_DB' ? 'Modern Database' : 'Legacy Database (Transformed)';
    
    const html = `
        <div class="card border-${sourceColor}">
            <div class="card-header bg-${sourceColor} text-white">
                <i class="bi bi-person-circle"></i> Customer Found
            </div>
            <div class="card-body">
                <p><strong>ID:</strong> ${customer.id}</p>
                <p><strong>Name:</strong> ${customer.name}</p>
                <p><strong>Email:</strong> ${customer.email || 'N/A'}</p>
                <p><strong>Phone:</strong> ${customer.phone || 'N/A'}</p>
                <p><strong>Address:</strong> ${customer.street || 'N/A'}, ${customer.city || 'N/A'}</p>
                <p class="mb-0">
                    <span class="badge bg-${sourceColor}">
                        <i class="bi bi-${sourceIcon}"></i> ${sourceText}
                    </span>
                </p>
            </div>
        </div>
    `;
    
    document.getElementById('searchResult').innerHTML = html;
    document.getElementById('searchResult').classList.remove('d-none');
}

// Create Customer Function
async function createCustomer(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const customer = Object.fromEntries(formData.entries());
    
    addLog(`Creating new customer: ${customer.name}`, 'info');
    
    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer)
        });
        
        if (response.ok) {
            const data = await response.json();
            
            const html = `
                <div class="alert alert-success">
                    <h6 class="fw-bold"><i class="bi bi-check-circle"></i> Customer Created Successfully!</h6>
                    <p class="mb-2"><strong>ID:</strong> ${data.id}</p>
                    <p class="mb-0">
                        <i class="bi bi-arrow-right"></i> Saved to NEW database (normalized)<br>
                        <i class="bi bi-arrow-right"></i> Saved to LEGACY database (flattened)
                    </p>
                </div>
            `;
            
            document.getElementById('createResult').innerHTML = html;
            document.getElementById('createResult').classList.remove('d-none');
            
            addLog(`✓ Customer ${data.id} created in BOTH databases (Dual-Write)`, 'success');
            
            // Reset form
            event.target.reset();
            
            // Refresh page stats after 2 seconds
            setTimeout(() => location.reload(), 2000);
        } else {
            const error = await response.json();
            showCreateError(error.message || 'Failed to create customer');
            addLog(`✗ Failed to create customer: ${error.message}`, 'error');
        }
    } catch (error) {
        showCreateError('Network error occurred');
        addLog(`✗ Network error: ${error.message}`, 'error');
    }
}

// Show error in search result
function showError(message) {
    const html = `
        <div class="alert alert-danger">
            <i class="bi bi-exclamation-triangle"></i> ${message}
        </div>
    `;
    document.getElementById('searchResult').innerHTML = html;
    document.getElementById('searchResult').classList.remove('d-none');
}

// Show error in create result
function showCreateError(message) {
    const html = `
        <div class="alert alert-danger">
            <i class="bi bi-exclamation-triangle"></i> ${message}
        </div>
    `;
    document.getElementById('createResult').innerHTML = html;
    document.getElementById('createResult').classList.remove('d-none');
}

// Auto-clear results after 5 seconds
setInterval(() => {
    const result = document.getElementById('createResult');
    if (result && !result.classList.contains('d-none')) {
        setTimeout(() => result.classList.add('d-none'), 5000);
    }
}, 1000);	// API Base URL

	// Add log entry to activity log
	function addLog(message, type = 'info') {
	    const log = document.getElementById('activityLog');
	    const timestamp = new Date().toLocaleTimeString();
	    const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
	    const colorClass = type === 'success' ? 'text-success' : type === 'error' ? 'text-danger' : 'text-info';
	    
	    log.innerHTML += `<div class="${colorClass}">[${timestamp}] ${icon} ${message}</div>`;
	    log.scrollTop = log.scrollHeight;
	}

	// Search Customer Function
	async function searchCustomer() {
	    const customerId = document.getElementById('searchId').value.trim();
	    
	    if (!customerId) {
	        alert('Please enter a customer ID');
	        return;
	    }
	    
	    // Show query flow
	    document.getElementById('queryFlow').classList.remove('d-none');
	    document.getElementById('step1').innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Step 1: Checking New DB...';
	    document.getElementById('step2').classList.add('d-none');
	    document.getElementById('step3').classList.add('d-none');
	    document.getElementById('searchResult').classList.add('d-none');
	    
	    addLog(`Searching for customer: ${customerId}`, 'info');
	    
	    try {
	        const response = await fetch(`${API_BASE}/${customerId}`);
	        
	        if (response.ok) {
	            const data = await response.json();
	            
	            // Update query flow based on source
	            if (data.source === 'NEW_DB') {
	                document.getElementById('step1').innerHTML = '<i class="bi bi-check-circle-fill text-success"></i> Step 1: FOUND in New DB ✓';
	                addLog(`Customer ${customerId} found in NEW database`, 'success');
	            } else if (data.source === 'LEGACY_DB') {
	                document.getElementById('step1').innerHTML = '<i class="bi bi-x-circle-fill text-warning"></i> Step 1: Not in New DB';
	                document.getElementById('step2').classList.remove('d-none');
	                document.getElementById('step2').innerHTML = '<i class="bi bi-check-circle-fill text-success"></i> Step 2: FOUND in Legacy DB ✓';
	                document.getElementById('step3').classList.remove('d-none');
	                document.getElementById('step3').innerHTML = '<i class="bi bi-check-circle-fill text-success"></i> Step 3: Transformed to new format ✓';
	                addLog(`Customer ${customerId} found in LEGACY database, transformed`, 'success');
	            }
	            
	            // Display result
	            displayCustomer(data);
	        } else {
	            document.getElementById('step1').innerHTML = '<i class="bi bi-x-circle-fill text-danger"></i> Step 1: Not found in New DB';
	            document.getElementById('step2').classList.remove('d-none');
	            document.getElementById('step2').innerHTML = '<i class="bi bi-x-circle-fill text-danger"></i> Step 2: Not found in Legacy DB';
	            
	            const error = await response.json();
	            showError(error.message || 'Customer not found');
	            addLog(`Customer ${customerId} not found in any database`, 'error');
	        }
	    } catch (error) {
	        showError('Failed to search customer');
	        addLog(`Error searching customer: ${error.message}`, 'error');
	    }
	}

	// Display customer data
	function displayCustomer(customer) {
	    const sourceColor = customer.source === 'NEW_DB' ? 'success' : 'warning';
	    const sourceIcon = customer.source === 'NEW_DB' ? 'database-fill-up' : 'database-fill-down';
	    const sourceText = customer.source === 'NEW_DB' ? 'Modern Database' : 'Legacy Database (Transformed)';
	    
	    const html = `
	        <div class="card border-${sourceColor}">
	            <div class="card-header bg-${sourceColor} text-white">
	                <i class="bi bi-person-circle"></i> Customer Found
	            </div>
	            <div class="card-body">
	                <p><strong>ID:</strong> ${customer.id}</p>
	                <p><strong>Name:</strong> ${customer.name}</p>
	                <p><strong>Email:</strong> ${customer.email || 'N/A'}</p>
	                <p><strong>Phone:</strong> ${customer.phone || 'N/A'}</p>
	                <p><strong>Address:</strong> ${customer.street || 'N/A'}, ${customer.city || 'N/A'}</p>
	                <p class="mb-0">
	                    <span class="badge bg-${sourceColor}">
	                        <i class="bi bi-${sourceIcon}"></i> ${sourceText}
	                    </span>
	                </p>
	            </div>
	        </div>
	    `;
	    
	    document.getElementById('searchResult').innerHTML = html;
	    document.getElementById('searchResult').classList.remove('d-none');
	}

	// Create Customer Function
	async function createCustomer(event) {
	    event.preventDefault();
	    
	    const formData = new FormData(event.target);
	    const customer = Object.fromEntries(formData.entries());
	    
	    addLog(`Creating new customer: ${customer.name}`, 'info');
	    
	    try {
	        const response = await fetch(API_BASE, {
	            method: 'POST',
	            headers: {
	                'Content-Type': 'application/json'
	            },
	            body: JSON.stringify(customer)
	        });
	        
	        if (response.ok) {
	            const data = await response.json();
	            
	            const html = `
	                <div class="alert alert-success">
	                    <h6 class="fw-bold"><i class="bi bi-check-circle"></i> Customer Created Successfully!</h6>
	                    <p class="mb-2"><strong>ID:</strong> ${data.id}</p>
	                    <p class="mb-0">
	                        <i class="bi bi-arrow-right"></i> Saved to NEW database (normalized)<br>
	                        <i class="bi bi-arrow-right"></i> Saved to LEGACY database (flattened)
	                    </p>
	                </div>
	            `;
	            
	            document.getElementById('createResult').innerHTML = html;
	            document.getElementById('createResult').classList.remove('d-none');
	            
	            addLog(`✓ Customer ${data.id} created in BOTH databases (Dual-Write)`, 'success');
	            
	            // Reset form
	            event.target.reset();
	            
	            // Refresh page stats after 2 seconds
	            setTimeout(() => location.reload(), 2000);
	        } else {
	            const error = await response.json();
	            showCreateError(error.message || 'Failed to create customer');
	            addLog(`✗ Failed to create customer: ${error.message}`, 'error');
	        }
	    } catch (error) {
	        showCreateError('Network error occurred');
	        addLog(`✗ Network error: ${error.message}`, 'error');
	    }
	}

	// Show error in search result
	function showError(message) {
	    const html = `
	        <div class="alert alert-danger">
	            <i class="bi bi-exclamation-triangle"></i> ${message}
	        </div>
	    `;
	    document.getElementById('searchResult').innerHTML = html;
	    document.getElementById('searchResult').classList.remove('d-none');
	}

	// Show error in create result
	function showCreateError(message) {
	    const html = `
	        <div class="alert alert-danger">
	            <i class="bi bi-exclamation-triangle"></i> ${message}
	        </div>
	    `;
	    document.getElementById('createResult').innerHTML = html;
	    document.getElementById('createResult').classList.remove('d-none');
	}

	// Auto-clear results after 5 seconds
	setInterval(() => {
	    const result = document.getElementById('createResult');
	    if (result && !result.classList.contains('d-none')) {
	        setTimeout(() => result.classList.add('d-none'), 5000);
	    }
	}, 1000);
	
	
	
	
	// Random data generators
	const firstNames = [
	    'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
	    'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
	    'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
	    'Matthew', 'Margaret', 'Anthony', 'Betty', 'Mark', 'Sandra', 'Donald', 'Ashley',
	    'Steven', 'Emily', 'Paul', 'Kimberly', 'Andrew', 'Donna', 'Joshua', 'Michelle',
	    'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Mia', 'Charlotte', 'Amelia'
	];

	const lastNames = [
	    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
	    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
	    'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris',
	    'Clark', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright',
	    'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson',
	    'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Turner'
	];

	const streets = [
	    'Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine Rd', 'Elm St', 'Washington Blvd',
	    'Park Ave', 'Broadway', 'Market St', 'Church St', 'Spring St', 'Lake Dr', 'Hill St',
	    'College Ave', 'Forest Rd', 'Highland Ave', 'River Rd', 'Sunset Blvd', 'Franklin St',
	    'Pearl St', 'Walnut St', 'Chestnut St', 'Cherry Ln', 'Willow Way', 'Summit Ave'
	];

	const cities = [
	    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
	    'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
	    'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle',
	    'Denver', 'Boston', 'Nashville', 'Portland', 'Las Vegas', 'Detroit', 'Memphis',
	    'Miami', 'Atlanta', 'Minneapolis', 'Sacramento', 'Kansas City'
	];

	const states = [
	    'CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI',
	    'NJ', 'VA', 'WA', 'AZ', 'MA', 'TN', 'IN', 'MO', 'MD', 'WI',
	    'CO', 'MN', 'SC', 'AL', 'LA', 'KY', 'OR', 'OK', 'CT', 'NV'
	];

	const accountTypes = ['SAVINGS', 'CHECKING', 'PREMIUM'];

	// Auto-fill form with random data
	function autoFillForm() {
	    // Generate random data
	    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
	    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
	    const fullName = `${firstName} ${lastName}`;
	    
	    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@demo-bank.com`;
	    const phone = `555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
	    
	    const streetNumber = Math.floor(Math.random() * 9999) + 1;
	    const street = `${streetNumber} ${streets[Math.floor(Math.random() * streets.length)]}`;
	    
	    const city = cities[Math.floor(Math.random() * cities.length)];
	    const state = states[Math.floor(Math.random() * states.length)];
	    const zipCode = String(Math.floor(Math.random() * 90000) + 10000);
	    
	    const accountType = accountTypes[Math.floor(Math.random() * accountTypes.length)];
	    
	    // Fill the form
	    document.getElementById('input-name').value = fullName;
	    document.getElementById('input-email').value = email;
	    document.getElementById('input-phone').value = phone;
	    document.getElementById('input-street').value = street;
	    document.getElementById('input-city').value = city;
	    document.getElementById('input-state').value = state;
	    document.getElementById('input-zipCode').value = zipCode;
	    document.getElementById('input-accountType').value = accountType;
	    
	    // Add animation effect
	    const inputs = document.querySelectorAll('#createCustomerForm input, #createCustomerForm select');
	    inputs.forEach(input => {
	        input.classList.add('border-success');
	        setTimeout(() => input.classList.remove('border-success'), 1000);
	    });
	    
	    // Log the action
	    addLog(`✨ Form auto-filled with: ${fullName}`, 'info');
	}

	// Keep all your existing functions below...
	// (searchCustomer, createCustomer, displayCustomer, etc.)