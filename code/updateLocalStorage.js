"use strict"
export function updateLocalStorage(key, newObj) {
   // Отримання рядка JSON з localStorage за вказаним ключем
   const jsonString = localStorage.getItem(key);

   // Розбирання рядка JSON у масив, якщо він є, або ініціалізація порожнього масиву
   let dataArray = jsonString ? JSON.parse(jsonString) : [];

   // Додавання нового об'єкта до масиву
   dataArray.push(newObj);

   // Перетворення масиву на рядок JSON
   const updatedJsonString = JSON.stringify(dataArray);

   // Збереження оновленого рядка JSON в localStorage за вказаним ключем
   localStorage.setItem(key, updatedJsonString);
}


//Функція отримання даних з localStorage з захистом від нульового значення:
export function getDataFromLocalStorage(key) {
   const jsonString = localStorage.getItem(key);
   return jsonString ? JSON.parse(jsonString) : null;
}

//Функція збереження даних в localStorage:
export function saveDataToLocalStorage(key, data) {
   const jsonString = JSON.stringify(data);
   localStorage.setItem(key, jsonString);
}

//Функція видалення даних з localStorage:
export function removeDataFromLocalStorage(key) {
   localStorage.removeItem(key);
}

//Функція видалення всіх даних з localStorage:
function clearLocalStorage() {
   localStorage.clear();
}

//Функція перевірки підтримки localStorage в браузері:
function isLocalStorageSupported() {
   try {
      const testKey = "__test__";
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
   } catch (e) {
      return false;
   }
}

