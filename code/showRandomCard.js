"use strict"
import { searchBtnProductCard, searchCard } from "./function.js"

//?Рандомневиведення на головну сторінку
// Функція для отримання випадкового числа в заданому діапазоні
function getRandomInt(min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Функція для отримання випадкових об'єктів з масиву
export function getRandomObjectsFromArray(array, count) {
   if (array) {
      var randomObjects = [];
      var arrayCopy = array.slice(); // Копія масиву, щоб не змінювати оригінал
      for (var i = 0; i < count; i++) {
         var randomIndex = getRandomInt(0, arrayCopy.length - 1);
         randomObjects.push(arrayCopy[randomIndex]);
         arrayCopy.splice(randomIndex, 1); // Видаляємо вибраний об'єкт з копії масиву
      }
      return randomObjects;
   }
}

export function showRandomCard(obj) {
   let o = getRandomObjectsFromArray(obj, 4);
   const cardHtml =
      // Генерація HTML-коду для кожного об'єкта
      `${o.map((o, i) => {
         return `
         <div class="products__item" id="${o.id}">
         <a href="#" class="products__imge">
         <img src=${o.url} alt="${o.name}">
         </a>
         <a href="#" class="products__name">${o.name}</a>
         <div class="product__rating"><img src="/svg/star.svg" alt="star"></div>
         <div class="product__price">As low as<sapn class="price-product">$${o.price.toFixed(2)}</sapn>
         </div>
         <div class="product__color">
         ${o.colors.map((e) => {
            return `
            <div class="color" style="background-color: ${e};"></div>
            `
         }).join("")}
         </div>
         <a href="#" class="product__add-tocart  add__tocart"  id="${o.id}"><img src="/img/Add to cart.png" alt="cart">ADD TO CART</a>
         </div>
         `
      }).join("")}`

   if (document.location.pathname === "/") {
      const productItems = document.querySelector(".products__items");
      productItems.insertAdjacentHTML("beforeend", cardHtml);
   }
   //Пошук всіх карток
   searchCard();
   //пошук усіх кнопок
   searchBtnProductCard()
}