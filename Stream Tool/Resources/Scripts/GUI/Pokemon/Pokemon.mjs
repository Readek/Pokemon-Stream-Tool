import { pokeFinder } from "../Finder/Pokemon Finder.mjs";
import { stPath } from "../Globals.mjs";

export class Pokemon {

    #gender;

    constructor(el) {

        this.pokeSel = el.getElementsByClassName(`pokeSelector`)[0];
        this.nickInp = el.getElementsByClassName(`pokeNickName`)[0];
        this.formSel = el.getElementsByClassName(`pokeForm`)[0];
        this.genderButt = el.getElementsByClassName(`pokeGenderButton`)[0];
        this.genderIcon = el.getElementsByClassName(`pokeGenderIcon`)[0];
        
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

        // set the pokemon name and icon on the selector
        if (!name || name == "None") {
            this.pokeSel.children[1].innerHTML = "";
            this.pokeSel.children[0].src = `${stPath.poke}/../None.png`;
        } else {
            this.pokeSel.children[1].innerHTML = name;
            this.pokeSel.children[0].src = `${stPath.poke}/${name}/Icon/Default.png`;
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

    getForm() {
        return this.formSel.value;
    }
    setForm(value) {
        this.formSel.value = value;
    }

    getGender() {
        return this.#gender;
    }
    setGender(value) {
        this.#gender = value;
        this.genderIcon.src = `Assets/Gender ${value}.png`;
    }

    swapGender() {
        if (this.getGender() == "M") {
            this.setGender("F");
        } else {
            this.setGender("M");
        }
    }

    getSriteImgSrc() {
        return `../../Resources/Assets/Pokemon/${this.getSpecies()}/Sprite Anim/${this.getForm()}.gif`;
    }

}