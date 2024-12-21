document.querySelector('.ticket-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const orderId = document.getElementById('orderid').value.trim();

    // Mock-data för demonstration (kan hämtas från servern i verklig användning)
    const mockData = {
        id: orderId,
        customerName: "John Doe", // Namn på kund
        quantity: 2 // Antal biljetter
    };

    // Kontrollera om Order ID är korrekt
    if (orderId && mockData.id === orderId) {
        // Rensa tidigare QR-kod och innehåll
        const qrResultContainer = document.getElementById('qr-code-result');
        qrResultContainer.innerHTML = '';

        // Skapa och visa namnet på kunden
        const customerName = document.createElement('p');
        customerName.textContent = mockData.customerName;
        customerName.style.fontSize = '1.5rem';
        customerName.style.fontWeight = 'bold';
        customerName.style.marginBottom = '10px';
        qrResultContainer.appendChild(customerName);

        // Skapa QR-koden
        const qrCode = document.createElement('img');
        qrCode.src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(orderId)}&size=200x200`;
        qrCode.alt = "QR Code";
        qrResultContainer.appendChild(qrCode);

        // Visa quantity (antal) under QR-koden
        const quantityText = document.createElement('p');
        quantityText.textContent = `Quantity: ${mockData.quantity}`;
        quantityText.style.fontSize = '1rem';
        quantityText.style.marginTop = '10px';
        qrResultContainer.appendChild(quantityText);

        // Visa resultatcontainern
        qrResultContainer.style.display = 'flex';
        qrResultContainer.style.flexDirection = 'column';
        qrResultContainer.style.alignItems = 'center';
    } else {
        alert('Invalid Order ID. Please try again.');
    }

    // Funktion som hanterar visningen av felmeddelandet och knappen
    function showError() {
        // Skapa och visa felmeddelande
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('error-message');
        errorMessage.textContent = 'INVALID ORDER ID. PLEASE TRY AGAIN.';
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
