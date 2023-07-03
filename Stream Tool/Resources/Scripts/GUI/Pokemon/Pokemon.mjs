import { pokeFinder } from "../Finder/Pokemon Finder.mjs";
import { current, nameReplacements, stPath } from "../Globals.mjs";

const dexGen = new pkmn.data.Generations(pkmn.dex.Dex);
const pokeInfo = dexGen.get(current.generation).species;

export class Pokemon {

    #gender = "M";
    #shiny = false;
    #pokeData;
    #baseFormPokeData;
    #form = ""; //Short name.
    #formNames = []; //These can be used as identifiers for pokeInfo.get(); e.g., "Wormadam-Trash".
    #shortFormNames = []; //These only have the form name and are better suited for the selector; e.g., "Trash".
    #isNone = true;

    constructor(el) {

        this.pokeSel = el.getElementsByClassName(`pokeSelector`)[0];
        this.nickInp = el.getElementsByClassName(`pokeNickName`)[0];
        this.lvlInp = el.getElementsByClassName("pokeLvlNumber")[0];
        this.formSel = el.getElementsByClassName(`pokeForm`)[0];

        this.genderButt = el.getElementsByClassName(`pokeGenderButton`)[0];
        this.genderIcon = el.getElementsByClassName(`pokeGenderIcon`)[0];

        this.shinyButt = el.getElementsByClassName('pokeShinyButton')[0];
        this.shinyIcon = el.getElementsByClassName('pokeShinyIcon')[0];

        this.typeImg1 = el.getElementsByClassName('typeIcon1')[0];
        this.typeImg2 = el.getElementsByClassName('typeIcon2')[0];
        
        
        // set a listener that will trigger when pokemon selector is clicked
        this.pokeSel.addEventListener("click", () => {
            pokeFinder.open(this.pokeSel);
            pokeFinder.setCurrentPokemon(this);
            pokeFinder.focusFilter();
        });
        // also set an initial pokemon value
        this.setSpecies();

        this.genderButt.addEventListener("click", () => {this.swapGender()});

        this.shinyButt.addEventListener("click", () => {this.swapShiny()});

        // event listener for the form selector.
        this.formSel.addEventListener("change", () => {this.setForm(this.formSel.value)});

    }

    getSpecies() {
        //Maybe we should rename this to getSpeciesName(), in order to emphasize that this doesn't return forms and the names are replaced. 
        //(In other words, this doesn't return unique identifiers, but human-readable values).
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
            //We also disable the type icons.
            this.typeImg1.style.display = "none";
            this.typeImg2.style.display = "none";
            //In case you select a gender-locked Pokémon before and you want to pre-select another Pokémon's gender.
            //Alternatively, we could disable everything but the Pokémon selector, in order to remain consistent.
            this.enableGenderButt();
        } else {

            this.#isNone = false;
            // this will fetch us all the data we will ever need
            // We should consider migrating this logic to another class.
            this.#pokeData = pokeInfo.get(name);
            this.#baseFormPokeData = pokeInfo.get(this.#pokeData.baseSpecies); //Only the base species has data about forms.

            // set the pokemon name and icon on the selector
            this.pokeSel.children[1].innerHTML = nameReplacements[this.#pokeData.baseSpecies] ?? this.#pokeData.baseSpecies; //We use the base species name.
            this.#updateIcon();
            
            // set types from @pkmn/data Specie object
            let types = this.#pokeData.types;
            this.typeImg1.src = `${stPath.assets}/Type Icons/${types[0]}.png`;
            if (types[1]) {
                this.typeImg2.src = `${stPath.assets}/Type Icons/${types[1]}.png`;
                this.typeImg2.style.display = "block";
            } else {
                this.typeImg2.style.display = "none";
            }
            // sets the form lists.
            this.#form = this.#pokeData.forme || this.#pokeData.baseForme || "Base";
            this.#formNames = this.#baseFormPokeData.formes ?? [this.#pokeData.name];
            this.#shortFormNames = this.#formNames.map( (speciesName) => {
                let forme = pokeInfo.get(speciesName);
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
            } else {
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
            this.#gender = "M";
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

    getTypes() {
        if(this.#isNone){
            return ["Normal"]; //Placeholder, shouldn't be used for anything but prevents undefined exceptions.
        }
        return this.#pokeData.types;
    }

    getSpriteImgSrc() {
        if(this.#isNone){
            return "../../Resources/Assets/None.png";
        }
        //TODO: don't hardcode gen 5.
        //TODO: Fallback to gen5 if gen5ani doesn't exist.
        let imgData = pkmn.img.Sprites.getPokemon(this.#pokeData.name, {
            gen: "gen5ani", 
            gender: this.getGender(), 
            shiny: this.#shiny,
            protocol: 'http', domain: "../../Resources/Assets/play.pokemonshowdown.com"
        })
        return imgData.url.replace("http://", ""); //ugly workaround.
    }

}