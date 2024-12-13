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
            resultDiv.textContent = `Error fetching QR code: ${response.statusText}`;
        }
        
    } catch (error) {
        console.error('Fetch error:', error);
        resultDiv.textContent = 'An error occurred while retrieving your QR code.';
    }
});
