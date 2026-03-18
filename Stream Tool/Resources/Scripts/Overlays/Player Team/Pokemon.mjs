import { typeToColor } from "../Type to Color.mjs";
import { getLocalizedPokeText, getLocalizedText } from "../../Utils/Language.mjs";
import { current } from "../Globals.mjs";
/** @import { PokemonSentData, PokeGender, PokeType, PokeImgData } from "../../Utils/Type Definitions.mjs" */

const pokeTemplate = document.getElementById("teamPokeTemplate");

export class Pokemon extends HTMLElement {

    #species = "";
    #form = "";
    #lvl = -1;
    #nickname = "¡";
    #gender = "";
    /** @type {PokeType[]} */
    #types = [];
    #status = "";
    #shiny = false;

    #hpCurrent = -1;
    #hpMax = -1;
    #hpActive = -1;
    #hpDecreasing = false;
    #noHpAnim = false;

    /** @type {PokeImgData} */
    #img;
    #side = "Front";

    /**
     * Manages all info related to a player's pokemon
     */
    constructor() {

        super();
        const template = pokeTemplate.content;
        const shadow = this.attachShadow({ mode: "open" });
        shadow.appendChild(document.importNode(template, true));

        this.mainEl = shadow.getElementById("pokeDiv");
        const el = this.mainEl;

        this.speciesEl = el.getElementsByClassName(`pokeSpecies`)[0];
        this.lvlEl = el.getElementsByClassName(`pokeLvlNum`)[0];
        this.nickEl = el.getElementsByClassName(`pokeNick`)[0];
        this.gendEl = el.getElementsByClassName(`pokeGender`)[0];

        this.hpBar = el.getElementsByClassName(`pokeHpBarCurrent`)[0];
        this.hpEl = el.getElementsByClassName(`pokeHpText`)[0];

        this.imgEl = el.getElementsByClassName(`pokeImg`)[0];

        // initialize status state
        this.#status = "---";
        el.classList.add("poke---");

        // add localized strings where needed
        const lvlTextEl = el.getElementsByClassName(`pokeLvlText`)[0];
        lvlTextEl.textContent = getLocalizedText("pokeLvl");

    }

    /** @param {String} species */
    setSpecies(species) {
        this.#species = species;
        this.speciesEl.textContent = getLocalizedPokeText(
            species, "Pokemon", current.generation);
        this.speciesEl.setAttribute("locPokemon", species);
    }
    getSpecies() {
        return this.#species;
    }

    /**
     * @param {String} form 
     * @param {Boolean} megaEvolving 
     */
    setForm(form, megaEvolving) {

        this.#form = form;

        // cool mega evolution animation
        if (megaEvolving) {
            this.imgEl.style.animation = `
                megaAnim 3.5s ${current.megaTime / 1000}s linear forwards
            `;
            this.imgEl.getAnimations()[0].play();
        }

    }
    getForm() {
        return this.#form;
    }

    /** @param {Number} lvl */
    setLvl(lvl) {

        this.#lvl = lvl;
        this.lvlEl.textContent = lvl;

        // if lvl equals 0, hide it
        if (lvl) {
            this.mainEl.classList.remove("hidePokeLvlDiv");
        } else {
            this.mainEl.classList.add("hidePokeLvlDiv");
        }

    }
    getLvl() {
        return this.#lvl;
    }

    /** @param {String} name */
    setNickname(name) {

        this.#nickname = name;
        this.nickEl.textContent = name;

        // hide or show sub text depending on if the poke has a nickname or not
        if (name && name != this.getSpecies()) {
            this.speciesEl.parentElement.style.display = "flex";
            this.nickEl.removeAttribute("locPokemon");
        } else {
            this.nickEl.textContent = getLocalizedPokeText(
                this.getSpecies(), "Pokemon", current.generation);
            this.nickEl.setAttribute("locPokemon", this.getSpecies());
            this.speciesEl.parentElement.style.display = "none";
        }

    }
    getNickname() {
        return this.#nickname;
    }

    /** @param {PokeGender} gender */
    setGender(gender) {
        this.#gender = gender;
        this.gendEl.textContent = getLocalizedText(`pokePronoun${gender || "Null"}`);
        this.gendEl.setAttribute("locText", `pokePronoun${gender || "Null"}`);
    }
    /** @returns {PokeGender} */
    getGender() {
        return this.#gender;
    }

    /** @param {PokeType[]} types */
    setTypes(types) {
        this.#types = types;
        this.#setBackgroundColor(types);
    }
    /** @returns {PokeType[]} */
    getTypes() {
        return this.#types;
    }

    /** @param {String} status */
    setStatus(status) {

        // if fainted, let HP decide when to set status
        // if hp is 0/0, we'll assume user is using manual and thus allow fainted status
        if (status != "Fai" || (this.#hpCurrent == 0 && this.#hpMax == 0)) {
            this.mainEl.classList.replace(`poke${this.#status}`, `poke${status}`);
            this.#status = status;
        }

    }
    getStatus() {
        return this.#status;
    }

    getHpCurrent() {
        return this.#hpCurrent;
    }
    getHpMax() {
        return this.#hpMax;
    }
    /**
     * @param {Number} hp
     * @param {Numner} max
     */
    async setHp(hp, max) {
        
        const oldHp = this.#hpCurrent;
        this.#hpCurrent = hp;
        this.#hpMax = max;

        // hide or show the health bar if pokemon is hurt (or in combat)
        this.#displayHPBar();

        if (oldHp <= hp || this.#noHpAnim) {

            // if HP increased, just do everything instantly without animations
            this.#hpActive = hp;
            this.#updateHpBar(hp);
            return;

        }

        // our boi has been damaged! play some animations

        // we fake a wait here to avoid having the overlay show data
        // before it happens in game, since data in memory updates
        // before displaying it in game
        await new Promise(resolve => setTimeout(resolve, 1500));

        // trigger that oomf animation
        this.#shakeIt();
        // wait a bit before hp starts ticking down to direct viewer's eyes
        await new Promise(resolve => setTimeout(resolve, 500));

        // decrease that health bar
        if (!this.#hpDecreasing) {

            this.#hpDecreasing = true;

            while (this.#hpActive >= this.#hpCurrent) {

                this.#updateHpBar(this.#hpActive);

                await new Promise(resolve => setTimeout(resolve, 1000/30)); // 30 fps

                this.#hpActive--;

            }

            this.#hpDecreasing = false;

        }

    }

    /**
     * Updates the pokemon's health bar along with the HP texts
     * @param {Number} hp - HP value to display
     */
    #updateHpBar (hp) {

        // update hp texts
        this.hpEl.textContent = hp + "/" + this.#hpMax;

        // adjust the health bar
        const percent = hp / this.#hpMax * 100 - 100;
        this.hpBar.style.transform = "translateX("+percent+"%)";

        // and just because its cool, recolor border if in danger
        if (hp == this.#hpMax) {
            // this one is here for data sent with 0/0 HP
            this.mainEl.style.setProperty("--activeColor", "var(--healthy)");
        } else if (hp <= 0) { // 0%
            this.setStatus("Ded");
        } else if (hp <= this.#hpMax*.2) { // 20%
            this.mainEl.style.setProperty("--activeColor", "var(--danger)");
        } else if (hp <= this.#hpMax/2) { // 50%
            this.mainEl.style.setProperty("--activeColor", "var(--warning)");
        } else {
            this.mainEl.style.setProperty("--activeColor", "var(--healthy)");
        }

    }

    setInCombat(value) {

        if (this.inCombat == value) return;

        this.inCombat = value;

        this.#turnSprite(value);
        this.#displayHPBar();

    }

    /**
     * Group of image src's for this pokemon
     * @param {PokeImgData} img 
     */
    setImg(img) {

        if (!img) return;

        // We compensate to account for the cases where the gif center is skewed
        // towards a place where the Pokémon doesn't spend that much time;
        // e.g., Pokémon that jump (Rotom-Heat, Weavile) or extend their
        // body (Thundurus-Therian, Timburr).
        // The offsets are the difference between the actual center of the gif
        // and the mean of the bounding boxes of each gif frame, and are precalculated
        // using a Python script included in the assets repo.
        const offset = img["gen5" + this.#side + "Offs"];
        this.imgEl.style.transform = `scale(2) translate(${offset[0]}px, ${offset[1]}px)`;

        // actual image change
        this.#img = img;
        this.imgEl.src = img["gen5" + this.#side];

    }
    getImgSrc() {
        return this.#img;
    }

    /**
     * Changes the background color depending on the pokemons type
     * @param {Array} types - Names of types (Strings)
     */
    #setBackgroundColor(types) {
        if (types.length == 2) {
            this.mainEl.style.background = `linear-gradient(to bottom,
                ${typeToColor(types[1])}35, ${typeToColor(types[0])}75)`;
        } else if (types.length == 1) {
            this.mainEl.style.background = `${typeToColor(types[0])}75`;
        }
    }

    /**
     * Compares current types with incoming
     * @param {Array} types - Names of types (Strings)
     * @returns {Boolean} - True if different
     */
    #compareIncTypes(types) {
        if (types.length == this.#types.length) {
            for (let i = 0; i < types.length; i++) {
                if (types[i] != this.#types[i]) {
                    return true
                }
            }
            return;
        }
        return true;
    }

    /**
     * Turns the pokemon's sprite
     * @param {Boolean} side - True for "Back", false for "Front"
     */
    #turnSprite(side) {
        this.#side = side ? "Back" : "Front";
        this.setImg(this.getImgSrc());
    }


    /** Shows or hides pokemon's HP bar and adjusts other elements */
    #displayHPBar() {

        // if pokemon is hurt or in combat
        if (this.inCombat || this.getHpCurrent() < this.getHpMax()) {

            this.mainEl.classList.remove("pokeDivOutOfCombat");
            this.mainEl.classList.add("pokeDivInCombat");

        } else {

            this.mainEl.classList.remove("pokeDivInCombat");
            this.mainEl.classList.add("pokeDivOutOfCombat");

        }

    }

    /** Triggers a shake animation for the entire pokemon div */
    async #shakeIt() {

        // apply the animation the first time this happens
        if (!this.mainEl.getAnimations()[0]) {
            this.mainEl.style.animation = `
                shake cubic-bezier(0.0, 0.3, 0.1, 1.0) .4s forwards
            `;
        }
        this.mainEl.getAnimations()[0].play();

    }


    /**
     * Updates data for this pokemon if its different from previous data
     * @param {PokemonSentData} data - Full data for this pokemon
     * @param {Boolean} bTypeChanged - If we just swapped battle type
     */
    async update(data, bTypeChanged) {

        this.#noHpAnim = bTypeChanged;
        let megaEvolving;

        // set species
        if (data.species != this.getSpecies() ||
            data.form != this.getForm()) {

            // dont animate hp changes if pokemon changed
            this.#noHpAnim = true;

            if (data.species == this.getSpecies() && data.form.includes("Mega")) {
                megaEvolving = true;
            }

            this.setSpecies(data.species);
            this.setForm(data.form, megaEvolving);

            // if pokemon is mega evolving, wait for that img update
            if (megaEvolving) {
                setTimeout(() => {
                    this.setImg(data.img);
                    this.setTypes(data.types);
                    this.#shakeIt();
                }, 2700 + (current.megaTime));
                current.megaTime = 0;
            } else {
                this.setImg(data.img);
            }

            this.#shiny = data.shiny;

        } else if (this.#shiny != data.shiny) {
            // if shiny was toggled, just update the image
            this.setImg(data.img);
            this.#shiny = data.shiny;
        }

        // set level
        if (data.lvl != this.getLvl()) {
            this.setLvl(data.lvl);
        }

        // set nickname
        if (data.nickName != this.getNickname()) {
            this.setNickname(data.nickName);
        }

        // set gender
        if (data.gender != this.getGender()) {
            this.setGender(data.gender);
        }

        // set background color
        if (!megaEvolving && this.#compareIncTypes(data.types)) {
            this.setTypes(data.types);
        }

        // set status condition
        this.setStatus(data.status);

        // set HP
        if (this.getHpCurrent() != data.hpCurrent || this.getHpMax() != data.hpMax) {
            this.setHp(data.hpCurrent, data.hpMax, bTypeChanged);
        }

        // in combat status
        this.setInCombat(data.inCombat);        

    }

    /** All things have to die someday */
    async delet() {
        
        // say goodbye
        this.style.opacity = 0;
        await this.getAnimations()[0].finished;

        // the ilusion of removing an item from a list smoothly
        const mindTheGap = Number(window.getComputedStyle(this.parentElement)
            .getPropertyValue("gap").replace("px", ""));
        this.style.marginLeft = (-this.offsetWidth-mindTheGap)+"px";
        
        // and after that finishes, dont come back
        await this.getAnimations()[0].finished;
        this.remove();

    }

}

customElements.define("team-pokemon", Pokemon);