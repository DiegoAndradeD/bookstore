document.addEventListener('DOMContentLoaded', function () {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/index', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        var books = JSON.parse(xhr.responseText);

        var highligth = document.getElementById('highligth');
        var index = 0;
        books.forEach((book, index) => {
          if (index < 5) {
            var itemElement = document.getElementById(`item${index + 1}`);

            var imgElement = document.createElement('img');
            imgElement.src = `/images/bookCovers/${book.cover}`;
            imgElement.classList.add('book-cover');

            itemElement.innerHTML = ''; 
            itemElement.appendChild(imgElement);
          }
        });
      }
    };
    xhr.send();
  });