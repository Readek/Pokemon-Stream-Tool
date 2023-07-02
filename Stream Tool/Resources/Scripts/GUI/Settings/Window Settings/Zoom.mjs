import { Setting } from '../Setting.mjs';

export class SettingWindowZoom extends Setting {

    #lessZoomButt = document.getElementById("lessZoomButt");
    #moreZoomButt = document.getElementById("moreZoomButt");
    #zoomTextValue = document.getElementById("zoomTextValue");
    #zoomValue = 100;

    constructor() {

        super();
        this.load();

        this.#lessZoomButt.addEventListener("click", () => {this.#lessZoom()})
        this.#moreZoomButt.addEventListener("click", () => {this.#moreZoom()})

    }

    load() {
        this.#zoomValue = this.guiSettings.zoom;
        this.#changeZoom();
    }

    set(value) {
        this.#zoomValue = value;
        this.#changeZoom();
    }

    #lessZoom() {
        if (this.#zoomValue > 100) {
            this.#zoomValue -= 10;
            this.#changeZoom();
        }
    }
    #moreZoom() {
        if (this.#zoomValue < 400) {
            this.#zoomValue += 10;
            this.#changeZoom();
        }
    }
    #changeZoom() {
        const { webFrame } = require('electron');
        webFrame.setZoomFactor(this.#zoomValue / 100);
        this.#zoomTextValue.innerHTML = `${this.#zoomValue}%`;
        this.save("zoom", this.#zoomValue);
    }

}