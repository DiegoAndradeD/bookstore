/* This function is called when the DOM content is loaded (DOMContentLoaded event).
  It sends a POST request to the '/index' route using XMLHttpRequest to retrieve book data in JSON format.
  Upon receiving the response, it processes the data and performs various operations that are commented bellow
  Some other functions are defined and will be commented ahead
*/
initializePage();

/*
  This function is responsible for receive the books data from the backend:
*/
function initializePage() {
  document.addEventListener('DOMContentLoaded', function () {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/index', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
      var response = JSON.parse(xhr.responseText);
          
        //Variables
        var response = JSON.parse(xhr.responseText);
        const trendingBooks = response.trendingBooks;
        const fantasyBooks = response.fantasyBooks;
        const adventureBooks = response.adventureBooks;
        
        var fantasyBooksIds = [];
        var adventureBooksIds = [];
        
        var favLinks = document.querySelectorAll('.favLinks');
        var favLinks2 = document.querySelectorAll('.favLinks2');
        
        const searchButton = document.getElementById('searchButton');
        const searchText = document.getElementById('searchText');

        // This function is responsible for inserting the trendingBooks covers in the html image containers
        function processTrendingBooks(books) {
          books.forEach((book, index) => {
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
        }
        
        processTrendingBooks(trendingBooks);
        processBooksAndLinks(fantasyBooks, fantasyBooksIds, 'Fantasy', favLinks);
        processBooksAndLinks(adventureBooks, adventureBooksIds, 'Adventure', favLinks2);
        setupClickHandlers();


        /*
          This function is responsible for:
            - Insert the prices for the fantasy and adventure books
            - Add the ids from the correspondent books passed as parameters
            - Add the 'clickable' class to the element, making it clickable
            - Define the content of the books prices
            - Insert the book cover to it's html container
        */
        function processBooksAndLinks(books, idsArray, idPrefix, favLinksArray) {
          books.forEach((book, index) => {
            var itemElement = document.getElementById(`item${index + 1}${idPrefix}`);
            var bookPrice = document.getElementById(`item${index + 1}${idPrefix}Price`); 
        
            idsArray.push(book._id);
        
            itemElement.setAttribute('data-id', book._id);
            itemElement.classList.add('clickable');
            bookPrice.textContent = '$' + book.price + '.00';
        
            var imgElement = document.createElement('img');
            imgElement.src = `/images/bookCovers/${book.cover}`;
            imgElement.classList.add('book-cover');
        
            itemElement.innerHTML = '';
            itemElement.appendChild(imgElement);
          });
        
          for (let i = 0; i < favLinksArray.length; i++) {
            if (idsArray[i]) {
              favLinksArray[i].setAttribute('href', favLinksArray[i].getAttribute('href') + idsArray[i]);
            }
          }
        }

        //Add an click event to the elements with the clickable class
        //Redirecting the to their book page after being clicked

        /*
          This function is responsible for: 
            - configuring click event handlers for clickable elements on the page.
            - It  adds a click event to each element.
            - Each clickable element will have an event handler that calls the redirectToBookPage() function when clicked.
            - In addition, a click event is also assigned to the search button (searchButton), which calls the performSearch() function.
        */
        function setupClickHandlers() {
          var clickableElements = document.querySelectorAll('.clickable');
          clickableElements.forEach(function (element) {
            element.addEventListener('click', redirectToBookPage);
          });
        
          searchButton.addEventListener('click', performSearch);
        }

        /* 
          This function is responsible for:
            - be called when the clickable element is clicked .
            - It gets the data-id attribute value of the clicked element using
            - Redirect the browser to a book-specific page, passing the bookId as a parameter in the URL, using the window.location.href.
        */
        function redirectToBookPage() {
          var bookId = this.getAttribute('data-id');
          window.location.href = '/bookPageRedirect?id=' + bookId;
        }
        
        /*
          This function is responsible for:
           - Extract the value of the search text field (searchText).
           - If the search term is not empty, redirects the browser to a search results page, passing the search term as a parameter in the URL.
           - The search term is encoded using encodeURIComponent() to ensure special characters are handled correctly in the URL.
        */
        function performSearch() {
          const searchTerm = searchText.value.trim();
          if (searchTerm) {
              window.location.href = `/searchBook?searchText=${encodeURIComponent(searchTerm)}`;
          }
        }        
      }
    };
    xhr.send();
  });
}

// load event listener to configure the behavior that the favorite link should take
//It's behavior depends on if the user is logged in or not

document.addEventListener("DOMContentLoaded", initializeHighlightElements);

/* 
  This function is responsible for:
    - Select various highlightElements components
    - Check if the page has the favorite links in their respective containers
    - Chek if the user is logged by getting it's id
    - If the user is logged, the href of the link is changed to a route for favoriting a book
    - If the user is not logged, the favlink receives a class name to "popupClick", that will be used to show a message
    - The popup will then be responsible to show messages.
*/
function initializeHighlightElements() {
  const highlightChildElements = document.querySelectorAll(".highligthChildElememt");
  const body = document.querySelector('body');
  const userId = body.getAttribute('data-user-id');

  highlightChildElements.forEach(highlightChildElement => {
    const favLinks = highlightChildElement.querySelector('.favLinks');
    const favLinks2List = highlightChildElement.querySelectorAll('.favLinks2');
    const p = highlightChildElement.querySelector('.favImg');
    const img = document.createElement("img");

    if (favLinks) {
      if (userId) {
        favLinks.href = `/user/${userId}/favorite/`;
      } else {
        favLinks.className = "popupClick";
        favLinks.href = "#";
      }
    }

    favLinks2List.forEach(favLink2 => {
      if (userId) {
        favLink2.href = `/user/${userId}/favorite/`;
      } else {
        favLink2.className = "popupClick";
        favLink2.href = "#";
      }
    });

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

    img.src = "images/favorite.svg";
    img.alt = "";

    p.appendChild(img);
  });
}


/* 
  This function is responsible for:
    - When a favorite link (favLink) is clicked, the event handler is triggered.
    - It calls event.preventDefault() to prevent the link's default navigation behavior.
    - It gets the href attribute value of the link using link.getAttribute('href'), which is the route to which the GET request will be sent.
    - It then creates a new instance of XMLHttpRequest and opens an asynchronous GET request to the specified route.
    - The onreadystatechange function is defined to handle the state of the request. When the request is complete (xhr.readyState === XMLHttpRequest.DONE), 
        it checksthe status of the response.
    - If the status is 201, the response content (xhr.responseText) is displayed in the popupParagraph element.
    - If the status is different from 201, it displays an error message.
    - Finally, it displays the myPopup element to show the content of the response or error message.

*/
function handleFavLinkClick(link) {
  return async (event) => {
    event.preventDefault();
    const route = link.getAttribute('href');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', route, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 201) {
          popupParagraph.textContent = xhr.responseText;
        } else {
          popupParagraph.textContent = 'An error occurred.';
        }
        myPopup.style.display = 'block';
      }
    };
    xhr.send();
  };
}

document.addEventListener("DOMContentLoaded", initializeFavoriteLinks);

/* 
  This function is responsible for:
    - It selects all elements with class favLinks and favLinks2.
    - For each of these elements, it adds a click event listener that calls the handleFavLinkClick(link) function.
    - Basically, whenever a favorite link is clicked, the handleFavLinkClick function is invoked to handle the action.
*/
function initializeFavoriteLinks() {
  const favLinks = document.querySelectorAll('.favLinks');
  favLinks.forEach(link => {
    link.addEventListener('click', handleFavLinkClick(link));
  });

  const favLinks2List = document.querySelectorAll('.favLinks2');
  favLinks2List.forEach(link => {
    link.addEventListener('click', handleFavLinkClick(link));
  });
}





