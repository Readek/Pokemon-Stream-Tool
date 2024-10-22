import { getLocalizedText } from "../../../../Utils/Language.mjs";
import { current } from "../../../Globals.mjs";
import { indexToType } from "../Type Indexes.mjs";
import { validateRawPokemon } from "../Utils.mjs";

export class RawPokemonBattle {

    #data = [];
    #hasChanged = false;

    /**
     * Translates raw pokemon data into something readable
     * @param {Uint8Array} data Raw pokemon data
     */
    newData(data) {

        // check if new data is same as last to save on performance
        this.#hasChanged = false;

        if (this.#data.length != data.length) { // mostly for first time
            this.#hasChanged = true
        } else {

            // check if anything missmatches between old data and new data
            for (let i = 0; i < this.#data.length; i++) {
                if (data[i] != this.#data[i]) {
                    this.#hasChanged = true;
                    break;
                }
            }

        }

        if (this.#hasChanged) {

            this.#data = data;
            this.valid = validateRawPokemon(this);

            if (this.valid) {
                current.autoUpdated = true;
            }

        }

    }

    /** @returns {Boolean} */
    hasChanged() {
        return this.#hasChanged;
    }
    /** Changes hasChanged status from the outside */
    changeHasChanged() {
        this.#hasChanged = true;
    }


    /**
     * Gets this pokemon's battle slot
     * @returns {Number}
     */
    slot() {

        // this adress will tell us this pokemon's slot in battle
        // which is useful to determine if this is an enemy poke or not
        // for player pokemon, those will be 0 ~ 5
        // enemy pokemon will begin at 12 through 17
        // 6 ~ 11 are believed to be for allies?
        // multibattle positions are untested

        if (this.#hasChanged) {
            this.slotValue = this.#data[0x11];
        }
        return this.slotValue;

    }

    /**
     * Returns this pokemon's Pokedex number
     * @returns {Number}
     */
    dexNum() {
        if (this.#hasChanged) {
            this.dexNumValue = this.#data[0x4] + this.#data[0x5]*256;
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
            this.levelValue = this.#data[0x10];
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
            const address = current.generation == 6 ? 0x14B : 0x231;
            this.formIndexValue = this.#data[address];
        }
        return this.formIndexValue;
    }

    /**
     * Returns this pokemon's gender
     * @returns {String}
     */
    gender() {
    
        if (this.#hasChanged) {

            const leByte = this.#data[0xfb];

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
            if (current.generation == 6) {
                if (this.#data[0x18]) {
                    this.statusValue = "Par";
                } else if (this.#data[0x1C]) {
                    this.statusValue = "Sle";
                } else if (this.#data[0x20]) {
                    this.statusValue = "Fro";
                } else if (this.#data[0x24]) {
                    this.statusValue = "Bur";
                } else if (this.#data[0x28]) {
                    this.statusValue = "Poi";
                } else {
                    this.statusValue = null;
                }
            } else {
                // gen 7 will assign "248" to other status when one is active
                if (this.#data[0x20] && this.#data[0x20] != 248) {
                    this.statusValue = "Par";
                } else if (this.#data[0x28] && this.#data[0x28] != 248) {
                    this.statusValue = "Sle";
                } else if (this.#data[0x30] && this.#data[0x30] != 248) {
                    this.statusValue = "Fro";
                } else if (this.#data[0x38] && this.#data[0x38] != 248) {
                    this.statusValue = "Bur";
                } else if (this.#data[0x40] && this.#data[0x40] != 248) {
                    this.statusValue = "Poi";
                } else {
                    this.statusValue = null;
                }
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
            this.experienceValue = this.#data[0x0]
                + this.#data[0x1]*256
                + this.#data[0x2]*256
                + this.#data[0x3]*256;
        }
        return this.experienceValue;
    }

    /**
     * Gets this pokemon's ability id then translates it to text
     * @returns {String}
     */
    ability() {

        if (this.#hasChanged) {

            const address = current.generation == 6 ? 0x146 : 0x22C;

            const abNum = this.#data[address];
            if (abNum == 0) {
                this.abilityValue = "";
            } else if (current.abilities[abNum]) {
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

            const itemNum = this.#data[0xA] + this.#data[0xB]*256;
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
        const address = current.generation == 6 ? 0x10E : 0x1F4;

        const moveAdd = address + (14 * num);
        const ppAdd = address + 2 + (14 * num);
        const moveNum = this.#data[moveAdd] + this.#data[moveAdd+1]*256;

        if (current.moves[moveNum]) {
            
            move.name = current.moves[moveNum].name;
            move.type = current.moves[moveNum].type;
    
            move.pp = this.#data[ppAdd];
    
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
            this.currentHPValue = this.#data[0x8] + this.#data[0x9]*256;
        }
        return this.currentHPValue;
    }

    /**
     * Returns this pokemon's max HP value
     * @returns {Number}
     */
    maxHP() {
        if (this.#hasChanged) {
            this.maxHPValue = this.#data[0x6] + this.#data[0x7]*256;
        }
        return this.maxHPValue;
    }

    /** Current Attack value @returns {Number} */
    attack() {
        const address = current.generation == 6 ? 0xEE : 0x1D2;
        return this.#data[address] + this.#data[address+1]*256;
    }
    /** Current Defense value @returns {Number} */
    defense() {
        const address = current.generation == 6 ? 0xF0 : 0x1D4;
        return this.#data[address] + this.#data[address+1]*256;
    }
    /** Current Special Attack value @returns {Number} */
    spAttack() {
        const address = current.generation == 6 ? 0xF2 : 0x1D6;
        return this.#data[address] + this.#data[address+1]*256;
    }
    /** Current Special Defense value @returns {Number} */
    spDefense() {
        const address = current.generation == 6 ? 0xF4 : 0x1D8;
        return this.#data[address] + this.#data[address+1]*256;
    }
    /** Current Speed value @returns {Number} */
    speed() {
        const address = current.generation == 6 ? 0xF6 : 0x1DA;
        return this.#data[address] + this.#data[address+1]*256;
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

    /**
     * Gathers stat boosts from this pokemon
     * @returns {{
     *  atk: Number, def: Number, spa: Number, spd: Number, spe: Number, pre: Number, eva: Number
     * }}
     */
    boosts() {

        if (this.#hasChanged) {

            const address = current.generation == 6 ? 0XFC : 0x1E2;

            this.statBoostsValue = {
                atk: this.#data[address] - 6,
                def: this.#data[address+1] - 6,
                spa: this.#data[address+2] - 6,
                spd: this.#data[address+3] - 6,
                spe: this.#data[address+4] - 6,
                acc: this.#data[address+5] - 6,
                eva: this.#data[address+6] - 6,
            }

        }
        return this.statBoostsValue;

    }

    /**
     * Some pokemon may change types during battle
     * @returns {String[]}
     */
    types() {

        const address = current.generation == 6 ? 0xF8 : 0x1DC;

        const type1 = indexToType(this.#data[address]);
        const type2 = indexToType(this.#data[address+1]);

        const types = [type1];
        if (type2 != type1) types.push(type2);

        return types;

    }

}
