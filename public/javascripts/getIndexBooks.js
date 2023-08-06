document.addEventListener('DOMContentLoaded', function () {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/index', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      var response = JSON.parse(xhr.responseText);
      var trendingBooks = response.trendingBooks;
      var fantasyBooks = response.fantasyBooks;
      var adventureBooks = response.adventureBooks;



      var highligth = document.getElementById('highligth');
      var index = 0;
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

      fantasyBooks.forEach((book, index) => {
        var itemElement = document.getElementById(`item${index + 1}Fantasy`);
        var bookPrice = document.getElementById(`advItem${index + 1}Price`);
        itemElement.setAttribute('data-id', book._id);
        itemElement.classList.add('clickable');
        bookPrice.textContent = '$' + book.price + '.00';

        var imgElement = document.createElement('img');
        imgElement.src = `/images/bookCovers/${book.cover}`;
        imgElement.classList.add('book-cover');

        itemElement.innerHTML = '';
        itemElement.appendChild(imgElement);
      });

      adventureBooks.forEach((book, index) => {
        var itemElement = document.getElementById(`item${index + 1}Adventure`);
        var bookPrice =document.getElementById(`item${index + 1}Price`);
        console.log(bookPrice);
        itemElement.setAttribute('data-id', book._id);
        itemElement.classList.add('clickable');
        bookPrice.textContent = '$' + book.price + '.00';

        var imgElement = document.createElement('img');
        imgElement.src = `/images/bookCovers/${book.cover}`;
        imgElement.classList.add('book-cover');

        itemElement.innerHTML = '';
        itemElement.appendChild(imgElement);
      });

      var clickableElements = document.querySelectorAll('.clickable');
      clickableElements.forEach(function (element) {
        element.addEventListener('click', function () {
          var bookId = this.getAttribute('data-id');
          window.location.href = '/bookPageRedirect?id=' + bookId;
        });
      });

      const searchButton = document.getElementById('searchButton');
      const searchText = document.getElementById('searchText');
  
      searchButton.addEventListener('click', () => {
          const searchTerm = searchText.value.trim();
          if (searchTerm) {
              window.location.href = `/searchBook?searchText=${encodeURIComponent(searchTerm)}`;
          }
      });

    }
  };
  xhr.send();
});
