document.addEventListener("DOMContentLoaded", () => {
    const feedback = document.getElementById("scan-feedback");
    const toggleCameraButton = document.getElementById("toggle-camera");
    const switchCameraButton = document.getElementById("switch-camera");
    const historyList = document.getElementById("history-list");
    const clearHistoryButton = document.getElementById("clear-history");
    const acceptButton = document.getElementById("accept-button");
    const nameStatusContainer = document.getElementById("name-status-container");
    const scannedName = document.getElementById("scanned-name");
    const scannedStatus = document.getElementById("scanned-status");

    let html5QrCode = new Html5Qrcode("reader");
    let isCameraActive = true;
    let scannedCodes = new Set(); // To store unique scanned QR codes
    let isScanningCompleted = false; // Flag to check if scanning is completed

    const functionKey = "FUNCTION_API_KEY"; // Add your Function Key here

    // Utility function to get current timestamp
    const getTimestamp = () => {
        const now = new Date();
        return now.toLocaleString(); // Format: "MM/DD/YYYY, HH:MM:SS"
    };

    // Function called when a QR code is successfully scanned
    const onScanSuccess = (decodedText) => {
        if (scannedCodes.has(decodedText) || isScanningCompleted) {
            return; // Prevent duplicate scans and stop scanning once completed
        }

        scannedCodes.add(decodedText); // Add the code to the set
        feedback.textContent = `Accepted: ${decodedText}`;
        feedback.style.color = "green";

        const timestamp = getTimestamp();
        const listItem = document.createElement("li");
        listItem.textContent = `${decodedText} (Scanned at: ${timestamp})`;
        historyList.appendChild(listItem);

        // Stop the camera after a successful scan
        stopCamera();

        // Check QR code status with function key
        checkQRCodeStatus(decodedText);
    };

    const checkQRCodeStatus = (paymentSessionId) => {
        const apiUrl = `https://stripewebhook-function.azurewebsites.net/api/CheckQRCodeStatus?paymentSessionId=${paymentSessionId}&code=${functionKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log(data);

                // Update name and status
                scannedName.textContent = data.name || "Unknown";
                scannedStatus.textContent = data.status;

                // Show name and status
                nameStatusContainer.style.display = "block";

                // Show the accept button
                acceptButton.style.display = "inline-block";

                // Mark scanning as completed
                isScanningCompleted = true;
            })
            .catch((error) => {
                console.error(`Error:`, error);
                feedback.textContent = "Kunde inte hämta status från servern.";
                feedback.style.color = "red";
            });
    };

    const onScanFailure = () => {
        feedback.textContent = "Scanning...";
        feedback.style.color = "#ffffff";
    };

    // Start the camera
    const startCamera = (cameraId) => {
        html5QrCode
            .start(cameraId, { fps: 10, qrbox: { width: 250, height: 250 } }, onScanSuccess, onScanFailure)
            .then(() => {
                isCameraActive = true;
                toggleCameraButton.textContent = "Turn Off Camera";
                isScanningCompleted = false; // Reset scanning completion flag
            })
            .catch((err) => {
                feedback.textContent = "Failed to start camera.";
                feedback.style.color = "red";
                console.error(err);
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
        // Hide the name/status and the accept button
        nameStatusContainer.style.display = "none";
        acceptButton.style.display = "none";

        // Restart the camera
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
    });

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
});
