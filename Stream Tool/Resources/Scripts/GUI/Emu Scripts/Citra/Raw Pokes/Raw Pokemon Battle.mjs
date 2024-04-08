import { getLocalizedText } from "../../../../Utils/Language.mjs";
import { current } from "../../../Globals.mjs";
import { validateRawPokemon } from "../Utils.mjs";
import struct from "../struct.mjs";

export class RawPokemonBattle {

    #data;
    #dataUnbuffered = [];
    #hasChanged = false;

    /**
     * Translates raw pokemon data into something readable
     * @param {Uint8Array} data Raw pokemon data
     */
    newData(data) {

        // check if new data is same as last to save on performance
        this.#hasChanged = false;

        if (this.#dataUnbuffered.length != data.length) { // mostly for first time
            this.#hasChanged = true
        } else {

            // check if anything missmatches between old data and new data
            for (let i = 0; i < this.#dataUnbuffered.length; i++) {
                if (data[i] != this.#dataUnbuffered[i]) {
                    this.#hasChanged = true;
                    break;
                }
                
            }

        }

        if (this.#hasChanged) {

            this.#dataUnbuffered = data;
            this.#data = data.buffer;
            this.valid = validateRawPokemon(this);

        }
            
    }

    /** Changes hasChanged status from the outside */
    hasChanged() {
        this.#hasChanged = true;
    }

    /**
     * Returns this pokemon's Pokedex number
     * @returns {Number}
     */
    dexNum() {
        if (this.#hasChanged) {
            this.dexNumValue = struct("<H").unpack(this.#data.slice(0x4, 0x6))[0];
        }
        return this.dexNumValue;
    }

    /**
     * Returns this pokemon's species name
     * @returns {String}
     */
    speciesName() {
        return current.numToPoke[this.dexNum()];
    }

    /**
     * Returns this pokemon's current level
     * @returns {Number}
     */
    level() {
        if (this.#hasChanged) {
            this.levelValue = struct("B").unpack(this.#data.slice(0x10, 0x11))[0];
        }
        return this.levelValue;
    }

    /**
     * Check if this Pokemon has changed its form.
     * For megas, can return 1 or 2 depending on form (Y, X);
     * @returns {Number}
     */
    formIndex() {
        if (this.#hasChanged) {
            this.formIndexValue = struct("B").unpack(this.#data.slice(0x14B, 0x14C))[0];
        }
        return this.formIndexValue;
    }

    /**
     * Returns this pokemon's gender
     * @returns {String}
     */
    gender() {
    
        if (this.#hasChanged) {

            const leByte = struct("B").unpack(this.#data.slice(0xfb, 0xfc))[0];

            if (leByte == 1 ) {
                this.genderValue = "F";
            } else if (leByte == 2) {
                this.genderValue = null;
            } else {
                this.genderValue = "M";
            }

        }

        return this.genderValue;
        
    }

    /**
     * Gets the current pokemon's status
     * @returns {String}
     */
    status() {
        
        if (this.#hasChanged) {
            if (struct("B").unpack(this.#data.slice(0x18, 0x19))[0]) {
                this.statusValue = "Par";
            } else if (struct("B").unpack(this.#data.slice(0x1C, 0x1D))[0]) {
                this.statusValue = "Sle";
            } else if (struct("B").unpack(this.#data.slice(0x20, 0x21))[0]) {
                this.statusValue = "Fro";
            } else if (struct("B").unpack(this.#data.slice(0x24, 0x25))[0]) {
                this.statusValue = "Bur";
            } else if (struct("B").unpack(this.#data.slice(0x28, 0x29))[0]) {
                this.statusValue = "Poi";
            }
        }
        return this.statusValue;
        
    }

    /**
     * Gets this pokemon's current total experience points
     * @returns {Number}
     */
    experience() {
        if (this.#hasChanged) {
            this.experienceValue = struct("<i").unpack(this.#data.slice(0x0, 0x4))[0];
        }
        return this.experienceValue;
    }

    /**
     * Gets this pokemon's ability id then translates it to text
     * @returns {String}
     */
    ability() {

        if (this.#hasChanged) {

            const abNum = struct("B").unpack(this.#data.slice(0xE, 0xF))[0];
            if (current.abilities[abNum]) {
                this.abilityValue = current.abilities[abNum].name;
            } else {
                this.abilityValue = getLocalizedText("unknownAbility");
            }

        }
        return this.abilityValue;

    }

    /**
     * Gets this pokemon's held item id then translates it to text
     * @returns {String}
     */
    item() {

        if (this.#hasChanged) {

            const itemNum = struct("<H").unpack(this.#data.slice(0xA, 0xC))[0];
            if (itemNum == 0) {
                this.itemValue = "";
            } else if (current.items[itemNum]) {
                this.itemValue = current.items[itemNum].name;
            } else {
                this.itemValue = getLocalizedText("unknownItem");
            }

        }

        return this.itemValue;

    }

    move(num) {

        const move = {};

        const moveAdd = 0x10e + (14 * num);
        const ppAdd = 0x110 + (14 * num);
        const moveNum = struct("<H").unpack(this.#data.slice(moveAdd, moveAdd+2))[0];

        if (current.moves[moveNum]) {
            
            move.name = current.moves[moveNum].name;
            move.type = current.moves[moveNum].type;
    
            move.pp = struct("B").unpack(this.#data.slice(ppAdd, ppAdd+1))[0];
    
            return move;

        }
        
        if (moveNum == 0) {
            return {
                name : "",
                type : "None",
                pp : 0
            }
        }
        
        return {
            name : getLocalizedText("unknownMove"),
            type : "None",
            pp : 0
        }

    }

    /**
     * Gets this pokemon's moves
     * @returns {[{name: String, type: String, pp: Number}]} Movement data
     */
    moves() {

        if (this.#hasChanged) {
            this.movesValue = [];
            for (let i = 0; i < 4; i++) {
                this.movesValue.push(this.move(i));
            }
        }
        
        return this.movesValue;
    }

    /**
     * Returns this pokemon's current HP value
     * @returns {Number}
     */
    currentHP() {
        if (this.#hasChanged) {
            this.currentHPValue = struct("<H").unpack(this.#data.slice(0x8, 0xA))[0];
        }
        return this.currentHPValue;
    }

    /**
     * Returns this pokemon's max HP value
     * @returns {Number}
     */
    maxHP() {
        if (this.#hasChanged) {
            this.maxHPValue = struct("<H").unpack(this.#data.slice(0x6, 0x8))[0];
        }
        return this.maxHPValue;
    }

    /** Current Attack value @returns {Number} */
    attack() {
        return struct("<H").unpack(this.#data.slice(0xEE, 0xF0))[0];
    }
    /** Current Defense value @returns {Number} */
    defense() {
        return struct("<H").unpack(this.#data.slice(0xF0, 0xF2))[0];
    }
    /** Current Special Attack value @returns {Number} */
    spAttack() {
        return struct("<H").unpack(this.#data.slice(0xF2, 0xF4))[0];
    }
    /** Current Special Defense value @returns {Number} */
    spDefense() {
        return struct("<H").unpack(this.#data.slice(0xF4, 0xF6))[0];
    }
    /** Current Speed value @returns {Number} */
    speed() {
        return struct("<H").unpack(this.#data.slice(0xF6, 0xF8))[0];
    }

    /**
     * @typedef {{num: Number} StatKey
     */

    /**
     * Gathers base stats from this pokemon
     * @returns {{
    *  hp: StatKey, atk: StatKey, def: StatKey, spa: StatKey, spd: StatKey, spe: StatKey
    * }}
    */
   stats() {

       if (this.#hasChanged) {
   
           this.statsValue = {
               hp: {num : this.maxHP()},
               atk: {num : this.attack()},
               def: {num : this.defense()},
               spa: {num : this.spAttack()},
               spd: {num : this.spDefense()},
               spe: {num : this.speed()},
           }
           
       }
       
       return this.statsValue;

   }

}
