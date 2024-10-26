import { current } from "../../../Globals.mjs";
import { citra } from "../Citra.mjs";

/**
 * Reads current in-game gym badges unlocked by the player
 * @returns {{gymBadges: Number[]}}
 */
export async function getRawBadges() {

    const address = getBadgeAddress(current.game, current.version);
    
    // badges are stored in a single byte
    const badgeCount = await citra.readMemory(address, 1);

    const badges = {gymBadges : []}

    badges.gymBadges.push(
        badgeCount[0] &(1 << 0),
        badgeCount[0] &(1 << 1),
        badgeCount[0] &(1 << 2),
        badgeCount[0] &(1 << 3),
        badgeCount[0] &(1 << 4),
        badgeCount[0] &(1 << 5),
        badgeCount[0] &(1 << 6),
        badgeCount[0] &(1 << 7),
    )
    
    return badges;

}

/**
 * Raw gym badge addresses in memory
 * @param {String} game 
 * @param {String} version 
 * @returns {Number}
 */
function getBadgeAddress(game, version) {
    
    if (game == "XY") {
        if (version == "1.0") return 0x8C6A6A0;
        if (version == "1.5") return 0x8C6A6B0;
    } else if (game == "ORAS") {
        if (version == "1.0") return 0x8C6DDD4;
        if (version == "1.4") return 0x8C71DC4;
    } else if (game == "SM") {
        return 0;
    } else if (game == "USUM") {
        return 0;
    }

}