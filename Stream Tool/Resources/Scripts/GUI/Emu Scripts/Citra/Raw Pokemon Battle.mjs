import { current } from "../../Globals.mjs";
import struct from "./struct.mjs";

export class RawPokemonBattle {

    #data;

    /**
     * Translates raw pokemon data into something readable
     * @param {Uint8Array} data Raw pokemon data
     */
    constructor(data) {
        this.#data = data.buffer;
    }

    /**
     * Returns this pokemon's Pokedex number
     * @returns {Number}
     */
    dexNum() {
        return struct("<H").unpack(this.#data.slice(0x4, 0x6))[0];
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
        return struct("B").unpack(this.#data.slice(0x10, 0x11))[0];
    }

    /**
     * Gets the current pokemon's status
     * @returns {String}
     */
    status() {
        
        if (struct("B").unpack(this.#data.slice(0x18, 0x19))[0]) {
            return "Par";
        } else if (struct("B").unpack(this.#data.slice(0x1C, 0x1D))[0]) {
            return "Sle";
        } else if (struct("B").unpack(this.#data.slice(0x20, 0x21))[0]) {
            return "Fro";
        } else if (struct("B").unpack(this.#data.slice(0x24, 0x25))[0]) {
            return "Bur";
        } else if (struct("B").unpack(this.#data.slice(0x28, 0x29))[0]) {
            return "Poi";
        }
        
    }

    /**
     * Returns this pokemon's current HP value
     * @returns {Number}
     */
    currentHP() {
        return struct("<H").unpack(this.#data.slice(0x8, 0xA))[0];
    }

    /**
     * Returns this pokemon's max HP value
     * @returns {Number}
     */
    maxHP() {
        return struct("<H").unpack(this.#data.slice(0x6, 0x8))[0];
    }

    /**
     * Check if this Pokemon has changed its form.
     * For megas, can return 1 or 2 depending on form (Y, X);
     * @returns {Number}
     */
    formIndex() {
        return struct("B").unpack(this.#data.slice(0x14B, 0x14C))[0];
    }

}
