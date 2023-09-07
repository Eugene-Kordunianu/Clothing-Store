"use strict"
import { loadProducts, showCard, } from "/code/function.js";
import { showCardInCart } from "./showCardInCart.js";
import { showRandomCard } from "./showRandomCard.js";
import { showProductCard } from "./showProductCard.js";
import { useDynamicAdapt } from '/code/dynamicAdapt.js';
import { getDataFromLocalStorage } from "./updateLocalStorage.js"

const menuList = document.querySelector(".menu__list"),
   search = document.querySelector('.search__input'),
   qBag = document.querySelector(".box__bag-pc > .quantity"),
   qLike = document.querySelector(".box__like-pc > .quantit"),
   bag = document.querySelector(".box__bag-pc"),
   like = document.querySelector(".box__like-pc");
//? Показ в корзині локал...
let localAllCart = getDataFromLocalStorage("addCart");
let localWishlist = getDataFromLocalStorage("Wishlist");
//? Показ в продукті локал...
let productCard = getDataFromLocalStorage("productCard");
//?====DOCUMENT================================================================
document.addEventListener("DOMContentLoaded", () => {
   document.location.pathname === "/" ? (loadProducts("/json/index.json", showRandomCard)) : console.log("(~_~)ne ( / )");
   document.location.pathname === "/catalog/index.html" ?
      (loadProducts("/json/index.json", showCard), search.focus())
      : console.log("(~_~)ne catalog");
   document.location.pathname === "/cart/index.html" ? showCardInCart(localAllCart) : qBag.textContent = localAllCart ? localAllCart.length : 0//привязуємо кількість до довжини масиву якщо ми не в корзині
   document.location.pathname === "/like/index.html" ? showCard(localWishlist) : qLike.textContent = localWishlist ? localWishlist.length : 0//привязуємо кількість до довжини масиву якщо ми не в localWishlist
   document.location.pathname === "/product/index.html" ? showProductCard(productCard) : console.log("(~_~)ne product")
   useDynamicAdapt()//динамічний адаптив

})

//Перехід на сторінку Cart
bag.addEventListener("click", (e) => {
   document.location.pathname !== "/cart/index.html" ? document.location = "/cart/index.html" : console.log();
   /* if(document.location === "/cart/index.html") {
      preventDefault();
   } else {                                                       //! Як ліпше зробити у даному варіанті сторінка обновлюється.??
      document.location = "/cart/index.html";
   } */
})
//Перехід на сторінку like
like.addEventListener("click", (e) => {
   document.location.pathname !== "/like/index.html" ? document.location = "/like/index.html" : console.log();
})

menuList.addEventListener("click", (e) => {
   let eTtC = e.target.textContent;
   if (eTtC === "SHORTS" || eTtC === "PANTS" || eTtC === "SHIRTS") {
      document.location = "/catalog/index.html";
   } else if (e.target.className === "empty__like") {
      document.location = "/like/index.html";
   } else if (e.target.alt === "bag") {
      document.location = "/cart/index.html";
   }
})
//spoiler footer
const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach((item) => {
   const header = item.querySelector('.accordion-header');
   const content = item.querySelector('.accordion-content');

   header.addEventListener('click', (e) => {
      // Закриваємо всі спойлери, окрім активного
      accordionItems.forEach((otherItem) => {
         if (otherItem !== item) {
            otherItem.classList.remove('active');
         }
      });

      // Відкриваємо або закриваємо активний спойлер
      item.classList.toggle('active');
   });
});
