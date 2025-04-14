document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
            
            // If going to order section, reset to step 1
            if (sectionId === 'order') {
                resetOrderSteps();
            }
        });
    });
    
    // Menu tabs
    const menuTabs = document.querySelectorAll('.menu-tabs .tab-btn');
    const menuCategories = document.querySelectorAll('.menu-category');
    
    menuTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and categories
            menuTabs.forEach(t => t.classList.remove('active'));
            menuCategories.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding category
            const categoryId = this.getAttribute('data-category');
            document.getElementById(categoryId).classList.add('active');
        });
    });
    
    // Order steps
    const orderSteps = document.querySelectorAll('.order-steps .step');
    const stepPanels = document.querySelectorAll('.step-panel');
    const nextStepBtns = document.querySelectorAll('.next-step');
    const backStepBtns = document.querySelectorAll('.back-step');
    
    function resetOrderSteps() {
        // Reset to step 1
        orderSteps.forEach(step => step.classList.remove('active'));
        stepPanels.forEach(panel => panel.classList.remove('active'));
        
        orderSteps[0].classList.add('active');
        stepPanels[0].classList.add('active');
        
        // Clear any existing order items
        clearOrderItems();
    }
    
    nextStepBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const nextStep = this.getAttribute('data-next');
            goToStep(nextStep);
        });
    });
    
    backStepBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const prevStep = this.getAttribute('data-prev');
            goToStep(prevStep);
        });
    });
    
    function goToStep(stepNumber) {
        // Validate step 1 (user details) before proceeding
        if (stepNumber === '2') {
            if (!validateUserDetails()) {
                return;
            }
            updateOrderConfirmation();
        }
        
        // Update steps
        orderSteps.forEach(step => {
            if (step.getAttribute('data-step') === stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Update panels
        stepPanels.forEach(panel => {
            if (panel.getAttribute('data-step') === stepNumber) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });
    }
    
    function validateUserDetails() {
        const name = document.getElementById('name').value;
        const room = document.getElementById('room').value;
        const phone = document.getElementById('phone').value;
        const time = document.getElementById('time').value;
        
        if (!name || !room || !phone || !time) {
            alert('Please fill in all fields before continuing.');
            return false;
        }
        
        return true;
    }
    
    // Order items
    const orderMenuTabs = document.querySelectorAll('.order-menu-tabs .tab-btn');
    const orderCategories = document.querySelectorAll('.order-category');
    const addToOrderBtns = document.querySelectorAll('.add-to-order');
    const orderItemsList = document.querySelector('.order-items-list');
    const totalAmount = document.getElementById('total-amount');
    let orderItems = [];
    
    orderMenuTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and categories
            orderMenuTabs.forEach(t => t.classList.remove('active'));
            orderCategories.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding category
            const categoryId = 'order-' + this.getAttribute('data-category');
            document.getElementById(categoryId).classList.add('active');
        });
    });
    
    addToOrderBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const itemElement = this.closest('.order-item');
            const itemId = itemElement.getAttribute('data-id');
            const itemName = itemElement.getAttribute('data-name');
            const itemPrice = parseFloat(itemElement.getAttribute('data-price'));
            
            // Check if item already exists in order
            const existingItem = orderItems.find(item => item.id === itemId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                orderItems.push({
                    id: itemId,
                    name: itemName,
                    price: itemPrice,
                    quantity: 1
                });
            }
            
            updateOrderSummary();
        });
    });
    
    function updateOrderSummary() {
        // Clear current list
        orderItemsList.innerHTML = '';
        
        if (orderItems.length === 0) {
            orderItemsList.innerHTML = '<p class="empty-message">No items selected yet</p>';
            totalAmount.textContent = '0.00';
            return;
        }
        
        // Calculate total
        let total = 0;
        
        // Add each item to the list
        orderItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item-list';
            itemElement.innerHTML = `
                <span>${item.name} x${item.quantity}</span>
                <span>$${(itemTotal).toFixed(2)}</span>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            orderItemsList.appendChild(itemElement);
        });
        
        // Update total
        totalAmount.textContent = total.toFixed(2);
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.getAttribute('data-id');
                removeItemFromOrder(itemId);
            });
        });
    }
    
    function removeItemFromOrder(itemId) {
        orderItems = orderItems.filter(item => item.id !== itemId);
        updateOrderSummary();
    }
    
    function clearOrderItems() {
        orderItems = [];
        updateOrderSummary();
    }
    
    // Order confirmation
    function updateOrderConfirmation() {
        const confirmUserDetails = document.getElementById('confirm-user-details');
        const confirmOrderItems = document.getElementById('confirm-order-items');
        const confirmTotal = document.getElementById('confirm-total');
        
        // User details
        const name = document.getElementById('name').value;
        const room = document.getElementById('room').value;
        const phone = document.getElementById('phone').value;
        const time = document.getElementById('time').value;
        
        confirmUserDetails.innerHTML = `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Room:</strong> ${room}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Delivery Time:</strong> ${time}</p>
        `;
        
        // Order items
        confirmOrderItems.innerHTML = '';
        
        if (orderItems.length === 0) {
            confirmOrderItems.innerHTML = '<p>No items selected</p>';
            confirmTotal.textContent = '0.00';
            return;
        }
        
        let total = 0;
        
        orderItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item-confirm';
            itemElement.innerHTML = `
                <p>${item.name} x${item.quantity} - $${itemTotal.toFixed(2)}</p>
            `;
            
            confirmOrderItems.appendChild(itemElement);
        });
        
        confirmTotal.textContent = total.toFixed(2);
    }
    
    // Submit order
    const submitOrderBtn = document.querySelector('.submit-order');
    const orderModal = document.getElementById('order-success');
    const closeModalBtns = document.querySelectorAll('.close-modal, .close-modal-btn');
    
    submitOrderBtn.addEventListener('click', function() {
        if (orderItems.length === 0) {
            alert('Please add at least one item to your order.');
            return;
        }
        
        // Show success modal
        orderModal.style.display = 'flex';
    });
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            orderModal.style.display = 'none';
            
            // Reset the order process
            resetOrderSteps();
            document.getElementById('user-details').reset();
            
            // Go back to home
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            navLinks[0].classList.add('active');
            document.getElementById('home').classList.add('active');
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === orderModal) {
            orderModal.style.display = 'none';
        }
    });
    
    // Initialize first section
    document.querySelector('nav a[data-section="home"]').click();
});