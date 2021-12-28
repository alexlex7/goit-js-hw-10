import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'flatpickr/dist/flatpickr.min.css';
import { fetchCountries } from './js/fetchCountries.js';
import debounce from 'lodash.debounce';


const DEBOUNCE_DELAY = 300;
const messegeInfo = "Too many matches found. Please enter a more specific name.";
const messegeFailure = "Oops, there is no country with that name";

function listTamplate({ flags, name }) {
  return `
  <li class="list-item">
        <img src="${flags.svg}" alt="">
        <p>${name.official}</p>
      </li>`
  
}

function tamplateForOneCountry({flags, name, capital, languages, population }) {
  return `
  <li class="list-item">
          <img src="${flags.svg}" alt="">
          <p class="name">${name.common}</p>
        </li>
        <li>
          <span class="text">
            Capital:
          </span> ${capital}
        </li>
        <li>
          <span class="text">
            Population:
          </span> ${population}
        </li>
        <li>
          <span class="text">
            Languages:
          </span>  ${Object.values(languages)}
        </li>
  `
} 


const refs = {
  searchInput: document.querySelector('#search-box'),
  list: document.querySelector('.country-list')
} 

refs.searchInput.addEventListener('input', debounce(onInputHandler, DEBOUNCE_DELAY))

function onInputHandler(e) {
  if (!e.target.value) {
    refs.list.innerHTML = '';
    return;
  }
  fetchCountries(e.target.value.trim())
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(messegeInfo);
        return
      }

      const markup = countries.map((country, i, arr) => { return arr.length > 1 ? listTamplate(country) : tamplateForOneCountry(country) }).join('');

      refs.list.innerHTML = markup;
  })
  .catch(error => {
   Notify.failure(messegeFailure)
  });
  
}



