import { inside } from "../Globals.mjs";
import { SettingGameSelect } from "./General Settings/Game Select.mjs";
import { SettingGenSelect } from "./General Settings/Gen Select.mjs";
import { SettingAlwaysOnTop } from "./Window Settings/Always on top.mjs";
import { SettingResizableWindow } from "./Window Settings/Resizable.mjs";
import { SettingWindowZoom } from "./Window Settings/Zoom.mjs";

class Settings {

    constructor() {

        this.genSelect = new SettingGenSelect();
        this.gameSelect = new SettingGameSelect();

        if (inside.electron) {
            this.alwaysOnTop = new SettingAlwaysOnTop();
            this.resizable = new SettingResizableWindow();
            this.windowZoom = new SettingWindowZoom();
        } else { // browser users dont need any of this
            document.getElementById("settingsElectron").style.display = "none";
        }

    }

}

export const settings = new Settings();
