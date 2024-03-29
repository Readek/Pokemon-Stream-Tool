import { getLocalizedText } from "../../Utils/Language.mjs";
import { Pokemon } from "../Pokemon.mjs";
import { deleteCatch } from "./Catches.mjs";

let idCounter = 1; // used to find pokemon on an array

export class Catch extends Pokemon {

    #id = 0;

    constructor(data) {

        super();

        this.#id = idCounter; // set the unique id to this pokemon
        idCounter++; // change number for the next one
        
        // also set an initial pokemon value
        if (data) { // if we get catch data from somewhere else
            this.setSpecies(data.species);
            this.setForm(data.form);
            this.setGender(data.gender);
            this.setNickName(data.nickname);
            this.setShiny(data.shiny);
        }

        // but what if the pokemon wants to be free
        this.deletButt = this.el.getElementsByClassName('catchDeleteButt')[0];
        this.deletButt.addEventListener("click", () => {this.delet()});
        
    }

    getId() {
        return this.#id;
    }

    /** Creates the pokemon's HTML element */
    generateElement() {

        const element = document.createElement("div");
        element.classList.add("catchDiv");
        // and now for the big fat text
        element.innerHTML = `

            <button class="catchDeleteButt catchButt" locTitle="deleteCatchButtTitle" title="${getLocalizedText("deleteCatchButtTitle")}">-</button>
        
            <div class="finderPosition">
                <div class="selector pokeSelector" tabindex="-1" locTitle="pokeSelectTitle" title="${getLocalizedText("pokeSelectTitle")}">
                <img class="pokeSelectorIcon" alt="">
                <div class="pokeSelectorText"></div>
                </div>
            </div>

            <input type="text" class="pokeNickName textInput mousetrap" locTitle="pokeNickTitle" title="${getLocalizedText("pokeNickTitle")}" locPHolder="pokeNickPHolder" placeholder="${getLocalizedText("pokeNickPHolder")}" spellcheck="false">

            <select class="pokeForm" locTitle="pokeFormTitle" title="${getLocalizedText("pokeFormTitle")}">
            </select>

            <button class="pokeGenderButton" locTitle="pokeGenderTitle" title="${getLocalizedText("pokeGenderTitle")}">
                <img class="pokeGenderIcon" src="Assets/Gender M.png" alt="">
            </button>

            <button class="pokeShinyButton" locTitle="pokeShinyTitle" title="${getLocalizedText("pokeShinyTitle")}">
                <img class="pokeShinyIcon" src="Assets/Shiny Icon.png" alt="">
            </button>

        `

        // add it to the GUI
        document.getElementById("catchesDiv").appendChild(element);
        return element;

    }

    delet() {

        this.el.remove();
        deleteCatch(this.#id);

    }

}