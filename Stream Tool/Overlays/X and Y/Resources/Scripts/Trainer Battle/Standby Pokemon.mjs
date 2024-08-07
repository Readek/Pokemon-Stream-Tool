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

    #reveal = false;
    #reveals = [];

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

            <img class="standbyPokeIconDiv" src="../../Resources/Assets/Pokemon/sprites/pokemonicons-sheet.png">

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

        // check if coords are the same as last time
        if (!this.#reveal && this.#iconCoords[0] == iconCoords[0]
            && this.#iconCoords[1] == iconCoords[1]) {
            return;
        }

        this.#iconCoords = iconCoords;

        if (this.#player || this.#reveal) {
            this.#iconEl.classList.remove("standbyUnrevealed");
        } else {
            // default question mark image for unrevealed enemies
            this.#iconEl.classList.add("standbyUnrevealed");
            iconCoords = [0, 0];
        }

        this.#iconEl.style.objectPosition = `${iconCoords[0]}px ${iconCoords[1]}px`;

    }

    getName() {
        return this.#name;
    }
    /** @param {String} name */
    setName(name) {

        if (!this.#reveal && name == this.#name) return;

        this.#name = name;

        if (!this.#player && !this.#reveal) {
            // enemies yet to be revealed will hide their names
            this.#nameText.innerHTML = "???";
        } else {
            this.#nameText.innerHTML = name;
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
            if (reveals[i] == "Full") {
                this.#reveal = true;
                this.setName(this.#name);
                this.setIcon(this.#iconCoords);
            }
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

    /** Sets intro animation for this poke */
    showIntro(num) {

        const aniTime = .4;
        const delTime = num ? num *2 / 10 : .3;
        this.#mainEl.style.animation = `slideIn ${aniTime}s ${delTime}s both`;

        // after animation finishes, remove animation to prevent anomalies
        setTimeout(() => {
            this.#mainEl.style.animation = ``;
        }, (aniTime+delTime)*1000);

    }

    update(data) {

        // if pokemon is not in combat right now, hide it
        if (data.inCombat || !data.species) {

            this.hidePoke();
            this.#inCombat = this.#inCombat;

            // reveal poke info if poke has been in combat before
            if (!this.#player && data.inCombat) {
                this.#reveal = true;
                this.setName(this.#name);
                this.setIcon(this.#iconCoords);
            }

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

        this.#setReveals(data.reveals);

    }

    /** Deletes the entirety of this pokemon */
    delet() {
        this.#mainEl.remove();
    }

}