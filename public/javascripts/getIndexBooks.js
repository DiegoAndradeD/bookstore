// Proceding to get put the book covers into image containers;

document.addEventListener('DOMContentLoaded', function () {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/index', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {

      //Variables

      var response = JSON.parse(xhr.responseText);
      var trendingBooks = response.trendingBooks;
      var fantasyBooks = response.fantasyBooks;
      var adventureBooks = response.adventureBooks;

      var fantasyBooksIds = [];
      var adventureBooksIds = [];

      var favLinks = document.querySelectorAll('.favLinks');
      var favLinks2 = document.querySelectorAll('.favLinks2');

      const searchButton = document.getElementById('searchButton');
      const searchText = document.getElementById('searchText');

      //Place the Trending books in the container images

      trendingBooks.forEach((book, index) => {
        if (index < 5) {
          var itemElement = document.getElementById(`item${index + 1}`);
          
          itemElement.setAttribute('data-id', book._id);
          itemElement.classList.add('clickable');

          var imgElement = document.createElement('img');
          imgElement.src = `/images/bookCovers/${book.cover}`;
          imgElement.classList.add('book-cover');

          itemElement.innerHTML = ''; 
          itemElement.appendChild(imgElement);
        }
      });
      
      // Place the Fantasy books in the container images

      fantasyBooks.forEach((book, index) => {
        var itemElement = document.getElementById(`item${index + 1}Fantasy`);
        var bookPrice = document.getElementById(`advItem${index + 1}Price`);
        
        fantasyBooksIds.push(book._id);

        itemElement.setAttribute('data-id', book._id);
        itemElement.classList.add('clickable');
        bookPrice.textContent = '$' + book.price + '.00';

        var imgElement = document.createElement('img');
        imgElement.src = `/images/bookCovers/${book.cover}`;
        imgElement.classList.add('book-cover');

        itemElement.innerHTML = '';
        itemElement.appendChild(imgElement);
      });

    //Updating the href from the fantasy books links for them to carry the books ids

      for (let i = 0; i < favLinks.length; i++) {
        if (fantasyBooksIds[i]) {
          favLinks[i].setAttribute('href', favLinks[i].getAttribute('href') + fantasyBooksIds[i]);
        } 
        console.log('Novo href:', favLinks[i].getAttribute('href'));
    }

    // Place the Adventure books in the container images

      adventureBooks.forEach((book, index) => {
        var itemElement = document.getElementById(`item${index + 1}Adventure`);
        var bookPrice =document.getElementById(`item${index + 1}Price`);

        adventureBooksIds.push(book._id);

        itemElement.setAttribute('data-id', book._id);
        itemElement.classList.add('clickable');
        bookPrice.textContent = '$' + book.price + '.00';

        var imgElement = document.createElement('img');
        imgElement.src = `/images/bookCovers/${book.cover}`;
        imgElement.classList.add('book-cover');

        itemElement.innerHTML = '';
        itemElement.appendChild(imgElement);

      });
      
      //Updating the href from the adventure books links for them to carry the books ids

        for (let i = 0; i < favLinks2.length; i++) {
          if (adventureBooksIds[i]) {
            favLinks2[i].setAttribute('href', favLinks2[i].getAttribute('href') + adventureBooksIds[i]);
          } 
          console.log('Novo href:', favLinks2[i].getAttribute('href'));
      }

      //Add an click event to the elements with the clickable class
      //Redirecting the to their book page after being clicked

      var clickableElements = document.querySelectorAll('.clickable');
      clickableElements.forEach(function (element) {
        element.addEventListener('click', function () {
          var bookId = this.getAttribute('data-id');
          window.location.href = '/bookPageRedirect?id=' + bookId;
        });
      });

      
      //Add a click event to the search button and update it's href location to search by the user input

      searchButton.addEventListener('click', () => {
          const searchTerm = searchText.value.trim();
          if (searchTerm) {
              window.location.href = `/searchBook?searchText=${encodeURIComponent(searchTerm)}`;
          }
      });

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

    }
  };
  xhr.send();
});
