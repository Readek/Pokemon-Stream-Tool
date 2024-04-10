const dgram = require('node:dgram');

// this will connect us to the emulator
const socket = dgram.createSocket("udp4");

// assuming a local connection
const adress = "localhost";
// this do be citra's port
const port = 45987;

const maxRequestDataSize = 32;

let theResolve = null;

class Citra {

    #header;

    #toutInterval;
    #toutTick = 0;
    #toutPromise;

    constructor() {

        // todo improve this way to listen to responses
        socket.on("message", (msg) => {
            if (theResolve != null) {
                theResolve(msg);
                theResolve = null;
            }
        })
    
        this.#header = this.#prepareHeader();
        this.#startInterval();

    }

    /**
     * Sends a request to Citra via socket to read from the game's memory
     * @param {Number} readAdress - Memory adress to read
     * @param {Number} readSize - Size of that memory adress
     * @returns {Uint8Array} - Requested raw data
     */
    async readMemory(readAdress, readSize) {

        // this will be the final return
        let result = new Uint8Array(readSize);
        let resCounter = 0;

        // we need to send small packages to Citra, so we will be reading
        // small chunks until we have nothing else to read
        while (readSize > 0) {

            // block to read
            const tempReadSize = Math.min(readSize, maxRequestDataSize);

            // we need to generate a header for Citra to listen to us
            this.#header[4] = readAdress;
            this.#header[5] = tempReadSize;
            const request = this.#header.buffer;

            // send that data to the socket
            // if the data is wrong somehow, Citra will just not answer back
            socket.send(Buffer.from(request), port, adress);

            // now we wait for an answer
            const citraReply = new Promise((resolve) => {
                theResolve = resolve;
            })
            // but set a time limit to the request
            this.#toutTick = 4; // roughly 2 seconds
            const timeLimit = new Promise((resolve) => {
                this.#toutPromise = resolve;
            })

            // check if everything is alright
            const reply = await Promise.race([citraReply, timeLimit]);
            if (!reply) return null;

            // remove the header because we dont really need it
            const replyData = reply.slice(16);

            // add new data to the end result
            for (let i = 0; i < replyData.length; i++) {
                result[resCounter] = replyData[i];
                resCounter++;
            }
            // prepare stuff for the next loop
            readSize -= replyData.byteLength;
            readAdress += replyData.byteLength;
            
        }

        return result;

    }

    /**
     * Checks if the message we got is what we expect and removes the header
     * @param {Uint8Array} reply - Data sent from Citra
     * @param {Number} expectedId - Request identifier
     * @param {Number} expectedType 
     * @returns {Uint8Array} Data reply without header
     */
    #validateHeader(reply, expectedId, expectedType) {

        // it would be best to run the commented code below, however chances for it
        // to matter are really thin so we ignore it for a small performance imporvement
        // just leaving code here in case it becomes relevant some day

        /*
        const currentRequestVersion = 1;

        // struct expects an array buffer for its functions
        const replyABuffer = reply.buffer;

        let [replyVersion, replyId, replyType, replyDataSize] = struct("<IIII").unpack(replyABuffer.slice(0, 16));

        if (currentRequestVersion == replyVersion &&
            expectedId == replyId &&
            expectedType == replyType &&
            replyDataSize == reply.slice(16).byteLength) {
                return reply.slice(16);
        }
        */

    }
    
    /** Prepares header to be sent out to Citra with static data */
    #prepareHeader() {

        const result = new Uint32Array(6);
        result[0] = 1; // Request Version
        result[1] = 0; // Request ID
        result[2] = 1; // Request Type
        result[3] = 8; // Request Data Size
        return result;

    }

    /** Starts the internal citra request timeout limit */
    #startInterval() {

        this.#toutInterval = setInterval(() => {
            
            this.#toutTick--;

            // if it reaches 0 or if the promise resolves
            if (this.#toutPromise && this.#toutTick <= 0) {
                this.#toutPromise();
                this.#toutPromise = null;
            }

        }, 500); // if tick is 4, will take roughly 2 seconds

    }

}

export const citra = new Citra;