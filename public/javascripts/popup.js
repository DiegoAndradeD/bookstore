//Configure the popup from the favorite link 

closePopup.addEventListener("click", function() {
    myPopup.style.display = "none";
});

//Function to get the backend route that will be handled
function getCurrentRoute() {
    return window.location.pathname;
}

//Handle the backend response to show the returned json message in the popup
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('form').addEventListener('submit', function() {
      event.preventDefault();

      var formData = new FormData(this);
      var currentRoute = getCurrentRoute();

      var xhr = new XMLHttpRequest();
      xhr.open('POST', currentRoute, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            const popupParagraph = document.getElementById("popupParagraph");
            const myPopup = document.getElementById("myPopup");
                if (xhr.status === 400) {
                popupParagraph.textContent = xhr.responseText;
            } 
            else if(xhr.status === 500){
                popupParagraph.textContent = xhr.responseText;
            }else if(xhr.status === 200) {
                window.location.href = '/index';
            }
            myPopup.style.display = 'block';
        }
      };
      xhr.send(new URLSearchParams(formData).toString());
    });
  });