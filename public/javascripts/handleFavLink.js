//Get the user id that was defined in the body by EJS
const body = document.querySelector('body');
const userId = body.getAttribute('data-user-id');

/* 
  Function to handle the processing the favorite link
  If the user is logged, clicking in the link will trigger the favorite funtion by its route
  If not,it will proceed to show a message by a popup
*/
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
  
  
/*
  Function to handle the response from the favorite link function/route
  Responsible to pass the backend message to the popup
*/
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

//The function is only triggered if the user is logged, as the id will be present in the page
if (userId) {
    setupFavLinksClick(); 
}
