import { concatArrayBuffers } from "./Utils.mjs";
import struct from "./struct.mjs";

/*

    Most of this logic comes from the Python script found at:
    https://github.com/EverOddish/PokeStreamer-Tools/blob/master/gen_6_7/auto_layout_gen6_gen7.py

*/

const blockSize = 56;

/**
 * Decrypts raw data sent by Citra
 * @param {Uint8Array} data - Raw data to be decrypted
 * @returns {Object}
 */
export function decryptData(data) {

    const pv = struct("<I").unpack(data.slice(0, 4).buffer)[0];
    const sv = ((pv >> 0xD) & 0x1F) % 24;

    const start = 8;
    const end = (4 * blockSize) + start;

    const header = data.slice(0, 8);

    const blocks = cryptArray(data, pv, start, end);

    const stats = cryptArray(data, pv, end, data.byteLength);

    const concat = concatArrayBuffers(header, shuffleArray(blocks, sv));
    const finalResult = concatArrayBuffers(concat, stats);

    return finalResult;

}

/**
 * 
 * @param {Uint8Array} data 
 * @param {Number} seed 
 * @param {Number} start 
 * @param {Number} end 
 * @returns {ArrayBuffer}
 */
function cryptArray(data, seed, start, end) {

    let result = new ArrayBuffer();
    let tempSeed = BigInt(seed);

    for (let i = start; i < end; i+=2) {
        
        // these operations got too big for precision
        // so we need to operate with bigInts for a while
        tempSeed *= BigInt(0x41C64E6D);
        tempSeed &= BigInt(0xFFFFFFFF);
        tempSeed += BigInt(0x00006073);
        tempSeed &= BigInt(0xFFFFFFFF);
        result = concatArrayBuffers(result, crypt(data, Number(tempSeed), i));
        
    }

    return result;

}

/**
 * 
 * @param {Uint8Array} data 
 * @param {Number} seed 
 * @param {Number} i 
 * @returns {ArrayBuffer}
 */
function crypt(data, seed, i) {
    
    let value = data[i];
    let shifted_seed = seed >> 16;
    shifted_seed &= 0xFF;
    value ^= shifted_seed;
    const result1 = struct("B").pack(value);

    value = data[i + 1];
    shifted_seed = seed >> 24;
    shifted_seed &= 0xFF;
    value ^= shifted_seed;
    const result2 = struct("B").pack(value);

    const finalResult = concatArrayBuffers(result1, result2);

    return finalResult;

}

/**
 * 
 * @param {ArrayBuffer} data 
 * @param {Number} sv 
 * @returns {ArrayBuffer}
 */
function shuffleArray(data, sv) {

    const block_position = [[0, 0, 0, 0, 0, 0, 1, 1, 2, 3, 2, 3, 1, 1, 2, 3, 2, 3, 1, 1, 2, 3, 2, 3],
                      [1, 1, 2, 3, 2, 3, 0, 0, 0, 0, 0, 0, 2, 3, 1, 1, 3, 2, 2, 3, 1, 1, 3, 2],
                      [2, 3, 1, 1, 3, 2, 2, 3, 1, 1, 3, 2, 0, 0, 0, 0, 0, 0, 3, 2, 3, 2, 1, 1],
                      [3, 2, 3, 2, 1, 1, 3, 2, 3, 2, 1, 1, 3, 2, 3, 2, 1, 1, 0, 0, 0, 0, 0, 0]]
    let result;
    for (let i = 0; i < 4; i++) {
        const start = blockSize * block_position[i][sv];
        const end = start + blockSize;
        const slicedData = data.slice(start, end);
        result = concatArrayBuffers(result, slicedData);
    }

    return result;
    
}