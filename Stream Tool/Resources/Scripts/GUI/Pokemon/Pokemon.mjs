import { getLocalizedText } from "../../Utils/Language.mjs";
import { pokeFinder } from "../Finder/Pokemon Finder.mjs";
import { current, nameReplacements, stPath } from "../Globals.mjs";

export class Pokemon {

    #gender = "M";
    #shiny = false;
    #pokeData;
    #baseFormPokeData;
    #form = ""; //Short name.
    #formNames = []; //These can be used as identifiers for current.pkmnSpecies.get(); e.g., "Wormadam-Trash".
    #shortFormNames = []; //These only have the form name and are better suited for the selector; e.g., "Trash".
    #isNone = true;

    constructor() {

        const el = this.generateElement();

        this.pokeSel = el.getElementsByClassName(`pokeSelector`)[0];
        this.nickInp = el.getElementsByClassName(`pokeNickName`)[0];
        this.lvlInp = el.getElementsByClassName("pokeLvlNumber")[0];
        this.formSel = el.getElementsByClassName(`pokeForm`)[0];

        this.genderButt = el.getElementsByClassName(`pokeGenderButton`)[0];
        this.genderIcon = el.getElementsByClassName(`pokeGenderIcon`)[0];

        this.shinyButt = el.getElementsByClassName('pokeShinyButton')[0];
        this.shinyIcon = el.getElementsByClassName('pokeShinyIcon')[0];

        this.hpCurrentInp = el.getElementsByClassName('pokeHpCurrent')[0];
        this.hpMaxInp = el.getElementsByClassName('pokeHpMax')[0];
        
        this.statusSel = el.getElementsByClassName('pokeStatus')[0];

        
        // set a listener that will trigger when pokemon selector is clicked
        this.pokeSel.addEventListener("click", () => {
            pokeFinder.open(this.pokeSel);
            pokeFinder.setCurrentPokemon(this);
            pokeFinder.focusFilter();
            pokeFinder.setSpeciesFocus();
        });
        // also set an initial pokemon value
        this.setSpecies();

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
     */
    setSpecies(name) {

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
            
            // set types from @pkmn/data Specie object
            let types = this.#pokeData.types;
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
    
    #updateIcon() {
        if(this.#isNone){
            this.pokeSel.children[0].alt = "None";
            this.pokeSel.children[0].src = `${stPath.assets}/None.png`;
            this.pokeSel.children[0].style.objectPosition = `-0px -0px`;
            return;
        }
        let imgInfo = pkmn.img.Icons.getPokemon(this.#pokeData.name, {side: 'p2', gender: this.getGender(), protocol: 'http', domain: stPath.poke});
        this.pokeSel.children[0].alt = this.#pokeData.name;
        this.pokeSel.children[0].src = `${stPath.poke}/sprites/pokemonicons-sheet.png`;
        this.pokeSel.children[0].style.objectPosition = `${imgInfo.left}px ${imgInfo.top}px`;
    }

    getNickName() {
        return this.nickInp.value;
    }
    setNickName(name) {
        if (name) {
            this.nickInp.value = name;
        } else {
            this.nickInp.value = "";
        }
    }

    getLvl() {
        return this.lvlInp.value;
    }
    setLvl(value) {
        this.lvlInp.value = value;
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
            this.setSpecies(form);
            return true;
        }
        console.log(`"${value}" isn't a valid form name for ${this.#pokeData.name}.`);
        return false;
        //Should we throw an exception if the value doesn't exist or just log it?
    }
    setFormNumber(value) {
        this.formSel.selectedIndex = value;
        this.setForm(this.formSel.value);
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

    getHpCurrent() {
        return Number(this.hpCurrentInp.value);
    }
    /**
     * @param {Number} value 
     */
    setHpCurrent(value) {

        this.hpCurrentInp.value = value;

        // and just because its cool, recolor border if in danger
        if (value <= 0 && this.getHpMax() == 0) {
            // do nothin
        } else if (value <= 0) {
            this.hpCurrentInp.parentElement.style.setProperty("--activeColor", "var(--ded)");
        } else if (value <= this.getHpMax()*.2) { // 20%
            this.hpCurrentInp.parentElement.style.setProperty("--activeColor", "var(--danger)");
        } else if (value <= this.getHpMax()/2) { // 50%
            this.hpCurrentInp.parentElement.style.setProperty("--activeColor", "var(--warning)");
        } else {
            this.hpCurrentInp.parentElement.style.setProperty("--activeColor", "var(--healthy)");
        }

    }

    getHpMax() {
        return Number(this.hpMaxInp.value);
    }
    /**
     * @param {Number} value 
     */
    setHpMax(value) {
        this.hpMaxInp.value = value;
    }

    /**
     * @returns {String}
     */
    getStatus() {
        return this.statusSel.value;
    }
    /**
     * @param {String} value 
     */
    setStatus(value) {
        if (this.getHpCurrent() <= 0 && this.getHpMax()) {
            value = "Fai"
        }
        this.statusSel.value = value || "---";
    }

    getTypes() {
        if(this.#isNone){
            return ["Normal"]; //Placeholder, shouldn't be used for anything but prevents undefined exceptions.
        }
        return this.#pokeData.types;
    }

    getImgSrc() {

        // final data to be sent
        const img = {
            gen5Front : "",
            gen5Back : "",
            aniFront : "",
            aniBack : ""
        }

        if(!this.#isNone){
            // get those actual images!
            img.gen5Front = this.#findImg("gen5ani", "p2");
            img.gen5Back = this.#findImg("gen5ani", "p1");
            img.aniFront = this.#findImg("ani", "p2");
            img.aniBack = this.#findImg("ani", "p1");
        }

        return img;

    }
    /**
     * Finds a requested image depending on current Pokemon data
     * @param {String} gen Generation of sprites ( `gen?`, `gen?ani`, and `ani`)
     * @param {String} side If front facing (`p2`) or back facing (`p1`)
     * @returns {Object} Collection of found images
     */
    #findImg(gen, side) {
        let imgData = pkmn.img.Sprites.getPokemon(this.#pokeData.name, {
            gen: gen,
            side: side,
            gender: this.getGender(),
            shiny: this.#shiny,
            protocol: 'http', domain: "../../Resources/Assets/Pokemon"
        })
        return imgData.url.replace("http://", ""); //ugly workaround.
    }

    getPokeData() {
        return this.#pokeData;
    }

    clear() {
        this.setSpecies("None");
    }
    randomize() {
        let fullSpeciesList = [...current.pkmnSpecies];
        let randomSpecies = fullSpeciesList[Math.floor(Math.random()*fullSpeciesList.length)];
        this.setSpecies(randomSpecies.name);
    }


    /** Creates the pokemon's HTML element */
    generateElement() {

        const element = document.createElement("div");
        element.classList.add("pokemonDiv");
        // and now for the big fat text
        element.innerHTML = `
        
            <div class="finderPosition">
                <div class="selector pokeSelector" tabindex="-1" locTitle="pokeSelectTitle">
                <img class="pokeSelectorIcon" alt="">
                <div class="pokeSelectorText"></div>
                </div>
            </div>

            <input type="text" class="pokeNickName textInput mousetrap" spellcheck="false" locTitle="pokeNickTitle" locPHolder="pokeNickPHolder">

            <div class="pokeLvlDiv" locTitle="pokeLvlTitle">
                <div class="pokeLvlText" locText="pokeLvl"></div>
                <input class="pokeLvlNumber" type="number" min="1" max="100" value="1">
            </div>          

            <select class="pokeForm" locTitle="pokeFormTitle">
            </select>

            <button class="pokeGenderButton" locTitle="pokeGenderTitle">
                <img class="pokeGenderIcon" src="Assets/Gender M.png" alt="">
            </button>

            <button class="pokeShinyButton" locTitle="pokeShinyTitle">
                <img class="pokeShinyIcon" src="Assets/Shiny Icon.png" alt="">
            </button>

            <div class="pokeHpDiv" locTitle="pokeHpTitle">
                <input class="pokeHpNumber pokeHpCurrent" type="number" min="0" max="999" value="0">
                /
                <input class="pokeHpNumber pokeHpMax" type="number" min="0" max="999" value="0">
            </div>

            <select class="pokeStatus" locTitle="pokeStatusTitle">
                <option value="---">----</option>
                <option value="Par" locText="pokeStatusPar"></option>
                <option value="Poi" locText="pokeStatusPoi"></option>
                <option value="Fro" locText="pokeStatusFro"></option>
                <option value="Bur" locText="pokeStatusBur"></option>
                <option value="Sle" locText="pokeStatusSle"></option>
                <option value="Fai" locText="pokeStatusFai"></option>
            </select>

        `

        // add it to the GUI
        document.getElementById("pokeParty").appendChild(element);
        return element;

    }

}