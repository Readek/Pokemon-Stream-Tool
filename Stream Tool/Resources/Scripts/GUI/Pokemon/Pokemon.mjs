import { pokeFinder } from "../Finder/Pokemon Finder.mjs";
import { current, stPath } from "../Globals.mjs";
import { typeToColor } from "../Type to Color.mjs";

const dexGen = new pkmn.data.Generations(pkmn.dex.Dex);
const pokeInfo = dexGen.get(current.generation).species;

export class Pokemon {

    #gender = "M";
    #types = [];
    #typeColors = [];

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
            const pokeData = pokeInfo.get(name);

            // set the pokemon name and icon on the selector
            this.pokeSel.children[1].innerHTML = name;
            this.pokeSel.children[0].src = `${stPath.poke}/${name}/Icon/Default.png`;

            // set pokemon types
            this.#types = pokeData.types;
            for (let i = 0; i < this.#types.length; i++) {
                this.#typeColors[i] = typeToColor(this.#types[i]);
            }

            // set type images
            this.typeImg1.src = `${stPath.assets}/Type Icons/${this.#types[0]}.png`;
            // show or hide second type image
            if (this.#types[1]) {
                this.typeImg2.src = `${stPath.assets}/Type Icons/${this.#types[1]}.png`;
                this.typeImg2.style.display = "block";
            } else {
                this.typeImg2.style.display = "none";
            }

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
        this.formSel.value = value;
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
        return this.#types;
    }
    getTypeColors() {
        return this.#typeColors;
    }

    getSriteImgSrc() {
        return `../../Resources/Assets/Pokemon/${this.getSpecies()}/Sprite Anim/${this.getForm()}.gif`;
    }

}