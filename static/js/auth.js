document.addEventListener('DOMContentLoaded', function() {
    // Update DateTime
    function updateDateTime() {
        fetch('/get_time')
            .then(response => response.json())
            .then(data => {
                document.getElementById('currentDateTime').textContent = data.datetime;
            });
    }

    setInterval(updateDateTime, 1000);
    updateDateTime();

    // Get DOM elements
    const loginBox = document.getElementById('loginBox');
    const registerBox = document.getElementById('registerBox');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');

    // Show/Hide Register Form
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginBox.style.display = 'none';
        registerBox.style.display = 'block';
    });

    // Show/Hide Login Form
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerBox.style.display = 'none';
        loginBox.style.display = 'block';
    });

    // Register Form Handler
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        if (password !== confirmPassword) {
            showMessage('error', 'Passwords do not match!');
            return;
        }

        // Store user data (in a real app, this would be sent to a server)
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(user => user.username === username)) {
            showMessage('error', 'Username already exists!');
            return;
        }

        users.push({
            username,
            email,
            password,
            registrationDate: new Date().toISOString()
        });

        localStorage.setItem('users', JSON.stringify(users));
        showMessage('success', 'Registration successful! Please login.');
        registerForm.reset();
        showLoginLink.click();
    });

    // Login Form Handler
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            sessionStorage.setItem('currentUser', username);
            window.location.href = '/dashboard';
        } else {
            showMessage('error', 'Invalid username or password!');
        }
    });

    // Show message function
    function showMessage(type, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
            <span>${message}</span>
        `;

        const form = registerBox.style.display === 'block' ? registerForm : loginForm;
        form.insertBefore(messageDiv, form.firstChild);

        setTimeout(() => messageDiv.remove(), 3000);
    }
});