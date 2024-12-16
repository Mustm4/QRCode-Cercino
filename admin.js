document.addEventListener("DOMContentLoaded", () => {
    const feedback = document.getElementById("scan-feedback");
    const toggleCameraButton = document.getElementById("toggle-camera");
    const switchCameraButton = document.getElementById("switch-camera");
    const clearHistoryButton = document.getElementById("clear-history");
    const acceptButton = document.getElementById("accept-button");
    const nameStatusContainer = document.getElementById("name-status-container");
    const scannedName = document.getElementById("scanned-name");
    const scannedStatus = document.getElementById("scanned-status");
    const guestList = document.getElementById("guest-list");

    let html5QrCode = new Html5Qrcode("reader");
    let isCameraActive = true;
    let scannedCodes = new Set(); // To store unique scanned QR codes
    let isScanningCompleted = false; // Flag to check if scanning is completed
    let currentPaymentSessionId = null; // To store the current payment session ID

    // Function to get current timestamp
    const getTimestamp = () => {
        const now = new Date();
        return now.toLocaleString(); // Format: "MM/DD/YYYY, HH:MM:SS"
    };

    // Function called when a QR code is successfully scanned
    const onScanSuccess = (decodedText) => {
        const timestamp = getTimestamp(); // Get timestamp on successful scan

        if (scannedCodes.has(decodedText) || isScanningCompleted) {
            feedback.textContent = "Redan skannad eller skanning slutförd.";
            feedback.style.color = "orange";
            return;
        }

        scannedCodes.add(decodedText);
        feedback.textContent = "Accepterad";
        feedback.style.color = "green";

        // Update the guest's status after scanning
        acceptButton.style.display = "inline-block";
        stopCamera();
    };

    // Handle the "Släpp In" button click
    acceptButton.addEventListener("click", () => {
        if (!currentPaymentSessionId) {
            feedback.textContent = "Ingen QR-kod skannad.";
            feedback.style.color = "red";
            return;
        }

        const timestamp = getTimestamp(); // Get timestamp when accepting
        updateGuestStatus(currentPaymentSessionId, "Redan skannad", timestamp).then(() => {
            fetchScannedGuests();
        });
    });

    const updateGuestStatus = (paymentSessionId, status, timestamp) => {
        const apiUrl = `https://stripewebhook-function.azurewebsites.net/api/UpdateQRCodeStatus?paymentSessionId=${paymentSessionId}&status=${status}&code=obq3ySEnhcFbiDIK0H1uAoE2tksc-yL4aoPdLE3AS96wAzFuSC57-w==`;
        
        return fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: status,
                scannedTime: timestamp
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Guest status updated:", data);
            feedback.textContent = `Status uppdaterad till: ${status}`;
            feedback.style.color = "green";
            setTimeout(() => {
                feedback.textContent = "";
            }, 3000);
            nameStatusContainer.style.display = "none";
            acceptButton.style.display = "none";
        })
        .catch((error) => {
            console.error("Error updating guest status:", error);
            feedback.textContent = "Kunde inte uppdatera status.";
            feedback.style.color = "red";
        });
    };

    // Fetch and display scanned guests
    const fetchScannedGuests = () => {
        const apiUrl = "https://stripewebhook-function.azurewebsites.net/api/GetScannedGuests?code=obq3ySEnhcFbiDIK0H1uAoE2tksc-yL4aoPdLE3AS96wAzFuSC57-w==";

        fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            guestList.innerHTML = "";

            data.forEach(guest => {
                const listItem = document.createElement("li");
                listItem.textContent = `${guest.Name} - ${guest.Status} (Köptes: ${guest.Date}, Skannade sin biljett: ${guest.ScannedTime})`;
                guestList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error("Fel vid hämtning av gästlistan:", error);
            feedback.textContent = "Kunde inte ladda gästlistan.";
            feedback.style.color = "red";
        });
    };

    // Initialize the camera and start scanning
    const startCamera = (cameraId) => {
        const qrboxSize = window.innerWidth <= 480 ? 200 : 250;
        const fps = window.innerWidth <= 480 ? 5 : 10;

        html5QrCode.start(cameraId, { 
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

    // Stop the camera
    const stopCamera = () => {
        html5QrCode.stop().then(() => {
            isCameraActive = false;
            toggleCameraButton.textContent = "Turn On Camera";
        }).catch((err) => {
            feedback.textContent = "Failed to stop camera.";
            feedback.style.color = "red";
            console.error(err);
        });
    };

    // Toggle camera state
    toggleCameraButton.addEventListener("click", () => {
        if (isCameraActive) {
            stopCamera();
        } else {
            startCamera(currentCameraId);
        }
    });

    // Switch camera
    switchCameraButton.addEventListener("click", () => {
        Html5Qrcode.getCameras().then((cameras) => {
            if (cameras.length > 1) {
                const isFrontCamera = currentCameraId === cameras[0].id;
                currentCameraId = isFrontCamera ? cameras[1].id : cameras[0].id;
                stopCamera();
                setTimeout(() => startCamera(currentCameraId), 500);
                switchCameraButton.textContent = isFrontCamera ? "Switch to Back Camera" : "Switch to Front Camera";
            } else {
                feedback.textContent = "Only one camera detected.";
                feedback.style.color = "orange";
            }
        }).catch((err) => {
            feedback.textContent = "Failed to switch cameras.";
            feedback.style.color = "red";
            console.error(err);
        });
    });

    // Initialize camera on page load
    Html5Qrcode.getCameras().then((cameras) => {
        if (cameras.length > 0) {
            currentCameraId = cameras[0].id;
            startCamera(currentCameraId);
        } else {
            feedback.textContent = "No cameras found.";
            feedback.style.color = "red";
        }
    }).catch((err) => {
        feedback.textContent = "Failed to initialize cameras.";
        feedback.style.color = "red";
        console.error(err);
    });

    fetchScannedGuests();
});
