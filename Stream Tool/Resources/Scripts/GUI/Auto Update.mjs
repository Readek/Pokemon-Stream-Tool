import { current, inside } from "./Globals.mjs";

const autoUpdateButt = document.getElementById("citraButt");

/** Shows or hides auto update button for generations that support it */
export async function displayAutoButt() {

    if (current.generation == 6 || current.generation == 7) {

        autoUpdateButt.style.display = "block";

        if (inside.electron) {
        
            const autoUpdateToggleCitra = await import("./Emu Scripts/Citra/Auto Update Gen 6 7.mjs");
            autoUpdateButt.addEventListener("click", autoUpdateToggleCitra.autoUpdateToggleCitra);

        }
        
    } else {
        
        autoUpdateButt.style.display = "none";

        if (inside.electron) {

            const autoUpdateToggleCitra = await import("./Emu Scripts/Citra/Auto Update Gen 6 7.mjs");
            autoUpdateButt.removeEventListener("click", autoUpdateToggleCitra.autoUpdateToggleCitra);

        
        }
       

    }

}