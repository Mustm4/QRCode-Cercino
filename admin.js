document.addEventListener("DOMContentLoaded", () => {
    const feedback = document.getElementById("scan-feedback");
    const toggleCameraButton = document.getElementById("toggle-camera");
    const switchCameraButton = document.getElementById("switch-camera");
    const exportButton = document.getElementById("clear-history");  // Export-knappen
    const acceptButton = document.getElementById("accept-button");
    const nameStatusContainer = document.getElementById("name-status-container");
    const scannedName = document.getElementById("scanned-name");
    const scannedStatus = document.getElementById("scanned-status");
    const guestList = document.getElementById("guest-list");

    let html5QrCode = new Html5Qrcode("reader");
    let isCameraActive = true;
    let scannedCodes = new Set();
    let isScanningCompleted = false;
    let currentPaymentSessionId = null;
    let currentCameraId = null; // Kamerans id
    const getTimestamp = () => {
        const now = new Date();
        return now.toLocaleString(); // Tidens timestamp
    };

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

        const guest = { name: decodedText, timestamp: timestamp };

        // Lägg till gästen i listan i tidsordning
        addGuestToList(guest);

        checkQRCodeStatus(decodedText);

        fetchScannedGuests();
        acceptButton.style.display = "inline-block";
        stopCamera();
    };

    const addGuestToList = (guest) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${guest.name} (Skannad: ${guest.timestamp})`;
        guestList.appendChild(listItem);

        // Hämta alla gäster från listan
        const guests = Array.from(guestList.children);
        
        // Sortera gäster baserat på deras timestamp
        guests.sort((a, b) => {
            const aTime = new Date(a.textContent.match(/\(Skannad: (.*?)\)/)[1]);
            const bTime = new Date(b.textContent.match(/\(Skannad: (.*?)\)/)[1]);
            return aTime - bTime; // Sortera i stigande ordning
        });

        // Töm listan och lägg till gäster i sorterad ordning
        guestList.innerHTML = "";
        guests.forEach(guestItem => guestList.appendChild(guestItem));
    };

    const checkQRCodeStatus = (paymentSessionId) => {
        const apiUrl = `https://stripewebhook-function.azurewebsites.net/api/CheckQRCodeStatus?paymentSessionId=${paymentSessionId}&code=obq3ySEnhcFbiDIK0H1uAoE2tksc-yL4aoPdLE3AS96wAzFuSC57-w==`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                scannedName.textContent = data.name || "Unknown";
                scannedStatus.textContent = data.status;
                const scannedTime = data.ScannedTime || "N/A";
                nameStatusContainer.style.display = "block";
                scannedStatus.textContent += scannedTime !== "N/A" ? ` (Skannades: ${scannedTime})` : "";

                if (data.status === "Redan skannad") {
                    feedback.textContent = "Redan skannad eller skanning slutförd.";
                    feedback.style.color = "orange";
                    acceptButton.style.display = "none";
                    return;
                }
                acceptButton.style.display = "inline-block";
                currentPaymentSessionId = paymentSessionId;
                isScanningCompleted = true;
            })
            .catch((error) => {
                feedback.textContent = "Kunde inte hämta status från servern.";
                feedback.style.color = "red";
            });
    };

    const startCamera = (cameraId) => {
        const qrboxSize = window.innerWidth <= 480 ? 200 : 250;
        const fps = window.innerWidth <= 480 ? 5 : 10; 
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

    toggleCameraButton.addEventListener("click", () => {
        if (isCameraActive) {
            stopCamera();
        } else if (currentCameraId) {
            startCamera(currentCameraId);
        }
    });

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

    acceptButton.addEventListener("click", () => {
        if (!currentPaymentSessionId) {
            feedback.textContent = "Ingen QR-kod skannad.";
            feedback.style.color = "red";
            return;
        }
        updateQRCodeStatus(currentPaymentSessionId, "Redan skannad").then(() => {
            fetchScannedGuests();
        });
    });

    const updateQRCodeStatus = (paymentSessionId, status) => {
        const apiUrl = `https://stripewebhook-function.azurewebsites.net/api/UpdateQRCodeStatus?paymentSessionId=${paymentSessionId}&status=${status}&code=obq3ySEnhcFbiDIK0H1uAoE2tksc-yL4aoPdLE3AS96wAzFuSC57-w==`;

        return fetch(apiUrl, {
            method: 'POST',
        })
            .then(response => response.json())
            .then(data => {
                feedback.textContent = `Status uppdaterad till: ${status}`;
                feedback.style.color = "green";

                setTimeout(() => {
                    feedback.textContent = "";
                }, 3000);

                nameStatusContainer.style.display = "none";
                acceptButton.style.display = "none";
                fetchScannedGuests();
                startCamera(currentCameraId);
            })
            .catch((error) => {
                feedback.textContent = "Kunde inte uppdatera status.";
                feedback.style.color = "red";
            });
    };

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

    exportButton.addEventListener("click", () => {
        fetchScannedGuests();
    });

    const convertToCSV = (data) => {
        const headers = ["Name", "Status", "Date", "ScannedTime"];
        const rows = data.map((guest) => [
            guest.Name || "Unknown",
            guest.Status || "Unknown",
            guest.Date || "Unknown",
            guest.ScannedTime || "Unknown"
        ]);
        const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
        return csvContent;
    };

    const downloadCSV = (csvContent) => {
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "guest-list.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const fetchScannedGuests = () => {
        fetch("https://stripewebhook-function.azurewebsites.net/api/GetScannedGuests?code=obq3ySEnhcFbiDIK0H1uAoE2tksc-yL4aoPdLE3AS96wAzFuSC57-w==")
            .then(response => response.json())
            .then(data => {
                const csvContent = convertToCSV(data);
                downloadCSV(csvContent);
            })
            .catch((error) => {
                console.error(`Error:`, error);
            });
    };
});
