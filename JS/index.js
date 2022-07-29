let generations = ['i', 'ii', 'iii', 'iV', 'v', 'vi', 'vii', 'viii'];
let pokemons = [];
let searchInput = document.getElementById('searchInput');
console.log(searchInput)
for (let i = 0; i < 202; i++) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${i}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(pokemon => {
            let pokedex = document.getElementById('pokedex'),
                imageSrc = pokemon.sprites.other['official-artwork'].front_default,
                moves = getFourRandomMoves(pokemon),
                cardDiv = document.createElement('div'),
                type = pokemon.types.map((el) => {
                    return el.type.name
                }).join(" | "),
                html = '';
            html = `<div class="pokemon_name">${pokemon.name}#${pokemon.id}</div>
                <div>${type}</div>
                <img class="pokemon_image" src="${imageSrc}" alt="${pokemon.name}"></img>
                <div class="pokemon_moves">
                `;
            for (let j = 0; j < moves.length; j++) {
                html += `<div>${moves[j]}</div>`
            }
            html += '</div>';
            console.log(html)
            cardDiv.innerHTML = html;
            cardDiv.classList.add('card');
            pokedex.append(cardDiv);
            pokemon['htmlCard'] = cardDiv;
            pokemons.push(pokemon);

        })
}
searchInput.addEventListener('input', (e) => {
    for (let i = 0; i < pokemons.length; i++) {
        if (pokemons[i].name.indexOf(e.target.value) == -1) {
            pokemons[i].htmlCard.style.display = 'none';
        } else {
            pokemons[i].htmlCard.style.display = 'flex';
        }
    }

})
const getFourRandomMoves = (pokemon) => {
    let moves = []
    for (let i = 0; i < 4; i++) {
        let position = Math.round(Math.random() * pokemon.moves.length - 1);
        moves.push(pokemon.moves[position].move.name)
    }
    return moves;
}
// searchInput.onchange((text) => {
//     console.log(text);
// })


