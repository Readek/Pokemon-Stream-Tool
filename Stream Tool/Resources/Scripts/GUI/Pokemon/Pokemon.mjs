import { pokeFinder } from "../Finder/Pokemon Finder.mjs";
import { current, stPath } from "../Globals.mjs";

const dexGen = new pkmn.data.Generations(pkmn.dex.Dex);
const pokeInfo = dexGen.get(current.generation).species;

export class Pokemon {

    #gender = "M";
    #pokeData;
    #baseFormPokeData;
    #form = ""; //Short name.
    #formNames = []; //These can be used as identifiers for pokeInfo.get(); e.g., "Wormadam-Trash".
    #shortFormNames = []; //These only have the form name and are better suited for the selector; e.g., "Trash".

    constructor(el) {

        this.pokeSel = el.getElementsByClassName(`pokeSelector`)[0];
        this.nickInp = el.getElementsByClassName(`pokeNickName`)[0];
        this.lvlInp = el.getElementsByClassName("pokeLvlNumber")[0];
        this.formSel = el.getElementsByClassName(`pokeForm`)[0];

        this.genderButt = el.getElementsByClassName(`pokeGenderButton`)[0];
        this.genderIcon = el.getElementsByClassName(`pokeGenderIcon`)[0];

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

    }

    getSpecies() {
        return this.pokeSel.children[1].innerHTML;
    }
    /**
     * Sets a new pokemon based on the name
     * @param {String} name - Name of the pokemon
     */
    setSpecies(name) {

        // if we select none, just display nothin
        if (!name || name == "None") {
            this.pokeSel.children[1].innerHTML = "";
            this.pokeSel.children[0].src = `${stPath.poke}/../None.png`;
        } else {

            // this will fetch us all the data we will ever need
            // We should consider migrating this logic to another class.
            this.#pokeData = pokeInfo.get(name);
            this.#baseFormPokeData = pokeInfo.get(this.#pokeData.baseSpecies); //Only the base species has data about forms.

            // set the pokemon name and icon on the selector
            this.pokeSel.children[1].innerHTML = name;
            this.pokeSel.children[0].src = `${stPath.poke}/${name}/Icon/Default.png`;

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
        }

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
        //value = formName
        this.formSel.value = value;
        let form = this.#formNames[this.#shortFormNames.indexOf(value)];
        this.setSpecies(form);
        //Untested.
    }

    getFormNames() {
        return this.#shortFormNames;
    }

    getGender() {
        return this.#gender;
    }
    setGender(value) {
        this.#gender = value;
        this.genderIcon.src = `${stPath.assets}/Gender ${value}.png`;
    }
    swapGender() {
        if (this.getGender() == "M") {
            this.setGender("F");
        } else {
            this.setGender("M");
        }
    }

    getTypes() {
        return this.#pokeData.types;
    }

    getSriteImgSrc() {
        return `../../Resources/Assets/Pokemon/${this.getSpecies()}/Sprite Anim/${this.getForm()}.gif`;
    }

}