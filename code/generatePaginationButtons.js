"use strict"
import { showCard, scrollToTopSmoothly } from "./function.js";

const productItems = document.querySelector(".products__items");

export function generatePaginationButtons(obj,totalPages) {
   const paginationContainer = document.querySelector(".nav__list"); // Замініть на ваш селектор
   paginationContainer.innerHTML = ""; // Очистимо контейнер перед додаванням кнопок

   for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      const button = document.createElement("li");
      button.classList.add("nav__catalog-item");
      button.dataset.page = pageNumber;
      button.textContent = pageNumber;

      button.addEventListener("click", function () {
         const page = parseInt(this.getAttribute("data-page"));
         productItems.innerHTML = "";
         showCard(obj, page); // Викликайте showCard знову для оновлення вмісту
      });

      paginationContainer.appendChild(button);
   }
}
export function setActivePaginationButton(paginBtn,pageNumber) {
   paginBtn.forEach((button) => {
      if (button.dataset.page === pageNumber.toString()) {
         button.classList.add("_active-pagin");
         scrollToTopSmoothly();
      } else {
         button.classList.remove("_active-pagin");
      }
   });
}