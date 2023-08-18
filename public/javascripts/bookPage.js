let sidebarFilled = false;

if(userId) {
    document.addEventListener("DOMContentLoaded", function () {
    const cartBtns = document.querySelectorAll(".cartBtn");
    const cartBtn = document.getElementById("cartBtn");
    const cartItemsContainer = document.getElementById("cartItems");
    const bookId = cartBtn.getAttribute("data-book-id");
    const sidebar = document.getElementById('sidebar');
    const sidebarHeader = document.getElementById('sidebarHeader');
    const closeCart = document.getElementById("closeCart");
    const closeSidebarButton = document.querySelector(".closeSidebarButton");
    
    let subtotal = 0;
    
    cartBtns.forEach(cartBtn => {
      cartBtn.addEventListener("click", async () => {
        
          if (!sidebarFilled) {
            
        try {
            console.log(`/getCartItems?bookId${bookId}`)
            const response = await fetch(`/getCartItems/${bookId}`);
            console.log(response);
            const data = await response.json();
            console.log(data);

            sidebar.classList.add('active');

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

            data.forEach(item => {
                const book = item.book; 
                const quantity = item.quantity;

                const bookContainer = document.createElement("div");
                bookContainer.classList.add("bookContainer");

                const coverImg = document.createElement("img");
                coverImg.classList.add("coverImg");
                coverImg.src = `/images/bookCovers/${book.cover}`;
                coverImg.alt = book.title;
                coverImg.width = 130; 
                coverImg.height = 170;
                bookContainer.appendChild(coverImg);

                const bookDetailsContainer = document.createElement("div");
                bookDetailsContainer.classList.add("bookDetailsContainer");

                const bookDetail1 = document.createElement("div");
                bookDetail1.classList.add("bookDetail1");

                const bookDetail2 = document.createElement("div");
                bookDetail2.classList.add("bookDetail2");

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

                subtotal += book.price * quantity;;

                
            });

            bookRemoveNotice();

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
            payButton.href = "/officializePurchase";

            buyContainerDetails1.appendChild(buyContainerH2);
            buyContainerDetails1.appendChild(subtotalValue);
            buyContainerDetails2.appendChild(payButton);

            buyContainer.appendChild(buyContainerDetails1);
            buyContainer.appendChild(buyContainerDetails2);

            sidebar.appendChild(buyContainer);
            
            console.log(closeSidebarButton);
            closeSidebarButton.addEventListener("click", () => {
                sidebar.classList.remove('active');
            });
            sidebarFilled = true;

        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    }
    sidebar.classList.add('active');
    });
});
});
}

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