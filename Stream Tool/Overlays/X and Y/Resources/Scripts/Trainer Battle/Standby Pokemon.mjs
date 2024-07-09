const playerActiveDiv = document.getElementById("battleStandbyBarPlayer");
const enemyActiveDiv = document.getElementById("battleStandbyBarEnemy");

export class StandbyPokemon {

    #player = true;

    #species = "";
    #form = "";
    #name = "¡";
    #status = "";
    #shiny = false;
    #inCombat = false;

    #hpCurrent = -1;
    #hpMax = -1;

    #iconCoords = [];

    #mainEl;
    #iconEl;
    #nameText;
    #hpBar;

    /**
     * Manages standby combat overlay elements for this pokemon
     * @param {Boolean} side - True if player, false if enemy
     */
    constructor(side) {

        this.#player = side;

        const el = this.#createElement();

        this.#mainEl = el;
        this.#iconEl = el.getElementsByClassName(`standbyPokeIconDiv`)[0];
        this.#nameText = el.getElementsByClassName("standbyName")[0];
        this.#hpBar = el.getElementsByClassName("pokeHpBarCurrent")[0];

        // initialize status state
        this.#status = "---";
        this.#mainEl.classList.add("poke---");

    }

    #createElement() {

        const element = document.createElement("div");
        element.classList.add("standbyPokemon");

        // if enemy, the entire element is mirrored
        // this is to flip back things like text so it can be read
        const flipBack = this.#player ? "nada" : "flipBack";

        element.innerHTML = `

            <img class="standbyPokeIconDiv">

            <div class="standbyNameHp">
        
                <div class="standbyName ${flipBack}"></div>

                <div class="standbyHpDiv">
                    <div class="standbyHpBar">
                        <div class="hpBar pokeHpBarTotal"></div>
                        <div class="hpBar pokeHpBarCurrent"></div>
                    </div>
                </div>

            </div>

        `

        // add element to the battle overlay
        if (this.#player) {
            playerActiveDiv.appendChild(element);
        } else {
            enemyActiveDiv.appendChild(element);
        }

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
    /** @param {String} form */
    setForm(form) {
        if (form == this.#form) return;
        this.#form = form;
    }

    /**
     * Set the icon path for this pokemon, as well as position offsets
     * @param {String[]} iconCoords 
     */
    setIcon(iconCoords) {

        this.#iconCoords = iconCoords;

        if (true) {
            this.#iconEl.src = "../../Resources/Assets/Pokemon/sprites/pokemonicons-sheet.png"
        } else {
            // default pokeball image
            this.#iconEl.src = "../../Resources/Assets/None.png";
            iconCoords = [0, 0];
        }

        this.#iconEl.style.objectPosition = `${iconCoords[0]}px ${iconCoords[1]}px`;
    
    }

    getName() {
        return this.#name;
    }
    /** @param {String} name */
    setName(name) {

        if (name == this.#name) return;

        this.#name = name;
        this.#nameText.innerHTML = name;

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
        
        this.#hpCurrent = hp;
        this.#hpMax = max;

        // adjust the health bar
        const percent = hp / this.#hpMax * 100 - 100;
        this.#hpBar.style.transform = "translateX("+percent+"%)";

        // and just because its cool, recolor border if in danger
        if (hp == this.#hpMax) {
            // this one is here for data sent with 0/0 HP
            this.#mainEl.style.setProperty("--activeColor", "var(--healthy)");
        } else if (hp <= 0) { // 0%
            this.setStatus("Ded");
        } else if (hp <= this.#hpMax*.2) { // 20%
            this.#mainEl.style.setProperty("--activeColor", "var(--danger)");
        } else if (hp <= this.#hpMax/2) { // 50%
            this.#mainEl.style.setProperty("--activeColor", "var(--warning)");
        } else {
            this.#mainEl.style.setProperty("--activeColor", "var(--healthy)");
        }

    }


    /** Hides this pokemon's div */
    hidePoke() {
        this.#mainEl.style.display = "none";
    }
    /** Shows this pokemon on the bar */
    showPoke() {
        this.#mainEl.style.display = "flex";
    }


    update(data) {

        // if pokemon is not in combat right now, hide it
        if (data.inCombat || !data.species) {
            this.hidePoke();
            this.#inCombat = this.#inCombat;
            return;
        }

        // first loop in combat, display show animation
        if (this.#inCombat != data.incombat) {
            this.showPoke();
        }


        // set species
        if (data.species != this.getSpecies() ||
            data.form != this.getForm()) {

            this.setSpecies(data.species);
            this.setForm(data.form);
            
            this.setIcon(data.iconCoords);

            this.#shiny = data.shiny;

        } else if (this.#shiny != data.shiny) {
            // if shiny was toggled, just update the image
            this.setIcon(data.iconCoords);
            this.#shiny = data.shiny;
        }

        // set name
        this.setName(data.nickName);        
        
        // set status condition
        this.setStatus(data.status);

        // set HP
        if (this.getHpCurrent() != data.hpCurrent || this.getHpMax() != data.hpMax) {
            this.setHp(data.hpCurrent, data.hpMax);
        }

    }

    /** Deletes the entirety of this pokemon */
    delet() {
        this.#mainEl.remove();
    }

}