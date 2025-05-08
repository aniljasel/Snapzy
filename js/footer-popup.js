document.addEventListener("DOMContentLoaded", () => {
    const settingsButton = document.querySelector("#footer-set-btn");
    const settingsPopup = document.querySelector("#settings-popup");
    const closePopup = document.querySelector("#close-popup");
    const themeToggle = document.querySelector("#toggle-theme");

    if (!settingsButton || !settingsPopup || !closePopup) {
        console.error("One or more settings elements not found!");
        return;
    }

    // Open popup
    settingsButton.addEventListener("click", () => {
        settingsPopup.style.display = "block";
    });

    // Close popup
    closePopup.addEventListener("click", () => {
        settingsPopup.style.display = "none";
    });
});
