import { Pokemon } from "../Pokemon.mjs";
import { typeToColor } from "../Type to Color.mjs";

const statKeys = ["hp", "atk", "def", "spa", "spd", "spe"];
const statKeysUpper = ["Hp", "Atk", "Def", "SpA", "SpD", "Spe"];
const statKeyValues = ["num", "ev", "iv"];

const pokePartyDiv = document.getElementById("pokeParty");

export class TeamPokemon extends Pokemon {

    #status = "";

    #hpCurrentInp;
    #hpMaxInp;
    #hpBar;

    #expInp;

    #abilityInp;

    #itemInp;

    #move = [{},{},{},{}];
    #moveInp = [{},{},{},{}];

    #stat = { hp: {}, atk: {}, def: {}, spa: {}, spd: {}, spe: {} };
    #statInp = { hp: {}, atk: {}, def: {}, spa: {}, spd: {}, spe: {} };

    constructor() {

        super();

        this.lvlInp = this.el.getElementsByClassName("pokeLvlNumber")[0];
        
        this.statusSel = this.el.getElementsByClassName('pokeStatus')[0];

        // show or hide details with button
        const detailsButt = this.el.getElementsByClassName('pokeDetailsButt')[0];
        const detailsDiv = this.el.getElementsByClassName('pokeDetails')[0];
        detailsButt.addEventListener("click", () => {
            detailsDiv.classList.toggle("pokeDetailsShow");
        });

        this.#hpCurrentInp = this.el.getElementsByClassName('pokeHpCurrent')[0];
        this.#hpMaxInp = this.el.getElementsByClassName('pokeHpMax')[0];
        this.#hpBar = this.el.getElementsByClassName('pokeHpBarActive')[0];       

        this.#expInp = this.el.getElementsByClassName('pokeExpCurrent')[0];
        this.#abilityInp = this.el.getElementsByClassName('pokeAbility')[0];
        this.#itemInp = this.el.getElementsByClassName('pokeItem')[0];

        // moves
        for (let i = 0; i < 4; i++) {
            this.#moveInp[i].name = this.el.getElementsByClassName(`pokeMove${i}`)[0];
            this.#moveInp[i].pp = this.el.getElementsByClassName(`pokeMove${i}PP`)[0];
            this.#moveInp[i].parent = this.#moveInp[i].name.parentElement;
        }
        
        // stats
        for (let i = 0; i < statKeys.length; i++) {
            this.#statInp[statKeys[i]].num = this.el.getElementsByClassName(`poke${statKeysUpper[i]}`)[0];
            this.#statInp[statKeys[i]].ev = this.el.getElementsByClassName(`poke${statKeysUpper[i]}EV`)[0];
            this.#statInp[statKeys[i]].iv = this.el.getElementsByClassName(`poke${statKeysUpper[i]}IV`)[0];
        }        

    }

    getLvl() {
        return Number(this.lvlInp.value);
    }
    /** @param {Number} value  */
    setLvl(value) {
        if (this.getLvl() == value) return;
        this.lvlInp.value = value;
    }

    /** @returns {String} */
    getStatus() {
        return this.statusSel.value;
    }
    /** @param {String} value */
    setStatus(value) {
        if (this.getHpCurrent() <= 0 && this.getHpMax()) {
            value = "Fai"
        }
        if (this.#status == value) return;
        this.#status = value;
        this.statusSel.value = value || "---";
    }


    getHpCurrent() {
        return Number(this.#hpCurrentInp.value);
    }
    /** @param {Number} value  */
    setHpCurrent(value) {

        if (this.getHpCurrent == value) return;

        this.#hpCurrentInp.value = value;

        // update HP bar on the pokemon's details
        const percent = value / this.getHpMax() * 100 - 100;
        this.#hpBar.style.transform = "translateX("+percent+"%)";

        // and just because its cool, recolor health bar if in danger
        if (value <= 0 && this.getHpMax() == 0) {
            // do nothin
        } else if (value <= this.getHpMax()*.2) { // 20%
            this.#hpBar.style.setProperty("--activeColor", "var(--danger)");
        } else if (value <= this.getHpMax()/2) { // 50%
            this.#hpBar.style.setProperty("--activeColor", "var(--warning)");
        } else {
            this.#hpBar.style.setProperty("--activeColor", "var(--healthy)");
        }

    }

    getHpMax() {
        return Number(this.#hpMaxInp.value);
    }
    /** @param {Number} value */
    setHpMax(value) {
        if (this.getHpMax() == value) return;
        this.#hpMaxInp.value = value;
    }

    getExp() {
        return Number(this.#expInp.value);
    }
    /** @param {Number} value - Total experience points */
    setExp(value) {
        if (this.getExp() == value) return;
        this.#expInp.value = value;
    }

    getAbility() {
        return this.#abilityInp.value;
    }
    /** @param {String} value - Ability name */
    setAbility(value) {
        if (this.getAbility() == value) return;
        this.#abilityInp.value = value;
    }

    getItem() {
        return this.#itemInp.value;
    }
    /** @param {String} value - Ability name */
    setItem(value) {
        if (this.getItem() == value) return;
        this.#itemInp.value = value;
    }

    /** @typedef {[{name: String, type: String, pp: Number}]} Moves */
    /** @returns {Moves} */
    getMoves() {
        return this.#move;
    }
    /**
     * @param {Moves} moves 
     */
    setMoves(moves) {

        if (!moves) return;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].name != this.#move[i].name) {
                this.#move[i].name = moves[i].name;
                this.#moveInp[i].name.value = moves[i].name;
                this.#move[i].type = moves[i].type;
                this.#moveInp[i].parent.style.backgroundColor = `${typeToColor(moves[i].type)}80`;
            }
            if (this.#move[i].pp != moves[i].pp) {
                this.#move[i].pp = moves[i].pp;
                this.#moveInp[i].pp.value = moves[i].pp;
            }
        }

    }

    /**
     * @typedef {{num: Number, ev: Number, iv: Number}} StatKey
     * @typedef {{
     *  hp: StatKey, atk: StatKey, def: StatKey, spa: StatKey, spd: StatKey, spe: StatKey
     * }} Stats
     */
    /**
     * @returns {Stats}
     */
    getStats() {
        return this.#stat;
    }
    /**
     * Sets current stats, EVs, and IVs for this pokemon
     * @param {Stats} stats
     */
    setStats(stats) {

        if (!stats) return;

        // for each different stat
        for (let i = 0; i < statKeys.length; i++) {

            // stat actual value, ev, and iv
            for (let j = 0; j < statKeyValues.length; j++) {
                
                if (this.#stat[statKeys[i]][statKeyValues[j]] != stats[statKeys[i]][statKeyValues[j]]) {
                    this.#stat[statKeys[i]][statKeyValues[j]] = stats[statKeys[i]][statKeyValues[j]];
                    this.#statInp[statKeys[i]][statKeyValues[j]].value = stats[statKeys[i]][statKeyValues[j]];
                }
                
            }
            
        }

    }

    /**
     * Creates the pokemon's HTML element
     * @returns {HTMLElement}
     */
    generateElement() {

        const element = document.createElement("div");
        element.classList.add("pokemonDiv");
        // and now for the big fat text
        element.innerHTML = `
        
        <div class="teamPokeMainInfo">
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

            <select class="pokeStatus" locTitle="pokeStatusTitle">
                <option value="---">----</option>
                <option value="Par" locText="pokeStatusPar"></option>
                <option value="Poi" locText="pokeStatusPoi"></option>
                <option value="Fro" locText="pokeStatusFro"></option>
                <option value="Bur" locText="pokeStatusBur"></option>
                <option value="Sle" locText="pokeStatusSle"></option>
                <option value="Fai" locText="pokeStatusFai"></option>
            </select>

            <button class="pokeDetailsButt" locTitle="pokeDetailsTitle">
                ...
            </button>

        </div>

        <div class="pokeDetails">

            <div class="detailsGeneral">

                <div class="detailsTopRow">

                    <div class="detailsHpExp">

                        <div class="pokeDetailsDiv" locTitle="pokeHpTitle">
                            <div class="pokeTopRowText pokeHpText" locText="pokeHp"></div>
                            <div>
                                <input class="pokeDetailsInput pokeHpNumber pokeHpCurrent" type="number" min="0" max="999" value="0" placeholder="0">
                                /
                                <input class="pokeDetailsInput pokeHpNumber pokeHpMax" type="number" min="0" max="999" value="0" placeholder="0">
                            </div>
                            <div class="pokeHpBarDiv">
                                <div class="pokeHpBarBg pokeHpBar"></div>
                                <div class="pokeHpBarActive pokeHpBar"></div>
                            </div>
                        </div>

                        <div class="pokeDetailsDiv" locTitle="pokeExpTitle">
                            <div class="pokeTopRowText pokeExpText" locText="pokeExp"></div>
                            <input class="pokeDetailsInput pokeExpCurrent" type="number" min="0" value="0" placeholder="0">
                            <div class="pokeExpBarDiv">
                                <div class="pokeExpBarBg pokeExpBar"></div>
                                <div class="pokeExpBarActive pokeExpBar"></div>
                            </div>
                        </div>

                    </div>

                    <div class="detailsAbiItem">

                        <div class="pokeDetailsDiv" locTitle="pokeAbilityTitle">
                            <div class="pokeTopRowText pokeAbilityText" locText="pokeAbility"></div>
                            <input class="pokeDetailsInput pokeAbility" type="text" locPHolder="pokeAbilityPHolder">
                        </div>

                        <div class="pokeDetailsDiv" locTitle="pokeItemTitle">
                            <div class="pokeTopRowText pokeItemText" locText="pokeItem"></div>
                            <input class="pokeDetailsInput pokeItem" type="text" locPHolder="pokeItemPHolder">
                        </div>

                    </div>

                </div>

                <div class="detailsBotRow" locTitle="pokeMoves">

                    <div class="detailsMovesTop detailsMoves"></div>
                    <div class="detailsMovesBot detailsMoves"></div>

                </div>

            </div>

            <div class="detailsStats">
            
            </div>

        </div>

        `

        // add move elements
        const detailsMovesTopEl = element.getElementsByClassName("detailsMovesTop")[0];
        const detailsMovesBotEl = element.getElementsByClassName("detailsMovesBot")[0];
        for (let i = 0; i < 4; i++) {
            const moveEl = this.createMoveElement(i);
            if (i < 2) {
                detailsMovesTopEl.appendChild(moveEl);
            } else {
                detailsMovesBotEl.appendChild(moveEl);
            }
        }

        // add stat elements
        const detailsStatsEl = element.getElementsByClassName("detailsStats")[0];
        for (let i = 0; i < statKeysUpper.length; i++) {
            const statEl = this.createStatElement(statKeysUpper[i]);
            detailsStatsEl.appendChild(statEl);
        }

        // add it to the GUI
        pokePartyDiv.appendChild(element);
        return element;

    }

    /**
     * Generates a movement HTML element
     * @param {Number} num - Movement number slot
     * @returns {HTMLElement}
     */
    createMoveElement(num) {

        const element = document.createElement("div");
        element.classList.add("pokeDetailsBlock", "pokeDetailsMove");
        element.innerHTML = `

        <input class="pokeDetailsInput pokeMoveName pokeMove${num}" type="text" placeholder="-" spellcheck="false">
        <div class="pokeDetailsStatDiv">
            <input class="pokeDetailsInput pokeStatsNumber pokeMove${num}PP" type="number" min="0" max="99" placeholder="0">
            <div class="" locText="pokePP"></div>
        </div>

        `

        return element;

    }

    /**
     * Generates a stat HTML element
     * @param {String} statKey - Name of stat to use
     * @returns {HTMLElement}
     */
    createStatElement(statKey) {

        const element = document.createElement("div");
        element.classList.add("pokeDetailsBlock", "pokeDetailsStatBlock");
        element.innerHTML = `

        <div class="pokeDetailsStatDiv" locTitle="poke${statKey}Title">
            <div class="pokeDetailsText pokeDetailsStatName" locText="poke${statKey}"></div>
            <input class="pokeDetailsInput pokeStatsNumber poke${statKey}" type="number" min="0" max="999" placeholder="0">
        </div>
        
        <div class="pokeDetailsStatDiv" locTitle="pokeEVTitle">
            <div class="pokeDetailsText" locText="pokeEV"></div>
            <input class="pokeDetailsInput pokeStatsNumber poke${statKey}EV" type="number" min="0" max="999" placeholder="0">
        </div>

        <div class="pokeDetailsStatDiv" locTitle="pokeIVTitle">
            <div class="pokeDetailsText" locText="pokeIV"></div>
            <input class="pokeDetailsInput pokeStatsNumber poke${statKey}IV" type="number" min="0" max="999" placeholder="0">
        </div>

        `

        return element;

    }

}