import { current, nameReplacements, stPath } from '../Globals.mjs';
import { FinderSelect } from './Finder Select.mjs';

class PokeFinder extends FinderSelect {

    #curPokemon;

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
            imgIcon.src = `${stPath.poke}/sprites/pokemonicons-sheet.png`;
            imgIcon.style.objectPosition = `${imgInfo.left}px ${imgInfo.top}px`;

            // pokemon name
            const spanName = document.createElement('span');
            spanName.innerHTML = nameReplacements[pokemon.name] ?? pokemon.name; // replace the name if it exists in the dict
            spanName.className = "pfName";

            // add them to the div we created before
            newDiv.appendChild(imgIcon);
            newDiv.appendChild(spanName);

            // and now add the div to the finder
            this.addEntry(newDiv);

            // add a dex number to pokemon name translation for future scripts
            numToPoke[pokemon.num] = pokemon.name;

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

        // send this to global variables for other scripts
        current.numToPoke = numToPoke;

    }

    #entryClick(pokeName) {

        // clear focus to hide pokemon select menu
        document.activeElement.blur();

        // clear filter box
        this._finderEl.firstElementChild.value = "";

        // our pokemon class will take things from here
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