import { current } from "../../Globals.mjs";
import { decryptData } from "./Crypts.mjs";
import { validateRawPokemon } from "./Utils.mjs";
import struct from "./struct.mjs";

export class RawPokemonParty {

    #data;

    /**
     * Translates raw pokemon data into something readable
     * @param {Uint8Array} data Raw pokemon data
     */
    constructor(data) {

        this.#data = decryptData(data);
        this.valid = validateRawPokemon(this);

    }

    /**
     * Returns this pokemon's Pokedex number
     * @returns {Number}
     */
    dexNum() {
        return struct("<H").unpack(this.#data.slice(0x8, 0xA))[0];
    }

    /**
     * Returns this pokemon's species name
     * @returns {String}
     */
    speciesName() {
        return current.numToPoke[this.dexNum()];
    }

    /**
     * Returns this pokemon's nickname
     * @returns {String}
     */
    nickname() {
        return struct("<24s").unpack(this.#data.slice(0x40, 0x58))[0]
            .split(`\0\0`)[0].replace(/\0/g, '');
    }

    /**
     * Returns this pokemon's gender
     * @returns {String}
     */
    gender() {
        /* Bit 0 - Fateful Encounter Flag
        Bit 1 - Female
        Bit 2 - Genderless
        Bit 3-7 - Alternate Forms */
        const leByte = struct("B").unpack(this.#data.slice(0x1D, 0x1E))[0];

        // gender
        if (leByte &(1 << 1) ) {
            return "F";
        } else if (leByte &(1 << 2)) {
            return;
        } else {
            return "M";
        }
    }

    /**
     * Check if this Pokemon has changed its form
     * @returns {Number}
     */
    formIndex() {
        // this is the same byte used to determine gender
        return (struct("B").unpack(this.#data.slice(0x1D, 0x1E))[0] & 248) >> 3;
    }

    /**
     * Returns this pokemon's current level
     * @returns {Number}
     */
    level() {
        return struct("B").unpack(this.#data.slice(0xEC, 0xED))[0];
    }

    /**
     * Gets the current pokemon's status
     * @returns {String}
     */
    status() {
        const leByte = struct("B").unpack(this.#data.slice(0xE8, 0xE9))[0];
        if (leByte == 2) {
            return "Sle";
        } else if (leByte == 5) {
            return "Poi";
        } else if (leByte == 4) {
            return "Bur";
        } else if (leByte == 3) {
            return "Fro";
        } else if (leByte == 1) {
            return "Par";
        }
    }

    /**
     * Returns this pokemon's current HP value
     * @returns {Number}
     */
    currentHP() {
        return struct("<H").unpack(this.#data.slice(0xF0, 0xF2))[0];
    }

    /**
     * Returns this pokemon's max HP value
     * @returns {Number}
     */
    maxHP() {
        return struct("<H").unpack(this.#data.slice(0xF2, 0xF4))[0];
    }

}
