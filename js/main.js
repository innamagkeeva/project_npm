import UI from './ui.js'
import { apiKey, serverUrl } from './const.js'

// Импортируем нужную функцию
import { format } from 'date-fns'

// Создаем объект даты
const date = new Date(2023, 9, 25, 14, 30) // 2023-10-25 14:30

// Форматируем дату
const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss')
console.log(formattedDate) // Вывод: "2023-10-25 14:30:00"

// Другие примеры форматирования
const formattedDate2 = format(date, 'MM/dd/yyyy')
console.log(formattedDate2) // Вывод: "10/25/2023"

const formattedDate3 = format(date, 'EEEE, MMMM do, yyyy')
console.log(formattedDate3) // Вывод: "Wednesday, October 25th, 2023"

let favoriteCities = [] // создали переменную, в которую поместили пустой массив для добавления городов

loadCitiesFromLocalStorage() //при перезагрузки сразу выз-ся функ, кот загружает города из хранилища

UI.FORM.addEventListener('submit', getCityNameForRequest) // вешаю обр соб на форму, и при нажатии на поиск или enter выз-ся функ getCityName
UI.FOOTER_BUTTON.addEventListener('click', addCityToFavorites) // вешаю обр соб на кнопку футера, и при нажатии на нее выз-ся функ getCityName
UI.CLOSE_BUTTON.addEventListener('click', closePopup)

// Функция, которая которая берет название города , введенного в input. подставляет его в url адрес и отправляет на сервер. и получает ответ с данными погоды.
function getCityNameForRequest(e) {
  e.preventDefault() // отмена перезагрузки страницы

  const cityName = UI.FORM_INPUT.value.trim() //конст, кот присваивается значение инпута без пробелов
  getCityWeather(cityName) //вызов функ кот отправляет запрос для получения данных с сервера

  clearInput() //инпут очищается
}

function addLike() {
  UI.SVG_LIKE.classList.add('like') //добавляется класс лайк, в css которого команда окрасить сердечко в красный
}

function removeLike() {
  UI.SVG_LIKE.classList.remove('like')
}

function addCityToFavorites() {
  const cityName = UI.CITY_NAME.textContent.trim()
  if (!cityName || favoriteCities.includes(cityName)) {
    return // Не добавляем пустые названия или дубли
  }

  getNewElementForCity(cityName)

  addLike()

  saveToLocalStorage() //вызываю функция,кот сохраняет данные в localStorage

  console.log(favoriteCities)
}

function saveToLocalStorage() {
  localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities)) //у элемента переводит данные в вид "строка" и сохраняет в localStorage.
}

//загружает города из localStorage
function loadCitiesFromLocalStorage() {
  const storedCities = JSON.parse(localStorage.getItem('favoriteCities')) || [] // переменная, кот присваиваем элемент из localStorage или пустой массив
  storedCities.forEach((city) => {
    getNewElementForCity(city) // и для каждого города создается новый li
  })
}

function getNewElementForCity(cityName) {
  //функция кот создает новый эл.в который добавляется кнопка с названием города и кнопка для удаления элемента. и этот эл добавляется в список.
  favoriteCities.push(cityName) // беру из localStorage название города и добавляю его в массив
  const newLi = document.createElement('li') // создаю новый элемент li
  newLi.className = 'list_li' // присваиваю ему класс
  const newButton = createButtonForCityName(cityName) //создаем перем в кот помещаем данные о новой кнопки
  newLi.append(newButton) // создаю кнопку для всех нов ли с названием города

  newButton.addEventListener('click', () => {
    getCityWeather(cityName)
    addLike()
  }) // веш слуш соб на нов кнопку.При клике на нее отравляется запрос на сервер для получения данных о погоде данного города

  newLi.append(createButtonDelete()) // создаю кнопку удаления для всех новых ли
  UI.LIST.append(newLi) // добавляем элемент в список
}

// function getCityWeather(cityName) {
//   const url = `${serverUrl}?q=${cityName}&appid=${apiKey}`

//   if (!cityName) {
//     return
//   }

//   UI.LOADER.classList.add('loader-style')

//   fetch(url)
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error('Ошибка сети')
//       }
//       return response.json() // Преобразование ответа в JSON
//     })
//     .then((data) => {
//       // после ответа с сервера, из data берется название города и заносится в поле внизу .
//       UI.CITY_NAME.textContent = data.name.trim()
//       if (!data.name.includes(cityName)) {
//         removeLike()
//       }
//       а температура округляется до целого числа и вносится сюда:
//       UI.PART_TEMPERATURE.textContent = Math.round(data.main.temp - 273)

//       getImgWeather(data)
//     })
//     .catch((err) => {
//       console.error('ошибка при получении данных:', err)
//       UI.POPUP.classList.add('popup-style')
//     })
//     .finally(() => UI.LOADER.classList.remove('loader-style'))
// }

// async function getCityWeather(cityName) {
//   const url = `${serverUrl}?q=${cityName}&appid=${apiKey}`

//   if (!cityName) {
//     return // Если нет имени города, выходим из функции
//   }

//   UI.LOADER.classList.add('loader-style') // Показываем индикатор загрузки

//   try {
//     const response = await fetch(url) // ожидаем ответ от fetch
//     if (!response.ok) {
//       throw new Error('ошибка сети') // Генерируем ошибку, если статус ответа не OK
//     }
//     const data = await response.json() // Ожидаем преобразования ответа в JSON

//     //  После получения ответа с сервера
//     UI.CITY_NAME.textContent = data.name.trim() // Устанавливаем название города с обрезанием пробелов.

//     if (!data.name.includes(cityName)) {
//       removeLike() // Удаляем лайк, если имя города не совпадает
//     }

//     // а температура округляется до целого числа и вносится сюда:
//     UI.PART_TEMPERATURE.textContent = Math.round(data.main.temp - 273)

//     getImgWeather(data) // Получаем изображение погоды
//   } catch (err) {
//     console.error('ошибка при получении данных', err) // обработка ошибок

//     UI.POPUP.classList.add('popup-style') // Показываем попап с ошибкой
//   } finally {
//     UI.LOADER.classList.remove('loader-style') // Убираем индикатор загрузки
//   }
// }

async function getCityWeather(cityName, attempt = 1) {
  const url = `${serverUrl}?q=${cityName}&appid=${apiKey}`

  if (!cityName) {
    return // Если имя города не передано, выходим из функции
  }

  UI.LOADER.classList.add('loader-style') // Показываем индикатор загрузки

  try {
    const response = await fetch(url) // Ждем ответ от fetch
    if (!response.ok) {
      throw new Error('ошибка сети') // Генерируем ошибку, если статус ответа не OK
    }
    const data = await response.json() // Ждем преобразования ответа в JSON

    // После получения ответа от сервера
    UI.CITY_NAME.textContent = data.name.trim() // Устанавливаем название города с обрезанием пробелов

    if (!data.name.includes(cityName)) {
      removeLike() // Удаляем лайк, если имя города не совпадает
    }

    // Температура округляется до целого числа
    UI.PART_TEMPERATURE.textContent = Math.round(data.main.temp - 273)

    getImgWeather(data) // Получаем изображение погоды
  } catch (err) {
    console.error('ошибка при получении данных', err) // Обработка ошибок

    if (attempt < 3) {
      // Повторяем максимум 3 раза
      console.log(`Попытка ${attempt} не удалась. Повторяем...`)
      await getCityWeather(cityName, attempt + 1) // Рекурсивный вызов с увеличенным номером попытки
    } else {
      UI.POPUP.classList.add('popup-style') // Показываем попап с ошибкой после достижения максимальных попыток
    }
  } finally {
    UI.LOADER.classList.remove('loader-style') // Убираем индикатор загрузки
  }
}

function getImgWeather(data) {
  if (data.weather[0].main === 'Clouds') {
    UI.PART_IMG.src = '../img/clouds.svg'
    UI.PART_IMG.alt = 'картинка облаков'
  } else if (data.weather[0].main === 'Rain') {
    UI.PART_IMG.src = '../img/rain.svg'
    UI.PART_IMG.alt = 'картинка дождя'
  } else if (data.weather[0].main === 'Clear') {
    UI.PART_IMG.src = '../img/sun.svg'
    UI.PART_IMG.alt = 'картинка солнца'
  }
}

function closePopup() {
  UI.POPUP.classList.remove('popup-style')
} //функция добавляет класс, у которого в csss  - display: none;

function clearInput() {
  UI.FORM_INPUT.value = '' // у инпута пустая строка.
}

//функция создает кнопку в кот будет попадать назв города, которое мы искали. те ввели в поиск.
function createButtonForCityName(cityName) {
  const newButton = document.createElement('button') //создается новая кнопка
  newButton.className = 'list__button-city' //новой кнопке присв класс
  newButton.textContent = cityName // текст контент у кнопки

  return newButton
}

function createButtonDelete() {
  //функ создает кнопку удаления элемента из списка
  const newButtonDelete = document.createElement('button')
  newButtonDelete.className = 'list__button-delete'
  newButtonDelete.textContent = '+'
  newButtonDelete.addEventListener('click', deleteCity)
  return newButtonDelete
}

function deleteCity(e) {
  const parentNode = e.target.parentNode
  const cityText = parentNode.children[0].textContent

  removeLike()

  if (UI.LIST.contains(parentNode)) {
    const index = favoriteCities.indexOf(cityText)
    if (index !== -1) {
      favoriteCities.splice(index, 1)
    }
  }

  saveToLocalStorage() // загружаю новые данные из localStorage
  parentNode.remove()
  console.log(favoriteCities)
}
