let page = 1;
let offset = 0;
let paginationDiv = document.getElementById('page_number_div');
let searchInput = document.getElementById('search_input');
let pokedex = document.getElementById('pokedex');
let nextPageBtn = document.getElementById('next_page');
let backPageBtn = document.getElementById('back_page');
let promisses = [];
let allPokemons = [];
const getUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}`;
window.addEventListener('load', (event) => {
    paginationDiv.textContent = page;
    createPromisses();
    let pokemons = fetchPokemon(page)
    console.log('The page has fully loaded');
    initEvents()
});

const createPromisses = (multiple = true, pokemonName) => {
    try {
        let i = offset > 0 ? offset : 1;
        let pageCount = page == 1 ? page * 5 : page * 5 - 1
        if (multiple) {
            for (i; i < pageCount; i++) {
                promisses.push(fetch(getUrl(i)).then(response => response.json()))
            }
        } else {
            promisses.push(fetch(getUrl(pokemonName)).then(response => response.json()))
        }
    } catch (err) {
        console.log(err)
    }


}
const fetchPokemon = () => {
    try {
        Promise.all(promisses).then(pokemons => {
            pokemons.forEach(pokemon => {
                console.log(pokemon)
                let moves = getFourRandomMoves(pokemon),
                    html = createHtmlCard(pokemon, moves),
                    cardDiv = createCardDiv(html, pokemon.types[0].type.name);


                pokemon['htmlCard'] = cardDiv;
                if (allPokemons.indexOf(pokemon) == -1)
                    allPokemons.push(pokemon);
            })
        })
    } catch (err) {
        console.log(err)
    }

}

const createCardDiv = (html, type) => {
    let cardDiv = document.createElement('div');
    cardDiv.innerHTML = html;
    cardDiv.classList.add('card');
    cardDiv.classList.add(type);
    pokedex.append(cardDiv);
    return cardDiv;
}
const screenFilter = (text) => {
    let foundPokemons = [];
    for (let i = 0; i < allPokemons.length; i++) {
        if (allPokemons[i].name.indexOf(text) == -1) {
            allPokemons[i].htmlCard.style.display = 'none';
        } else {
            allPokemons[i].htmlCard.style.display = 'flex';
            foundPokemons.push(allPokemons[i]);
        }
    }
    return foundPokemons;

}
const initEvents = () => {
    searchInput.addEventListener('input', (e) => {
        console.log(e.target.value)
        foundPokemons = screenFilter(e.target.value)
        if (foundPokemons.length == 0) {
            promisses = [];
            createPromisses(false, e.target.value)
            fetchPokemon();
            paginationDiv.textContent = 1;
            allPokemons.length = 4
        }
        if (e.target.value == "") {
            clearScreen();
            page = 1;
            paginationDiv.textContent = page;
            createPromisses();
            fetchPokemon(page)
        }
    })
    nextPageBtn.addEventListener('click', (e) => {
        makePagination(true);
    })
    backPageBtn.addEventListener('click', (e) => {
        if (page - 1 > 0)
            makePagination(false)
    })
}
const makePagination = (next) => {
    if (next) {
        page += 1;
        offset += 5;
    }
    else {
        page -= 1;
        offset -= 5;
    }

    clearScreen();
    createPromisses();
    fetchPokemon(page);
    paginationDiv.textContent = page;
}
const createTypeText = (types) => {
    return types.map((el) => {
        return el.type.name
    }).join(" | ");
}
const createHtmlStats = (stats) => {
    let html = ""
    stats.forEach(el => {
        html += `<p>${el.stat.name}:  ${el.base_stat}</p>`
    });
    return html
}
const createHtmlCard = (pokemon, moves) => {
    let imageSrc = pokemon.sprites.other['official-artwork'].front_default,
        type = createTypeText(pokemon.types),
        html = '';
    html = `<div class="pokemon_name">${pokemon.name}#${pokemon.id}</div>
    <div>${type}</div>
    <div class="pokemon_img_stats">
    <div class="pokemon_img_div"><img class="pokemon_image" src="${imageSrc}" alt="${pokemon.name}"></img></div>
    <div class="pokemon_stats">${createHtmlStats(pokemon.stats)}</div>
    </div>
    <div class="pokemon_moves">
    `;
    for (let j = 0; j < moves.length; j++) {
        html += `<div class="pokemon_move">${moves[j]}</div>`
    }
    html += '</div>';
    return html
}
const getFourRandomMoves = (pokemon) => {
    let moves = []
    let size = pokemon.moves.length >= 4 ? 4 : pokemon.moves.length
    for (let i = 0; i < size; i++) {
        moves.push(pokemon.moves[i].move.name)
    }

    return moves;
}
const clearScreen = () => {
    promisses = [];
    allPokemons = [];
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.remove();
    });
    pokemons = [];
}



