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

}
