import { RawPokemonBattle } from "./Raw Pokes/Raw Pokemon Battle.mjs";
import { RawPokemonParty } from "./Raw Pokes/Raw Pokemon Party.mjs";

/**
 * Creates a new ArrayBuffer from concatenating two existing ones
 * @param {ArrayBuffer | null} buffer1 The first buffer.
 * @param {ArrayBuffer | null} buffer2 The second buffer.
 * @return {ArrayBuffer | null} The new ArrayBuffer created out of the two.
 */
export function concatArrayBuffers(buffer1, buffer2) {

    if (!buffer1) {
        return buffer2;
    } else if (!buffer2) {
        return buffer1;
    }

    let tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
    
};

/**
 * Fact checks if this raw pokemon is valid
 * @param {RawPokemonParty | RawPokemonBattle} rawPokemon - Raw Pokemon class
 * @returns {Boolean}
 */
export function validateRawPokemon(rawPokemon) {
    
    const currentHP = rawPokemon.currentHP();
    const maxHP = rawPokemon.maxHP();

    let result = true;
    if (rawPokemon.nickname) {
        result = !rawPokemon.corruptNickname() && rawPokemon.nickname().length <= 12;
    }

    return result
        && currentHP <= maxHP && currentHP <= 999 && maxHP <= 999
        && rawPokemon.level() <= 100
        && rawPokemon.dexNum() <= 809 // max gen 7 dex number

}