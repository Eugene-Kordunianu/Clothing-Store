"use strict"

const isMobile = {
   Android: function () {
      return navigator.userAgent.match(/Android/i);
   },
   BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
   },
   iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad}iPod/i);
   },
   Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
   },
   Window: function () {
      return navigator.userAgent.match(/IEMobile/i);
   },
   any: function () {
      return (
         isMobile.Android() ||
         isMobile.BlackBerry() ||
         isMobile.iOS() ||
         isMobile.Opera() ||
         isMobile.Window()
      );
   }
};

if (isMobile.any()) {
   document.body.classList.add("_touch");
} else {
   document.body.classList.add("_pc")
}

//Burger
const menuIcon = document.querySelector(".menu__icon");
if (menuIcon) {
   const menuBody = document.querySelector(".menu__body");
   menuIcon.addEventListener("click", function (e) {
      document.body.classList.toggle("_lock");
      menuIcon.classList.toggle("_active");
      menuBody.classList.toggle("_active");
   });
}

