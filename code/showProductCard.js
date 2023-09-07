"use strict"
import { searchBtnProductCard } from "./function.js";
import { searchBtnAddToWishlist } from "./showCardInCart.js";

const productDetails = document.querySelector(".product__details"),
   bigFotto = document.querySelector(".big__fotto");

export function showProductCard(obj) {
   if (obj.length !== 0) {
      const fottoCard = `
      ${obj.map((o) => {
         return `
         <img src="${o.url}" alt="${o.name}">
         `
      })}
      `
      const card =
         `
         ${obj.map((o) => {
            return `
                  <div class="product__name" id="${o.id}">${o.name}
                     <span class="article">ITEM #${o.id}</span>
                  </div>
                  <div class="rating__card-product"><img src="/svg/star.svg" alt="star"><span class="reviews">93 REVIEWS</span>
                  </div>
                  <div class="box__price">
                     <span class="price__news">As low as</span>
                     <span class="price-prod">$${o.price.toFixed(2)}</span>
                  </div>
                  <div class="box__color">
                     <div class="title__color">COLOR:</div>
                     <div class="all__color">
                     ${o.colors.map((e) => {
               return `
                                                         <div class="color" style="background-color: ${e};"></div>
                                                         `
            }).join("")}
                     </div>
                  </div>
                  <div class="box__size">
                     <div class="title__size">SIZE:</div>
                     <div class="all__size">
                     ${o.size.map((e) => {
               return `
                                                         <div class="size__item">${e}</div>
                                                         `
            }).join("")}
                     </div>
                  </div>
                  <div class="box__button">
                     <button type="button" id="${o.id}" class="btn__cart add__tocart"><img src="/img-product/Vector cart.png"
                           alt="cart">ADD TO BAG</button>
                     <button type="button" id="${o.id}" class="btn__like add__like-title"><img src="/img-product/Vectorlov.png" alt="like">ADD TO
                        WISHLIST</button>
                  </div>
            `
         }).join("")}
      
   `
      document.location.pathname === "/product/index.html" ? productDetails.insertAdjacentHTML("afterbegin", card) : console.log("(+_+)");
      document.location.pathname === "/product/index.html" ? bigFotto.insertAdjacentHTML("afterbegin", fottoCard) : console.log("(-_-)");
   } else {
      console.log("немає що показувати в продукті");
   }
   searchBtnProductCard();
   searchBtnAddToWishlist();
}