import { current } from "../../Globals.mjs";
import { decryptData } from "./Crypts.mjs";
import struct from "./struct.mjs";

export class RawPokemon {

    #data;

    /**
     * Translates raw pokemon data into something readable
     * @param {Uint8Array} data Raw pokemon data
     */
    constructor(data) {

        this.#data = decryptData(data);

        console.log(this.dexNum(), this.speciesName());

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

}
