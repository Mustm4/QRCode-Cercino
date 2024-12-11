document.addEventListener("DOMContentLoaded", () => {
    const feedback = document.getElementById("scan-feedback");
    const toggleCameraButton = document.getElementById("toggle-camera");
    const switchCameraButton = document.getElementById("switch-camera");
    const historyList = document.getElementById("history-list");
    const clearHistoryButton = document.getElementById("clear-history");

    let html5QrCode = new Html5Qrcode("reader");
    let isCameraActive = true;
    let scannedCodes = new Set(); // To store unique scanned QR codes

    // Utility function to get current timestamp
    const getTimestamp = () => {
        const now = new Date();
        return now.toLocaleString(); // Format: "MM/DD/YYYY, HH:MM:SS"
    };

    // Function called when a QR code is successfully scanned
    const onScanSuccess = (decodedText) => {
        if (scannedCodes.has(decodedText)) {
            feedback.textContent = `Duplicate QR Code: ${decodedText}`;
            feedback.style.color = "orange";
        } else {
            scannedCodes.add(decodedText); // Add the code to the set
            feedback.textContent = `Accepted: ${decodedText}`;
            feedback.style.color = "green";

            const timestamp = getTimestamp();
            const listItem = document.createElement("li");
            listItem.textContent = `${decodedText} (Scanned at: ${timestamp})`;
            historyList.appendChild(listItem);
        }
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

    // Clear the scan history
    clearHistoryButton.addEventListener("click", () => {
        historyList.innerHTML = ""; // Clear the displayed list
        scannedCodes.clear(); // Clear the scanned codes set
        feedback.textContent = "History cleared.";
        feedback.style.color = "#ffffff";
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
