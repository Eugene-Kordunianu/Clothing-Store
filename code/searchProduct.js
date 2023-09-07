"use strict"
import { getDataFromLocalStorage } from "./updateLocalStorage.js";
import { showCard } from "./function.js";

// Пошук на сторінці
export function searchProducts() {
   let products = getDataFromLocalStorage("allProduct");
   let searchName = document.querySelector('.search__input').value;
   let searchRegExp = new RegExp(searchName, 'i'); // 'i' - ігнорувати регістр

   let results = products.filter(function (product) {
      return searchRegExp.test(product.name);
   });
   if (document.location.pathname === "/catalog/index.html") {
      showCard(results)
   } 
}
export function openCatalog() {
   if (document.location.pathname !== "/catalog/index.html") {
      document.location = "/catalog/index.html";
      
   }
}
