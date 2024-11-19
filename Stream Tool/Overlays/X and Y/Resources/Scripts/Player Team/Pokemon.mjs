import { typeToColor } from "../Type to Color.mjs";
import { getLocalizedPokeText, getLocalizedText } from "../../../../../Resources/Scripts/Utils/Language.mjs";
import { current } from "../Globals.mjs";
/** @import { PokemonSentData } from "../../../../../Resources/Scripts/Utils/Type Definitions.mjs" */

export class Pokemon {

    #species = "";
    #form = "";
    #lvl = 0;
    #nickname = "¡";
    #gender = "";
    #types = [];
    #status = "";
    #shiny = false;

    #hpCurrent = -1;
    #hpMax = -1;
    #hpActive = -1;
    #hpDecreasing = false;
    #noHpAnim = false;

    #img = "";
    #side = "Front";

    #showHideTimeout;

    /**
     * Manages all info related to a player's pokemon
     * @param {HTMLElement} el 
     */
    constructor(el) {

        this.mainEl = el;

        this.speciesEl = el.getElementsByClassName(`pokeSpecies`)[0];
        this.lvlEl = el.getElementsByClassName(`pokeLvlNum`)[0];
        this.nickEl = el.getElementsByClassName(`pokeNick`)[0];
        this.gendEl = el.getElementsByClassName(`pokeGender`)[0];

        this.hpBar = el.getElementsByClassName(`pokeHpBarCurrent`)[0];
        this.hpEl = el.getElementsByClassName(`pokeHpText`)[0];

        this.imgEl = el.getElementsByClassName(`pokeImg`)[0];

        // initialize status state
        this.#status = "---";
        this.mainEl.classList.add("poke---");
        
    }

    
    /** @param {String} species */
    setSpecies(species) {
        this.#species = species;
        if (!species) return; // we dont need to continue if no poke
        this.speciesEl.innerHTML = getLocalizedPokeText(species, "Pokemon", current.generation);
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

        if (megaEvolving) {
            this.imgEl.style.animation = `megaAnim 3.5s ${current.megaTime / 1000}s linear`;
            setTimeout(() => {
                this.imgEl.style.animation = "";
            }, 3500 + current.megaTime);
        }
        
    }
    getForm() {
        return this.#form;
    }

    /** @param {Number} lvl */
    setLvl(lvl) {
        this.#lvl = lvl;
        this.lvlEl.innerHTML = lvl;
    }
    getLvl() {
        return this.#lvl;
    }

    /** @param {String} name */
    setNickname(name) {

        this.#nickname = name;
        this.nickEl.innerHTML = name;        

        // hide or show sub text depending on if the poke has a nickname or not        
        if (name && name != this.getSpecies()) {
            this.speciesEl.parentElement.style.display = "flex";
            this.nickEl.removeAttribute("locPokemon");
        } else {            
            this.nickEl.innerHTML = getLocalizedPokeText(
                this.getSpecies(), "Pokemon", current.generation);
            this.nickEl.setAttribute("locPokemon", this.getSpecies());
            this.speciesEl.parentElement.style.display = "none";
        }

    }
    getNickname() {
        return this.#nickname;
    }

    /**
     * Gender can be "F", "M", or null
     * @param {String} gender 
     */
    setGender(gender) {
        this.#gender = gender;
        this.gendEl.innerHTML = getLocalizedText("pokePronoun" + (gender || "Null"));
        this.gendEl.setAttribute("locText", "pokePronoun" + (gender || "Null"));
    }
    getGender() {
        return this.#gender;
    }

    /** @param {String[]} types */
    setTypes(types) {
        this.#types = types;
        this.#setBackgroundColor(types);
    }
    /** @returns {String[]} */
    getTypes() {
        return this.#types;
    }

    /** @param {String} status */
    setStatus(status) {

        // if fainted, let HP decide when to set status
        // if hp is 0/0, we'll assume user is using manual and thus allow fainted status
        if (status != "Fai" || (this.#hpCurrent == 0 && this.#hpMax == 0)) {
            this.mainEl.classList.replace("poke" + this.#status, "poke" + status);
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
        this.displayHPBar();

        if (oldHp <= hp || this.#noHpAnim) {

            // if HP increased, just do everything instantly without animations
            this.#hpActive = hp;
            this.#updateHpBar(hp);
            
        } else {

            // our boi has been damaged! play some animations

            // we fake a wait here to avoid having the overlay show data
            // before it happens in game, since data in memory updates
            // before displaying it in game
            await new Promise(resolve => setTimeout(resolve, 1500));

            this.mainEl.style.animation = "shake cubic-bezier(0.0, 0.3, 0.1, 1.0) .4s";
            await new Promise(resolve => setTimeout(resolve, 500));
            this.mainEl.style.animation = "";
            
            if (!this.#hpDecreasing) {

                this.#hpDecreasing = true;

                while (this.#hpActive >= this.#hpCurrent) {

                    this.#updateHpBar(this.#hpActive);
    
                    await new Promise(resolve => setTimeout(resolve, 1000/30));
        
                    this.#hpActive--;
    
                }

                this.#hpDecreasing = false;

            }
            

        }        

    }

    /**
     * Updates the pokemon's health bar along with the HP texts
     * @param {Number} hp - HP value to display
     */
    #updateHpBar (hp) {

        // update hp texts
        this.hpEl.innerHTML = hp + "/" + this.#hpMax;

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

        this.turnSprite(value);
        this.displayHPBar(value);         

    }

    /**
     * Group of image src's for this pokemon
     * @param {String[]} img 
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

    /** Hides this pokemon's div */
    hidePoke() {

        this.mainEl.style.opacity = "0";

        // this prevents bugs if a pokemon hides and shows fast enough
        clearTimeout(this.#showHideTimeout);

        this.#showHideTimeout = setTimeout(() => {
            // we use margin here with div width + flex gap
            this.mainEl.style.marginLeft = "-315px";
            this.setSpecies(null);
        }, 250);

    }
    /** Shows this pokemon on the list */
    showPoke() {

        this.mainEl.style.marginLeft = "0px";

        clearTimeout(this.#showHideTimeout);

        this.#showHideTimeout = setTimeout(() => {
            this.mainEl.style.opacity = "1";
        }, 300);
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
    turnSprite(side) {
        this.#side = side ? "Back" : "Front";
        this.setImg(this.getImgSrc());
    }


    /** Shows or hides pokemon's HP bar and adjusts other elements */
    displayHPBar() {

        // if pokemon is hurt or in combat
        if (this.inCombat || this.getHpCurrent() < this.getHpMax()) {

            this.hpEl.parentElement.style.transform = "translateY(0px)";
            this.nickEl.parentElement.style.transform = "translateY(0px)";

        } else {

            this.hpEl.parentElement.style.transform = "translateY(25px)";
            this.nickEl.parentElement.style.transform = "translateY(10px)";

        }

    }


    /**
     * Updates data for this pokemon if its different from previous data
     * @param {PokemonSentData} data - Full data for this pokemon
     * @param {Boolean} bTypeChanged - If we just swapped battle type
     */
    async update(data, bTypeChanged) {

        this.#noHpAnim = bTypeChanged;

        // set species
        if (data.species != this.getSpecies() ||
            data.form != this.getForm()) {

            // dont animate hp changes if pokemon changed
            this.#noHpAnim = true;

            if (data.species) {

                let megaEvolving;
                if (data.species == this.getSpecies() && data.form.includes("Mega")) {
                    megaEvolving = true;
                }

                this.setSpecies(data.species);
                this.setForm(data.form, megaEvolving);
                
                this.showPoke();

                // if pokemon is mega evolving, wait for that img update
                if (megaEvolving) {
                    setTimeout(() => {this.setImg(data.img)}, 2700 + (current.megaTime));
                    current.megaTime = 0;                    
                } else {
                    this.setImg(data.img);
                }

                this.#shiny = data.shiny;

            } else {
                this.hidePoke();
            }

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
        if (this.#compareIncTypes(data.types)) {
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

}