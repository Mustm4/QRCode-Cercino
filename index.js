document.querySelector('.ticket-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const orderId = document.getElementById('orderid').value;
    const resultDiv = document.getElementById('qr-code-result');

    // Clear previous results
    resultDiv.innerHTML = '';

    try {
        const response = await fetch(`https://stripewebhook-function.azurewebsites.net/api/GetQRCodeImage?orderId=${orderId}`);
        if (response.ok) {
            const data = await response.json();
            const imageUrl = data.imageUrl; // URL to the QR code image

            // Display the QR code image
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Your QR Code';
            resultDiv.appendChild(img);
        } else {
            const errorText = await response.text();
            resultDiv.textContent = `Error: ${errorText}`;
        }
    } catch (error) {
        console.error('Failed to fetch QR code image:', error);
        resultDiv.textContent = 'An error occurred while retrieving your ticket.';
    }
});
