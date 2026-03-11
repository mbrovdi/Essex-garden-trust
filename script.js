const yearNode = document.getElementById("year");
const cookieBar = document.getElementById("cookieBar");
const cookieButton = document.getElementById("cookieOk");

if (yearNode){
    yearNode.textContent = new Date().getFullYear();
}

if(cookieButton && cookieBar){
    cookieButton.addEventListener("click", () => {
        cookieBar.style.display = "none";
    });
}
