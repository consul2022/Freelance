document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".activity-header").forEach(header => {
        header.addEventListener("click", function() {
            let list = document.getElementById(this.dataset.target);
            list.style.display = list.style.display === "none" ? "block" : "none";
        });
    });
});
