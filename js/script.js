const formSearch = document.querySelector('.form-search');
const inputCitiesFrom = document.querySelector('.input__cities-from');
const dropdownCitiesFrom = document.querySelector('.dropdown__cities-from');
const inputCitiesTo = document.querySelector('.input__cities-to');
const dropdownCitiesTo = document.querySelector('.dropdown__cities-to');
const inputDateDepart = document.querySelector('.input__date-depart');
const cheapestTicket = document.getElementById('cheapest-ticket');
const otherCheapTickets = document.getElementById('other-cheap-tickets');

// База данных городов

const citiesApi = 'https://api.travelpayouts.com/data/ru/cities.json';
let city = [];

// Proxy 

const proxy = 'https://cors-anywhere.herokuapp.com/';

// Документация - https://support.travelpayouts.com/hc/ru/categories/200358578
// API_KEY - Получать тут: https://www.travelpayouts.com/developers/api


const API_KEY = 'f4db9166d9b31730eb21a3fb63a8b5c3';
const calendar = 'http://api.travelpayouts.com/v2/prices/month-matrix';


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
            return fixItem.startsWith(input.value.toLowerCase());
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
};

const getDate = (date) => {
     return new Date(date).toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
     });
}

const getNameCity = (code) => {
    const objCity = city.find(item => item.code === code);
    console.log(objCity.name)
    return objCity.name
}

const getChanges = (n) => {
    if (n) {
        return n === 1 ? 'С одной пересадкой' : 'С двумя пересадками'
    } else {
        return 'Без пересадок'
    }
}

const getLinkAviaSales = (data) => {
    let link = 'https://www.aviasales.com/search/'
    link += data.origin;
    const date = new Date(data.depart_date)
    const day = date.getDate();
    link += day < 10 ? '0' + day : day;
    const month = date.getMonth() + 1;
    link += month < 10 ? '0' + month : month;
    link += data.destination;
    link += '1';

    console.log(link)
    return link

}

const createCard = (data) => {
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');

    let deep = '';

    if (data) {
        deep = `
            <h3 class="agent">${data.gate}</h3>
            <div class="ticket__wrapper">
	            <div class="left-side">
		            <a href="${getLinkAviaSales(data)}" class="button button__buy">Купить за ${data.value}</a>
	            </div>
	            <div class="right-side">
		            <div class="block-left">
			            <div class="city__from">Вылет из города: 
				            <span class="city__name">${getNameCity(data.origin)}</span>
			            </div>
			        <div class="date">${getDate(data.depart_date)}</div>
		        </div>

		        <div class="block-right">
			        <div class="changes">${getChanges(data.number_of_changes)}</div>
			            <div class="city__to">Город назначения: 
				            <span class="city__name">${getNameCity(data.destination)}</span>
			            </div>
		            </div>
	            </div>
            </div>
        `;
    } else {
        deep = `<h3>К сожалению на текущую дату нет билетов не нашлось.</h3>`;
    }

    ticket.insertAdjacentHTML('afterbegin', deep)

    return ticket
}

const renderTicketDay = (TicketDay) => {
    const ticket = createCard(TicketDay[0]);
    cheapestTicket.append(ticket);

    console.log(TicketDay);
}

const renderTicketMonth = (TicketMonth) => {
    TicketMonth.sort((a, b) => a.value - b.value);

    console.log('cheapTicketMonth: ', TicketMonth);
}

const renderCheap = (DATA, date) => {

    const cheapTicketMonth = JSON.parse(DATA).data
    const cheapTicketDay = cheapTicketMonth.filter(item => item.depart_date === date);

    renderTicketMonth(cheapTicketMonth);
    renderTicketDay(cheapTicketDay);

};

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

formSearch.addEventListener('submit', (event) => {
    event.preventDefault();

    cheapestTicket.textContent = '';
    otherCheapTickets.textContent = '';

    const cityFrom = city.find(item => inputCitiesFrom.value === item.name);
    const cityTo = city.find(item => inputCitiesTo.value === item.name);

    const formData = {
        from: cityFrom,
        to: cityTo,
        when: inputDateDepart.value
    }
    
    if (formData.from && formData.to) {

    const requestDataBy = 

        '?depart_date=' + formData.when + 
        '&currency=byn' +
        '&origin=' + formData.from.code + 
        '&destination=' + formData.to.code + 
        '&one_way=true&token=' + API_KEY;
        '&token=' + API_KEY;

        getData(calendar + requestDataBy, (response) => {
            renderCheap(response, formData.when);
        });

        const requestDataRu = 

        '?depart_date=' + formData.when + 
        '&currency=rub' +
        '&origin=' + formData.from.code + 
        '&destination=' + formData.to.code + 
        '&one_way=true&token=' + API_KEY;

        getData(calendar + requestDataRu, (response) => {
            renderCheap(response, formData.when);
        });
    } else {
        alert('Введите корректное название города!')
    }
});

// Вызовы функций

// getData(proxy + citiesApi, data => city = JSON.parse(data).filter(item => item.name));

getData(citiesApi, (data) => {
    city.sort((a, b) => {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }

        return 0;
    });

    city = JSON.parse(data).filter((item) => {
        return item.name;
    });
});