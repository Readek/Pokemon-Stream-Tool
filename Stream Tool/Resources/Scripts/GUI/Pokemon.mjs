import { current, inside, nameReplacements, stPath } from "./Globals.mjs";
import { pokeFinder } from "./Finder/Pokemon Finder.mjs";
import { fileExists, getJson } from "./File System.mjs";
import { fetchFile } from "./Fetch File.mjs";

// this will sightly move sprite positions on the overlays
let offsets = {};
let firstBoot = true;

export class Pokemon {

    #gender = "M";
    #shiny = false;
    #pokeData;
    #baseFormPokeData;
    #form = ""; // Short name.
    #formNames = []; // These can be used as identifiers for current.pkmnSpecies.get(); e.g., "Wormadam-Trash".
    #shortFormNames = []; // These only have the form name and are better suited for the selector; e.g., "Trash".
    #isNone = true;
    #hasLocalImgs = false;
    #pokeImgs = {};
    #iconCoords = [];

    /** @protected {HTMLElement} */
    el;

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

        this.genderButt.addEventListener("click", () => {this.swapGender()});

        this.shinyButt.addEventListener("click", () => {this.swapShiny()});

        // event listener for the form selector.
        this.formSel.addEventListener("change", () => {this.setForm(this.formSel.value)});

    }

    getInternalSpecies() {
        if(this.#isNone) return "";
        return this.#pokeData.name;
    }

    getSpecies() {
        //This doesn't return unique identifiers, but human-readable values; for example, it localizes names ("Type: Null" becomes "Código Cero"), and ignores forms ("Arceus-Dark" becomes "Arceus").
        if(this.#isNone){
            return "";
        }
        let baseSpecies = this.#pokeData.baseSpecies;
        return nameReplacements[baseSpecies] ?? baseSpecies; //We return the replacement if it exists in the dict; otherwise, the first term is undefined and we return the normal name.
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

        this.#hasLocalImgs = false;

        // if we select none, just display nothin
        if (!name || name == "None") {
            this.#isNone = true;
            this.pokeSel.children[1].innerHTML = "";
            this.#updateIcon();
            // We reset and disable the form selector, to prevent some visual bugs in edge cases. 
            let formEl = document.createElement("option");
            formEl.textContent = "Base";
            formEl.value = "Base";
            this.formSel.replaceChildren(formEl);
            this.formSel.value = "Base";
            this.formSel.disabled = true;
            //In case you select a gender-locked Pokémon before and you want to pre-select another Pokémon's gender.
            //Alternatively, we could disable everything but the Pokémon selector, in order to remain consistent.
            this.enableGenderButt();
        } else {

            this.#isNone = false;
            // this will fetch us all the data we will ever need
            // We should consider migrating this logic to another class.
            this.#pokeData = current.pkmnSpecies.get(name);
            if(!this.#pokeData){
                console.log(`Something went wrong: "${name}" is not a valid species name.`);
                this.setSpecies("None");
                return;
            }
            this.#baseFormPokeData = current.pkmnSpecies.get(this.#pokeData.baseSpecies); //Only the base species has data about forms.

            // set the pokemon name and icon on the selector
            this.pokeSel.children[1].innerHTML = nameReplacements[this.#pokeData.baseSpecies] ?? this.#pokeData.baseSpecies; //We use the base species name.
            this.#updateIcon();

            // sets the form lists.
            this.#form = this.#pokeData.forme || this.#pokeData.baseForme || "Base";
            this.#formNames = this.#baseFormPokeData.formes ?? [this.#pokeData.name];
            this.#shortFormNames = this.#formNames.map( (speciesName) => {
                let forme = current.pkmnSpecies.get(speciesName);
                return forme.forme || forme.baseForme || "Base"; //Either the correct form name or "Base".
            });

            // populate the form selector.
            // We could consider adding an icon for each form, similar to the Finder.
            this.formSel.replaceChildren(); // First, we remove all the previous child nodes, if any.
            for(let formName of this.#shortFormNames){
                let el = document.createElement("option");
                el.textContent = formName;
                el.value = formName;
                this.formSel.appendChild(el);
            }
            this.formSel.value = this.#form;
            this.formSel.disabled = (this.#formNames.length <= 1); //If there is only one form, we disable the form selector.
            

            // gender locking
            if (this.#pokeData.genderRatio.M == 1) {
                this.setGender("M");
                this.disableGenderButt();
            } else if (this.#pokeData.genderRatio.F == 1) {
                this.setGender("F");
                this.disableGenderButt();
            } else if (this.#pokeData.genderRatio.M == 0 && this.#pokeData.genderRatio.F == 0) {
                this.setGender();
                this.disableGenderButt();
            } else { // defaulting to male if gender neutral selected
                if(!this.getGender()) this.setGender('M');
                this.enableGenderButt();
            }

        }

    }
    
    /** Updates this poke pixel art icon and stores its coordinates */
    #updateIcon() {

        if(this.#isNone){

            // show a simple pokeball icon
            this.pokeSel.children[0].src = `${stPath.assets}/None.png`;
            this.#iconCoords = [0, 0];
            
        } else {

            // go fetch positions for the big ass spritesheet file
            this.pokeSel.children[0].src = `${stPath.poke}/sprites/pokemonicons-sheet.png`;
            const imgInfo = pkmn.img.Icons.getPokemon(this.#pokeData.name, {
                side: 'p2', gender: this.getGender(), protocol: 'http', domain: stPath.poke
            });
            this.#iconCoords = [imgInfo.left, imgInfo.top];

        }

        // actual image translate
        this.pokeSel.children[0].style.objectPosition = `
            ${this.#iconCoords[0]}px ${this.#iconCoords[1]}px
        `;
        
    }
    getIconCoords() {
        return this.#iconCoords;
    }

    getNickName() {
        return this.nickInp.value;
    }
    setNickName(name) {

        if (this.getNickName() == name) return;

        // if name equals poke species just leave the field empty
        if (name && name != this.getSpecies()) {
            this.nickInp.value = name;
        } else {
            this.nickInp.value = "";
        }

    }

    getForm() {
        return this.formSel.value;
    }
    setForm(value) {
        if(this.#isNone){
            return false;
        }
        //value = formName
        if(this.#shortFormNames.includes(value)){
            let form = this.#formNames[this.#shortFormNames.indexOf(value)]; //We get the form's fullname.
            //We should probably consider making an object with both the short and full name as properties.
            this.setSpecies(form, true);
            return true;
        }
        console.log(`"${value}" isn't a valid form name for ${this.#pokeData.name}.`);
        return false;
        //Should we throw an exception if the value doesn't exist or just log it?
    }
    setFormNumber(value) {

        if (this.formSel.options[value] && this.formSel.value != this.formSel.options[value].value) {
            this.formSel.selectedIndex = value;
            this.setForm(this.formSel.value);
        }
        
    }

    getFormNames() {
        if(this.#isNone){
            return ["Base"];
        }
        return this.#shortFormNames;
    }

    getGender() {
        return this.#gender;
    }
    setGender(value) {
        if (this.#gender != value) {
            if (value) {
                this.#gender = value;
                this.genderIcon.src = `${stPath.assets}/Gender ${value}.png`;
            } else {
                this.#gender = null;
                this.genderIcon.src = `${stPath.assets}/Gender N.png`;
            }
            //Update the icon, for things like Jellicent.
            this.#updateIcon();
        }
    }
    swapGender() {
        if (this.getGender() == "M") {
            this.setGender("F");
        } else {
            this.setGender("M");
        }
    }
    disableGenderButt() {
        this.genderButt.disabled = true;
    }
    enableGenderButt() {
        this.genderButt.disabled = false;
    }

    getShiny() {
        return this.#shiny;
    }
    setShiny(value) {

        if (this.#shiny == value) return;

        this.#shiny = value;
        if (value) {
            this.shinyIcon.style.opacity = 1;
        } else {
            this.shinyIcon.style.opacity = .3;
        }

    }
    swapShiny() {
        if (this.#shiny) {
            this.setShiny(false);
        } else {
            this.setShiny(true);
        }
    }

    getTypes() {
        if(this.#isNone){
            return ["Normal"]; //Placeholder, shouldn't be used for anything but prevents undefined exceptions.
        }
        return this.#pokeData.types;
    }

    async getImgSrc() {

        if (this.#hasLocalImgs) return this.#pokeImgs;

        // only check for this once, fetching the file before this could
        // result in null if the user has to download it
        if (firstBoot) {
            firstBoot = false;
            offsets = await getJson(stPath.poke + "/sprites/offsets");
        }

        // final data to be sent
        this.#pokeImgs = {
            gen5Front : "",
            gen5Back : "",
            aniFront : "",
            aniBack : "",
            gen5FrontOffs : [], // position offsets for overlay
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

            // add those paths to our class
            this.#pokeImgs.gen5Front = results[0]
            this.#pokeImgs.gen5Back = results[1];
            this.#pokeImgs.aniFront = results[2];
            this.#pokeImgs.aniBack = results[3];

            // also add position offsets (substr removes up until "gen5ani/lugia.gif")
            this.#pokeImgs.gen5FrontOffs = offsets[results[0].substr(39)] || [0, 0];
            this.#pokeImgs.gen5BackOffs = offsets[results[1].substr(39)] || [0, 0];
            this.#pokeImgs.aniFrontOffs = offsets[results[2].substr(39)] || [0, 0];
            this.#pokeImgs.aniBackOffs = offsets[results[3].substr(39)] || [0, 0];

        }

        // if we got them images, no need to run this again
        this.#hasLocalImgs = true; // goes to false on species change

        return this.#pokeImgs;

    }
    /**
     * Finds a requested image depending on current Pokemon data
     * @param {String} gen Generation of sprites ( `gen?`, `gen?ani`, and `ani`)
     * @param {String} side If front facing (`p2`) or back facing (`p1`)
     * @returns {Object} Collection of found images
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

            const cleanUrl = browserUrl.substr(23);
            if (!await fileExists(stPath.assets + "/" + cleanUrl)) {
                await fetchFile(
                    "https://gitlab.com/pokemon-stream-tool/pokemon-stream-tool-assets/-/raw/main/play.pokemonshowdown.com/" + cleanUrl.substr(8),
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

    randomize() {
        let fullSpeciesList = [...current.pkmnSpecies];
        let randomSpecies = fullSpeciesList[Math.floor(Math.random()*fullSpeciesList.length)];
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