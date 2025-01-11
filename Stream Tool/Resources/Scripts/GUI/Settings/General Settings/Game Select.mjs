import { getLocalizedText } from "../../../Utils/Language.mjs";
import { displayAutoButt } from "../../Auto Update.mjs";
import { updatePokedexData } from "../../Dex Data.mjs";
import { current } from "../../Globals.mjs";
import { changeBadges } from "../../Player/Badges.mjs";
import { displayBattleStateButt } from "../../Team/Battle State.mjs";
import { Setting } from "../Setting.mjs";
import { settings } from "../Settings.mjs";

const gameSelectSelect = document.getElementById("gameSelect");

const genGameData = {
    1 : {
        RB : {
            pixelated : true
        }
    },
    2 : {
        GS : {
            badges : {
                Johto : 8,
                Kanto : 8
            },
            pixelated : true
        }
    },
    3 : {
        RS : {
            pixelated : true
        },
        FRLG : {
            pixelated : true
        }
    },
    4 : {
        DP : {},
        HGSS : {
            badges : {
                Johto : 8,
                Kanto : 8
            },
            pixelated : true
        }
    },
    5 : {
        BW : {
            pixelated : true
        },
        BW2 : {
            pixelated : true
        }
    },
    6 : {
        XY : {
            versions : ["1.0", "1.5"]
        },
        ORAS : {
            versions : ["1.0", "1.4"]
        }
    },
    7 : {
        SM : {
            badges : {
                Melemele : 3,
                Akala : 4,
                Ulaula : 7,
                Poni : 4
            },
            pixelated : true,
        },
        USUM : {
            badges : {
                Melemele : 3,
                Akala : 4,
                Ulaula : 7,
                Poni : 4
            },
            pixelated : true,
        },
    },
    8 : {
        SS : {
            versions : ["Sword", "Shield"]
        },
        BDSP : {},
        PLA : {
            badges : {
                Noble : 5
            }
        }
    },
    9 : {
        SV : {
            badges : {
                Victory : 8,
                Starfall : 5,
                Legends : 5
            }
        },
    }
}

export class SettingGameSelect extends Setting {

    constructor() {

        super();
        this.#setListener();

    }

    #setListener() {
        gameSelectSelect.addEventListener("change", () => {
            
            this.setGame(gameSelectSelect.value);

            // send the data to remote guis
            settings.update();

        });
    }

    /**
     * Changes game data to desired generation
     * @param {String} value - Game acronym
     */
    setGame(value) {

        // in case function wasn't triggered by the change event
        gameSelectSelect.value = value;

        current.game = value;

        // change player badges
        changeBadges(
            genGameData[current.generation][value].badges,
            genGameData[current.generation][value].pixelated
        );

        // set game versions if any
        settings.versionSelect.addVersions(genGameData[current.generation][value].versions);

        // show or hide extra buttons
        displayBattleStateButt(current.generation);
        displayAutoButt(current.generation);

        // gen8 pokedex does not have PLA data, but gen9 does
        if (value == "PLA") {updatePokedexData(9)}

    }

    /**
     * Clears the game list and adds games from provided generation
     * @param {Number} gen - Generation number
     */
    addGames(gen) {

        // clear current game select state
        gameSelectSelect.innerHTML = "";

        // check if gen requested has data
        if (genGameData[gen]) {
        
            // add a new select entry for each game found
            for (const key in genGameData[gen]) {
                this.#addGameEntry(key);
            }
            
        }

        // auto-select the first game on the list
        this.setGame(gameSelectSelect.value);

    }

    /**
     * Adds a new entry on the game select combo
     * @param {String} value - Game acronym
     */
    #addGameEntry(value) {

        const entry = document.createElement("option");
        entry.value = value;
        entry.setAttribute("locText", `game${value}`);
        entry.text = getLocalizedText(`game${value}`);
        gameSelectSelect.add(entry);

    }

}