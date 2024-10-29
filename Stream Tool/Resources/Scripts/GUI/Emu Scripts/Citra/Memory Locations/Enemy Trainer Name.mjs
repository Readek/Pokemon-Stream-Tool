import { current } from "../../../Globals.mjs";
import { citra } from "../Citra.mjs";
import struct from "../struct.mjs";

/**
 * Gets the current battle enemy's trainer name and title
 * @returns {String} Title + Name
 */
export async function getEnemyTrainerName() {

    const offset = current.generation == 6 ? 144 : 140;
    const length = current.generation == 6 ? 30 : 26;

    const address = getEnemyNameAddress(current.game);

    // get the trainer's name
    const nameData = await citra.readMemory(address, length);
    const nameRaw = struct(`<${length/2}h`).unpack(nameData.buffer);

    // convert it to something readable
    const nameUtf = Encoding.convert(nameRaw, {
        to: "UTF32",
        from: "UNICODE"
    });
    const name = Encoding.codeToString(nameUtf);

    // do the same for the trainer's title
    const titleData = await citra.readMemory(address + offset, length + 10);
    const titleRaw = struct(`<${(length+10)/2}h`).unpack(titleData.buffer);

    const titleUtf = Encoding.convert(titleRaw, {
        to: "UTF32",
        from: "UNICODE"
    });
    const title = Encoding.codeToString(titleUtf);

    return title + " " + name;

}

function getEnemyNameAddress(game) {
    
    if (game == "XY") {
        return 0x08203F08;
    } else if (game == "ORAS") {
        return 0x08204234;
    } else if (game == "SM") {
        return 0x30034A74;
    } else if (game == "USUM") {
        return 0x30034C5C;
    }

}