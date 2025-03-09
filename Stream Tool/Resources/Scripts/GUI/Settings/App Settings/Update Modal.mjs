import { getLocalizedText } from "../../../Utils/Language.mjs";
import { updateAppDownload, updateAppReplace } from "./Update.mjs";

const modal = document.getElementById("updateAppModal");
const modalTitle = document.getElementById("updateModalTitle");
const modalDesc = document.getElementById("updateModalDesc");
const modalButts = document.getElementById("updateModalButts");


document.getElementById("gitUpdateButt").addEventListener("click", () => {
    modal.showModal();
});

document.getElementById("updateModalAccept").addEventListener("click", async () => {

    // hide buttons
    modalButts.style.display = "none";

    // give some feedback to the user
    replaceModalTexts("updateModalTitleUpdating", "updateModalDescUpdatingDown")

    // aaaand update
    const downApp = await updateAppDownload();
    
    if (downApp) {

        const updApp = updateAppReplace();
        if (updApp) {
            replaceModalTexts("updateModalTitleDone", "updateModalDescDone");
        } else {
            replaceModalTexts("updateModalTitleError", "updateModalDescErrorUpdating");
        }

    } else {
        replaceModalTexts("updateModalTitleError", "updateModalDescErrorDown");
    }

})

document.getElementById("updateModalGoBack").addEventListener("click", () => {
    modal.close();
})

/**
 * Replaces this modal's title and description strings
 * @param {String} title 
 * @param {String} desc 
 */
function replaceModalTexts(title, desc) {
    modalTitle.innerHTML = getLocalizedText(title);
    modalDesc.innerHTML = getLocalizedText(desc);
}
