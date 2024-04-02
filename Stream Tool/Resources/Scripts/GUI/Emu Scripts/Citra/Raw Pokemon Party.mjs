import { getLocalizedText } from "../../../Utils/Language.mjs";
import { current, dexGens } from "../../Globals.mjs";
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
     * Gets this pokemon's current total experience points
     * @returns {Number}
     */
    experience() {
        return struct("<H").unpack(this.#data.slice(0x10, 0x13))[0];
    }

    /**
     * Gets this pokemon's ability id then translates it to text
     * @returns {String}
     */
    ability() {

        const abNum = struct("B").unpack(this.#data.slice(0x14, 0x15))[0];
        if (current.abilities[abNum]) {
            return current.abilities[abNum].name;
        }
        return getLocalizedText("unknownAbility");

    }

    /**
     * Gets this pokemon's held item id then translates it to text
     * @returns {String}
     */
    item() {

        const itemNum = struct("<H").unpack(this.#data.slice(0x0A, 0x0C))[0];
        if (itemNum == 0) return;
        if (current.items[itemNum]) {
            return current.items[itemNum].name;
        }
        return getLocalizedText("unknownItem");

    }

    /**
     * Gets this pokemon's move info
     * @param {Number} num - Move slot
     * @returns {{name: String, type: String, pp: Number}}
     */
    move(num) {

        const move = {};

        const moveAdd = 0x5A + (num * 2);
        const ppAdd = 0x62 + (num);
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
                pp : "0"
            }
        }
        
        return {
            name : getLocalizedText("unknownMove"),
            type : "",
            pp : 0
        }

    }

    moves() {
        const moves = [];
        for (let i = 0; i < 4; i++) {
            moves.push(this.move(i));
        }
        return moves;
    }

    /** Current HP value @returns {Number} */
    currentHP() {
        return struct("<H").unpack(this.#data.slice(0xF0, 0xF2))[0];
    }
    /** Current max HP value @returns {Number} */
    maxHP() {
        return struct("<H").unpack(this.#data.slice(0xF2, 0xF4))[0];
    }

    /** Current Attack value @returns {Number} */
    attack() {
        return struct("<H").unpack(this.#data.slice(0xF4, 0xF6))[0];
    }
    /** Current Defense value @returns {Number} */
    defense() {
        return struct("<H").unpack(this.#data.slice(0xF6, 0xF8))[0];
    }
    /** Current Special Attack value @returns {Number} */
    spAttack() {
        return struct("<H").unpack(this.#data.slice(0xFA, 0xFC))[0];
    }
    /** Current Special Defense value @returns {Number} */
    spDefense() {
        return struct("<H").unpack(this.#data.slice(0xFC, 0xFE))[0];
    }
    /** Current Speed value @returns {Number} */
    speed() {
        return struct("<H").unpack(this.#data.slice(0xF8, 0xFA))[0];
    }


    /**
     * @typedef {{
     *  hp: Number, atk: Number, def: Number, spa: Number, spd: Number, spe: Number
     * }} Stats
     */

    /**
     * Gets this pokemon's Effort Values
     * @returns {Stats}
     */
    ev() {

        const ev = {};

        ev.hp = struct("B").unpack(this.#data.slice(0x1E, 0x1F))[0];
        ev.atk = struct("B").unpack(this.#data.slice(0x1F, 0x20))[0];
        ev.def = struct("B").unpack(this.#data.slice(0x20, 0x21))[0];
        ev.spa = struct("B").unpack(this.#data.slice(0x22, 0x23))[0];
        ev.spd = struct("B").unpack(this.#data.slice(0x23, 0x24))[0];
        ev.spe = struct("B").unpack(this.#data.slice(0x21, 0x22))[0];

        return ev;

    }

    /**
     * Gets this pokemon's Individual Values
     * @returns {Stats}
     */
    iv() {

        const iv = {};

        const ivs = struct("<I").unpack(this.#data.slice(0x74, 0x78))[0];

        iv.hp = (ivs >> 0) & 31;
        iv.atk = (ivs >> 5) & 31;
        iv.def = (ivs >> 10) & 31;
        iv.spa = (ivs >> 15) & 31;
        iv.spd = (ivs >> 20) & 31;
        iv.spe = (ivs >> 25) & 31;

        return iv;

    }

    /**
     * @typedef {{num: Number, ev: Number, iv: Number}} StatKey
     */

    /**
     * Gathers all stats from this pokemon and returns an object
     * @returns {{
     *  hp: StatKey, atk: StatKey, def: StatKey, spa: StatKey, spd: StatKey, spe: StatKey
     * }}
     */
    stats() {

        const num = {
            hp : this.maxHP(),
            atk : this.attack(),
            def : this.defense(),
            spa : this.spAttack(),
            spd : this.spDefense(),
            spe : this.speed(),
        }
        const ev = this.ev();
        const iv = this.iv();

        return {
            hp: {num : num.hp, ev: ev.hp, iv: iv.hp},
            atk: {num : num.atk, ev: ev.atk, iv: iv.atk},
            def: {num : num.def, ev: ev.def, iv: iv.def},
            spa: {num : num.spa, ev: ev.spa, iv: iv.spa},
            spd: {num : num.spd, ev: ev.spd, iv: iv.spd},
            spe: {num : num.spe, ev: ev.spe, iv: iv.spe},
        }

    }

}
