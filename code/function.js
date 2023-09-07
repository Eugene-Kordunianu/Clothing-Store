
"use strict"
import { updateLocalStorage, saveDataToLocalStorage, getDataFromLocalStorage } from "./updateLocalStorage.js";
import { openCatalog, searchProducts } from "./searchProduct.js";
import { generatePaginationButtons, setActivePaginationButton } from "./generatePaginationButtons.js";

let isModalVisible = false; // Початково модальне вікно не видимеж

const productItems = document.querySelector(".products__items"),
   qBag = document.querySelector(".box__bag-pc > .quantity"),
   search = document.querySelector('.search__input'),
   qLike = document.querySelector(".box__like-pc > .quantit");

let localAllCart = "",
   localCart = localStorage.addCart;
localStorage.addCart ? localAllCart = JSON.parse(localCart) : console.log("not faund");

let localAllproduct = "",
   localItem = localStorage.allProduct;
localStorage.allProduct ? localAllproduct = JSON.parse(localItem) : console.log("not faund");

//SIDEBAR
const [...sideTitel] = document.querySelectorAll(".sidebar__titel");
sideTitel.forEach((e) => {
   e.addEventListener("click", () => {
      e.classList.toggle("_activ-sidebar");
      e.nextElementSibling.classList.toggle("_activ-sidebar");
   })
})

//Запит на уявний сервер Fetch
export async function loadProducts(url, listener) {
   try {
      const response = await fetch(url);
      if (response.ok) {
         const products = await response.json();
         listener(products);
         if (!localStorage.allProduct) {
            // updateLocalStorage('allProduct',products)
            localStorage.allProduct = JSON.stringify(products);
         }
      } else {
         console.error(response.status + " (Not Found)");
      }
   } catch (error) {
      console.error("Error:", error);
   }
}

// Показ карток
export function showCard(obj, page = 1) {
   productItems.innerHTML = "";
   if (obj) {
      let objectsPerPage = 10;
      let totalPages;
      // Розрахунок кількості сторінок
      totalPages = Math.ceil(obj.length / objectsPerPage);

      // Вивід об'єктів на поточній сторінці
      let startIndex = (page - 1) * objectsPerPage;
      let endIndex = startIndex + objectsPerPage;

      const card = obj.slice(startIndex, endIndex);
      const cardHtml = [card].map((o, i) => {
         // Генерація HTML-коду для кожного об'єкта
         return `
         ${o.map((o, i) => {
            return `
            <div class="products__item" id="${o.id}">
            <a href="#" class="products__imge">
            <img src=${o.url} alt="${o.name}">
            </a>
            <a href="#" class="products__name">${o.name}</a>
            <div class="product__rating"><img src="/svg/star.svg" alt="star"></div>
            <div class="product__price">As low as<span class="price-product">$${o.price.toFixed(2)}</span>
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
      }).join("");

      // Вивід на сторінці
      const nothingFound = `<div class="nothing-found">NOTHING FOUND</div>`
      if (document.location.pathname === "/catalog/index.html") {

         if (obj.length === 0) {
            productItems.insertAdjacentHTML("beforeend", nothingFound);
         } else {
            productItems.insertAdjacentHTML("beforeend", cardHtml);
         }
      } else if (document.location.pathname === "/like/index.html") {
         const localWishlist = getDataFromLocalStorage("Wishlist");
         qLike.textContent = !localWishlist ? "0" : localWishlist.length;//показуємо що не має ніяких продуктів
         if (obj.length === 0) {
            productItems.insertAdjacentHTML("beforeend", nothingFound);
         } else {
            productItems.insertAdjacentHTML("beforeend", cardHtml);
         }
      }
      //Пошук всіх карток
      searchCard();
      //пошук усіх кнопок
      searchBtnProductCard()
      // Створюємо Пагінацію
      generatePaginationButtons(obj, totalPages);
      // Встановлюємо активну кнопку
      const paginBtn = document.querySelectorAll(".nav__catalog-item");
      setActivePaginationButton(paginBtn, page);
   } else {
      const nothingFound = `<div class="nothing-found">NOTHING FOUND</div>`
      productItems.insertAdjacentHTML("beforeend", nothingFound)
      qLike.textContent = !localWishlist ? "0" : localWishlist.length;//показуємо що не має ніяких продуктів
   }
}
//Функція проскролювання до гори
export function scrollToTopSmoothly() {
   window.scrollTo({
      top: 0,
      behavior: 'smooth'//плавно
   });
}

//Відкривання карток в новій вкладці
export function openProductPage(product) {
   if (localStorage.productCard === undefined && localStorage.allProduct === undefined) {
      localStorage.productCard = JSON.stringify([product]);
   } else {
      localStorage.productCard = JSON.stringify([product]);
   }
   window.open("/product/index.html", "_blank"); // Відкриває в новій вкладці
}
//Пошук всіх карток 
export function searchCard() {
   const [...itemCard] = document.querySelectorAll(".products__item");
   itemCard.forEach((e) => {
      let img = e.firstElementChild; //Знайшли в картці фото
      let productName = e.firstElementChild.nextElementSibling;//Знайшли в картці назву

      //натиск на ім'я шукаєм співпадіння записуєм локал перекидуєм на сторінку продукту
      productName.addEventListener("click", (event) => {
         const productIndex = event.target.parentElement.id - 1;
         const localAllproduct = JSON.parse(localStorage.allProduct);
         const product = localAllproduct[productIndex];

         openProductPage(product);
      });

      //натиск на фото шукаєм співпадіння записуєм локал перекидуєм на сторінку продукту
      img.addEventListener("click", (event) => {
         const productIndex = event.target.offsetParent.parentElement.id - 1;
         const localAllproduct = JSON.parse(localStorage.allProduct);
         const product = localAllproduct[productIndex];
         openProductPage(product);
      });
   });
}
//Пошук кнопок та порівняння
export function searchBtnProductCard() {
   const [...allBtnAddToCart] = document.querySelectorAll(".add__tocart");
   allBtnAddToCart.forEach((e) => {
      e.addEventListener("click", (e) => {
         e.preventDefault();//Відміна кліку
         //Перевірка чи активне модальне вікно
         if (!isModalVisible) {
            // Перевірка чи користувач натиснув на іконк в середені кнопки 
            if (e.target.localName === 'img') {
               e.preventDefault();//перевірка якщо нажати на фото
            } else {
               showAndHideModal("Successfully added to cart!");
               qBag.textContent++ //збільшуємо кількість в кошику візуально 
               localAllproduct = getDataFromLocalStorage("allProduct");
               const localWishlist = getDataFromLocalStorage("Wishlist");
               if (document.location.pathname === "/catalog/index.html") {
                  let product = localAllproduct[e.target.id - 1];
                  updateLocalStorage("addCart", product);
               } else if (document.location.pathname === "/product/index.html") {
                  let product = localAllproduct[e.target.parentElement.parentElement.children[0].id - 1];
                  updateLocalStorage("addCart", product);
               } else if (document.location.pathname === "/") {
                  let product = localAllproduct[e.target.id - 1];
                  updateLocalStorage("addCart", product);
               } else if (document.location.pathname === "/like/index.html") {
                  qLike.textContent--;
                  let product = localAllproduct[e.target.id - 1];
                  const index = parseInt(e.target.id);

                  const updatedCartItems = localWishlist.filter(item => item.id !== index);
                  saveDataToLocalStorage("Wishlist", updatedCartItems);
                  updateLocalStorage("addCart", product);
                  showCard(updatedCartItems)
               }
            }
         }
      })
   })
}
//?Модальне вікно відкриття закриття
export function showAndHideModal(name) {

   ///<summary>
   ///Показ модалки з папки function
   ///</summary> 
   // Перевірка, чи модальне вікно видиме
   if (isModalVisible) {
      return; // Вийти, якщо вже видиме
   }

   isModalVisible = true; // Встановити флаг, що модальне вікно видиме

   // Відображення модального вікна
   const modal = document.getElementById("successModal");
   let modalContent = document.querySelector(".modal-content");
   modalContent.textContent = name;
   modal.style.display = "block";

   // Плавно з'явити модальне вікно
   setTimeout(() => modal.style.bottom = "0px", 100)// Змініть на відповідну відстань від низу

   // Закриття модального вікна через 2 секунду
   setTimeout(() => {
      // Плавно приховати модальне вікно
      modal.style.bottom = "-100px"; // Повернення в початкове положення
      setTimeout(() => {
         modal.style.display = "none";
         isModalVisible = false; // По закриттю модального вікна флаг повертається в false
      }, 1000); // Час анімації для закриття
   }, 1000);
}
// //? Філльтрація 
const size = document.querySelectorAll(".size__item");
const color = document.querySelectorAll("[data-color]");
const clerFilter = document.querySelector(".cler-filter");

clerFilter ? clerFilter.addEventListener("click", (e) => {
   if (selectedSizes.length === 0 && selectedColors.length === 0) {
   } else {

      // Скидаємо вміст обраних розмірів і кольорів
      selectedSizes = [];
      selectedColors = [];

      // Знаходимо всі елементи з класами "selected" і "selected-color" і видалимо ці класи
      size.forEach((e) => {
         e.classList.remove("selected");
      });

      color.forEach((e) => {
         e.classList.remove("selected-color");
      });
      // Знаходимо всі елементи з класами "_activ-sidebar" і "_activ-sidebar" і видаляємо ці класи
      sideTitel.forEach((e) => {
         e.classList.remove("_activ-sidebar");
         e.nextElementSibling.classList.remove("_activ-sidebar");
      })
      // Повторно застосовуємо фільтри
      applyFilters();
   }
}) : null;

let selectedSizes = []; // Масив для збереження обраних розмірів
let selectedColors = []; // Масив для збереження обраних кольорів

size.forEach((e) => {
   e.addEventListener("click", (size) => {
      let valueSize = parseFloat(size.target.innerText);
      e.classList.toggle("selected"); // Додати клас для зміни стилю
      toggleSelectedValue(selectedSizes, valueSize);
      // saveDataToLocalStorage("selectedSizes", selectedSizes);// Зберігаємо фільтри в Local Storage
      applyFilters();
   });
});

color.forEach((e) => {
   e.addEventListener("click", (el) => {
      let valueColor = el.target.dataset.color;
      e.classList.toggle("selected-color"); // Додати клас для зміни стилю
      toggleSelectedValue(selectedColors, valueColor);
      // saveDataToLocalStorage("selectedColors", selectedColors);// Зберігаємо фільтри в Local Storage
      applyFilters();
   });

});

const toggleSelectedValue = (selectedValues, value) => {
   if (!selectedValues.includes(value)) {
      selectedValues.push(value);
   } else {
      selectedValues.splice(selectedValues.indexOf(value), 1);
   }

};

export const applyFilters = () => {
   let data = getDataFromLocalStorage("allProduct");
   if (selectedSizes.length === 0 && selectedColors.length === 0) {
      showCard(data);
   } else {
      let filteredData = filterProducts(data, selectedSizes, selectedColors);
      showCard(filteredData);
   }
};

const filterProducts = (arr, sizes, colors) => {
   return arr.filter((el) => {
      const sizeMatch = sizes.length === 0 || sizes.some((size) => el.size.includes(size));
      const colorMatch = colors.length === 0 || colors.some((color) => el.colors.includes(color));

      return sizeMatch && colorMatch;
   });
};

//? Пошук + перекидання на сторінку каталогу
search.addEventListener("focus", openCatalog)
search ? search.addEventListener("input", searchProducts) : null;
