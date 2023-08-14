const body = document.querySelector('body');
const userId = body.getAttribute('data-user-id');


function setupFavoritesPopup() {
    document.addEventListener("DOMContentLoaded", function () {
      const favLinks = document.getElementById('favLinks');
      const p = document.querySelector('.favImg');
      const img = document.createElement("img");

     
  
      var hrefValue = favLinks.getAttribute('href');
      if (favLinks) {
        if (userId) {
          favLinks.href = `/user/${userId}/favorite/` + hrefValue;
        } else {
          favLinks.className = "popupClick";
          favLinks.href = "#";
        }
      }
  
      const popupClickLinks = document.querySelectorAll(".popupClick");
      const myPopup = document.getElementById("myPopup");
      const closePopup = document.getElementById("closePopup");
      const popupParagraph = document.getElementById("popupParagraph");
  
      const popupMessage = 'You need to be logged in to add this book to your favorites';
  
      popupClickLinks.forEach(link => {
        link.addEventListener("click", function (event) {
          event.preventDefault();
          popupParagraph.innerHTML = popupMessage;
          myPopup.style.display = "block";
        });
      });
  
      closePopup.addEventListener("click", function () {
        myPopup.style.display = "none";
      });
    });
  }
  
  setupFavoritesPopup();
  
  function setupFavLinksClick() {
    document.addEventListener("DOMContentLoaded", function () {
      const favLinks = document.getElementById('favLinks');
      favLinks.addEventListener('click', async (event) => {
        event.preventDefault();
        const route = favLinks.getAttribute('href'); 
        const xhr = new XMLHttpRequest();
        xhr.open('GET', route, true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            const popupParagraph = document.getElementById("popupParagraph");
            const myPopup = document.getElementById("myPopup");
            if (xhr.status === 201) {
              popupParagraph.textContent = xhr.responseText;
            } else {
              popupParagraph.textContent = 'An error occurred.';
            }
            myPopup.style.display = 'block';
          }
        };
        xhr.send();
      });
    });
  }

if (userId) {
    setupFavLinksClick(); 
}
