import { current, nameReplacements, stPath } from '../Globals.mjs';
import { FinderSelect } from './Finder Select.mjs';

class PokeFinder extends FinderSelect {

    #curPokemon;

    constructor() {
        super(document.getElementById("pokeFinder"));
    }

    /** Fills the character list with each folder on the Characters folder */
    async loadCharacters() {

        this._clearList();

        const speciesList = [...current.pkmnSpecies].filter( 
            (poke) => (!poke.forme) // Checks if the Pokémon is not a forme (other than the base forme).
        ).sort( 
            (poke1, poke2) => (poke1.num - poke2.num) // Sorts by National Dex number. 
        );
        // add entries to the character list
        for (let pokemon of speciesList) {

            // this will be the div to click
            const newDiv = document.createElement('div');
            newDiv.className = "finderEntry";
            newDiv.addEventListener("click", () => {this.#entryClick(pokemon.name)}); //We DON'T replace the name here, as it's used for internal logic.

            // character icon
            const imgIcon = document.createElement('img');
            imgIcon.className = "fIconImg";

            // this will get us the true default icon for any character
            let imgInfo = pkmn.img.Icons.getPokemon(pokemon.name, {side: 'p2', protocol: 'http', domain: stPath.poke});
            imgIcon.alt = pokemon.name;
            imgIcon.src = `${stPath.poke}/sprites/pokemonicons-sheet.png`;
            imgIcon.style.objectPosition = `${imgInfo.left}px ${imgInfo.top}px`;

            // pokemon name
            const spanName = document.createElement('span');
            spanName.innerHTML = nameReplacements[pokemon.name] ?? pokemon.name; //We replace the name if it exists in the dict.
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
        imgIcon.alt = "None";
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

    /** Focuses the Finder to the currently selected pokemon */
    setSpeciesFocus() {
        if (this.#curPokemon.getSpecies()) {
            current.focus = this.#curPokemon.getPokeData().num - 2;
            this.addActive(true);   
        }
    }

}

export const pokeFinder = new PokeFinder;