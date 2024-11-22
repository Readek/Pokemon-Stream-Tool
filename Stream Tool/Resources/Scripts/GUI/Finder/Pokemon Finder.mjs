import { getLocalizedPokeText } from '../../Utils/Language.mjs';
import { current, stPath } from '../Globals.mjs';
import { Pokemon } from '../Pokemon.mjs';
import { FinderSelect } from './Finder Select.mjs';

// numbers relative to poke's position on list, not on dex (dexit was a mistake)
let pokeToNum = {};
/** @type {Pokemon} */
let currentPokemon;

class PokeFinder extends FinderSelect {

    constructor() {
        super(document.getElementById("pokeFinder"));
    }

    /** Fills the Pokemon Finder list with current pokedex data */
    async loadCharacters() {        

        this._clearList();

        const speciesList = [...current.pkmnSpecies].filter( 
            (poke) => (!poke.forme) // check if the Pokémon is not a forme (other than the base forme)
        ).sort( 
            (poke1, poke2) => (poke1.num - poke2.num) // sort by National Dex number
        );

        // some other script may need this
        const numToPoke = {};
        let pokeCount = 1;

        // add entries to the pokemon list
        for (let pokemon of speciesList) {

            // this will be the div to click
            const newDiv = document.createElement('div');
            newDiv.className = "finderEntry";
            newDiv.addEventListener("click", () => {this.#entryClick(pokemon.name)}); // don't replace the name here, as it's used for internal logic

            // pokemon icon
            const imgIcon = document.createElement('img');
            imgIcon.className = "fIconImg";

            // all icons are on the same spritesheet, this gets us the positions we want
            let imgInfo = pkmn.img.Icons.getPokemon(pokemon.name, {side: 'p2', protocol: 'http', domain: stPath.poke});
            imgIcon.alt = pokemon.name;
            imgIcon.src = `${stPath.poke}/pokemonicons-sheet.png`;
            imgIcon.style.objectPosition = `${imgInfo.left}px ${imgInfo.top}px`;

            // pokemon name
            const spanName = document.createElement('span');
            spanName.innerHTML = getLocalizedPokeText(pokemon.name, "Pokemon", current.generation);
            spanName.setAttribute("locPokemon", pokemon.name);
            spanName.className = "pfName";

            // add them to the div we created before
            newDiv.appendChild(imgIcon);
            newDiv.appendChild(spanName);

            // and now add the div to the finder
            this.addEntry(newDiv);

            // add a dex number to pokemon name translation for future scripts
            numToPoke[pokemon.num] = pokemon.name;
            // store the poke's position on the list regardless of dexits
            pokeToNum[pokemon.name] = pokeCount;
            pokeCount++;

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

        // store this list for later use
        this._storeFinderEntries();

        // send this to global variables for other scripts
        current.numToPoke = numToPoke;

    }

    #entryClick(pokeName) {

        // hide menu on click
        this.hide();

        // our pokemon class will take things from here
        currentPokemon.setSpecies(pokeName);

    }

    setCurrentPokemon(pokemon) {
        currentPokemon = pokemon;
    }

    /** Focuses the Finder to the currently selected pokemon */
    setSpeciesFocus() {
        if (currentPokemon.getSpecies()) {
            current.focus = pokeToNum[currentPokemon.getSpecies()] - 2;
            this.addActive(true);
        }
    }

}

export const pokeFinder = new PokeFinder;