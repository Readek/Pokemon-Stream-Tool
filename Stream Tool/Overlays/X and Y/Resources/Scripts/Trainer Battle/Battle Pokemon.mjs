import { ActivePokemon } from "./Active Pokemon/Active Pokemon.mjs";
import { StandbyPokemon } from "./Standby Pokemon.mjs";

export class BattlePokemon {

    #active;
    #standby;

    #gamemode = 0;
    #inCombat = null;

    /**
     * Manages combat overlay elements for this pokemon
     * @param {Boolean} side - True if player, false if enemy
     */
    constructor(side) {

        this.#active = new ActivePokemon(side);
        this.#standby = new StandbyPokemon(side);

    }

    /** @returns {Boolean} */
    getInCombat() {
        return this.#inCombat;
    }

    update(data) {

        this.#active.update(data);
        this.#standby.update(data);

        this.#inCombat = data.inCombat;

    }

    /**
     * Determines gamemode to display or hide some poke info
     * @param {Number} num - Number of active pokes on the field
     */
    setGamemode(num) {

        if (this.#gamemode == num) return;

        this.#active.setGamemode(num);

    }

    show(num) {

        this.#active.showIntro();
        this.#standby.showIntro(num);

    }

    delet() {

        this.#active.delet();
        this.#standby.delet();

    }

}