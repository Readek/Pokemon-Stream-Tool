/**
 * Returns the memory adress for a player's Pokemon in a battle
 * @param {String} type - Type of battle: Wild / Trainer
 * @param {String} game - Game to read from: XY / ORAS / SM / USUM
 * @returns {Number}
 */
export function getBattleAddress(type, game) {

    if (type == "Wild") {
        
        if (game == "XY") {
            return 0x8203ED0;
        } else if (game == "ORAS") {
            return 0x82041FC;
        } else if (game == "SM" || game == "USUM") {
            return 0x30002770;
        }

    } else if (type == "Trainer") {
        
        if (game == "XY") {
            return 0x82059E0;
        } else if (game == "ORAS") {
            return 0x8205D0C;
        } else if (game == "SM" || game == "USUM") {
            return 0x30009758;
        }

    } else if (type == "Multi") {
        
        if (game == "XY") {
            return 0x8209D98;
        }
        
    }

}
