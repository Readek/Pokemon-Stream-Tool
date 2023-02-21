import { getCharacterList } from '../File System.mjs';
import { stPath } from '../Globals.mjs';
import { FinderSelect } from './Finder Select.mjs';

class PokeFinder extends FinderSelect {

    #curPokemon;

    constructor() {
        super(document.getElementById("pokeFinder"));
    }

    /** Fills the character list with each folder on the Characters folder */
    async loadCharacters() {

        // create a list with folder names on charPath
        const pokemonList = await getCharacterList();

        // add entries to the character list
        for (let i = 0; i < pokemonList.length; i++) {

            // this will be the div to click
            const newDiv = document.createElement('div');
            newDiv.className = "finderEntry";
            newDiv.addEventListener("click", () => {this.#entryClick(pokemonList[i])});

            // character icon
            const imgIcon = document.createElement('img');
            imgIcon.className = "fIconImg";
            // this will get us the true default icon for any character
            imgIcon.src = `${stPath.poke}/${pokemonList[i]}/Icon/Default.png`;
            
            // pokemon name
            const spanName = document.createElement('span');
            spanName.innerHTML = pokemonList[i];
            spanName.className = "pfName";

            // add them to the div we created before
            newDiv.appendChild(imgIcon);
            newDiv.appendChild(spanName);

            // and now add the div to the actual interface
            this.addEntry(newDiv);

        }

    }

    #entryClick(pokeName) {

        // clear focus to hide character select menu
        document.activeElement.blur();

        // clear filter box
        this._finderEl.firstElementChild.value = "";

        // our player class will take things from here
        this.#curPokemon.setSpecies(pokeName);

    }

    setCurrentPokemon(pokemon) {
        this.#curPokemon = pokemon;
    }

}

export const pokeFinder = new PokeFinder;