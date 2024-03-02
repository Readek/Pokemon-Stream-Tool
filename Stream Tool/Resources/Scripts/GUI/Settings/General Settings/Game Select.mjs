import { getLocalizedText } from "../../../Utils/Language.mjs";
import { displayAutoButt } from "../../Auto Update.mjs";
import { current } from "../../Globals.mjs";
import { changeBadges } from "../../Player/Gym Badges.mjs";
import { Setting } from "../Setting.mjs";
import { settings } from "../Settings.mjs";

const gameSelectSelect = document.getElementById("gameSelect");

const genGameData = {
    1 : [
        {value : "RB"},
    ],
    2 : [
        {value : "GS"},
    ],
    3 : [
        {value : "RS"},
        {value : "FRLG"}
    ],
    4 : [
        {value : "DP"},
        {value : "HGSS"}
    ],
    5 : [
        {value : "BW"},
        {value : "BW2"}
    ],
    6 : [
        {value : "XY"},
        {value : "ORAS"}
    ],
    7 : [
        {value : "SM"},
        {value : "USUM"}
    ],
    8 : [
        {value : "SS"},
        {value : "BDSP"},
        {value : "PLA"},
    ],
    9 : [
        {value : "SV"},
        {value : "PLZ"}
    ]
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
        changeBadges(value);

        // set game versions if any
        settings.versionSelect.addVersions(value);

        // show or hide auto update button
        displayAutoButt();

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
            for (let i = 0; i < genGameData[gen].length; i++) {
                this.#addGameEntry(genGameData[gen][i].value);                
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