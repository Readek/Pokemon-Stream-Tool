import { getLocalizedText } from "../../../../Utils/Language.mjs";
import { current } from "../../../Globals.mjs";
import { decryptData } from "../Crypts.mjs";
import { validateRawPokemon } from "../Utils.mjs";
import struct from "../struct.mjs";

export class RawPokemonParty {

    #data;
    #criptData = [];
    #hasChanged = false;

    /**
     * Translates raw pokemon data into something readable
     * @param {Uint8Array} data Raw pokemon data
     */
    newData(data) {

        // unencrypting data is performance heavy,
        // and less so, but so is structuring
        // so we want to avoid it as much as possible
        this.#hasChanged = false;

        if (this.#criptData.length != data.length) { // mostly for first time
            this.#hasChanged = true
        } else {

            // check if anything missmatches between old data and new data
            for (let i = 0; i < this.#criptData.length; i++) {
                if (data[i] != this.#criptData[i]) {
                    this.#hasChanged = true;
                    break;
                }
                
            }

        }
        this.#criptData = data;

        if (this.#hasChanged) {

            this.#data = decryptData(data);
            this.valid = validateRawPokemon(this);

        }
            
    }

    /**
     * Returns this pokemon's Pokedex number
     * @returns {Number}
     */
    dexNum() {
        if (this.#hasChanged) {
            this.dexNumValue = struct("<H").unpack(this.#data.slice(0x8, 0xA))[0];
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
     * Returns this pokemon's nickname
     * @returns {String}
     */
    nickname() {
        if (this.#hasChanged) {
            this.nicknameValue = struct("<24s").unpack(this.#data.slice(0x40, 0x58))[0]
                .split(`\0\0`)[0].replace(/\0/g, '');
        }
        return this.nicknameValue;
    }

    /**
     * Returns this pokemon's gender
     * @returns {String}
     */
    gender() {
        
        if (this.#hasChanged) {

            const leByte = struct("B").unpack(this.#data.slice(0x1D, 0x1E))[0];

            if (leByte &(1 << 1) ) {
                this.genderValue = "F";
            } else if (leByte &(1 << 2)) {
                this.genderValue = null;
            } else {
                this.genderValue = "M";
            }

        }

        return this.genderValue;
        
    }

    /**
     * Check if this Pokemon has changed its form
     * @returns {Number}
     */
    formIndex() {

        if (this.#hasChanged) {
            // this is the same byte used to determine gender
            this.formIndexValue =
                (struct("B").unpack(this.#data.slice(0x1D, 0x1E))[0] & 248) >> 3;
        }
        return this.formIndexValue;
      
    }

    /**
     * Returns this pokemon's current level
     * @returns {Number}
     */
    level() {
        if (this.#hasChanged) {
            this.levelValue = struct("B").unpack(this.#data.slice(0xEC, 0xED))[0];
        }
        return this.levelValue;
    }

    /**
     * Gets the current pokemon's status
     * @returns {String}
     */
    status() {

        if (this.#hasChanged) {
            const leByte = struct("B").unpack(this.#data.slice(0xE8, 0xE9))[0];
            if (leByte == 1) {
                this.statusValue = "Par";
            } else if (leByte == 2) {
                this.statusValue = "Sle";
            } else if (leByte == 3) {
                this.statusValue = "Fro";
            } else if (leByte == 4) {
                this.statusValue = "Bur";
            } else if (leByte == 5) {
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
            this.experienceValue = struct("<H").unpack(this.#data.slice(0x10, 0x13))[0];
        }
        return this.experienceValue;
    }

    /**
     * Gets this pokemon's ability id then translates it to text
     * @returns {String}
     */
    ability() {

        if (this.#hasChanged) {

            const abNum = struct("B").unpack(this.#data.slice(0x14, 0x15))[0];
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
            
            const itemNum = struct("<H").unpack(this.#data.slice(0x0A, 0x0C))[0];
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
                pp : 0
            }
        }
        
        return {
            name : getLocalizedText("unknownMove"),
            type : "None",
            pp : 0
        }

    }

    moves() {

        if (this.#hasChanged) {
            this.movesValue = [];
            for (let i = 0; i < 4; i++) {
                this.movesValue.push(this.move(i));
            }
        }
        
        return this.movesValue;
    }

    /** Current HP value @returns {Number} */
    currentHP() {
        if (this.#hasChanged) {
            this.currentHPValue = struct("<H").unpack(this.#data.slice(0xF0, 0xF2))[0];
        }
        return this.currentHPValue;
    }
    /** Current max HP value @returns {Number} */
    maxHP() {
        if (this.#hasChanged) {
            this.maxHPValue = struct("<H").unpack(this.#data.slice(0xF2, 0xF4))[0];
        }
        return this.maxHPValue;
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

        if (this.#hasChanged) {
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
    
            this.statsValue = {
                hp: {num : num.hp, ev: ev.hp, iv: iv.hp},
                atk: {num : num.atk, ev: ev.atk, iv: iv.atk},
                def: {num : num.def, ev: ev.def, iv: iv.def},
                spa: {num : num.spa, ev: ev.spa, iv: iv.spa},
                spd: {num : num.spd, ev: ev.spd, iv: iv.spd},
                spe: {num : num.spe, ev: ev.spe, iv: iv.spe},
            }
        }
        
        return this.statsValue;

    }

}