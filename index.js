document.querySelector('.ticket-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const orderId = document.getElementById('orderid').value.trim();

    // Check if Order ID is provided
    if (orderId) {
        // Hide the form, instructions, and heading
        document.querySelector('.ticket-form').style.display = 'none';
        document.querySelector('.instructions').style.display = 'none';
        document.querySelector('h1').style.display = 'none';  // Hide the heading

        // Show the QR code result container
        const qrResultContainer = document.getElementById('qr-code-result');
        qrResultContainer.style.display = 'flex';

        // Clear any previous content
        qrResultContainer.innerHTML = '';

        // Call the backend to get the QR code image and payment details
        fetch(`https://stripewebhook-function.azurewebsites.net/api/GetQRCodeImageByOrderId?orderId=${orderId}`)
            .then(response => response.json())
            .then(data => {
                // Check if the response has the necessary data
                if (data.imageUrl) {
                    // Set background color only when QR code is shown
                    const qrResultContainer = document.getElementById('qr-code-result');
                    qrResultContainer.style.backgroundColor = 'hsl(329.1, 84%, 69.02%)'; // Set the background color
            
                    // Display the customer name
                    const customerName = document.createElement('p');
                    customerName.textContent = data.name || 'Okänd';
                    customerName.style.fontSize = '1.5rem';
                    customerName.style.fontWeight = 'bold';
                    customerName.style.marginBottom = '10px';
                    qrResultContainer.appendChild(customerName);
            
                    // Display the QR code image
                    const qrCode = document.createElement('img');
                    qrCode.src = data.imageUrl;
                    qrCode.alt = 'QR Code';
                    qrResultContainer.appendChild(qrCode);
            
                    // Display the quantity
                    const quantityText = document.createElement('p');
                    quantityText.textContent = `Quantity: ${data.quantity}`;
                    quantityText.style.fontSize = '1rem';
                    quantityText.style.marginTop = '10px';
                    qrResultContainer.appendChild(quantityText);
                } else {
                    // Handle errors if no imageUrl is returned
                    showError();
                }
            })
            

        // Function to show an error message and try again button
        function showError() {
            const resultDiv = document.getElementById('qr-code-result');
        
            // Ta bort både bakgrundsfärgen och bordern
            resultDiv.style.backgroundColor = 'none';  // Ta bort bakgrundsfärgen
            resultDiv.style.border = 'none';            // Ta bort bordern
        
            // Visa felmeddelandet
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('error-message');
            errorMessage.textContent = 'INVALID ORDER ID. PLEASE TRY AGAIN.';
            resultDiv.appendChild(errorMessage);
        
            // Visa "Try Again"-knappen
            const tryAgainButton = document.createElement('button');
            tryAgainButton.textContent = 'Try Again';
            tryAgainButton.classList.add('try-again-button');
            resultDiv.appendChild(tryAgainButton);
        
            // Lägg till event listener för att återställa formuläret
            tryAgainButton.addEventListener('click', () => {
                document.querySelector('.ticket-form').style.display = 'block';
                document.querySelector('.instructions').style.display = 'block';
                document.querySelector('h1').style.display = 'block';  // Visa rubriken igen
                resultDiv.style.display = 'none';
                resultDiv.innerHTML = '';  // Rensa tidigare innehåll
            });
        }
    }
});
