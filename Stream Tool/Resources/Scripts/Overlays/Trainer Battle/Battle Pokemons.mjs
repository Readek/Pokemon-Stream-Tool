import { BattlePokemon } from "./Battle Pokemon.mjs";
import { setTrainerPokeCount } from "./Trainer Name Intro.mjs";
/** @import { PokemonSentData } from "../../Utils/Type Definitions.mjs" */

const pokesDiv = document.getElementById("battleDiv");

class BattlePokemons {

    /** @type {BattlePokemon[]} */
    #playerBPokemons = [];
    /** @type {BattlePokemon[]} */
    #enemyBPokemons = [];

    /**
     * Updates pokemon battle data
     * @param {PokemonSentData[]} data - Team battle data
     * @param {Boolean} playerOrEnemy - True if player, false if enemy
     */
    update(data, playerOrEnemy) {

        const team = playerOrEnemy ? this.#playerBPokemons : this.#enemyBPokemons;

        let actPokeCount = 0;
        let pokeCount = 0;

        for (let i = 0; i < Math.max(team.length, data.length); i++) {
            
            // if we got sent more pokes than we have, create new ones
            if (!team[i]) {
                team.push(new BattlePokemon(playerOrEnemy));
            }

            if (!data[i]) {
                // if we got sent less pokes than we have, delete the rest
                team[i].delet();
                team.splice(i, 1);
                i--;
            } else {

                // time to update everything everywhere all at once
                team[i].update(data[i]);

                // get an active mon count to determine battle mode
                if (data[i].inCombat) actPokeCount++;

                // send a poke count for trainer intro
                if (!playerOrEnemy && data[i].species) pokeCount++;

            }

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
        await pokesDiv.getAnimations()[0].finished;

        // also delet all current pokes
        for (let i = 0; i < this.#playerBPokemons.length; i++) {
            this.#playerBPokemons[i].delet();
        }
        this.#playerBPokemons = [];
        for (let i = 0; i < this.#enemyBPokemons.length; i++) {            
            this.#enemyBPokemons[i].delet();
        }
        this.#enemyBPokemons = [];

    }

}

export const battlePokemons = new BattlePokemons;