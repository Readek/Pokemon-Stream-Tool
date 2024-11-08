import { getLocalizedPokeText, getLocalizedText } from "../../Utils/Language.mjs";
import { current, inside, stPath } from "../Globals.mjs";
import { Pokemon } from "../Pokemon.mjs";
import { typeToColor } from "../Type to Color.mjs";
import { updateTrainer } from "../VS Trainer/Update Trainer.mjs";

/** @typedef {{left: Number, top: Number}} ItemCoords */

const statKeys = ["hp", "atk", "def", "spa", "spd", "spe"];
const statKeysUpper = ["Hp", "Atk", "Def", "SpA", "SpD", "Spe"];
const boostKeys = ["atk", "def", "spa", "spd", "spe", "pre", "acc"];
const boostKeysUpper = ["Atk", "Def", "SpA", "SpD", "Spe", "Pre", "Acc"];

const pokePartyDiv = document.getElementById("pokeParty");
const trainerPartyDiv = document.getElementById("trainerParty");

export class TeamPokemon extends Pokemon {

    #status = "";

    #hpCurrentInp;
    #hpMaxInp;
    #hpBar;

    #expInp;

    #ability = "";
    #abilityInp;

    #item;
    #itemImg;
    /** @type {ItemCoords} */
    #itemCoords;
    #itemInp;

    #move = [{},{},{},{}];
    #moveInp = [{},{},{},{}];

    #stat = { hp: {}, atk: {}, def: {}, spa: {}, spd: {}, spe: {} };
    #statEl = { hp: {}, atk: {}, def: {}, spa: {}, spd: {}, spe: {} };

    #boost = {};
    #boostEl = {};

    #inCombat = false;

    /**
     * Class for team and enemy pokemon
     * @param {Boolean} enemy - True if this is an enemy pokemon
     */
    constructor(enemy) {

        super(enemy);

        this.lvlInp = this.el.getElementsByClassName("pokeLvlNumber")[0];
        
        this.statusSel = this.el.getElementsByClassName('pokeStatus')[0];

        // if right click on species, manually toggle in combat status
        this.pokeSel.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.setInCombat(!this.getInCombat());
        })

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

        // item
        this.#itemImg = this.el.getElementsByClassName('pokeItemIcon')[0];
        this.#itemInp = this.el.getElementsByClassName('pokeItem')[0];
        this.setItem("");

        // moves
        for (let i = 0; i < 4; i++) {
            this.#moveInp[i].name = this.el.getElementsByClassName(`pokeMove${i}`)[0];
            this.#moveInp[i].pp = this.el.getElementsByClassName(`pokeMove${i}PP`)[0];
            this.#moveInp[i].parent = this.#moveInp[i].name.parentElement;
        }
        
        // stats
        for (let i = 0; i < statKeys.length; i++) {
            this.#statEl[statKeys[i]].num = this.el.getElementsByClassName(`poke${statKeysUpper[i]}`)[0];
            this.#statEl[statKeys[i]].eviv = this.el.getElementsByClassName(`poke${statKeysUpper[i]}EVIV`)[0];
            this.#statEl[statKeys[i]].bar = this.el.getElementsByClassName(`pokeStat${statKeysUpper[i]}Bar`)[0];
        }

        // boosts
        for (let i = 0; i < 5 ; i++) {
            this.#boostEl[boostKeys[i]] = this.el.getElementsByClassName(`poke${boostKeysUpper[i]}Boost`)[0];
        }

        // to hide enemy stuff from view
        if (enemy) {
            this.createHideEls();
            this.#expInp.parentElement.style.display = "none";
        }

    }

    /** @param {String} name - Name of the pokemon */
    setSpecies(name) {
        // if enemy
        if (this.enemy && name && (!this.speciesName || this.speciesName == "None") && current.autoStatus) {
            this.hideRevealInfo(true);
        }
        super.setSpecies(name);
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

        // while we're at it, if pokemon is dead, reveal all info
        if (this.enemy && value == 0) {
           this.hideRevealInfo(false);
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

    /** @returns {String} */
    getAbility() {
        return this.#ability;
    }
    /** @param {String} value - Ability name */
    setAbility(value) {
        if (this.getAbility() == value) return;
        this.#ability = value;
        this.#abilityInp.value = getLocalizedPokeText(value, "Ability", current.generation);
        // this is so it reloads when swapping lang
        this.#abilityInp.setAttribute("locAbility", value);
    }

    /** @returns {String} */
    getItem() {
        return this.#item;
    }
    /** @param {String} value - Ability name */
    setItem(value) {        

        if (this.getItem() == value) return;
        this.#item = value;

        // localize this item to current language
        if (value) {            
            this.#itemInp.innerHTML = getLocalizedPokeText(value, "Item", current.generation);
            this.#itemInp.setAttribute("locItem", value);
            this.#itemInp.removeAttribute("locText");
        } else {
            this.#itemInp.innerHTML = getLocalizedText("pokeItemNone");
            this.#itemInp.setAttribute("locText", "pokeItemNone");
            this.#itemInp.removeAttribute("locItem");
        }
        

        // set the item's icon
        this.#itemCoords = pkmn.img.Icons.getItem(value, {domain: stPath.poke});
        const imgSrc = this.#itemCoords.left != -0 // if no icon found, display a placeholder
            ? `${stPath.assets}/Items/itemicons-sheet.png`
            : `${stPath.assets}/Items/None.png`;
        
        this.#itemImg.src = imgSrc;
        this.#itemImg.style.objectPosition = `
            ${this.#itemCoords.left}px ${this.#itemCoords.top}px
        `;
        
    }
    /**
     * Item icon coordinates for the icon spritesheet
     * @returns {ItemCoords}
    */
    getItemCoords() {
        return this.#itemCoords;
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
                this.#moveInp[i].name.value = getLocalizedPokeText(moves[i].name, "Move", current.generation);
                this.#moveInp[i].name.setAttribute("locMove", moves[i].name);
                this.#move[i].type = moves[i].type;
                this.#moveInp[i].parent.style.backgroundColor = `${typeToColor(moves[i].type)}80`;

            }
            if (this.#move[i].pp != moves[i].pp) {

                // if enemy, reveal this move
                if (this.enemy && this.#move[i].pp > moves[i].pp) {
                    this.hideMoveEls[i].style.display = "none";
                }

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

            
            if (this.#stat[statKeys[i]].num != stats[statKeys[i]].num) {

                // update internal value
                this.#stat[statKeys[i]].num = stats[statKeys[i]].num;

                // update displayed text
                this.#statEl[statKeys[i]].num.innerHTML = stats[statKeys[i]].num;

                // update stat bar
                const percent = stats[statKeys[i]].num * 100 / 400;
                this.#statEl[statKeys[i]].bar.style.width = percent+"%";
            
            }

            if (this.#stat[statKeys[i]].ev != stats[statKeys[i]].ev
            || this.#stat[statKeys[i]].iv != stats[statKeys[i]].iv) {
                
                // update internal values
                this.#stat[statKeys[i]].ev = stats[statKeys[i]].ev;
                this.#stat[statKeys[i]].iv = stats[statKeys[i]].iv;

                // update displayed text
                if (stats[statKeys[i]].ev != undefined && stats[statKeys[i]].iv != undefined) {
                    this.#statEl[statKeys[i]].eviv.innerHTML = `(${stats[statKeys[i]].ev}) (${stats[statKeys[i]].iv})`;   
                } else {
                    this.#statEl[statKeys[i]].eviv.innerHTML = "";
                }

            }

            
        }

    }


    /**
     * @typedef {{
    *  atk: Number, def: Number, spa: Number, spd: Number, spe: Number, acc: Number, eva: Number
    * }} Boosts
    */
    /** @returns {Boosts} */
    getBoosts() {
        return this.#boost;
    }
    /**
     * Sets current stat boosts
     * @param {Boosts} boosts 
     */
    setBoosts(boosts) {

        if (!boosts) return;

        for (let i = 0; i < boostKeys.length; i++) {
            
            if (this.#boost[boostKeys[i]] != boosts[boostKeys[i]]) {
                
                this.#boost[boostKeys[i]] = boosts[boostKeys[i]];

                if (this.#boostEl[boostKeys[i]]) {
                    if (this.#boost[boostKeys[i]] != 0 && this.#boost[boostKeys[i]] != undefined) {

                        let divi;
                        if (this.#boost[boostKeys[i]] != "eva" || this.#boost[boostKeys[i]] != "acc") {
                            
                            if (this.#boost[boostKeys[i]] > 0) {
                                divi = (2 + this.#boost[boostKeys[i]]) / 2;
                            } else {
                                divi = 2 / (2 - this.#boost[boostKeys[i]]);
                            }

                        } else {
                            
                            if (this.#boost[boostKeys[i]] > 0) {
                                divi = (3 + this.#boost[boostKeys[i]]) / 3;
                            } else {
                                divi = 3 / (3 - this.#boost[boostKeys[i]]);
                            }

                        }
                        const multNum = Number(divi.toFixed(2));

                        this.#boostEl[boostKeys[i]].style.display = "block";
                        this.#boostEl[boostKeys[i]].innerHTML = `x${multNum}`;
                    
                    } else {
                        this.#boostEl[boostKeys[i]].style.display = "none";
                    }
                }

            }
            
        }

    }

    getInCombat() {
        return this.#inCombat;
    }
    /** @param {Boolean} value */
    setInCombat(value) {

        if (this.#inCombat == value) return;
        
        this.#inCombat = value;

        // if in combat
        if (value) {

            // add some visual indicator to the GUI
            this.pokeSel.classList.add("pokeSelectorInCombat");

            // if enemy, reveal basic pokemon info
            if (this.enemy) {
                this.hideAllEl.style.display = "none";
            }

        } else {
            this.pokeSel.classList.remove("pokeSelectorInCombat");
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

            <div class="selector pokeSelector" tabindex="-1" locTitle="pokeSelectTitle">
                <img class="pokeSelectorIcon" alt="">
                <div class="pokeSelectorText"></div>
            </div>

            <input type="text" class="pokeNickName textInput mousetrap" spellcheck="false" locTitle="pokeNickTitle" locPHolder="pokeNickPHolder">

            <div class="pokeLvlDiv" locTitle="pokeLvlTitle">
                <div class="pokeLvlText" locText="pokeLvl"></div>
                <input class="pokeLvlNumber" type="number" min="1" max="100" value="1">
            </div>

            <select class="pokeForm" locTitle="pokeFormTitle"></select>

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
                            <div class="pokeAbilityDiv">
                                <input class="pokeDetailsInput pokeAbility" type="text" locPHolder="pokeAbilityPHolder">
                            </div>
                        </div>

                        <div class="pokeDetailsDiv" locTitle="pokeItemTitle">
                            <div class="pokeTopRowText pokeItemText" locText="pokeItem"></div>

                            <div class="pokeItemDiv">
                                <img class="pokeItemIcon"/>
                                <div class="pokeDetailsInput pokeItem"></div>
                            </div>
                        </div>

                    </div>

                </div>

                <div class="detailsMoveRow" locTitle="pokeMoves">

                </div>

            </div>

            <div class="detailsStats">

            </div>

        </div>

        `

        // add move elements
        const detailsMoves = element.getElementsByClassName("detailsMoveRow")[0];
        for (let i = 0; i < 4; i++) {
            const moveEl = this.createMoveElement(i);
            detailsMoves.appendChild(moveEl);
        }

        // add stat elements
        const detailsStatsEl = element.getElementsByClassName("detailsStats")[0];
        for (let i = 0; i < statKeysUpper.length; i++) {
            const statEl = this.createStatElement(statKeysUpper[i]);
            detailsStatsEl.appendChild(statEl);
        }

        // add it to the GUI
        if (this.enemy) {
            trainerPartyDiv.appendChild(element);
        } else {
            pokePartyDiv.appendChild(element);
        }

        return element;

    }

    /**
     * Generates a movement HTML element
     * @param {Number} num - Movement number slot
     * @returns {HTMLElement}
     */
    createMoveElement(num) {

        const element = document.createElement("div");
        element.classList.add("pokeMoveBlock", "pokeMoveDiv" + num);
        element.innerHTML = `

        <input class="pokeDetailsInput pokeMoveName pokeMove${num}" type="text" placeholder="-" spellcheck="false">
        <div class="pokeDetailsMoveDiv">
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
        element.classList.add("pokeDetailsStatDiv");
        element.innerHTML = `

        <div class="pokeStatTexts">
            <div class="pokeStatName" locText="poke${statKey}" locTitle="poke${statKey}Title"></div>
            <div class="pokeBoostNum poke${statKey}Boost" locTitle="pokeBoost"></div>
            <div class="pokeStatNums" locTitle="pokeEVIV">
                <div class="pokeStatNum poke${statKey}"></div>
                <div class="pokeStatNumEVIV poke${statKey}EVIV"></div>
            </div>
        </div>

        <div class="pokeStatBars">
            <div class="pokeStatBarBg pokeStatBar"></div>
            <div class="pokeStatBarActive pokeStatBar pokeStat${statKey}Bar"></div>
        </div>

        `

        return element;

    }

    /** Creates all hide elements for enemy trainer pokemon */
    createHideEls() {

        this.reveals = [];

        // the entire thing
        this.hideAllEl = document.createElement("div");
        this.createHideEl(this.hideAllEl, "teamPokeMainInfo", "Full");

        // details stuff
        this.hideAbiEl = document.createElement("div");
        this.createHideEl(this.hideAbiEl, "pokeAbilityDiv", "Ability");
        this.hideItemEl = document.createElement("div");
        this.createHideEl(this.hideItemEl, "pokeItemDiv", "Item");
        this.hideStatEl = document.createElement("div");
        this.createHideEl(this.hideStatEl, "detailsStats", "Stats");

        this.hideMoveEls = [];
        for (let i = 0; i < 4; i++) {
            this.hideMoveEls.push(document.createElement("div"));
            this.createHideEl(this.hideMoveEls[i], "pokeMoveDiv"+i, "Move"+i);        
        }

    }

    /**
     * Creates an element to hide enemy trainer info
     * @param {HTMLElement} el - Element to cover parent element
     * @param {HTMLElement} parentEl - Element to be covered by THE EYE
     * @param {String} key - Name of thing to be hidden
     */
    createHideEl(el, parentEl, key) {

        el.classList.add("hiddenElement");
        
        // what to show when not hovering
        const theEye = document.createElement("div");
        theEye.classList.add("hiddenElementEye")
        theEye.innerHTML = "👁️"; // 👁️
        el.append(theEye);

        // what to show when hovering
        const hoverText = document.createElement("div");
        hoverText.classList.add("hiddenElementHover")
        hoverText.innerHTML = getLocalizedText("hiddenHover");
        el.append(hoverText);

        // click to force show
        el.addEventListener("click", () => {
            el.style.display = "none";
            this.reveals.push(key); // keep track of manual reveals
            updateTrainer(); // auto send data when doing it
        });

        // add it to parent element
        this.el.getElementsByClassName(parentEl)[0].append(el);

    }

    /**
     * Hides info from enemy trainer pokemon
     * @param {Boolean} value True for hide, false to reveal
     */
    hideRevealInfo(value) {

        const style = value ? "flex" : "none";

        this.hideAllEl.style.display = style;
        this.hideAbiEl.style.display = style;
        this.hideItemEl.style.display = style;
        this.hideStatEl.style.display = style;
        for (let i = 0; i < 4; i++) {
            this.hideMoveEls[i].style.display = style;
        }

        // reset manual reveal tracking if hiding everything
        if (value) {this.reveals = []};

    }

    getReveals() {
        return this.reveals;
    }


    /** @param {String[]} reveals */
    setReveals(reveals) {

        // no reveals? skip
        if (!reveals) return;

        let diff = false;
        for (let i = 0; i < reveals.length; i++) {
            if (this.reveals[i] != reveals[i]) {
                diff = true;
            }
        }
        if (!diff) return; // same reveals as last time? skip

        // now, for each possible reveal
        for (let i = 0; i < reveals.length; i++) {
            if (reveals[i] == "Full") {
                this.hideAllEl.style.display = "none";
            }
            if (reveals[i] == "Ability") {
                this.hideAbiEl.style.display = "none";
            }
            if (reveals[i] == "Item") {
                this.hideItemEl.style.display = "none";
            }
            if (reveals[i].includes("Move")) {
                const moveNum = reveals[i].substring(4);
                this.hideMoveEls[moveNum].style.display = "none";
            }
            if (reveals[i] == "Stats") {
                this.hideStatEl.style.display = "none";
            }
        }

        this.reveals = reveals;

        // since there was a reveal, update enemies
        if (inside.electron) updateTrainer();

    }

    /** Resets all data for this pokemon */
    clear() {
        super.clear();
        this.setLvl(1);
        this.setStatus(null);
        this.setInCombat(false);
        const emptyMove = {
            name: "",
            type: "None",
            pp: 0
        }
        this.setMoves([emptyMove, emptyMove, emptyMove, emptyMove])
    }

}