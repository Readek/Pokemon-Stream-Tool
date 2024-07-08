import { BattlePokemon } from "./Battle Pokemon.mjs";

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
     * @param {Array} team - Team array to modify
     */
    #removePoke(team) {
        
        // delete html elements before removing from array
        team.at(-1).delet();

        // and no one will remember this pokemon ever again
        team.splice(team.length-1);

    }

    /**
     * 
     * @param {Object} data - Team battle data
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

        for (let i = 0; i < data.length; i++) {
            team[i].update(data[i]);            
        }

    }

    show() {
        pokesDiv.style.display = "flex";
    }

    hide() {
        pokesDiv.style.display = "none";
    }

}

export const battlePokemons = new BattlePokemons;