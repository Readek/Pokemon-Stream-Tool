import { pokemons } from "./Player Team/Pokemons.mjs";
import { current } from "./Globals.mjs";
import { getLocalizedText } from "../../../../Resources/Scripts/Utils/Language.mjs";

const playerInfoDiv = document.getElementById("playerInfo");
const wildDiv = document.getElementById("wildEncounterDiv");

const wildPokeImg = document.getElementById("wildPokeImg");

const typeDivs = document.getElementsByClassName("vsWildTypeDiv");

const ratioMaleDiv = document.getElementById("vsWildGenderRatioM");
const ratioFemaleDiv = document.getElementById("vsWildGenderRatioF");

const ability0Div = document.getElementById("vsWildAbility0");
const ability1Div = document.getElementById("vsWildAbility1");
const abilityHiddenDiv = document.getElementById("vsWildAbilityH");

const statTextHP = document.getElementById("vsWildStatNumberHP");
const statTextAT = document.getElementById("vsWildStatNumberAT");
const statTextDE = document.getElementById("vsWildStatNumberDE");
const statTextSA = document.getElementById("vsWildStatNumberSA");
const statTextSD = document.getElementById("vsWildStatNumberSD");
const statTextSP = document.getElementById("vsWildStatNumberSP");

const statMeterHP = document.getElementById("vsWildMeterHP");
const statMeterAT = document.getElementById("vsWildMeterAT");
const statMeterDE = document.getElementById("vsWildMeterDE");
const statMeterSA = document.getElementById("vsWildMeterSA");
const statMeterSD = document.getElementById("vsWildMeterSD");
const statMeterSP = document.getElementById("vsWildMeterSP");

let side = "Front";

class WildPokemon {

    /**
     * Sets src path for the pokemon's image
     * @param {Object} img - Image object
     */
    setImg(img) {

        // position offsets
        const offset = img["gen5" + side + "Offs"];
        wildPokeImg.style.transform = `scale(2) translate(${offset[0]}px, ${offset[1]}px)`;

        // actual image
        wildPokeImg.src = img["gen5" + side];

    }

    /**
     * Changes shown type info
     * @param {Array} types - Array of the pokemon's types
     */
    setTypes(types) {

        typeDivs[0].firstElementChild.src = `
            ../../Resources/Assets/Type Icons/${types[0]}.png`;
        typeDivs[0].lastElementChild.innerHTML = getLocalizedText("type"+types[0]);
        typeDivs[0].lastElementChild.setAttribute("locText", "type"+types[0]);

        if (types[1]) { // only if it has a second type

            typeDivs[1].firstElementChild.src = `
                ../../Resources/Assets/Type Icons/${types[1]}.png`;
            typeDivs[1].lastElementChild.innerHTML = getLocalizedText("type"+types[1]);
            typeDivs[1].lastElementChild.setAttribute("locText", "type"+types[1]);
            typeDivs[1].style.display = "flex";

        } else { // hide if not
            typeDivs[1].style.display = "none";
        }

    }

    /**
     * Changes shown gender ratio info
     * @param {Number} ratioM - Male Ratio
     * @param {Number} ratioF - Female Ratio
     */
    setGenderRatio(ratioM, ratioF) {
        ratioMaleDiv.innerHTML = `${ratioM * 100}%`;
        ratioFemaleDiv.innerHTML = `${ratioF * 100}%`;
    }

    /**
     * Updates shown ability texts
     * @param {Object} abilities - Object of the pokemon's abilities
     */
    setAbilities(abilities) {

        // we assume a pokemon always has at least 1 ability
        ability0Div.innerHTML = abilities[0];

        // second ability
        if (abilities[1]) {
            ability1Div.innerHTML = abilities[1];
            ability1Div.style.display = "flex";
        } else { // hide if non existant
            ability1Div.style.display = "none";
        }

        // hidden ability
        if (abilities.H) {
            abilityHiddenDiv.innerHTML = abilities.H;
            abilityHiddenDiv.style.display = "flex";
        } else {
            abilityHiddenDiv.style.display = "none";
        }

    }

    /**
     * Updates every stat meter
     * @param {Object} stats - Stats data
     */
    updateMeters(stats) {

        // base stats
        statTextHP.innerHTML = stats.hp;
        statTextAT.innerHTML = stats.atk;
        statTextDE.innerHTML = stats.def;
        statTextSA.innerHTML = stats.spa;
        statTextSD.innerHTML = stats.spd;
        statTextSP.innerHTML = stats.spe;

        // we wait a tick so the animation plays when coming from display none
        setTimeout(() => {
            statMeterHP.style.width = this.#calcStatMeter(stats.hp) + "%";
            statMeterAT.style.width = this.#calcStatMeter(stats.atk) + "%";
            statMeterDE.style.width = this.#calcStatMeter(stats.def) + "%";
            statMeterSA.style.width = this.#calcStatMeter(stats.spa) + "%";
            statMeterSD.style.width = this.#calcStatMeter(stats.spd) + "%";
            statMeterSP.style.width = this.#calcStatMeter(stats.spe) + "%";
        }, 0);

    }

    /**
     * Calculates percentage for the provided stat
     * @param {Number} value - Current pokemon stat
     * @returns {Number} Stat % out of max possible stats
     */
    #calcStatMeter(value) {
        return value * 100 / 230 // 230 being max base stat a pokemon can have
    }

    /**
     * Updates current wild pokemon stats
     * @param {Object} data - Wild pokemon's data
     */
    update(data) {

        // wild pokemon image
        this.setImg(data.pokemon.img);

        // set type info
        this.setTypes(data.pokemon.type);

        // gender ratio
        this.setGenderRatio(data.pokemon.ratioM, data.pokemon.ratioF);

        // abilities
        this.setAbilities(data.pokemon.abilities);

        // stat meters
        this.updateMeters(data.pokemon.stats);

        // check if the in combat state changed
        if (current.inCombat != data.inCombat) {

            current.inCombat = data.inCombat;

            // show or hide info if the fight is happening or not
            if (data.inCombat) {
                playerInfoDiv.style.animation = "slideOut .5s both";
                setTimeout(() => {
                    wildDiv.style.animation = "slideIn .5s both";
                }, 250);
            } else {
                wildDiv.style.animation = "slideOut .5s both";
                setTimeout(() => {
                    playerInfoDiv.style.animation = "slideIn .5s both";
                }, 250);
            }
            
            // if in combat, turn everyone so they get to see this glorious fight
            for (let i = 0; i < 6; i++) {

                if (pokemons.pokemon(i).getSpecies()) {
                    pokemons.pokemon(i).turnSprite(data.inCombat);
                    pokemons.pokemon(i).displayHPBar();
                }
                
            }

        }

    }

}

/** Wild Pokemon encounter stats */
export const wildPokemon = new WildPokemon;