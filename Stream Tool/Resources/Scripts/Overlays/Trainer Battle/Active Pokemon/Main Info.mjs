import { getLocalizedPokeText, getLocalizedText } from "../../../Utils/Language.mjs";
import { current } from "../../Globals.mjs";
import { typeToColor } from "../../Type to Color.mjs";
import { ActivePokemon } from "./Active Pokemon.mjs";
/** @import { Coords, PokeImgData, PokemonSentData} from "../../../Utils/Type Definitions.mjs" */


export class ActiveMainInfo {

    #player;

    #species = "";
    #form = "";
    #lvl = 0;
    #types = [];
    #name = "¡";
    #ability = "";
    /** @type {String} */
    #item;
    #status = "";
    #shiny = false;

    #hpCurrent = -1;
    #hpMax = -1;
    #hpActive = -1;
    #hpDecreasing = false;
    #noHpAnim = false;

    #mainEl;
    #imgEl;
    #lvlText;
    #typeImg1;
    #typeImg2;
    #nameText;
    #abilityText;
    #itemImg;
    #itemQue;
    /** @type {Coords} */
    #itemCoords;
    #itemText;
    #itemDiv;
    #hpText;
    #hpBar;

    #reveals = [];

    #parent;
    #shakeItTimeout;

    /**
     * Manages active combat overlay elements for this pokemon
     * @param {Boolean} side - True if player, false if enemy
     * @param {HTMLElement} fullEl - Element to append to
     * @param {ActivePokemon} parent - Parent class for some calls
     */
    constructor(side, fullEl, parent) {

        this.#player = side;

        const el = this.#createElement(fullEl);

        this.#mainEl = el;

        this.#imgEl = el.getElementsByClassName(`activePokeImg`)[0];

        this.#lvlText = el.getElementsByClassName("activeLvlNum")[0];

        const typeImgs = el.getElementsByClassName("activeTypeIcon");
        this.#typeImg1 = typeImgs[0];
        this.#typeImg2 = typeImgs[1];

        this.#nameText = el.getElementsByClassName("activeName")[0];

        this.#abilityText = el.getElementsByClassName("activeAbility")[0];

        this.#itemImg = el.getElementsByClassName("activeItemImg")[0];
        this.#itemQue = el.getElementsByClassName("activeItemImgQue")[0];
        this.#itemText = el.getElementsByClassName("activeItem")[0];
        this.#itemDiv = el.getElementsByClassName("activeItemDiv")[0];

        this.#hpText = el.getElementsByClassName("activeHpText")[0];
        this.#hpBar = el.getElementsByClassName("pokeHpBarCurrent")[0];

        // initialize status state
        this.#status = "---";
        this.#mainEl.classList.add("poke---");

        // get correct lvl text
        el.getElementsByClassName("activeLvlText")[0].innerHTML = getLocalizedText("pokeLvl");

        this.#parent = parent;

    }

    /**
     * Creates element containing main active pokemon info
     * @param {HTMLElement} fullEl - Element to append to
     * @returns {HTMLElement}
     */
    #createElement(fullEl) {

        const element = document.createElement("div");
        element.classList.add("activeMainInfo");

        // if enemy, the entire element is mirrored
        // this is to flip back things like text so it can be read
        const flipBack = this.#player ? "" : "flipBack";

        element.innerHTML = `
        
            <div class="activePokeImgDiv">
                <img class="activePokeImg">
            </div>
        
            <div class="activeDivMask">

                <div class="activeLvlDiv">
                    <div class="activeLvlTexts ${flipBack}">
                        <div class="activeLvlText" locText="pokeLvl"></div>
                        <div class="activeLvlNum"></div>
                    </div>
                    <img class="activeTypeIcon">
                    <img class="activeTypeIcon">
                </div>

                <div class="activeMainTexts">
            
                    <div class="activeName ${flipBack}"></div>
                    <div class="activeSubText">
                        <div class="activeAbility ${flipBack}"></div>
                        <div class="activeItemDiv">
                            <div class="activeItemPipe">|</div>
                            <div class="activeItemImgDiv">
                                <div class="activeItemImgBg"></div>
                                <div class="activeItemImgQue ${flipBack}">?</div>
                                <img class="activeItemImg" src="../../Resources/Assets/Items/itemicons-sheet.png"/>
                            </div>
                            <div class="activeItem ${flipBack}"></div>
                        </div>
                        
                    </div>

                </div>

                <div class="activeHpDiv">
                    <div class="activeHpBefore"></div>
                    <div class="activeHpText ${flipBack}"></div>
                    <div class="pokeHpAfter"></div>
                    <div class="pokeHpBar">
                        <div class="hpBar pokeHpBarTotal"></div>
                        <div class="hpBar pokeHpBarCurrent"></div>
                    </div>
                </div>

            </div>

        `

        // add element to the battle overlay
        fullEl.appendChild(element);

        return element;

    }


    getSpecies() {
        return this.#species;
    }
    /** @param {String} species */
    setSpecies(species) {
        if (species == this.#species) return;
        this.#species = species;
    }

    getForm() {
        return this.#form;
    }
    /**
     * @param {String} form 
     * @param {Boolean} megaEvolving 
     */
    setForm(form, megaEvolving) {

        if (form == this.#form) return;

        this.#form = form;

        const megaTime = this.#player ? current.megaTime : 0;

        if (megaEvolving) {
            this.#imgEl.style.animation = `megaAnim 3.5s ${megaTime / 1000}s linear`;
            setTimeout(() => {
                this.#imgEl.style.animation = "";
            }, 3500 + megaTime);
        }

    }

    /**
     * Set the image path for this pokemon, as well as position offsets
     * @param {PokeImgData} imgData 
     */
    setImg(imgData) {

        // load up the next new image
        const newImg = new Image();
        newImg.src = imgData.gen5Front;
        // decoding here is done so img swap and offset changes sync up
        newImg.decode().then(() => {

            // change the actual image
            this.#imgEl.src = newImg.src;

            // We compensate to account for the cases where the gif center is skewed
            // towards a place where the Pokémon doesn't spend that much time;
            // e.g., Pokémon that jump (Rotom-Heat, Weavile) or extend their
            // body (Thundurus-Therian, Timburr).
            // The offsets are the difference between the actual center of the gif
            // and the mean of the bounding boxes of each gif frame, and are precalculated
            // using a Python script included in the assets repo.
            const offset = imgData.gen5FrontOffs;
            this.#imgEl.style.transform = `
                scaleX(-2) scaleY(2)
                translate(${offset[0]}px, ${offset[1]}px)
            `;

        })

    }

    /** @param {Number} lvl */
    setLvl(lvl) {
        if (lvl == this.#lvl) return;
        this.#lvl = lvl;
        this.#lvlText.innerHTML = lvl;
    }
    getLvl() {
        return this.#lvl;
    }

    /** @param {String[]} types */
    setTypes(types) {

        if (!this.#compareIncTypes(types)) return;

        this.#types = types;

        // type icons
        this.#typeImg1.src = "../../Resources/Assets/Type Icons/" + types[0] + ".png";
        if (types[1]) {
            this.#typeImg2.src = "../../Resources/Assets/Type Icons/" + types[1] + ".png";
            this.#typeImg2.style.display = "flex";
        } else {
            this.#typeImg2.style.display = "none";
        }

        this.#setBackgroundColor(types);

    }
    /** @returns {String[]} */
    getTypes() {
        return this.#types;
    }

    getName() {
        return this.#name;
    }
    /** @param {String} name */
    setName(name) {

        if (name == this.#name) return;

        this.#name = name;
        this.#nameText.innerHTML = getLocalizedPokeText(name, "Pokemon", current.generation);
        this.#nameText.setAttribute("locPokemon", name);

    }

    getAbility() {
        return this.#ability;
    }
    /**
     * @param {String} ability
     * @param {Boolean} reveal
     */
    setAbility(ability, reveal) {

        if (ability == this.#ability && !reveal) return;

        const oldAbi = this.#ability;
        this.#ability = ability;

        // if this is an enemy
        if (!this.#player) {

            // if ability changed, reveal it (unset ability is falsy)
            if (oldAbi) reveal = true;

            // hide ability unless it is revealed
            ability = reveal ? ability : "???";

        }

        this.#abilityText.innerHTML = getLocalizedPokeText(ability, "Ability", current.generation);
        this.#abilityText.setAttribute("locAbility", this.#ability);

    }

    getItem() {
        return this.#item;
    }
    /**
     * @param {String} item
     * @param {Coords?} coords 
     * @param {Boolean} reveal
     */
    setItem(item, coords, reveal) {

        if (item == this.#item && !reveal) return;

        const oldItem = this.#item;
        this.#item = item;
        if (coords) this.#itemCoords = coords;

        // if this is an enemy
        if (!this.#player) {

            // if item changed, reveal it
            if (oldItem != undefined) reveal = true;

            // hide item unless it is revealed
            item = reveal ? item : "???";
            this.#itemQue.style.display = reveal ? "none" : "flex";
            this.#itemImg.style.display = reveal ? "block" : "none"

        }

        this.#itemText.innerHTML = getLocalizedPokeText(item, "Item", current.generation);
        this.#itemText.setAttribute("locItem", this.#item);

        this.#itemImg.style.objectPosition = `
            ${this.#itemCoords.left}px ${this.#itemCoords.top}px
        `

        // hide div if no item
        if (!item) {
            this.#itemDiv.style.display = "none";
        } else {
            this.#itemDiv.style.display = "flex";
        }

    }

    /** @param {String} status */
    setStatus(status) {

        // if fainted, let HP decide when to set status
        // if hp is 0/0, we'll assume user is using manual and thus allow fainted status
        if (status != "Fai" || (this.#hpCurrent == 0 && this.#hpMax == 0)) {
            this.#mainEl.classList.replace("poke" + this.#status, "poke" + status);
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

            // trigger that oomf animation
            this.#shakeIt();
            // wait a bit before hp starts ticking down to direct viewer's eyes
            await new Promise(resolve => setTimeout(resolve, 500));
            
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

        // adjust the health bar
        const percent = hp / this.#hpMax * 100;
        this.#hpBar.style.transform = `translateX(${percent-100}%)`;

        // update hp texts
        if (this.#player) {
            // player gets to see actual number
            this.#hpText.innerHTML = hp + "/" + this.#hpMax;
        } else {
            // enemies only have perecents
            let percentText;
            if (percent < 10) {
                // if below 1%, show decimals for extra drama
                percentText = percent.toFixed(1);
            } else {
                percentText = Math.round(percent);
            }
            this.#hpText.innerHTML = percentText + "%";
        }

        // and just because its cool, recolor border if in danger
        if (hp == this.#hpMax) {
            // this one is here for data sent with 0/0 HP
            this.#mainEl.style.setProperty("--activeColor", "var(--healthy)");
        } else if (hp <= 0) { // 0% and also reveal info for enemies
            this.setStatus("Ded");
            this.setAbility(this.#ability, true);
            this.setItem(this.#item, null, true);
            this.#parent.revealAll();
        } else if (hp <= this.#hpMax*.2) { // 20%
            this.#mainEl.style.setProperty("--activeColor", "var(--danger)");
        } else if (hp <= this.#hpMax/2) { // 50%
            this.#mainEl.style.setProperty("--activeColor", "var(--warning)");
        } else {
            this.#mainEl.style.setProperty("--activeColor", "var(--healthy)");
        }

    }

    /** @param {String[]} reveals */
    #setReveals(reveals) {

        // no reveals? skip
        if (!reveals) return;

        let diff = false;
        for (let i = 0; i < reveals.length; i++) {
            if (this.#reveals[i] != reveals[i]) {
                diff = true;
            }
        }
        if (!diff) return; // save reveals as last time? skip

        for (let i = 0; i < reveals.length; i++) {
            if (reveals[i] == "Ability") {
                this.setAbility(this.#ability, true)
            }
            if (reveals[i] == "Item") {
                this.setItem(this.#item, null, true);
            }
        }

    }

    /**
     * Changes the background color depending on the pokemons type
     * @param {String[]} types - Names of types
     */
    #setBackgroundColor(types) {
        if (types.length == 2) {
            this.#mainEl.style.background = `linear-gradient(to bottom,
                ${typeToColor(types[1])}35, ${typeToColor(types[0])}75)`;
        } else if (types.length == 1) {
            this.#mainEl.style.background = `${typeToColor(types[0])}75`;
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
                    return true;
                }
            }
            return;
        }
        return true;
    }


    /** Sets intro animation for this poke */
    showIntro() {

        const aniTime = .4;
        this.#mainEl.style.animation = `slideIn ${aniTime}s both`;
        // this will also fire every time pokemon swaps into combat

    }


    /** Triggers a shake animation for the entire pokemon div */
    async #shakeIt() {
        
        clearTimeout(this.#shakeItTimeout);
        this.#mainEl.style.animation = "";
        this.#mainEl.offsetHeight; // triggers reflow so it can animate again
        this.#mainEl.style.animation = "shake cubic-bezier(0.0, 0.3, 0.1, 1.0) .4s";

        // clear animation so it doesnt fire on new display
        this.#shakeItTimeout = setTimeout(() => {
            this.#mainEl.style.animation = "";
        }, 400);

    }

    /**
     * Updates data for this pokemon if its different from previous data
     * @param {PokemonSentData} data - Full data for this pokemon
     */
    update(data) {

        this.#noHpAnim = false;
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
                const megatime = this.#player ? current.megaTime : 0;
                setTimeout(() => {
                    this.setImg(data.img);
                    this.setTypes(data.types);
                    this.setAbility(data.ability, true);
                    this.setItem(data.item, null, true);
                    this.#shakeIt();
                }, 2700 + (megatime)); 
                if (this.#player) current.megaTime = 0;
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
        this.setLvl(data.lvl);

        // set type data
        if (!megaEvolving) this.setTypes(data.types);

        // set name
        this.setName(data.nickName);

        // set ability, if mega we will just reveal it on a timer up there
        if (!megaEvolving) this.setAbility(data.ability);

        // set item
        this.setItem(data.item, data.itemCoords);
        
        // set status condition
        this.setStatus(data.status);

        // set HP
        if (this.getHpCurrent() != data.hpCurrent || this.getHpMax() != data.hpMax) {
            this.setHp(data.hpCurrent, data.hpMax);
        }

        // set reveals for enemy pokemon
        if (!this.#player) {
            this.#setReveals(data.reveals);
        }

    }

    /**
     * Determines gamemode to shrink main info
     * @param {Number} num - Number of active pokes on the field
     */
    setGamemode(num) {

        if (num == 1) {
            this.#mainEl.classList.remove("activeMainInfoTiny");
        } else if (num >= 2) {
            this.#mainEl.classList.add("activeMainInfoTiny");
        }

    }

    /** Deletes the entirety of this pokemon */
    delet() {
        this.#mainEl.remove();
    }

}