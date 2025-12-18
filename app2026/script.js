document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const pages = document.querySelectorAll('.page');
    const launchAppBtn = document.getElementById('launch-app-btn');
    const registrationForm = document.getElementById('registration-form');
    const paymentMethods = document.querySelectorAll('.payment-method');
    const processPaymentBtn = document.getElementById('process-payment-btn');
    const backToRegisterBtn = document.getElementById('back-to-register-btn');
    const continueToLicenseBtn = document.getElementById('continue-to-license-btn');
    const licenseForm = document.getElementById('license-form');
    const platformGrid = document.getElementById('platformGrid');
    const activatePlatformBtn = document.getElementById('activate-platform');
    const strategyGrid = document.getElementById('strategyGrid');
    const applyStrategyBtn = document.getElementById('apply-strategy-btn');
    const changeStrategyBtn = document.getElementById('changeStrategyBtn');
    const processingOverlay = document.getElementById('processing-overlay');
    const processingStatus = document.getElementById('processing-status');
    
    // Aviator elements
    const analyzeBtn = document.getElementById('analyzeBtn');
    const currentMultiplier = document.getElementById('currentMultiplier');
    const activePlayers = document.getElementById('activePlayers');
    const lastCrash = document.getElementById('lastCrash');
    const predRange = document.getElementById('predRange');
    const historyContainer = document.getElementById('historyContainer');
    const resetBtn = document.getElementById('resetBtn');
    
    // Configuration
    const PAYMENT_AMOUNT = 65000; // ₦65,000
    
    // Application state
    let userData = {
        name: '',
        email: '',
        phone: ''
    };
    
    let selectedPaymentMethod = null;
    let selectedPlatform = null;
    let selectedStrategy = null;
    let generatedLicenseKey = '';
    
    // Aviator state
    let isAnalyzing = false;
    let liveDataInterval = null;
    let history = [];
    let currentRound = 0;
    
    // ==================== PAYMENT FUNCTIONS ====================
    
    /**
     * Generate a unique license key
     */
    function generateLicenseKey() {
        const prefix = 'AVIATOR';
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        const checksum = Math.random().toString(36).substring(2, 4).toUpperCase();
        return `${prefix}-${timestamp}-${random}-${checksum}`;
    }
    
    /**
     * Simulate payment processing
     */
    function simulatePaymentProcessing() {
        processingOverlay.style.display = 'flex';
        
        const steps = [
            "Initializing payment system...",
            "Connecting to payment gateway...",
            "Processing ₦65,000 payment...",
            "Verifying transaction...",
            "Completing payment...",
            "Payment successful! Generating license key..."
        ];
        
        let currentStep = 0;
        
        const processStep = () => {
            if (currentStep < steps.length) {
                processingStatus.textContent = steps[currentStep];
                currentStep++;
                setTimeout(processStep, 1500);
            } else {
                // Payment completed successfully
                generatedLicenseKey = generateLicenseKey();
                
                // Simulate sending email
                simulateEmailSend(userData, generatedLicenseKey);
                
                // Update confirmation page
                updateConfirmationPage();
                
                // Show success notification
                showNotification('Payment successful! License key generated.', 'success');
                
                // Hide processing overlay and proceed
                setTimeout(() => {
                    processingOverlay.style.display = 'none';
                    showPage('email');
                }, 1000);
            }
        };
        
        processStep();
    }
    
    /**
     * Simulate sending confirmation email
     */
    function simulateEmailSend(userData, licenseKey) {
        console.log('=== EMAIL SENT ===');
        console.log('To:', userData.email);
        console.log('Subject: Your Aviator Cracker +V7 License Key');
        console.log('Body:');
        console.log(`Dear ${userData.name},`);
        console.log('');
        console.log('Thank you for your purchase of Aviator Cracker +V7!');
        console.log('');
        console.log('Your license details:');
        console.log(`Name: ${userData.name}`);
        console.log(`Email: ${userData.email}`);
        console.log(`Phone: ${userData.phone}`);
        console.log('');
        console.log(`License Key: ${licenseKey}`);
        console.log('');
        console.log('To activate your software:');
        console.log('1. Open Aviator Cracker +V7');
        console.log('2. Enter your license key when prompted');
        console.log('3. Select your preferred platform and strategy');
        console.log('4. Start getting predictions!');
        console.log('');
        console.log('For support, contact: support@aviatorcracker.com');
        console.log('');
        console.log('Best regards,');
        console.log('Aviator Cracker Team');
        console.log('====================');
    }
    
    /**
     * Update confirmation page with user data
     */
    function updateConfirmationPage() {
        document.getElementById('user-name-display').textContent = userData.name;
        document.getElementById('user-email-display').textContent = userData.email;
        document.getElementById('user-phone-display').textContent = userData.phone;
        document.getElementById('generated-license').textContent = generatedLicenseKey;
        document.getElementById('prefilled-license').textContent = generatedLicenseKey;
    }
    
    // ==================== UI FUNCTIONS ====================
    
    /**
     * Show a specific page
     */
    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        const targetPage = document.getElementById(pageId + '-page');
        if (targetPage) {
            targetPage.classList.add('active');
            
            // Additional setup for specific pages
            switch(pageId) {
                case 'platform':
                    populatePlatforms();
                    break;
                case 'strategy-select':
                    populateStrategies();
                    break;
                case 'aviator':
                    setTimeout(startLiveData, 500);
                    updatePlatformInfo();
                    break;
            }
        }
    }
    
    /**
     * Show notification message
     */
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 10px;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    min-width: 300px;
                    max-width: 400px;
                    z-index: 9999;
                    animation: slideIn 0.3s ease;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                }
                .notification-success { background: linear-gradient(45deg, #00b09b, #96c93d); }
                .notification-error { background: linear-gradient(45deg, #ff416c, #ff4b2b); }
                .notification-warning { background: linear-gradient(45deg, #ff9500, #ff5e3a); }
                .notification-info { background: linear-gradient(45deg, #2193b0, #6dd5ed); }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex: 1;
                }
                .notification-close {
                    background: transparent;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 5px;
                    margin-left: 10px;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
    
    /**
     * Update platform info in aviator interface
     */
    function updatePlatformInfo() {
        const platformInfo = document.getElementById('selectedPlatformInfo');
        if (selectedPlatform && selectedStrategy) {
            platformInfo.textContent = `${selectedPlatform.name} | ${selectedStrategy.name}`;
        } else if (selectedPlatform) {
            platformInfo.textContent = selectedPlatform.name;
        }
    }
    
    // ==================== PLATFORM & STRATEGY ====================
    
    /**
     * Populate platforms grid
     */
    function populatePlatforms() {
        platformGrid.innerHTML = '';
        
        const platforms = [
            { name: "Betway", icon: "fa-bet" },
            { name: "aviator.co.za", icon: "fa-plane" },
            { name: "Hollywoodbets", icon: "fa-film" },
            { name: "Lottostar", icon: "fa-star" },
            { name: "10Bet", icon: "fa-dice" },
            { name: "YesPlay", icon: "fa-play-circle" },
            { name: "Lulabet", icon: "fa-smile" },
            { name: "Mostbet", icon: "fa-crown" },
            { name: "1xBet", icon: "fa-times" },
            { name: "1Win", icon: "fa-trophy" },
            { name: "Betfred", icon: "fa-flag" }
        ];
        
        platforms.forEach(platform => {
            const platformItem = document.createElement('div');
            platformItem.className = 'platform-item';
            platformItem.innerHTML = `
                <div class="platform-name">
                    <i class="fas ${platform.icon || 'fa-gamepad'}"></i>
                    ${platform.name}
                </div>
            `;
            
            platformItem.addEventListener('click', function() {
                document.querySelectorAll('.platform-item').forEach(item => {
                    item.classList.remove('selected');
                });
                this.classList.add('selected');
                activatePlatformBtn.disabled = false;
                selectedPlatform = platform;
            });
            
            platformGrid.appendChild(platformItem);
        });
    }
    
    /**
     * Populate strategies grid
     */
    function populateStrategies() {
        strategyGrid.innerHTML = '';
        
        const strategies = [
            {
                id: "strategy-1",
                name: "MOMENTUM",
                description: "Follows market momentum patterns",
                risk: "Medium",
                icon: "fa-chart-line"
            },
            {
                id: "strategy-2",
                name: "AGGRESSIVE",
                description: "High risk, high reward approach",
                risk: "High",
                icon: "fa-bolt"
            },
            {
                id: "strategy-3",
                name: "CONSERVATIVE",
                description: "Safe, steady growth strategy",
                risk: "Low",
                icon: "fa-shield-alt"
            }
        ];
        
        strategies.forEach(strategy => {
            const strategyCard = document.createElement('div');
            strategyCard.className = 'strategy-card';
            strategyCard.innerHTML = `
                <div class="strategy-icon">
                    <i class="fas ${strategy.icon}"></i>
                </div>
                <div class="strategy-title">${strategy.name}</div>
                <div class="strategy-description">${strategy.description}</div>
                <div class="strategy-risk">Risk: ${strategy.risk}</div>
            `;
            
            // Add styles for new elements
            if (!document.querySelector('#strategy-styles')) {
                const style = document.createElement('style');
                style.id = 'strategy-styles';
                style.textContent = `
                    .strategy-icon {
                        font-size: 32px;
                        color: #ff6b6b;
                        margin-bottom: 15px;
                    }
                    .strategy-description {
                        font-size: 14px;
                        color: rgba(255,255,255,0.7);
                        margin-bottom: 10px;
                        line-height: 1.4;
                    }
                    .strategy-risk {
                        font-size: 12px;
                        color: #ff9999;
                        font-weight: 600;
                        padding: 4px 12px;
                        background: rgba(255,0,0,0.1);
                        border-radius: 20px;
                        display: inline-block;
                    }
                `;
                document.head.appendChild(style);
            }
            
            strategyCard.addEventListener('click', function() {
                document.querySelectorAll('.strategy-card').forEach(card => {
                    card.classList.remove('selected');
                });
                this.classList.add('selected');
                applyStrategyBtn.disabled = false;
                selectedStrategy = strategy;
            });
            
            strategyGrid.appendChild(strategyCard);
        });
    }
    
    // ==================== AVIATOR CRACKER FUNCTIONS ====================
    
    /**
     * Start live data updates
     */
    function startLiveData() {
        if (liveDataInterval) clearInterval(liveDataInterval);
        
        // Initial data
        updateLiveData();
        
        // Update every 3 seconds
        liveDataInterval = setInterval(() => {
            updateLiveData();
        }, 3000);
    }
    
    /**
     * Update live data displays
     */
    function updateLiveData() {
        // Generate realistic random data
        const multiplier = (Math.random() > 0.7 ? Math.random() * 4 + 1 : Math.random() * 2 + 1).toFixed(2);
        const players = Math.floor(Math.random() * 500 + 50);
        const crash = (Math.random() * 8 + 1).toFixed(2);
        
        currentMultiplier.textContent = multiplier + 'x';
        activePlayers.textContent = players.toLocaleString();
        lastCrash.textContent = crash + 'x';
    }
    
    /**
     * Generate prediction based on selected strategy
     */
    function generatePrediction() {
        let prediction;
        let accuracy;
        
        if (selectedStrategy) {
            switch(selectedStrategy.id) {
                case 'strategy-1': // MOMENTUM
                    prediction = (Math.random() * 0.8 + 2.0).toFixed(2);
                    accuracy = (Math.random() * 10 + 85).toFixed(1); // 85-95%
                    break;
                case 'strategy-2': // AGGRESSIVE
                    prediction = (Math.random() * 0.6 + 2.5).toFixed(2);
                    accuracy = (Math.random() * 15 + 80).toFixed(1); // 80-95%
                    break;
                case 'strategy-3': // CONSERVATIVE
                    prediction = (Math.random() * 0.4 + 1.8).toFixed(2);
                    accuracy = (Math.random() * 5 + 90).toFixed(1); // 90-95%
                    break;
                default:
                    prediction = (Math.random() * 3 + 1.5).toFixed(2);
                    accuracy = (Math.random() * 15 + 75).toFixed(1); // 75-90%
            }
        } else {
            prediction = (Math.random() * 5 + 1.5).toFixed(2);
            accuracy = (Math.random() * 20 + 70).toFixed(1); // 70-90%
        }
        
        return { prediction, accuracy };
    }
    
    /**
     * Update history display
     */
    function updateHistory() {
        historyContainer.innerHTML = '';
        
        // Show last 8 predictions
        history.slice(0, 8).forEach((item, index) => {
            const historyElement = document.createElement('div');
            historyElement.className = 'history-item';
            
            // Color code based on multiplier
            const multiplier = parseFloat(item.multiplier);
            let color = '#ff6b6b'; // Default
            if (multiplier >= 3) color = '#ff0000'; // High
            if (multiplier <= 1.5) color = '#ff9999'; // Low
            
            historyElement.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 8px; height: 8px; background: ${color}; border-radius: 50%;"></div>
                    <div class="history-multiplier" style="color: ${color};">${item.multiplier}x</div>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="font-size: 12px; color: rgba(255,255,255,0.4);">${item.strategy}</div>
                    <div class="history-time">${item.time}</div>
                </div>
            `;
            
            historyContainer.appendChild(historyElement);
        });
    }
    
    /**
     * Reset session
     */
    function resetSession() {
        history = [];
        currentRound = 0;
        updateHistory();
        predRange.textContent = '—';
        showNotification('Session reset successfully', 'info');
    }
    
    // ==================== EVENT LISTENERS ====================
    
    // Launch app button
    launchAppBtn.addEventListener('click', function() {
        showPage('registration');
    });
    
    // Registration form
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Save user data
        userData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('cell').value.trim()
        };
        
        // Basic validation
        if (!userData.name || !userData.email || !userData.phone) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Show payment page
        showPage('payment');
    });
    
    // Payment method selection
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remove selected class from all methods
            paymentMethods.forEach(m => m.classList.remove('selected'));
            // Add selected class to clicked method
            this.classList.add('selected');
            // Enable process payment button
            processPaymentBtn.disabled = false;
            // Store selected method
            selectedPaymentMethod = this.getAttribute('data-method');
            
            // Update button text
            if (selectedPaymentMethod === 'card') {
                processPaymentBtn.textContent = 'PAY NOW (₦65,000)';
            } else if (selectedPaymentMethod === 'bank') {
                processPaymentBtn.textContent = 'VIEW BANK DETAILS';
            } else if (selectedPaymentMethod === 'ussd') {
                processPaymentBtn.textContent = 'VIEW USSD CODE';
            }
        });
    });
    
    // Back to registration
    backToRegisterBtn.addEventListener('click', function() {
        showPage('registration');
    });
    
    // Process payment
    processPaymentBtn.addEventListener('click', function() {
        if (!selectedPaymentMethod) return;
        
        if (selectedPaymentMethod === 'card') {
            // For demo purposes only - show disclaimer
            const proceed = confirm(
                'DEMO MODE: This is a simulation only.\n\n' +
                'In a real implementation, this would connect to Paystack payment gateway.\n\n' +
                'To integrate real payments:\n' +
                '1. Get Paystack API keys\n' +
                '2. Replace with your public key\n' +
                '3. Add backend verification\n\n' +
                'Continue with demo payment?'
            );
            
            if (proceed) {
                simulatePaymentProcessing();
            }
            
        } else if (selectedPaymentMethod === 'bank') {
            // Show bank transfer details
            const bankDetails = `
                Bank Transfer Details (Demo Mode):
                
                Bank: Zenith Bank
                Account Name: Aviator Cracker Ltd
                Account Number: 1234567890
                Amount: ₦65,000
                
                Reference: AVIATOR-${Date.now()}
                
                After payment, email receipt to:
                support@aviatorcracker.com
                
                Please include your:
                - Full Name
                - Email Address
                - Phone Number
                - Transaction Reference
                
                Note: This is for demonstration only.
                Real banking details would be provided in production.
            `;
            
            alert(bankDetails);
            
        } else if (selectedPaymentMethod === 'ussd') {
            // Show USSD code
            const ussdDetails = `
                USSD Payment Options (Demo Mode):
                
                Option 1:
                Dial *966*65000#
                
                Option 2:
                Dial *737*50*65000#
                
                After payment, email receipt to:
                support@aviatorcracker.com
                
                Please include your:
                - Full Name
                - Email Address
                - Phone Number
                - Transaction Reference
                
                Note: This is for demonstration only.
                Real USSD codes would be provided in production.
            `;
            
            alert(ussdDetails);
        }
    });
    
    // Continue to license activation
    continueToLicenseBtn.addEventListener('click', function() {
        // Pre-fill the license key
        document.getElementById('license').value = generatedLicenseKey;
        showPage('license');
    });
    
    // License form submission
    licenseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const enteredLicense = document.getElementById('license').value.trim();
        
        // Check if entered license matches generated license
        if (enteredLicense === generatedLicenseKey) {
            showPage('platform');
            showNotification('License activated successfully!', 'success');
        } else {
            showNotification('Invalid license key. Please enter the correct key sent to your email.', 'error');
        }
    });
    
    // Activate platform
    activatePlatformBtn.addEventListener('click', function() {
        if (selectedPlatform) {
            showPage('strategy-select');
        }
    });
    
    // Apply strategy
    applyStrategyBtn.addEventListener('click', function() {
        if (selectedPlatform && selectedStrategy) {
            updatePlatformInfo();
            showPage('aviator');
            showNotification(`${selectedStrategy.name} strategy applied to ${selectedPlatform.name}`, 'success');
        }
    });
    
    // Change strategy
    changeStrategyBtn.addEventListener('click', function() {
        showPage('strategy-select');
    });
    
    // Analyze button
    analyzeBtn.addEventListener('click', function() {
        if (isAnalyzing) return;
        
        isAnalyzing = true;
        currentRound++;
        
        // Update button state
        analyzeBtn.classList.add('analyzing');
        analyzeBtn.innerHTML = '<div style="font-size: 20px; margin-bottom: 5px;">ANALYZING</div><div style="font-size: 15px; opacity: 0.9;">ROUND ' + currentRound + '</div>';
        
        // Simulate analysis delay
        setTimeout(() => {
            // Generate prediction
            const { prediction, accuracy } = generatePrediction();
            
            // Update display
            predRange.textContent = prediction + 'x';
            document.getElementById('apiSource').textContent = `${accuracy}% Accuracy | ${selectedStrategy ? selectedStrategy.name : 'Default'} Strategy`;
            
            // Add to history
            const historyItem = {
                multiplier: prediction + 'x',
                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}),
                strategy: selectedStrategy ? selectedStrategy.name : 'DEFAULT',
                accuracy: accuracy,
                round: currentRound
            };
            
            history.unshift(historyItem);
            updateHistory();
            
            // Reset button state
            isAnalyzing = false;
            analyzeBtn.classList.remove('analyzing');
            analyzeBtn.innerHTML = '<div style="font-size: 20px; margin-bottom: 5px;">GET</div><div style="font-size: 15px; opacity: 0.9;">PREDICTION</div>';
            
            // Show notification
            showNotification(`Prediction for Round ${currentRound}: ${prediction}x (${accuracy}% accuracy)`, 'info');
            
        }, 2000);
    });
    
    // Reset session
    resetBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset the current session? All prediction history will be lost.')) {
            resetSession();
        }
    });
    
    // ==================== INITIALIZATION ====================
    
    // Pre-populate with test data for demo
    window.addEventListener('load', function() {
        // Auto-populate test data (remove in production)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            setTimeout(() => {
                document.getElementById('name').value = 'Demo User';
                document.getElementById('email').value = 'demo@example.com';
                document.getElementById('cell').value = '+2348012345678';
                showNotification('Demo mode active. Fill in your details or use demo data.', 'info');
            }, 1000);
        }
        
        // Initialize with some fake history for demo
        for (let i = 0; i < 5; i++) {
            const fakeTime = new Date(Date.now() - (i * 5 * 60000)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const fakeMultiplier = (Math.random() * 4 + 1).toFixed(2);
            
            history.push({
                multiplier: fakeMultiplier + 'x',
                time: fakeTime,
                strategy: ['MOMENTUM', 'AGGRESSIVE', 'CONSERVATIVE'][i % 3],
                accuracy: (Math.random() * 10 + 85).toFixed(1)
            });
        }
        
        // Update history display if on aviator page
        if (document.getElementById('aviator-page').classList.contains('active')) {
            updateHistory();
        }
    });
    
    // ==================== PAYSTACK INTEGRATION TEMPLATE ====================
    
    /**
     * Template for Paystack integration (for future use)
     */
    function initializePaystackIntegration() {
        console.log(`
        ==============================================
        PAYSTACK INTEGRATION TEMPLATE
        ==============================================
        
        To add real Paystack payments:
        
        1. Get your Paystack API keys from:
           https://dashboard.paystack.com/#/settings/developer
        
        2. Replace the payment processing function:
        
        function processRealPayment() {
            const PAYSTACK_PUBLIC_KEY = 'pk_live_your_live_key_here'; // or pk_test_ for test mode
            
            const handler = PaystackPop.setup({
                key: PAYSTACK_PUBLIC_KEY,
                email: userData.email,
                amount: 65000 * 100, // Amount in kobo
                currency: 'NGN',
                ref: 'AVIATOR-' + Date.now(),
                metadata: {
                    custom_fields: [
                        {
                            display_name: "Full Name",
                            variable_name: "full_name",
                            value: userData.name
                        },
                        {
                            display_name: "Phone Number",
                            variable_name: "phone_number",
                            value: userData.phone
                        },
                        {
                            display_name: "Product",
                            variable_name: "product",
                            value: "Aviator Cracker +V7"
                        }
                    ]
                },
                callback: function(response) {
                    // Verify payment on your backend
                    verifyPayment(response.reference);
                },
                onClose: function() {
                    alert('Payment cancelled');
                }
            });
            
            handler.openIframe();
        }
        
        3. Add backend verification:
        
        // Backend example (Node.js)
        const Paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);
        
        app.post('/verify-payment', async (req, res) => {
            try {
                const { reference } = req.body;
                const verification = await Paystack.transaction.verify(reference);
                
                if (verification.data.status === 'success') {
                    // Generate license key
                    const licenseKey = generateLicenseKey();
                    
                    // Send email to customer
                    await sendLicenseEmail(userEmail, licenseKey);
                    
                    res.json({ success: true, licenseKey });
                } else {
                    res.json({ success: false });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        
        ==============================================
        `);
    }
    
    // Initialize the template info (runs once)
    setTimeout(initializePaystackIntegration, 3000);
});