import { genRnd } from "../../../Utils/GenRnd.mjs";
import { concatArrayBuffers } from "./Utils.mjs";
import struct from "./struct.mjs";

const dgram = require('node:dgram');

// this will connect us to the emulator
const socket = dgram.createSocket("udp4");

// assuming a local connection
const adress = "localhost";
// this do be citra's port
const port = 45987;

const currentRequestVersion = 1;
const maxRequestDataSize = 32;
const readMemory = 1;

let theResolve = null;

class Citra {

    constructor() {

        // todo improve this way to listen to responses
        socket.on("message", (msg) => {
            if (theResolve != null) {
                theResolve(msg);
                theResolve = null;
            }
        })
    
    }

    /**
     * Sends a request to Citra via socket to read from the game's memory
     * @param {Number} readAdress - Memory adress to read
     * @param {Number} readSize - Size of that memory adress
     * @returns {Uint8Array} - Requested raw data
     */
    async readMemory(readAdress, readSize) {

        // this will be the final return
        let result = new Uint8Array();

        // we need to send small packages to Citra, so we will be reading
        // small chunks until we have nothing else to read
        while (readSize > 0) {
            
            // block to read
            const tempReadSize = Math.min(readSize, maxRequestDataSize);
            const requestData = struct("<II").pack(readAdress, tempReadSize);

            // generate a random id for the individual package
            const requestId = genRnd(0, 4000000000);
            // generate proper header info or else Citra wont even bother answering
            let request = this.#generateHeader(requestId, readMemory, requestData.byteLength);

            // add the data to the header we will send
            const finalRequest = concatArrayBuffers(request, requestData);

            // send that data to the socket
            // if the data is wrong somehow, Citra will just not answer back
            socket.send(Buffer.from(finalRequest), port, adress);

            // now we wait for an answer
            const citraReply = new Promise((resolve) => {
                theResolve = resolve;
            })
            // but set a time limit to the request
            const timeLimit = new Promise((resolve) => {
                setTimeout(resolve, 2000, null);
            });

            // check if everything is alright
            const reply = await Promise.race([citraReply, timeLimit]);
            if (!reply) {
                return null;
            }

            // check if the data we got is what we expect
            // though it would be rare if it wasnt
            const replyData = this.#validateHeader(reply, requestId, readMemory);

            // if the data we got is correct, add it to the end result
            if (replyData) {
                result = new Uint8Array([...result, ...replyData]);
                readSize -= replyData.byteLength;
                readAdress += replyData.byteLength;
            } else {
                return null;
            }

        }

        return result;

    }

    /**
     * Generates a header for a request
     * @param {Number} requestId - Request identifier
     * @param {Number} requestType 
     * @param {Number} dataSize - Size of data to request
     * @returns {ArrayBuffer}
     */
    #generateHeader(requestId, requestType, dataSize) {
        return struct("<IIII").pack(currentRequestVersion, requestId, requestType, dataSize);
    }

    /**
     * Checks if the message we got is what we expect and removes the header
     * @param {Uint8Array} reply - Data sent from Citra
     * @param {Number} expectedId - Request identifier
     * @param {Number} expectedType 
     * @returns {Uint8Array} Data reply without header
     */
    #validateHeader(reply, expectedId, expectedType) {

        // struct expects an array buffer for its functions
        const replyABuffer = reply.buffer;

        let [replyVersion, replyId, replyType, replyDataSize] = struct("<IIII").unpack(replyABuffer.slice(0, 16));

        if (currentRequestVersion == replyVersion &&
            expectedId == replyId &&
            expectedType == replyType &&
            replyDataSize == reply.slice(16).byteLength) {
                return reply.slice(16);
        }

    }   

}

export const citra = new Citra;