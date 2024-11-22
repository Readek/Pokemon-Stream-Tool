import { current, inside, stPath } from "./Globals.mjs";
import { genRnd } from "../Utils/GenRnd.mjs";
import { pokeFinder } from "./Finder/Pokemon Finder.mjs";
import { fileExists, getJson } from "./File System.mjs";
import { fetchFile } from "./Fetch File.mjs";
import { getLocalizedPokeText } from "../Utils/Language.mjs";
import { fetchOffsets } from "./Asset Download.mjs";
/** @import { PokeType, IconCoords, PokeGender, PokeImgData } from "../Utils/Type Definitions.mjs" */

// these will sightly center sprite positions on the overlays
await fetchOffsets();
const offsets = await getJson(stPath.poke + "/offsets");

// for external asset downloading
const assRepoUrl = "https://gitlab.com/pokemon-stream-tool/pokemon-stream-tool-assets/-/raw/main/play.pokemonshowdown.com/";

export class Pokemon {

    /** @type {PokeGender}*/
    #gender = "M";
    #shiny = false;
    /** @type {PokeType[]} */
    #types = [];
    #pokeData;
    #baseFormPokeData;
    #form = ""; // Short name
    #formNames = []; // These can be used as identifiers for current.pkmnSpecies.get(); e.g., "Wormadam-Trash"
    #shortFormNames = []; // These only have the form name and are better suited for the selector; e.g., "Trash"
    #isNone = true;
    #localImgsLoaded = false;
    #pokeImgs = {};
    /** @type {IconCoords} */
    #iconCoords = {};

    /** @protected {HTMLElement} */
    el;

    /**
     * Main pokemon class
     * @param {Boolean} enemy - True if this is an enemy pokemon 
     */
    constructor(enemy) {

        this.enemy = enemy; // only relevant for vs trainer pokemons

        this.el = this.generateElement();

        this.pokeSel = this.el.getElementsByClassName(`pokeSelector`)[0];
        this.nickInp = this.el.getElementsByClassName(`pokeNickName`)[0];
        this.formSel = this.el.getElementsByClassName(`pokeForm`)[0];

        this.genderButt = this.el.getElementsByClassName(`pokeGenderButton`)[0];
        this.genderIcon = this.el.getElementsByClassName(`pokeGenderIcon`)[0];

        this.shinyButt = this.el.getElementsByClassName('pokeShinyButton')[0];
        this.shinyIcon = this.el.getElementsByClassName('pokeShinyIcon')[0];
        
        // set a listener that will trigger when pokemon selector is clicked
        this.pokeSel.addEventListener("click", () => {
            pokeFinder.open(this.pokeSel);
            pokeFinder.setCurrentPokemon(this);
            pokeFinder.focusFilter();
            pokeFinder.setSpeciesFocus();
        });

        // also set an initial pokemon value
        this.setSpecies("None");

        // set toggle click listeners
        this.genderButt.addEventListener("click", () => {this.#swapGender()});
        this.shinyButt.addEventListener("click", () => {this.#toggleShiny()});

        // event listener for the form selector
        this.formSel.addEventListener("change", () => {
            this.setForm(this.formSel.value, true)
        });

    }

    /**
     * Returns unique species identifier
     * @returns {String}
     */
    getInternalSpecies() {
        if(this.#isNone) return "";
        return this.#pokeData.name;
    }

    /**
     * Gives human-readable values
     * @returns {String}
     */
    getSpecies() {

        if(this.#isNone) return "";

        return this.#pokeData.baseSpecies;

    }
    /**
     * Sets a new pokemon based on the name
     * @param {String} name - Name of the pokemon
     * @param {Boolean} force - Force update regardless of previous species
     */
    setSpecies(name, force) {

        // if this is the same poke as we already got, dont bother
        if (this.speciesName == name && !force) return;

        this.speciesName = name;

        // since this is a new species, we will reload poke images later
        this.#localImgsLoaded = false;

        // reset the form selector
        this.formSel.replaceChildren();

        // if we select none, just display nothin
        if (!name || name == "None") {

            this.#isNone = true;
            this.pokeSel.children[1].innerHTML = "";
            this.pokeSel.children[1].setAttribute("locPokemon", "");
            
            // add a default "Base" option
            this.#addFormOption("Base");
            // switch to this value, and disable the selector
            this.formSel.value = "Base";
            this.formSel.disabled = true;

            // set gender as null
            this.setGender();

        } else {

            this.#isNone = false;

            // this will fetch us all the data we will ever need
            this.#pokeData = current.pkmnSpecies.get(name);
            // if this poke does not exist, force "None"
            if(!this.#pokeData){
                console.log(`Something went wrong: "${name}" is not a valid species name.`);
                this.setSpecies("None");
                return;
            }
            // only the base species has data about forms
            this.#baseFormPokeData = current.pkmnSpecies.get(this.#pokeData.baseSpecies);

            // set the pokemon name in the selector
            this.pokeSel.children[1].innerHTML = getLocalizedPokeText(this.#pokeData.baseSpecies, "Pokemon", current.generation);
            this.pokeSel.children[1].setAttribute("locPokemon", this.#pokeData.baseSpecies);

            // set the form lists
            // some pokes have exclusive default forms so we default to those if any
            this.#form = this.#pokeData.forme || this.#pokeData.baseForme || "Base";
            this.#formNames = this.#baseFormPokeData.formes ?? [this.#pokeData.name];
            this.#shortFormNames = this.#formNames.map( (speciesName) => {
                const forme = current.pkmnSpecies.get(speciesName);
                return forme.forme || forme.baseForme || "Base";
            });

            // populate the form selector
            for(let formName of this.#shortFormNames){
                this.#addFormOption(formName)
            }
            // switch to an initial form value
            this.formSel.value = this.#form;
            // if there is only one form, disable the form selector
            this.formSel.disabled = (this.#formNames.length <= 1);
            
            // gender locking
            if (this.#pokeData.genderRatio.M == 1) {
                this.setGender("M");
                this.#disableGenderButt(true);
            } else if (this.#pokeData.genderRatio.F == 1) {
                this.setGender("F");
                this.#disableGenderButt(true);
            } else if (this.#pokeData.genderRatio.M == 0 && this.#pokeData.genderRatio.F == 0) {
                this.setGender();
            } else {
                this.#disableGenderButt(false);
                // defaulting to male if gender neutral was previously selected
                if(!this.getGender()) this.setGender('M');
            }

        }

        this.#updateIcon();
        this.setTypes();

    }
    
    /** Updates this poke's icon and stores its coordinates */
    #updateIcon() {

        if(this.#isNone){

            // show a simple pokeball icon
            this.pokeSel.children[0].src = `${stPath.assets}/None.png`;
            this.#iconCoords = {p1: {left: 0, top: 0}, p2: {left: 0, top: 0}};
            
        } else {

            // go fetch positions for the big ass spritesheet file
            this.pokeSel.children[0].src = `${stPath.poke}/pokemonicons-sheet.png`;
            const imgInfo = pkmn.img.Icons.getPokemon(this.#pokeData.name, {
                side: 'p2',
                gender: this.getGender(),
                domain: stPath.poke
            });
            this.#iconCoords.p2.left = imgInfo.left;
            this.#iconCoords.p2.top = imgInfo.top;

            // do it again but for "p1" in case icon is different
            const imgInfoP1 = pkmn.img.Icons.getPokemon(this.#pokeData.name, {
                side: 'p1',
                gender: this.getGender(),
                protocol: 'http',
                domain: stPath.poke
            });
            this.#iconCoords.p1.left = imgInfoP1.left;
            this.#iconCoords.p1.top = imgInfoP1.top;

        }

        // actual image translate
        this.pokeSel.children[0].style.objectPosition = `
            ${this.#iconCoords.p2.left}px ${this.#iconCoords.p2.top}px
        `;

    }
    /**
     * Pokemon icon coordinates for the icon spritesheet
     * @returns {IconCoords}
     */
    getIconCoords() {
        return this.#iconCoords;
    }

    /** @returns {String} */
    getNickName() {
        return this.nickInp.value;
    }
    /**
     * Sets this pokemon's nickname
     * @param {String} name
     */
    setNickName(name) {

        if (this.getNickName() == name) return;

        // if name equals poke species just leave the field empty
        if (name &&
            name != getLocalizedPokeText(this.getSpecies(), "Pokemon", current.generation)) {
            this.nickInp.value = name;
        } else {
            this.nickInp.value = "";
        }

    }

    /** @returns {String} */
    getForm() {
        return this.formSel.value;
    }
    /** 
     * Updates the pokemon's form, also updating species data
     * @param {String} value - Name of form
     * @param {boolean} force - Force form update
     */
    setForm(value, force = false) {

        if(this.#isNone) return;        

        if (!force && this.getForm() == value) return;

        if (this.#shortFormNames.includes(value)) {
            
            let form = this.#formNames[this.#shortFormNames.indexOf(value)];
            this.setSpecies(form, true);

        } else { // this can be useful for memory reading shenanigans

            console.log(`"${value}" isn't a valid form name for ${this.getSpecies()}`);

        }

    }

    /** 
     * Sets form via index, usually for game memory values
     * @param {Number} value - Form index 
     */
    setFormNumber(value) {

        // check if value exists and if it isnt the same as prev
        if (this.formSel.options[value] && this.formSel.value != this.formSel.options[value].value) {
            this.formSel.selectedIndex = value;
            this.setForm(this.formSel.value, true);
        }
        
    }

    /** @returns {String[]} */
    getFormNames() {
        if(this.#isNone) return ["Base"];
        return this.#shortFormNames;
    }

    /**
     * Adds a new option to the forms select
     * @param {String} formName - Name of the form to add
     */
    #addFormOption(formName) {

        const optionEl = document.createElement("option");
        optionEl.textContent = formName;
        optionEl.value = formName;
        this.formSel.appendChild(optionEl);

    }

    /** @returns {PokeGender} */
    getGender() {
        return this.#gender;
    }
    /** @param {PokeGender} value - Can be null for genderless */
    setGender(value = null) {

        if (this.#gender == value) return;

        if (value) {
            this.#gender = value;
            this.genderIcon.src = `${stPath.assets}/Gender ${value}.png`;
        } else {
            this.#gender = null;
            this.genderIcon.src = `${stPath.assets}/Gender N.png`;
            this.#disableGenderButt(true);
        }

        // update icon, for things like Jellicent
        this.#updateIcon();

    }
    /** Oh if only it were that easy */
    #swapGender() {
        const gender = this.getGender() == "M" ? "F" : "M"
        this.setGender(gender);
    }
    /**
     * Locks or unlocks gender button
     * @param {boolean} value 
     */
    #disableGenderButt(value) {
        this.genderButt.disabled = value;
    }

    /** @returns {boolean} */
    getShiny() {
        return this.#shiny;
    }
    /** @param {Boolean} value */
    setShiny(value) {

        if (this.#shiny == value) return;

        this.#shiny = value;

        // update images to be sent
        this.#localImgsLoaded = false;
        this.getImgSrc();

        // set lower button opacity if non-shiny
        const opValue = value ? 1 : .3;
        this.shinyIcon.style.opacity = opValue;

    }
    #toggleShiny() {
        this.setShiny(!this.getShiny());
    }

    /** @returns {PokeType[]} */
    getTypes() {
        return this.#types;
    }
    /**
     * Sets this poke's types
     * @param {PokeType[]} types - This param is only used for in-battle type changes
     */
    setTypes(types = null) {

        if (types) {

            this.#types = types;

        } else {

            if(this.#isNone){
                this.#types = ["Normal"]; // just for safety
            } else {
                this.#types = this.#pokeData.types;
            }

        }
        
    }

    /**
     * Generates poke image srcs, downloading images first if necessary
     * @returns {PokeImgData} Img paths and coords
     */
    async getImgSrc() {

        // if images have already been loaded, skip it all
        if (this.#localImgsLoaded) return this.#pokeImgs;

        // final data to be sent
        this.#pokeImgs = {
            gen5Front : "",
            gen5Back : "",
            aniFront : "",
            aniBack : "",
            // position offsets for overlay
            gen5FrontOffs : [],
            gen5BackOffs : [],
            aniFrontOffs : [],
            aniBackOffs : []
        }

        if(!this.#isNone){

            // now this is getting promising
            const promises = [];

            // get those actual images!
            promises.push(this.#findImg("gen5ani", "p2"));
            promises.push(this.#findImg("gen5ani", "p1"));
            promises.push(this.#findImg("ani", "p2"));
            promises.push(this.#findImg("ani", "p1"));

            // wait for all images to load properly
            const results = await Promise.all(promises);

            // add those paths to our object
            this.#pokeImgs.gen5Front = results[0];
            this.#pokeImgs.gen5Back = results[1];
            this.#pokeImgs.aniFront = results[2];
            this.#pokeImgs.aniBack = results[3];

            // also add position offsets (substr removes up until "gen5ani/lugia.gif")
            this.#pokeImgs.gen5FrontOffs = offsets[results[0].substring(39)] || [0, 0];
            this.#pokeImgs.gen5BackOffs = offsets[results[1].substring(39)] || [0, 0];
            this.#pokeImgs.aniFrontOffs = offsets[results[2].substring(39)] || [0, 0];
            this.#pokeImgs.aniBackOffs = offsets[results[3].substring(39)] || [0, 0];
            console.log(this.#pokeImgs);
            

        }

        // if we got them images, no need to run this again
        this.#localImgsLoaded = true; // goes to false on species change

        return this.#pokeImgs;

    }
    /**
     * Finds a requested image depending on current Pokemon data
     * @param {String} gen - Generation of sprites ( `gen?`, `gen?ani`, and `ani`)
     * @param {"p1" | "p2"} side - If front facing (`p2`) or back facing (`p1`)
     * @returns {String} Image path
     */
    async #findImg(gen, side) {

        let imgData = pkmn.img.Sprites.getPokemon(this.#pokeData.name, {
            gen: gen,
            side: side,
            gender: this.getGender(),
            shiny: this.#shiny,
            protocol: 'http', domain: "../../Resources/Assets/Pokemon"
        })

        const browserUrl = imgData.url.replace("http://", ""); //ugly workaround.

        if (inside.electron) {

            const cleanUrl = browserUrl.substring(23);
            if (!await fileExists(stPath.assets + "/" + cleanUrl)) {
                await fetchFile(
                    assRepoUrl + cleanUrl.substring(8),
                    stPath.assets + "/" + cleanUrl
                )
            } 

        }

        return browserUrl;

    }

    getPokeData() {
        return this.#pokeData;
    }

    /** Resets all data for this pokemon */
    clear() {
        this.setSpecies();
        this.setNickName("");
        this.setShiny(false);
    }

    /** Sets a random species from current dex */
    randomize() {
        let fullSpeciesList = [...current.pkmnSpecies];
        let randomSpecies = fullSpeciesList[genRnd(0, fullSpeciesList.length)];
        this.setSpecies(randomSpecies.name);
    }


    /**
     * Creates the pokemon's HTML element
     * @returns {HTMLElement}
     */
    generateElement() {

        // to be replaced by children

    }

}