import { current, stPath } from '../Globals.mjs';
import { FinderSelect } from './Finder Select.mjs';

class PokeFinder extends FinderSelect {

    #curPokemon;

    constructor() {
        super(document.getElementById("pokeFinder"));
    }

    /** Fills the character list with each folder on the Characters folder */
    async loadCharacters() {

        const dexGens = new pkmn.data.Generations(pkmn.dex.Dex);
        const gen = dexGens.get(current.generation);

        // add entries to the character list
        for (let pokemon of gen.species) {

            // this will be the div to click
            const newDiv = document.createElement('div');
            newDiv.className = "finderEntry";
            newDiv.addEventListener("click", () => {this.#entryClick(pokemon.baseSpecies)});

            // character icon
            const imgIcon = document.createElement('img');
            imgIcon.className = "fIconImg";
            // this will get us the true default icon for any character
            imgIcon.src = `${stPath.poke}/${pokemon.baseSpecies}/Icon/Default.png`;
            
            // pokemon name
            const spanName = document.createElement('span');
            spanName.innerHTML = pokemon.baseSpecies;
            spanName.className = "pfName";

            // add them to the div we created before
            newDiv.appendChild(imgIcon);
            newDiv.appendChild(spanName);

            // and now add the div to the actual interface
            this.addEntry(newDiv);

        }

        // add a final "None" button
        const newDiv = document.createElement('div');
        newDiv.className = "finderEntry";
        newDiv.addEventListener("click", () => {this.#entryClick("None")});

        const imgIcon = document.createElement('img');
        imgIcon.className = "fIconImg";
        imgIcon.src = `${stPath.assets}/None.png`;
        
        const spanName = document.createElement('span');
        spanName.innerHTML = "None";
        spanName.className = "pfName";

        newDiv.appendChild(imgIcon);
        newDiv.appendChild(spanName);
        this.addEntry(newDiv);

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