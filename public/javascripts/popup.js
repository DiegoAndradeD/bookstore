//Configure the popup from the favorite link 

const popupClickLinks = document.querySelectorAll(".popupClick");
const myPopup = document.getElementById("myPopup");
const closePopup = document.getElementById("closePopup");
const popupParagraph = document.getElementById("popupParagraph");

const popupMessage = 'You need to be logged in to add this book to your favorites';

popupClickLinks.forEach(link => {
    link.addEventListener("click", function(event) {
        event.preventDefault();
        popupParagraph.innerHTML = popupMessage;
        myPopup.style.display = "block";
    });
});

closePopup.addEventListener("click", function() {
    myPopup.style.display = "none";
});