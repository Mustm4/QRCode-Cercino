document.addEventListener("DOMContentLoaded", () => {
    const feedback = document.getElementById("scan-feedback");
    const toggleCameraButton = document.getElementById("toggle-camera");
    const switchCameraButton = document.getElementById("switch-camera");
    const exportHistoryButton = document.getElementById("export-history");
    const acceptButton = document.getElementById("accept-button");
    const nameStatusContainer = document.getElementById("name-status-container");
    const scannedName = document.getElementById("scanned-name");
    const scannedStatus = document.getElementById("scanned-status");
    const guestList = document.getElementById("guest-list");

    let html5QrCode = new Html5Qrcode("reader");
    let isCameraActive = true;
    let scannedCodes = new Set(); // To store unique scanned QR codes
    let isScanningCompleted = false; // Flag to check if scanning is completed
    let currentOrderNumber = null; // To store the current order number
    let isExporting = false;

    // Utility function to get current timestamp
    const getTimestamp = () => {
        const now = new Date();
        return now.toLocaleString(); // Format: "MM/DD/YYYY, HH:MM:SS"
    };

    // Funktion för att exportera gästlistan som CSV med Purchased Time och Scanned Time
const exportGuestListToCSV = () => {
    if (isExporting) {
        console.log("Export pågår redan, vänta...");
        return; // Om exporten redan pågår, gör inget
    }
    isExporting = true; // Sätt flaggan på true för att indikera att exporten pågår

    const apiUrl = "https://stripewebhook-function.azurewebsites.net/api/GetScannedGuests?code=obq3ySEnhcFbiDIK0H1uAoE2tksc-yL4aoPdLE3AS96wAzFuSC57-w==";

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Skapa CSV-huvud med kolumnnamn
            let csvContent = "Name,Status,Purchased Time,Scanned Time\n";

            // Loopa igenom gästerna och skapa CSV-rader
            data.forEach(guest => {
                // Konvertera ScannedTime och PurchasedTime till lokal tid
                const purchasedTime = new Date(guest.Date + 'Z').toLocaleString("sv-SE", {
                    timeZone: "Europe/Stockholm"
                });
                const scannedTime = new Date(guest.ScannedTime + 'Z').toLocaleString("sv-SE", {
                    timeZone: "Europe/Stockholm"
                });

                // Lägg till data i CSV-innehållet
                csvContent += `"${guest.Name}","${guest.Status}","${purchasedTime}","${scannedTime}"\n`;
            });

            // Skapa en "data URL" direkt i minnet
            const encodedUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);

            // Skapa en temporär länk för nedladdning
            const link = document.createElement("a");
            link.href = encodedUri;
            link.setAttribute("download", "guest_list.csv");

            // Lägg till länken temporärt i DOM och klicka på den
            document.body.appendChild(link);
            link.click();

            // Ta bort länken efter nedladdningen
            document.body.removeChild(link);

            // Exporten är klar, sätt flaggan tillbaka
            isExporting = false;
        })
        .catch(error => {
            console.error("Fel vid export av gästlistan:", error);
            feedback.textContent = "Kunde inte exportera gästlistan.";
            feedback.style.color = "red";

            // Vid fel, sätt flaggan tillbaka
            isExporting = false;
        });
};

// Koppla export-knappen till funktionen
exportHistoryButton.addEventListener("click", exportGuestListToCSV);


         // Start the camera
    const startCamera = (cameraId) => {
    const qrboxSize = window.innerWidth <= 480 ? 200 : 250;
    const fps = window.innerWidth <= 480 ? 5 : 10; // Lägre FPS för små skärmar
    html5QrCode
        .start(cameraId, { 
            fps: fps, 
            qrbox: { width: qrboxSize, height: qrboxSize }
        }, onScanSuccess)
        .then(() => {
            isCameraActive = true;
            toggleCameraButton.textContent = "Turn Off Camera";
            isScanningCompleted = false;
        })
        .catch((err) => {
            feedback.textContent = "Failed to start camera.";
            feedback.style.color = "red";
            console.error(err);
        });
    };
    
        // Function called when a QR code is successfully scanned
    const onScanSuccess = (decodedText) => {
        if (scannedCodes.has(decodedText) || isScanningCompleted) {
            feedback.textContent = "Redan skannad eller skanning slutförd.";
            feedback.style.color = "orange";
            return;
        }
        scannedCodes.add(decodedText);
        feedback.textContent = "Accepterad";
        feedback.style.color = "green";
        const timestamp = getTimestamp();
        const listItem = document.createElement("li");
        listItem.textContent = `${decodedText} (Skannad: ${timestamp})`;
        guestList.appendChild(listItem);
        checkQRCodeStatus(decodedText);

        fetchScannedGuests();
        acceptButton.style.display = "inline-block";
        stopCamera();
    };

    
    const checkQRCodeStatus = (orderNumber) => {
        const apiUrl = `https://stripewebhook-function.azurewebsites.net/api/CheckQRCodeStatus?orderNumber=${orderNumber}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log(data);
    
                // Update name and status
                scannedName.textContent = data.name || "Unknown";
                scannedStatus.textContent = data.status;
                
                const scannedTime = data.ScannedTime || "N/A";
    
                // Visa endast tid om den är tillgänglig
                if (scannedTime !== "N/A") {
                    scannedStatus.textContent += ` (Skannades: ${scannedTime})`;
                }
    
                // Show name, status & time
                nameStatusContainer.style.display = "block";
    
                if (data.status === "Redan skannad") {
                    feedback.textContent = "Redan skannad eller skanning slutförd.";
                    feedback.style.color = "orange";
                    acceptButton.style.display = "none";
                    return;
                }
    
                // Show the accept button
                acceptButton.style.display = "inline-block";
    
                // Save the current order number
                currentOrderNumber = orderNumber;
    
                // Mark scanning as completed
                isScanningCompleted = true;
            })
            .catch((error) => {
                console.error(`Error:`, error);
                feedback.textContent = "Kunde inte hämta status från servern.";
                feedback.style.color = "red";
            });
    };
    


    // Stop the camera
    const stopCamera = () => {
        html5QrCode
            .stop()
            .then(() => {
                isCameraActive = false;
                toggleCameraButton.textContent = "Turn On Camera";
            })
            .catch((err) => {
                feedback.textContent = "Failed to stop camera.";
                feedback.style.color = "red";
                console.error(err);
            });
    };
    // Toggle camera state
    toggleCameraButton.addEventListener("click", () => {
        if (isCameraActive) {
            stopCamera();
        } else if (currentCameraId) {
            startCamera(currentCameraId);
        }
    });
    // Switch camera
    switchCameraButton.addEventListener("click", () => {
        Html5Qrcode.getCameras()
            .then((cameras) => {
                if (cameras.length > 1) {
                    const isFrontCamera = currentCameraId === cameras[0].id;
                    currentCameraId = isFrontCamera ? cameras[1].id : cameras[0].id;
                    stopCamera();
                    setTimeout(() => startCamera(currentCameraId), 500);
                    switchCameraButton.textContent = isFrontCamera
                        ? "Switch to Back Camera"
                        : "Switch to Front Camera";
                } else {
                    feedback.textContent = "Only one camera detected.";
                    feedback.style.color = "orange";
                }
            })
            .catch((err) => {
                feedback.textContent = "Failed to switch cameras.";
                feedback.style.color = "red";
                console.error(err);
            });
    });
    // Handle the "Släpp In" button click
    acceptButton.addEventListener("click", () => {
        // Make sure the order number is available before sending the request
        if (!currentOrderNumber) {
            feedback.textContent = "Ingen QR-kod skannad.";
            feedback.style.color = "red";
            return;
        }
        // Make the API call to update the QR code status
        updateQRCodeStatus(currentOrderNumber, "Redan skannad").then(() => {
            fetchScannedGuests();
        });
    });
    const updateQRCodeStatus = (orderNumber, status) => {
        const apiUrl = `https://stripewebhook-function.azurewebsites.net/api/UpdateQRCodeStatus?orderNumber=${orderNumber}&status=${status}&code=obq3ySEnhcFbiDIK0H1uAoE2tksc-yL4aoPdLE3AS96wAzFuSC57-w==`;

        return fetch(apiUrl, { // Returnera Promise från fetch
            method: 'POST',
        })
            .then(response => response.json())
            .then(data => {
                console.log("Status updated:", data);
                feedback.textContent = `Status uppdaterad till: ${status}`;
                feedback.style.color = "green";

                setTimeout(() => {
                    feedback.textContent = "";
                }, 3000);

                // Hide name and status, and hide the accept button
                nameStatusContainer.style.display = "none";
                acceptButton.style.display = "none";

                // Hämta uppdaterad gästlista
                fetchScannedGuests();

                // Starta om kameran
                startCamera(currentCameraId);
            })
            .catch((error) => {
                console.error(`Error:`, error);
                feedback.textContent = "Kunde inte uppdatera status.";
                feedback.style.color = "red";
            });
    };

    // Initialize the camera
    Html5Qrcode.getCameras()
        .then((cameras) => {
            if (cameras.length > 0) {
                currentCameraId = cameras[0].id;
                startCamera(currentCameraId);
            } else {
                feedback.textContent = "No cameras found.";
                feedback.style.color = "red";
            }
        })
        .catch((err) => {
            feedback.textContent = "Failed to initialize cameras.";
            feedback.style.color = "red";
            console.error(err);
        });

    // Load guest list
    const fetchScannedGuests = () => {
        const apiUrl = "https://stripewebhook-function.azurewebsites.net/api/GetScannedGuests?code=obq3ySEnhcFbiDIK0H1uAoE2tksc-yL4aoPdLE3AS96wAzFuSC57-w==";

        fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Sortera gästerna efter 'ScannedTime' i fallande ordning (nyaste först)
            data.sort((a, b) => {
                const scannedTimeA = new Date(a.ScannedTime);
                const scannedTimeB = new Date(b.ScannedTime);
                return scannedTimeB - scannedTimeA; // Fallande ordning
            });

            // Töm nuvarande lista
            guestList.innerHTML = "";

            // Lägg till varje gäst i listan
            data.forEach(guest => {
                // Konvertera ScannedTime till ett Date-objekt och visa i lokal tid
                const scannedTime = new Date(guest.ScannedTime + 'Z');

                // Här konverterar vi till den lokala tidszonen, utan att visa tidszonsförkortningen
                const localTimeString = scannedTime.toLocaleString("sv-SE", {
                    timeZone: "Europe/Stockholm",
                    timeZoneName: "short",  // Visa kort tidszonsnamn (CEST eller CET)
                });

                const listItem = document.createElement("li");
                listItem.textContent = `${guest.Name} - ${guest.Status} (Köptes: ${guest.Date}, Skannades: ${localTimeString})`;
                guestList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error("Fel vid hämtning av gästlistan:", error);
            feedback.textContent = "Kunde inte ladda gästlistan.";
            feedback.style.color = "red";
        });
    };

    fetchScannedGuests();
});
