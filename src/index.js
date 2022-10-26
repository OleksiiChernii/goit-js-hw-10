import './css/styles.css';
import { FetchCountries } from './fetchCountries';

const debounce = require('lodash.debounce');

const refs = {
    input: document.querySelector('#search-box'),
    list: document.querySelector('.country-list'),
    info: document.querySelector('.country-info')
};

const fc = new FetchCountries(refs);
const DEBOUNCE_DELAY = 300;
const countryRequest = debounce((name) => fc.fetchCountries(name), DEBOUNCE_DELAY);


window.addEventListener('load', () => countryRequest(refs.input.value.trim()));

refs.input.addEventListener('input', event => {
    countryRequest(event.target.value.trim());
});
