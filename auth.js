(function() {
    if (!sessionStorage.getItem("authenticated") && location.pathname.includes("admin.html")) {
        window.location.href = "lockscreen.html";
    }
})();
