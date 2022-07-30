const formSearch = document.querySelector('.form-search');
const inputCitiesFrom = document.querySelector('.input__cities-from');
const dropdownCitiesFrom = document.querySelector('.dropdown__cities-from');
const inputCitiesTo = document.querySelector('.input__cities-to');
const dropdownCitiesTo = document.querySelector('.dropdown__cities-to');
const inputDateDepart = document.querySelector('.input__date-depart');

// База данных городов

const citiesApi = 'https://api.travelpayouts.com/data/ru/cities.json';
let city = [];

// Proxy 

const proxy = 'https://cors-anywhere.herokuapp.com/';

// Документация - https://support.travelpayouts.com/hc/ru/categories/200358578
// API_KEY - Получать тут: https://www.travelpayouts.com/developers/api


const API_KEY = KEY;
const calendar = 'https://min-prices.aviasales.by/calendar_preload';


// функции

const getData = (url, callback) => {

    //XMLHttpRequest - это API для обмена данными между клиентом и сервером
    const request = new XMLHttpRequest();

    // GET - для получения данных
    // POST - для отправки данных
    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
        // 4 - считается ответом от сервера
        if (request.readyState !== 4) return;

        // 200 - это положительный ответ от сервера
        if (request.status === 200) {
            callback(request.response);
        } else {
            console.error(request.status);
        }
    });

    request.send();
}


const showCity = (input, list) =>{
    list.textContent = '';

    if (input.value !== '') {
        const filterCity = city.filter((item) => {
            const fixItem = item.name.toLowerCase();
            return fixItem.includes(input.value.toLowerCase());
        });

        filterCity.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item.name;
            list.append(li);
        });
    }
};

const selectSity = (event, input, list) => {
    const target = event.target;
    if(target.tagName.toLowerCase() === 'li'){
        input.value = target.textContent;
        list.textContent = '';
    }
}

// Обработчики событий

inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom)
});

inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo)
});

dropdownCitiesFrom.addEventListener('click', (event) => {
    selectSity(event, inputCitiesFrom, dropdownCitiesFrom)
})

dropdownCitiesTo.addEventListener('click', (event) => {
    selectSity(event, inputCitiesTo, dropdownCitiesTo)
})

// Вызовы функций

getData(proxy + citiesApi, data => city = JSON.parse(data).filter(item => item.name));

// getData(proxy + citiesApi, (data) => {
    // city = JSON.parse(data).filter((item) => {
    //     return item.name;
    // });
// });