document.querySelector('.ticket-form').addEventListener('submit', async (event) => {
    console.log("Form submitted");  // Lägg till detta för att se om eventet tas emot.
    event.preventDefault();

    const orderId = document.getElementById('orderid').value;
    const resultDiv = document.getElementById('qr-code-result');

    // Clear previous results
    resultDiv.innerHTML = '';

    try {
        const response = await fetch(`https://stripewebhook-function.azurewebsites.net/api/GetQRCodeImage?orderId=${orderId}`, {
            cache: 'no-store', // För att undvika cache-problem
        });

        if (response.ok) {
            const data = await response.json();
            const imageUrl = data.imageUrl;

            // Debugging för att se vad som händer
            console.log('Fetched imageUrl:', imageUrl);

            // Lägg till bilden i DOM
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Your QR Code';
            resultDiv.appendChild(img);
        } else {
            console.error('Error response:', response.status, response.statusText);
            resultDiv.textContent = `Error fetching QR code: ${response.statusText}`;
        }
    } catch (error) {
        console.error('Fetch error:', error);
        resultDiv.textContent = 'An error occurred while retrieving your QR code.';
    }
});
