
import Notiflix from 'notiflix';

export class FetchCountries {
    #list
    #info

    constructor({list, info}){
        this.#list = list;
        this.#info = info;
    }

    fetchCountries(name){
        if(!name){
            return;
        }
        this.#clear();
        fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flag,languages`,
        {
            'X-Content-Type-Options': 'nosniff'
        })
            .then(response => {
                if(!response.ok){
                    return new Error(response.status);
                }
                return response.json();
            })
            .then(data => this.#dataProcessing(data))
            .catch(error => this.#errorProcessing(error));
    }

    #dataProcessing(data){
        if(data.length > 10){
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.')
        } else if(data.length <= 10 && data.length > 1){
            this.#list.append(...this.#createList(data));
        } else {
            this.#createResult(this.#info, data);
        }
    }

    #errorProcessing(error){
        console.log(error.message);
        Notiflix.Notify.failure('Oops, there is no counrty with that name');
    }

    #createList(data){
        return data.map(({flag, name}) => {
            let li = document.createElement('li');
            let p = document.createElement('p');
            p.innerHTML = flag + ' ' +name.official;
            li.append(p);
            return li;
        });
    }

    #createResult(info, [country]){
        const h2 = document.createElement('h2');
        h2.innerHTML = country.flag + ' ' + country.name.official;
        const capital = document.createElement('p');
        capital.innerHTML = this.#templateResult('Capital', country.capital);
        const population = document.createElement('p');
        population.innerHTML = this.#templateResult('Population', country.population);
        const languages = document.createElement('p');
        languages.innerHTML = this.#templateResult('Languages', Object.values(country.languages).join(', '));
        info.append(...[h2, capital, population, languages]);
    }
    
    #templateResult(category, result){
        return `<b>${category}:</b> ${result}`;
    }

    #clear(){
        this.#list.innerHTML = '';
        this.#info.innerHTML = '';
    }
}
