import { BattlePokemon } from "./Battle Pokemon.mjs";
import { setTrainerPokeCount } from "./Trainer Name Intro.mjs";
/** @import { PokemonSentData } from "../../../../../Resources/Scripts/Utils/Type Definitions.mjs" */

const pokesDiv = document.getElementById("battleDiv");

class BattlePokemons {

    /** @type {BattlePokemon[]} */
    #playerBPokemons = [];
    /** @type {BattlePokemon[]} */
    #enemyBPokemons = [];

    /**
     * Adds a new battle pokemon to the desired array
     * @param {Array} team - Team array to modify
     * @param {Boolean} playerOrEnemy - True if player, false if enemy
     */
    #addPoke(team, playerOrEnemy) {
        
        team.push(new BattlePokemon(playerOrEnemy));

    }

    /**
     * Removes the last battle pokemon from the desired array
     * @param {BattlePokemon[]} team - Team array to modify
     */
    #removePoke(team) {
        
        // delete html elements before removing from array
        team.at(-1).delet();

        // and no one will remember this pokemon ever again
        team.splice(team.length-1);

    }

    /**
     * Updates pokemon battle data
     * @param {PokemonSentData[]} data - Team battle data
     * @param {Boolean} playerOrEnemy - True if player, false if enemy
     */
    update(data, playerOrEnemy) {

        const team = playerOrEnemy ? this.#playerBPokemons : this.#enemyBPokemons;

        // fist of all, check if we have the same amount of pokemon
        const incPokeLength = data.length;
        const homePokeLength = team.length;

        if (incPokeLength != homePokeLength) {

            if (homePokeLength < incPokeLength) {

                // if more pokes than previously, add that many pokes
                for (let i = 0; i < incPokeLength - homePokeLength; i++) {
                    this.#addPoke(team, playerOrEnemy);
                }

            } else {

                // if less pokes than previously, remove that many pokes
                for (let i = 0; i < homePokeLength - incPokeLength; i++) {
                    this.#removePoke(team);
                }

            }

        }

        let actPokeCount = 0;
        let pokeCount = 0;
        for (let i = 0; i < data.length; i++) {

            // time to update everything everywhere all at once
            team[i].update(data[i]);

            // get an active mon count to determine battle mode
            if (data[i].inCombat) actPokeCount++;

            // send a poke count for trainer intro
            if (!playerOrEnemy && data[i].species) pokeCount++;

        }

        if (!playerOrEnemy) setTrainerPokeCount(pokeCount);

        // notify teams of gamemode
        for (let i = 0; i < team.length; i++) {
            team[i].setGamemode(actPokeCount);
        }

    }

    show() {

        pokesDiv.style.animation = "";

        // we check for in combat status so we can animate standby bar progressively
        let nonCombatCount = 0;
        for (let i = 0; i < this.#playerBPokemons.length; i++) {
            if (!this.#playerBPokemons[i].getInCombat()) {
                nonCombatCount++;
                this.#playerBPokemons[i].show(nonCombatCount);
            } else {
                this.#playerBPokemons[i].show();
            }
        }

        nonCombatCount = 0;
        for (let i = 0; i < this.#enemyBPokemons.length; i++) {
            if (!this.#enemyBPokemons[i].getInCombat()) {
                nonCombatCount++;
                this.#enemyBPokemons[i].show(nonCombatCount);
            } else {
                this.#enemyBPokemons[i].show();
            }
        }

    }

    async hide() {

        const fadeTime = .5
        pokesDiv.style.animation = `iDontFeelSoGood ${fadeTime}s both`;
        await new Promise(resolve => setTimeout(resolve, fadeTime*1000));

        // also delet all current pokes
        for (let i = this.#playerBPokemons.length; i > 0; i--) {
            this.#removePoke(this.#playerBPokemons);
        }
        for (let i = this.#enemyBPokemons.length; i > 0; i--) {
            this.#removePoke(this.#enemyBPokemons);
        }

    }

}

export const battlePokemons = new BattlePokemons;