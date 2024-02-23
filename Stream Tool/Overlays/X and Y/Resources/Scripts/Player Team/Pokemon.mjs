import { current } from "../Globals.mjs";
import { getJson } from "../Get JSON.mjs";
import { typeToColor } from "../Type to Color.mjs";

// these are the sprite offsets so their positions are more centered
const offsets = await getJson("../../Resources/Assets/Pokemon/sprites/offsets.json") || {};

export class Pokemon {

    #species = "";
    #form;
    #lvl = 0;
    #nickname = "";
    #gender = "";
    #types = [];
    #status = "";

    #hpCurrent = -1;
    #hpMax = -1;

    #img = "";
    #side = "Front";

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
        
    }

    
    /** @param {String} species */
    setSpecies(species) {
        this.#species = species;
        this.speciesEl.innerHTML = species;
    }
    getSpecies() {
        return this.#species;
    }

    setForm(form) {
        this.#form = form;
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
        } else {
            this.nickEl.innerHTML = this.getSpecies();
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
        if (gender == "F") {
            this.gendEl.innerHTML = "la";
        } else {
            this.gendEl.innerHTML = "el";
        }
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

        this.#status = status;

        if (status != "---") {
            this.mainEl.style.setProperty("--activeColor", "var(--"+status+")");
        }
        if (status == "Fai") {
            this.mainEl.classList.add("pokeDed");
        } else {
            this.mainEl.classList.remove("pokeDed");
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
    setHp(hp, max) {
        
        this.#hpCurrent = hp;
        this.#hpMax = max;
        this.hpEl.innerHTML = hp + "/" + max;

        // adjust the health bar
        const percent = hp / max * 100 - 100;
        this.hpBar.style.transform = "translateX("+percent+"%)";

        // and just because its cool, recolor border if in danger
        if (hp == max) {
            // this one is here for data sent with 0/0 HP
            this.mainEl.style.setProperty("--activeColor", "var(--healthy)");
        } else if (hp <= max*.2) { // 20%
            this.mainEl.style.setProperty("--activeColor", "var(--danger)");
        } else if (hp <= max/2) { // 50%
            this.mainEl.style.setProperty("--activeColor", "var(--warning)");
        } else {
            this.mainEl.style.setProperty("--activeColor", "var(--healthy)");
        }

        // hide or show the health bar if pokemon is hurt (or in combat)
        this.displayHPBar();

    }

    /**
     * Group of image src's for this pokemon
     * @param {String[]} img 
     */
    setImg(img) {
        
        this.#img = img;
        this.imgEl.src = img["gen5" + this.#side];
        let filename = img["gen5" + this.#side]
            .replace("\\", "/").replace(/.*sprites\//, ""); //"gen5ani/lugia.gif"
        
        // We compensate to account for the cases where the gif center is skewed
        // towards a place where the Pokémon doesn't spend that much time;
        // e.g., Pokémon that jump (Rotom-Heat, Weavile) or extend their
        // body (Thundurus-Therian, Timburr).
        // The offsets are the difference between the actual center of the gif
        // and the mean of the bounding boxes of each gif frame, and are precalculated
        // using a Python script included in the assets repo.
        let offset = offsets[filename] ?? [0, 0];
        this.imgEl.style.transform = `scale(2) translate(${offset[0]}px, ${offset[1]}px)`;
    
    }
    getImgSrc() {
        return this.#img;
    }

    /** Hides this pokemon's div */
    hidePoke() {

        this.mainEl.style.opacity = "0";

        setTimeout(() => {
            // we use margin here with div width + flex gap
            this.mainEl.style.marginLeft = "-315px";
            this.setSpecies(null);
        }, 250);

    }
    /** Shows this pokemon on the list */
    showPoke() {
        this.mainEl.style.marginLeft = "0px";
        setTimeout(() => {
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
        if (current.inCombat || this.getHpCurrent() < this.getHpMax()) {

            this.hpEl.parentElement.style.transform = "translateY(0px)";
            this.nickEl.parentElement.style.transform = "translateY(0px)";

        } else {

            this.hpEl.parentElement.style.transform = "translateY(25px)";
            this.nickEl.parentElement.style.transform = "translateY(10px)";

        }

    }


    update(data) {

        // set species
        if (data.species != this.getSpecies() ||
            data.form != this.getForm()) {
            if (data.species) {
                this.setSpecies(data.species);
                this.setImg(data.img);
                this.showPoke();
                this.setForm(data.form);
            } else {
                this.hidePoke();
            }
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
        
        // set HP
        this.setHp(data.hpCurrent, data.hpMax);

        // set status condition
        this.setStatus(data.status);

    }

}