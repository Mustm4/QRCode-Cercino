/* General Reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Body Styling */
body {
    font-family: Arial, sans-serif;
    background-color: #121212;
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 1)), url('party.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    color: #ffffff;
    display: block;
    flex-direction: column;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    padding-bottom: 80px;
}

/* Responsive Design */
@media (max-width: 768px) {
    body {
        background-size: cover; 
        background-position: center;
    }

    .main-content {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        padding: 2rem; /* Reduced padding */
        text-align: center;
    }

    .ticket-container {
        padding: 2rem;
        border-radius: 10px;
        text-align: center;
        width: 100%;
        max-width: 400px;
    }

    .ticket-container h1 {
        font-size: 1.8rem;
        margin-bottom: 1rem;
        color: #ffffff;
    }

    .ticket-container p {
        font-size: 1rem;
        margin-bottom: 1rem;
        color: #cccccc;
    }

    #reader {
        margin-top: 0px;  /* Mindre margin för mindre enheter */
        height: 50vh;
    }
}

@media (max-width: 480px) {
    body {
        height: auto; /* Adjust height for smaller screens */
    }

    .main-content {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        padding: 1.5rem; /* Reduced padding for smaller screens */
        text-align: center; 
    }

    .ticket-container {
        padding: 1.5rem;
        border-radius: 10px;
        text-align: center;
        width: 100%;
        max-width: 350px; /* Slightly smaller max-width for small screens */
    }

    .ticket-container h1 {
        font-size: 1.6rem; /* Adjusted font size */
        margin-bottom: 1rem;
        color: #ffffff;
    }

    .ticket-container p {
        font-size: 0.9rem; /* Smaller font size */
        margin-bottom: 1rem;
        color: #cccccc;
    }

    #reader {
        margin-top: 0px;  /* Mindre margin för mindre enheter */
        height: 50vh;
    }
}

/* Navbar */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #242424;
    padding: 1rem 2rem;
    position: relative; /* Behåller navbaren i flödet */
    z-index: 10; /* Se till att navbaren ligger ovanför kameran */
}

.navbar .logo a {
    text-decoration: none;
    color: #ffffff;
    font-size: 1.5rem;
    font-weight: bold;
}

.nav-links a {
    color: #ffffff;
    text-decoration: none;
    font-size: 1rem;
    margin-left: 1rem;
}

/* Scanner Page */
.scanner-page {
    display: flex;
    flex-direction: column; /* Ändra från row (default) till column */
    align-items: center;   /* Centrera innehållet horisontellt */
    padding: 20px;
    gap: 20px;             /* Lägger till mellanrum mellan kameran och gästlistan */
}

/* Camera Viewer */
#reader {
    width: 100vw;
    height: 100%;
}

/* Overlay for Accept/Decline buttons */
.qr-actions-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);  /* Center the overlay */
    display: flex;  /* Flexbox for buttons */
    gap: 1rem;
    z-index: 2;  /* Ensure it’s above the camera */
}

.qr-actions-overlay button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: #ffffff;
    transition: background-color 0.3s ease;
}

.qr-actions-overlay .accept {
    background-color: #28a745;
}

.qr-actions-overlay .accept:hover {
    background-color: #218838;
}

.qr-actions-overlay .decline {
    background-color: #dc3545;
}

.qr-actions-overlay .decline:hover {
    background-color: #c82333;
}

/* Feedback Text */
#scan-feedback {
    position: relative;
    margin-top: 10px;
    font-size: 16px;
    color: green;
    text-align: center;
}

/* History Widget */
.history-widget {
    background-color: #292929;
    padding: 1rem;
    border-radius: 5px;
    margin-top: 1rem;
    color: #ffffff;
}

.history-widget ul {
    list-style: none;
    padding: 0;
}

.history-widget ul li {
    margin-bottom: 0.5rem;
}

/* Lock Screen */
.lockscreen-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #121212;
    color: #ffffff;
}

.lockscreen-container {
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
    width: 100%;
    max-width: 400px;
}

.lockscreen-container h1 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: #ffffff;
}

.lockscreen-container p {
    font-size: 1rem;
    margin-bottom: 1rem;
    color: #cccccc;
}

#password-input {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    margin-bottom: 1rem;
    border-radius: 5px;
    border: 1px solid #cccccc;
}

.bottom-buttons {
    position: fixed; 
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-around;
    background-color: #242424; 
    padding: 10px 0;
    z-index: 1000; 
}

.bottom-buttons button {
    flex: 1;
    margin: 0 5px;
    padding: 10px;
    font-size: 1rem;
    color: white;
    background-color: #1e90ff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.back-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    color: #ffffff;
    background-color: #1e90ff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.error-message {
    font-size: 0.9rem;
    color: red;
    margin-top: 1rem;
}

/* Main content */
.main-content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    padding: 2rem;
}

.ticket-container {
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
    width: 100%;
    max-width: 400px;
}

.ticket-container h1 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: #ffffff;
}

.ticket-container p {
    font-size: 1rem;
    margin-bottom: 1rem;
    color: #cccccc;
}

#orderid {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    margin-bottom: 1rem;
    border-radius: 5px;
    border: 1px solid #cccccc;
}

.form-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    color: #ffffff;
    background-color: #1e90ff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

#scanner-container {
    margin-top: 20px;
    text-align: center;
    width: 100%;
}

#guest-list-container {
    width: 100%;           /* Ta upp hela bredden av föräldern */
    max-width: 600px;      /* Begränsa bredden för stora skärmar */
    background-color: #333;
    padding: 15px;
}

#guest-list-container h3 {
    margin-top: 0;
    text-align: center;
    font-size: 18px;
    color: white;
}

#guest-list {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 200px;
    overflow-y: auto;
    font-size: 14px;
}

#guest-list li {
    padding: 8px;
    border-bottom: 1px solid #ddd;
}

#guest-list li:last-child {
    border-bottom: none;
}

#name-status-container {
    margin-top: 20px;
    text-align: center;
}

#name-status-container p {
    font-size: 16px;
} 
