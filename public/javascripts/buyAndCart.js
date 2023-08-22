/*
  This script is responsible for handling the cart and buy buttons as well its functionalities
  It's used in the books individual page, favorites page and search results page
*/

/* 
  This variable is for checking if the sidebar is filled. 
  It impedes the sidebar of getting duplicate fields when the click action is executed
*/
let sidebarFilled = false;

//The cart button will only works if the user is logged, therefore having his id present in the session
if(userId) {
    document.addEventListener("DOMContentLoaded", function () {
    //Getting fields and values from the html page
    const cartBtns = document.querySelectorAll(".cartBtn");
    const cartBtn = document.getElementById("cartBtn");
    const cartItemsContainer = document.getElementById("cartItems");
    const bookId = cartBtn.getAttribute("data-book-id");
    const sidebar = document.getElementById('sidebar');
    const sidebarHeader = document.getElementById('sidebarHeader');
    const closeCart = document.getElementById("closeCart");
    const closeSidebarButton = document.querySelector(".closeSidebarButton");
    
    let subtotal = 0;
    
    /*
      Iteration responsible for, responding to all cart buttons, fetching the backend on the corresponding route
       to get the book data stored in the logged in user's cart and populating the sidebar with them
    */
       async function populateSidebar() { if (!sidebarFilled) {
      
        try {
          //Fetching the backend to get the book in user cart data
            console.log(`/getCartItems?bookId${bookId}`)
            const response = await fetch(`/getCartItems/${bookId}`);
            console.log(response);
            const data = await response.json();
            console.log(data);

            sidebar.classList.add('active');

            //Creating the elements of the sidebar header.
            const closeSidebarButton = document.createElement("button");
            const closeArrow = document.createElement("img");
            const message = document.createElement("h3");
            message.innerHTML = "Your Cart";
            message.classList.add("cartMessage");
            closeArrow.src = "/images/CartArrow.svg";
            closeSidebarButton.classList.add("closeSidebarButton");
            closeSidebarButton.appendChild(closeArrow);
            sidebarHeader.appendChild(closeSidebarButton);
            sidebarHeader.appendChild(message);

            //Iteration over each item inside the data returned from the backend
            data.forEach(item => {
                /* 
                  For each book, it will be created its container with corresponding data
                  Some css may be aplied here
                */
                const book = item.book; 
                const quantity = item.quantity;

                //Container to each book in the cart
                const bookContainer = document.createElement("div");
                bookContainer.classList.add("bookContainer");

                //Creation and append of book cover
                const coverImg = document.createElement("img");
                coverImg.classList.add("coverImg");
                coverImg.src = `/images/bookCovers/${book.cover}`;
                coverImg.alt = book.title;
                coverImg.width = 130; 
                coverImg.height = 170;
                bookContainer.appendChild(coverImg);

                //Container for book details
                const bookDetailsContainer = document.createElement("div");
                bookDetailsContainer.classList.add("bookDetailsContainer");

                //Divs to store the book details, appended in the bookDetailsContainer
                const bookDetail1 = document.createElement("div");
                bookDetail1.classList.add("bookDetail1");

                const bookDetail2 = document.createElement("div");
                bookDetail2.classList.add("bookDetail2");

                // Book parameters created and apended to details containers
                const titlePara = document.createElement("p");
                titlePara.textContent = book.title;
                bookDetail1.appendChild(titlePara);
                
                const authorPara = document.createElement("p");
                authorPara.textContent = `Author: ${book.author}`;
                bookDetail2.appendChild(authorPara);

                const quantityPara = document.createElement("p");
                quantityPara.textContent = `Quantity: ${quantity}`;
                bookDetail2.appendChild(quantityPara);

                const pricePara = document.createElement("p");
                pricePara.textContent = `$${book.price}.00`;
                pricePara.style.color = "#F9784B"
                bookDetail1.appendChild(pricePara);

                //Button to remove book from cart
                const removeBookBtn = document.createElement("a")
                removeBookBtn.id = 'removeBookBtn';
                removeBookBtn.classList.add("removeBookBtn");
                removeBookBtn.setAttribute("href", `/removeBookFromCart/${book._id}`);

                const removeBookImg = document.createElement('img');
                removeBookImg.src = '/images/TRASH.svg';
                removeBookImg.alt = 'Remove Book';

                removeBookBtn.appendChild(removeBookImg);
                
                bookDetailsContainer.appendChild(bookDetail1);
                bookDetailsContainer.appendChild(bookDetail2);
                bookDetailsContainer.appendChild(removeBookBtn);

                bookContainer.appendChild(coverImg);
                bookContainer.appendChild(bookDetailsContainer);
                sidebar.appendChild(bookContainer);

                //Defines the subtotal of all the books inserted in the user's cart
                subtotal += book.price * quantity;;

                
            });

            //Call to function responsible for the book remove button message
            bookRemoveNotice();

            //Creation and append of the buy container items
            const buyContainer = document.createElement("div");
            buyContainer.classList.add("buyContainer");

            const buyContainerDetails1 = document.createElement("div");
            buyContainerDetails1.classList.add("buyContainerDetails1");

            const buyContainerDetails2 = document.createElement("div");
            buyContainerDetails2.classList.add("buyContainerDetails2");

            const buyContainerH2 = document.createElement("h2");
            buyContainerH2.innerHTML = "Subtotal:";
            const subtotalValue = document.createElement("h2");
            subtotalValue.classList.add("subtotalValue");
            subtotalValue.innerHTML = "R$" + subtotal + ",00";
            const payButton = document.createElement("a");
            payButton.innerHTML = "Pay";
            payButton.id = 'payButton';

            const bookContainers = document.querySelectorAll(".bookContainer");
              if (bookContainers.length === 0) {
                payButton.addEventListener("click", function(event) {
                  event.preventDefault();
                  
                    const popupParagraph = document.getElementById("popupParagraph");
                    const myPopup = document.getElementById("myPopup");
                    popupParagraph.textContent = "empty cart";
                    myPopup.style.display = 'block';
                });
              }
              

            payButton.href = "/officializePurchase";

            buyContainerDetails1.appendChild(buyContainerH2);
            buyContainerDetails1.appendChild(subtotalValue);
            buyContainerDetails2.appendChild(payButton);

            buyContainer.appendChild(buyContainerDetails1);
            buyContainer.appendChild(buyContainerDetails2);

            

            sidebar.appendChild(buyContainer);
            
            console.log(closeSidebarButton);

            //Close sidebar button event listener
            closeSidebarButton.addEventListener("click", () => {
                sidebar.classList.remove('active');
            });

            //Makes the sidebar filled to not duplicate new elements
            sidebarFilled = true;

        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    } 



    sidebar.classList.add('active');}
    cartBtns.forEach(cartBtn => {
      cartBtn.addEventListener("click", populateSidebar);
});
});
}

//Buy now button message handling
document.addEventListener("DOMContentLoaded", function () {
  const buyNowTexts = document.querySelectorAll(".buyNowText"); 

  buyNowTexts.forEach(buyNowText => {
      buyNowText.addEventListener('click', async (event) => {
          event.preventDefault();
          const route = buyNowText.getAttribute('href');
          const xhr = new XMLHttpRequest();
          xhr.open('GET', route, true);
          xhr.onreadystatechange = function () {
              if (xhr.readyState === XMLHttpRequest.DONE) {
                  console.log(xhr.status);
                  const popupParagraph = document.getElementById("popupParagraph");
                  const myPopup = document.getElementById("myPopup");
                  if (xhr.status === 200) {
                      popupParagraph.textContent = xhr.responseText;
                  } else if (xhr.status === 404) {
                      popupParagraph.textContent = xhr.responseText;
                  } else {
                      popupParagraph.textContent = 'An error occurred.';
                  }
                  myPopup.style.display = 'block';

                  setTimeout(() => {
                      window.location.reload();
                  }, 1000);
              }
          };
          xhr.send();
      });
  });
});

//This function handle the message returned from the backend of the click event of the remove book from cart buttons
function bookRemoveNotice() {
    const removeBookBtns = document.querySelectorAll(".removeBookBtn");
    console.log("Number of removeBookBtns:", removeBookBtns.length)
    removeBookBtns.forEach(removeBookBtn => {
        console.log("here2");
        removeBookBtn.addEventListener('click', async (event) => {
            event.preventDefault();
            const route = removeBookBtn.getAttribute('href');
            const xhr = new XMLHttpRequest();
            xhr.open('GET', route, true);
            xhr.onreadystatechange = function () {
              if (xhr.readyState === XMLHttpRequest.DONE) {
                console.log(xhr.status);
                const popupParagraph = document.getElementById("popupParagraph");
                const myPopup = document.getElementById("myPopup");
                if (xhr.status === 200) {
                  popupParagraph.textContent = xhr.responseText;
                } else if (xhr.status === 404) {
                  popupParagraph.textContent = xhr.responseText;
                } else {
                  popupParagraph.textContent = 'An error occurred.';
                }
                myPopup.style.display = 'block';
      
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }
            };
            xhr.send();
          });
        });
}

