import './css/styles.css';
import Notiflix from 'notiflix';

let debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const countryRequest = debounce((name) => fetchCountries(name), DEBOUNCE_DELAY);

const refs = {
    input: document.querySelector('#search-box'),
    list: document.querySelector('.country-list'),
    info: document.querySelector('.country-info')
};

countryRequest(refs.input.value.trim());

refs.input.addEventListener('input', event => {
    countryRequest(event.target.value.trim());
})

function fetchCountries(name){
    if(!name){
        return;
    }
    clear();
    fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flag,languages`,
    {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if(!response.ok){
                return new Error(response.status);
            }
            return response.json();
        })
        .then(data => {
            if(data.length > 10){
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.')
            } else if(data.length <= 10 && data.length > 1){
                refs.list.append(...createList(data));
            } else {
                createResult(refs.info, data);
            }
        })
        .catch(error => {
            console.log(error.message);
            Notiflix.Notify.failure('Oops, there is no counrty with that name');
        });
}

function createList(data){
    return data.map(({flag, name}) => {
        let li = document.createElement('li');
        let p = document.createElement('p');
        p.innerHTML = flag + ' ' +name.official;
        li.append(p);
        return li;
    });
}

function createResult(info, [country]){
    const h2 = document.createElement('h2');
    h2.innerHTML = country.flag + ' ' + country.name.official;
    const capital = document.createElement('p');
    capital.innerHTML = `<b>Capital:</b> ${country.capital}`;
    const population = document.createElement('p');
    population.innerHTML = `<b>Population:</b> ${country.population}`;
    const languages = document.createElement('p');
    languages.innerHTML = `<b>Languages:</b> ${Object.values(country.languages).join(', ')}`;
    info.append(...[h2, capital, population, languages]);
}

function clear(){
    refs.list.innerHTML = '';
    refs.info.innerHTML = '';
}
