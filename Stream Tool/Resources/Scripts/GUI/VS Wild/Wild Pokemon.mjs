import { getLocalizedText } from "../../Utils/Language.mjs";
import { Catch } from "../Catches/Catch.mjs";
import { catches } from "../Catches/Catches.mjs";
import { updateCatches } from "../Catches/Update Catches.mjs";
import { stPath } from "../Globals.mjs";
import { displayNotif } from "../Notifications.mjs";
import { playerStats } from "../Player/Stats.mjs";
import { updatePlayer } from "../Player/Update Player.mjs";
import { Pokemon } from "../Pokemon.mjs";
import { updateWildEnc } from "./Update Wild.mjs";

const infoDiv = document.getElementById("vsWildBotRow");
const sendInp = document.getElementById("vsWildNickInput");
const sendBut = document.getElementById("sendCatchButt");
const inComCheck = document.getElementById("vsWildInCombatCheck");

class WildPokemon extends Pokemon {

    #statTextHP;
    #statTextAT;
    #statTextDE;
    #statTextSA;
    #statTextSD;
    #statTextSP;
    #statTextTS;

    #statMeterHP;
    #statMeterAT;
    #statMeterDE;
    #statMeterSA;
    #statMeterSD;
    #statMeterSP;
    #statMeterTS;

    #genderRatioTextM;
    #genderRatioTextF;

    #abilityText0;
    #abilityText1;
    #abilityTextH;

    constructor() {

        super();

        this.typeImg1 = document.getElementById("wildTypeIcon1");
        this.typeImg2 = document.getElementById("wildTypeIcon2");

        this.#statTextHP = document.getElementById("vsWildStatNumberHP");
        this.#statTextAT = document.getElementById("vsWildStatNumberAT");
        this.#statTextDE = document.getElementById("vsWildStatNumberDE");
        this.#statTextSA = document.getElementById("vsWildStatNumberSA");
        this.#statTextSD = document.getElementById("vsWildStatNumberSD");
        this.#statTextSP = document.getElementById("vsWildStatNumberSP");
        this.#statTextTS = document.getElementById("vsWildStatNumberTS");

        this.#statMeterHP = document.getElementById("vsWildMeterHP");
        this.#statMeterAT = document.getElementById("vsWildMeterAT");
        this.#statMeterDE = document.getElementById("vsWildMeterDE");
        this.#statMeterSA = document.getElementById("vsWildMeterSA");
        this.#statMeterSD = document.getElementById("vsWildMeterSD");
        this.#statMeterSP = document.getElementById("vsWildMeterSP");
        this.#statMeterTS = document.getElementById("vsWildMeterTS");

        this.#genderRatioTextM = document.getElementById("vsWildGenderRatioM");
        this.#genderRatioTextF = document.getElementById("vsWildGenderRatioF");

        this.#abilityText0 = document.getElementById("vsWildAbility0");
        this.#abilityText1 = document.getElementById("vsWildAbility1");
        this.#abilityTextH = document.getElementById("vsWildAbilityH");

        // send catch listener
        sendBut.addEventListener("click", () => {this.#sendCatch()})

        this.displayWildStats();

    }

    /**
     * Sets a new pokemon based on the name
     * @param {String} name - Name of the pokemon
     */
    setSpecies(name) {

        super.setSpecies(name);

        if (name) {
            this.displayWildStats();
        }

    }

    displayWildStats() {
        if (this.getSpecies()) {
            // show them stats and fill them
            infoDiv.style.display = "flex";
            document.getElementById("vsWildSendCatchDiv").style.display = "flex";
            document.getElementById("vsWildInCombatDiv").style.display = "flex";
            this.#fillInfo();
        } else {
            // hide them stats
            infoDiv.style.display = "none";
            document.getElementById("vsWildSendCatchDiv").style.display = "none";
            document.getElementById("vsWildInCombatDiv").style.display = "none";
        }
    }

    getInCombat() {
        return inComCheck.checked;
    }
    setInCombat(value) {
        inComCheck.checked = value;
    }

    #fillInfo() {

        const pokeData = this.getPokeData()
        
        // base stats
        this.#statTextHP.innerHTML = pokeData.baseStats.hp;
        this.#statTextAT.innerHTML = pokeData.baseStats.atk;
        this.#statTextDE.innerHTML = pokeData.baseStats.def;
        this.#statTextSA.innerHTML = pokeData.baseStats.spa;
        this.#statTextSD.innerHTML = pokeData.baseStats.spd;
        this.#statTextSP.innerHTML = pokeData.baseStats.spe;
        this.#statTextTS.innerHTML = pokeData.bst;

        // we wait a tick so the animation plays when coming from display none
        setTimeout(() => {
            this.#statMeterHP.style.width = this.#calcStatMeter(pokeData.baseStats.hp) + "%";
            this.#statMeterAT.style.width = this.#calcStatMeter(pokeData.baseStats.atk) + "%";
            this.#statMeterDE.style.width = this.#calcStatMeter(pokeData.baseStats.def) + "%";
            this.#statMeterSA.style.width = this.#calcStatMeter(pokeData.baseStats.spa) + "%";
            this.#statMeterSD.style.width = this.#calcStatMeter(pokeData.baseStats.spd) + "%";
            this.#statMeterSP.style.width = this.#calcStatMeter(pokeData.baseStats.spe) + "%";
            this.#statMeterTS.style.width = this.#calcStatMeter(pokeData.bst, true) + "%";
        }, 0);

        // poke types
        let types = this.getTypes();
        this.typeImg1.src = `${stPath.assets}/Type Icons/${types[0]}.png`;
        this.typeImg1.parentElement.lastElementChild.innerHTML = getLocalizedText("type"+types[0]);
        this.typeImg1.parentElement.lastElementChild.setAttribute("locText", "type"+types[0]);
        if (types[1]) {
            this.typeImg2.src = `${stPath.assets}/Type Icons/${types[1]}.png`;
            this.typeImg2.style.display = "block";
            this.typeImg2.parentElement.style.display = "flex";
            this.typeImg2.parentElement.lastElementChild.innerHTML = getLocalizedText("type"+types[1]);
            this.typeImg2.parentElement.lastElementChild.setAttribute("locText", "type"+types[1]);
        } else {
            this.typeImg2.parentElement.style.display = "none";
        }

        // gender ratio
        this.#genderRatioTextM.innerHTML = pokeData.genderRatio.M * 100 + "%";
        this.#genderRatioTextF.innerHTML = pokeData.genderRatio.F * 100 + "%";

        // abilities
        this.#abilityText0.innerHTML = pokeData.abilities[0];

        if (pokeData.abilities[1]) {
            this.#abilityText1.innerHTML = pokeData.abilities[1];
            this.#abilityText1.style.display = "flex";
        } else {
            this.#abilityText1.style.display = "none";
        }

        if (pokeData.abilities.H) {
            this.#abilityTextH.innerHTML = pokeData.abilities.H;
            this.#abilityTextH.style.display = "flex";
        } else {
            this.#abilityTextH.style.display = "none";
        }

    }

    #calcStatMeter(value, total) {

        if (total) {
            return value * 100 / 720 // 680 being max total base stats a pokemon can have
        } else {
            return value * 100 / 230 // 230 being max base stat a pokemon can have
        }

    }

    #sendCatch() {

        const dataToSend = {
            species : this.getSpecies(),
            form : this.getForm(),
            nickname : sendInp.value,
            gender : this.getGender(),
            shiny : this.getShiny(),
        }

        catches.push(new Catch(dataToSend));
        updateCatches();

        // automatically exit combat state
        this.setInCombat(false);
        updateWildEnc();

        // +1 to catches counter
        playerStats.setCatches(playerStats.getCatches() + 1);
        updatePlayer();

        displayNotif(getLocalizedText("notifCatchSent",
            [dataToSend.nickname || dataToSend.species]) // if no nickname, use species
        );

    }

    /**
     * Gathers are usable data from wild encounter
     * @returns {Object} Data to be read by browsers
     */
    async sendData() {

        const pokedata = this.getPokeData();

        if (!this.getSpecies()) {
            return null;
        } else {
            return {
                // these are only for remote updating
                species : this.getSpecies(),
                form : this.getForm(),
                gender : this.getGender(),
                shiny : this.getShiny(),
                // and this is the data for browsers
                type : this.getTypes(),
                img : await this.getImgSrc(),
                stats : {
                    hp : pokedata.baseStats.hp,
                    atk : pokedata.baseStats.atk,
                    def : pokedata.baseStats.def,
                    spa : pokedata.baseStats.spa,
                    spd : pokedata.baseStats.spd,
                    spe : pokedata.baseStats.spe,
                    bst : pokedata.bst
                },                
                ratioM : pokedata.genderRatio.M,
                ratioF : pokedata.genderRatio.F,
                abilities : {
                    0 : pokedata.abilities[0],
                    1 : pokedata.abilities[1],
                    H : pokedata.abilities.H
                }
            }
        }

    }

    /** Creates the pokemon's HTML element */
    generateElement() {

        return document.getElementById("vsWildRegion");


    }

}

export const wildEncounter = new WildPokemon;
