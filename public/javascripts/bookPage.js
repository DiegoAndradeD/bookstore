let sidebarFilled = false;

if(userId) {
    document.addEventListener("DOMContentLoaded", function () {
    const cartBtn = document.getElementById("cartBtn");
    const cartItemsContainer = document.getElementById("cartItems");
    const bookId = cartBtn.getAttribute("data-book-id");
    const sidebar = document.getElementById('sidebar');
    const sidebarHeader = document.getElementById('sidebarHeader');
    const closeCart = document.getElementById("closeCart");
    const closeSidebarButton = document.querySelector(".closeSidebarButton");
    
    let subtotal = 0;
    
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

                bookDetailsContainer.appendChild(bookDetail1);
                bookDetailsContainer.appendChild(bookDetail2);

                bookContainer.appendChild(coverImg);
                bookContainer.appendChild(bookDetailsContainer);
                sidebar.appendChild(bookContainer);

                subtotal += book.price * quantity;;

                sidebarFilled = true;
            });

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

        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    }
    sidebar.classList.add('active');
    });
});
}

document.addEventListener("DOMContentLoaded", function () {
    const buyNowText = document.getElementById('buyNowText');
    buyNowText.addEventListener('click', async (event) => {
      event.preventDefault();
      const route = buyNowText.getAttribute('href'); 
      const xhr = new XMLHttpRequest();
      xhr.open('GET', route, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          const popupParagraph = document.getElementById("popupParagraph");
          const myPopup = document.getElementById("myPopup");
          if (xhr.status === 200) {
            popupParagraph.textContent = xhr.responseText;
          } else if(xhr.status === 404) {
            popupParagraph.textContent = xhr.responseText;
          } else {
            popupParagraph.textContent = 'An error occurred.';
          }
          myPopup.style.display = 'block';

          setTimeout(() => {
            window.location.reload();
        }, 2000);
        }
      };
      xhr.send();
    });
  });