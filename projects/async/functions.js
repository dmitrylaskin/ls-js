/* ДЗ 5 - Асинхронность и работа с сетью */

/*
 Задание 1:

 Функция должна возвращать Promise, который должен быть разрешен через указанное количество секунд

 Пример:
   delayPromise(3) // вернет promise, который будет разрешен через 3 секунды
 */
function delayPromise(seconds) {
  seconds *= 1000
  return new Promise(resolve => setTimeout(() => resolve(), seconds))
}

/*
 Задание 2:

 2.1: Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов можно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json

 2.2: Элементы полученного массива должны быть отсортированы по имени города

 Пример:
   loadAndSortTowns().then(towns => console.log(towns)) // должна вывести в консоль отсортированный массив городов
 */

function loadAndSortTowns() {
  let url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json'
  return fetch(url)
    .then(response => response.json())
    .then(cities => cities.sort((a, b) => a.name > b.name ? 0 : -1))
}
export { delayPromise, loadAndSortTowns };
