import { Pokemon } from "../Pokemon.mjs";

export class TeamPokemon extends Pokemon {

    #status = "";

    constructor() {

        super();

        this.lvlInp = this.el.getElementsByClassName("pokeLvlNumber")[0];

        this.hpCurrentInp = this.el.getElementsByClassName('pokeHpCurrent')[0];
        this.hpMaxInp = this.el.getElementsByClassName('pokeHpMax')[0];
        
        this.statusSel = this.el.getElementsByClassName('pokeStatus')[0];

    }

    getLvl() {
        return this.lvlInp.value;
    }
    setLvl(value) {
        if (this.getLvl() == value) return;
        this.lvlInp.value = value;
    }

    getHpCurrent() {
        return Number(this.hpCurrentInp.value);
    }
    /**
     * @param {Number} value 
     */
    setHpCurrent(value) {

        if (this.getHpCurrent() == value) return;

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
        if (this.getHpMax() == value) return;
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
        if (this.#status == value) return;
        this.#status = value;
        this.statusSel.value = value || "---";
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