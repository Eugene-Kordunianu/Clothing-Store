"use strict"
import { showAndHideModal, openProductPage } from "./function.js";
import { getDataFromLocalStorage, updateLocalStorage, saveDataToLocalStorage } from "./updateLocalStorage.js";
const cartProduct = document.querySelector(".product__box"),
   qBag = document.querySelector(".box__bag-pc > .quantity"),
   qLike = document.querySelector(".box__like-pc > .quantit"),
   paymentPrice = document.querySelector(".payment__price"),
   totalPrice = document.querySelector(".total__price"),
   counterCart = document.querySelector(".counter__cart");

let isModalVisible = false; // Початково модальне вікно не видимеж

export function showCardInCart(obj) {
   cartProduct.innerHTML = ""
   //Перевірка чи є що показувати
   if (obj) {
      const card = `
      ${obj.map((o) => {
         return `
         <div class="box__product-card" id="${o.id}">
                     <div class="box__fotto-card">
                        <div class="product__foto-card">
                           <img src=${o.url} id="${o.id}">
                        </div>
                     </div>
                     <div class="box__product-details">
                        <div class="box__card-name-price">
                           <div class="card__name" id="${o.id}">${o.name}</div>
                        <div class="card__price">$${o.price.toFixed(2)}</div>
                        </div>
                        <div class="card__box-color">
                           <div class="item__color">Color</div>
                           <div class="color__name">${o.colors.map((e) => {
            return `
                                             <div class="color" style="background-color: ${e};"></div>
                                             `
         }).join("")}</div>
                        </div>
                        <div class="card__box-size">
                           <div class="item__siaze">Size</div>
                           <div class="size__value">${o.size.map((e) => {
            return `
                                             <div class="size__item">${e}</div>
                                             `
         }).join("")}</div>
                        </div>
                        <div class="box__prise-counter">
                           <div class="item__prise">Price <span class="new__price"></span><span class="old__price">$${o.price.toFixed(2)}</span>
                              
                           </div>
                           <div class="price-counter">
                              <button type="button" class="box__sub"><span class="sub"></span></button>
                              <div class="box__value">1</div>
                              <button type="button" class="box__add"><span class="add"></span></button>
                           </div>
                        </div>
                        <div class="box__variants">
                           <div class="box__remuve-like">
                              <div class="remuve__title" id="${o.id}"><span class="remuve"></span><div class="title">Remuve</div></div>
                              <div class="add__like-title" id="${o.id}"><span class="add__like"><img src="/svg/empty-like.svg" alt=""></span>ADD TO WISHLIST
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
         
         `
      }).join("")}
   `
      let totalSum = Number;
      const nothingFound = `<div class="nothing-found">NOTHING FOUND</div>`
      if (document.location.pathname === "/cart/index.html") {
         if (obj.length === 0) {
            cartProduct.insertAdjacentHTML("beforeend", nothingFound);
         } else {
            cartProduct.insertAdjacentHTML("beforeend", card);
         }
      }
      qBag.textContent = obj.length;//показуємо що є продукт
      counterCart.textContent = obj.length//показуємо скільки продуктів у спані

      const boxValueElements = document.querySelectorAll(".box__value"); // Отримайте всі елементи box__value
      const oldPriceElements = document.querySelectorAll(".old__price"); // Отримайте всі елементи, де ви відображаєте ціну товару
      const cardPriceElements = document.querySelectorAll(".card__price"); // Отримайте всі елементи, де ви відображаєте ціну товару
      const addButtons = document.querySelectorAll(".box__add"); // Отримайте всі кнопки box__add

      addButtons.forEach((addButton, index) => {
         addButton.addEventListener("click", () => {
            let currentValue = parseInt(boxValueElements[index].textContent); // Парсимо поточне значення як ціле число
            currentValue++; // Збільшуємо значення на 1
            boxValueElements[index].textContent = currentValue; // Оновлюємо відображене значення в HTML

            // Оновлюємо ціну на основі нового значення box__value та ціни одиниці товару
            const unitPrice = parseFloat(oldPriceElements[index].textContent.slice(1)); // Отримуємо ціну одиниці товару
            const newTotalPrice = (currentValue * unitPrice).toFixed(2); // Розраховуємо нову суму і заокруглюємо до 2 знаків після коми
            cardPriceElements[index].textContent = `$${newTotalPrice}`; // Оновлюємо відображену ціну в HTML
            // Оновлюємо загальну суму після зменшення кількості товарів
            updateTotalPrice()
            updateQbagTC()
         });
      });
      const subButtons = document.querySelectorAll(".box__sub"); // Отримайте всі кнопки box__sub
      subButtons.forEach((subButton, index) => {
         subButton.addEventListener("click", () => {
            let currentValue = parseInt(boxValueElements[index].textContent); // Парсимо поточне значення як ціле число
            if (currentValue > 1) {
               currentValue--; // Зменшуємо значення на 1, але не допускаємо його падіння нижче 1
               boxValueElements[index].textContent = currentValue; // Оновлюємо відображене значення в HTML
               // Оновлюємо ціну на основі нового значення box__value та ціни одиниці товару
               const unitPrice = parseFloat(oldPriceElements[index].textContent.slice(1)); // Отримуємо ціну одиниці товару
               const newTotalPrice = (currentValue * unitPrice).toFixed(2); // Розраховуємо нову суму і заокруглюємо до 2 знаків після коми
               cardPriceElements[index].textContent = `$${newTotalPrice}`; // Оновлюємо відображену ціну в HTML
               // Оновлюємо загальну суму після зменшення кількості товарів
               updateTotalPrice()
               updateQbagTC()
            }
         });
      });
      function updateQbagTC() {
         let newTotalSum = 0;
         boxValueElements.forEach((value) => {
            const unitPrice = parseFloat(value.textContent);
            newTotalSum += unitPrice;
         })
         qBag.textContent = newTotalSum
         counterCart.textContent = newTotalSum
      }
      function updateTotalPrice() {
         let newTotalSum = 0;
         cardPriceElements.forEach((priceElement) => {
            const unitPrice = parseFloat(priceElement.textContent.slice(1));
            newTotalSum += unitPrice;
         });

         paymentPrice.textContent = `$${newTotalSum.toFixed(2)}`;
         totalPrice.textContent = `$${newTotalSum.toFixed(2)}`;
      }
      updateTotalPrice();
      updateQbagTC()
      searchBtnAddToWishlist();
      searchBtnRemuveTitle();
      searchImgAndName();
   } else {
      const nothingFound = `<div class="nothing-found">NOTHING FOUND</div>`
      cartProduct.insertAdjacentHTML("beforeend", nothingFound)
      qBag.textContent = !obj ? "0" : obj.length;//показуємо що не має ніяких продуктів
   }
}
export function searchBtnAddToWishlist() {
   const [...allBtnAddToWishlist] = document.querySelectorAll(".add__like-title");
   allBtnAddToWishlist.forEach((e) => {
      e.addEventListener("click", (e) => {
         e.preventDefault();//Відміна кліку
         //Перевірка чи активне модальне вікно
         if (!isModalVisible) {
            // Перевірка чи користувач натиснув на іконк в середені кнопки 
            if (e.target.localName === 'img') {
               e.preventDefault();//перевірка якщо нажати на фото
            } else {
               showAndHideModal("successfully added to wishlist!");

               // Отримати id елемента 
               if (document.location.pathname === "/cart/index.html") {
                  qBag.textContent-- //зменшуємо кількість в кошику візуально 
                  qLike.textContent++//збільшуємо кількість в like візуально
                  const index = parseInt(e.target.id);
                  const localAllAddCard = getDataFromLocalStorage("addCart");
                  const localAllproduct = getDataFromLocalStorage("allProduct");
                  // Видаляємо елемент із масиву localAllproduct за індексом
                  let product = localAllproduct[e.target.id - 1];
                  // Використовуємо метод filter для створення нового масиву без об'єкта, який потрібно видалити
                  const updatedCartItems = localAllAddCard.filter(item => item.id !== index);
                  // Оновлюємо дані в localStorage
                  updateLocalStorage("Wishlist", product);
                  saveDataToLocalStorage("addCart", updatedCartItems);
                  showCardInCart(updatedCartItems);
               } else if (document.location.pathname === "/product/index.html") {
                  showAndHideModal("successfully added to wishlist!");
                  qLike.textContent++//збільшуємо кількість в like візуально
                  const localAllproduct = getDataFromLocalStorage("allProduct");
                  // Видаляємо елемент із масиву localAllproduct за індексом
                  let product = localAllproduct[e.target.id - 1];
                  updateLocalStorage("Wishlist", product);
               }
            }
         }
      })
   })
}
function searchBtnRemuveTitle() {
   const [...allBtnRemuveTitle] = document.querySelectorAll(".remuve__title");
   allBtnRemuveTitle.forEach((e) => {
      e.addEventListener("click", (e) => {
         e.preventDefault();//Відміна кліку
         //Перевірка чи активне модальне вікно
         if (!isModalVisible) {
            qBag.textContent--; //зменшуємо кількість в кошику візуально 
            showAndHideModal("the product has been successfully removed!");
            if (e.target.parentElement.id || e.target.id) {
               let index = e.target.id ? parseInt(e.target.id) : parseInt(e.target.parentElement.id)
               const localAllAddCard = getDataFromLocalStorage("addCart");
               const updatedCartItems = localAllAddCard.filter(item => item.id !== index);
               saveDataToLocalStorage("addCart", updatedCartItems);
               showCardInCart(updatedCartItems);
            }
         }
      })
   })
}
function openProduct(productIndex) {
   let localAllProduct = getDataFromLocalStorage("allProduct");
   let product = localAllProduct[productIndex];
   openProductPage(product);
}
function searchImgAndName() {
   // const [...card] = document.querySelectorAll(".box__product-card");
   let [...img] = document.querySelectorAll(".product__foto-card>img");
   let cardName = document.querySelectorAll(".card__name");

   img.forEach((e) => {
      e.addEventListener("click", (e) => {
         openProduct(e.target.id - 1);
      })
   })
   cardName.forEach((e) => {
      e.addEventListener("click", (e) => {
         openProduct(e.target.id - 1);
      })
   })


}