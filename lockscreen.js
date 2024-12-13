document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("lockscreen-form");
    const passwordInput = document.getElementById("password-input");
    const errorMessage = document.getElementById("error-message");

    const PASSWORD = "admin123";

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (passwordInput.value === PASSWORD) {
            sessionStorage.setItem("authenticated", "true");
            window.location.href = "admin.html";
        } else {
            errorMessage.textContent = "Invalid password. Please try again.";
            errorMessage.style.display = "block";
            passwordInput.value = "";
        }
    });
});

function goBack() {
    window.history.back();
  }
