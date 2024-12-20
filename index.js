document.querySelector('.ticket-form').addEventListener('submit', async (event) => {
    console.log("Form submitted");
    event.preventDefault();

    const orderId = document.getElementById('orderid').value;
    const resultDiv = document.getElementById('qr-code-result');
    const instructions = document.querySelector('.instructions');
    const form = document.querySelector('.ticket-form');
    const ticketTitle = document.querySelector('h1');  // Rubriken "Retrieve Your Ticket"

    // Döljer instruktioner, formulär och rubrik
    instructions.style.display = 'none';
    form.style.display = 'none';
    ticketTitle.style.display = 'none';  // Döljer rubriken
    resultDiv.innerHTML = '';  // Tömmer resultatdiven för att visa nya element

    try {
        const response = await fetch(`https://stripewebhook-function.azurewebsites.net/api/GetQRCodeImageByOrderId?orderId=${orderId}`, {
            cache: 'no-store', // För att undvika cache-problem
        });

        console.log('Response:', response);  // Logga hela svaret

        if (response.ok) {
            const data = await response.json();
            console.log('Fetched data:', data);  // Logga JSON-responsen
            const imageUrl = data.imageUrl;
            // Lägg till bilden i DOM
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Your QR Code';
            resultDiv.appendChild(img);
        } else {
            console.error('Error response:', response.status, response.statusText);
            showError();
        }

    } catch (error) {
        console.error('Fetch error:', error);
        showError();
    }

    // Funktion som hanterar visningen av felmeddelandet och knappen
    function showError() {
        // Skapa och visa felmeddelande
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('error-message');
        errorMessage.textContent = 'Invalid Order ID. Please try again.';
        resultDiv.appendChild(errorMessage);

        // Skapa och visa knappen "Try Again"
        const tryAgainButton = document.createElement('button');
        tryAgainButton.textContent = 'Try Again';
        tryAgainButton.classList.add('try-again-button');
        resultDiv.appendChild(tryAgainButton);

        // Lägg till event listener till knappen "Try Again"
        tryAgainButton.addEventListener('click', () => {
            ticketTitle.style.display = 'block';  // Visa rubriken igen
            instructions.style.display = 'block';
            form.style.display = 'block';
            resultDiv.innerHTML = '';  // Rensa tidigare resultat och felmeddelande
        });
    }
});
