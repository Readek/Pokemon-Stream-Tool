import { getLocalizedText } from "../Utils/Language.mjs";

const modal = document.getElementById("confModal");
const modalTitle = document.getElementById("confModalTitle");
const modalDesc = document.getElementById("confModalDesc");
const modalButt = document.getElementById("confModalAccept");
const modalButtText = document.getElementById("confModalAcceptText");

let controller = new AbortController();

/**
 * Opens the confirmation modal
 * @param {String} title - Loc string for the modal's title
 * @param {String} desc - Loc string for the modal's description
 * @param {String} buttText - Loc string for the confirm button
 * @param {function} action - Function to execute on confirm
 */
export function openConfModal(title, desc, buttText, action) {

    // clear previous event listener
    controller.abort();
    controller = new AbortController();

    // show confirm button in case it was hidden
    modalButt.style.display = "flex";
    
    // change texts all around
    modalTitle.innerHTML = getLocalizedText(title);
    modalDesc.innerHTML = getLocalizedText(desc);
    modalButtText.innerHTML = getLocalizedText(buttText);

    // what the confirm button does
    modalButt.addEventListener("click", () => {
        action();
        modal.close();
    }, {signal: controller.signal})

    modal.showModal();

}

document.getElementById("confModalGoBack").addEventListener("click", () => {
    modal.close();
})

/**
 * Opens an information modal
 * @param {String} title - Loc string for the modal's title
 * @param {String} desc - Loc string for the modal's description
 */
export function openInfoModal(title, desc) {

    // clear previous event listener
    controller.abort();
    controller = new AbortController();

    // hide confirm button from conf modal
    modalButt.style.display = "none";

    // change texts all around
    modalTitle.innerHTML = getLocalizedText(title);
    modalDesc.innerHTML = getLocalizedText(desc);

    modal.showModal();

}