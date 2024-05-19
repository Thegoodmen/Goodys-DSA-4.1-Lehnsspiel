import { Fief } from "./module/config.js";
import FiefBuildingSheet from "./module/sheets/FiefBuildingSheet.js";

Hooks.once('init', async function() {

    console.log("Fief | Initalizing Goodys DSA 4.1 Lehnsspiel");

    CONFIG.Fief = Fief;
    CONFIG.INIT = true;
    
    Actors.registerSheet("Fief", FiefBuildingSheet, { types: ["LootActor"]});

});

Hooks.once('ready', async function() {

    CONFIG.INIT = false;

});

Hooks.on("renderSettings", (app, html) => {
        
    html.find('#tools-panel-notes').append($(
        `<li class="control-tool" data-tool="fief-overview" aria-label="Clear Notes" role="button" data-tooltip="CONTROLS.NoteClear">
            <i class="fa-solid fa-house"></i>
        </li>`
    ));

    // html.find('button[data-tool="fief-overview"').on("click", _ => new GDSAHeldenImporter().render(true));
});