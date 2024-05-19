export default class FiefBuildingSheet extends ActorSheet {

    sheet = {};

    static get defaultOptions() {

        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ##            Returns the General HTML of the Sheet and defines some general Stats             ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################

        return mergeObject(super.defaultOptions, {

            width: 632,
            height: 396,
            resizable: false,
            tabs: [ {navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "mainPage"},
                    {navSelector: ".skill-tabs", contentSelector: ".skill-body", initial: "combatSkills"},
                    {navSelector: ".magic-tabs", contentSelector: ".magic-body", initial: "mgeneral"},
                    {navSelector: ".holy-tabs", contentSelector: ".holy-body", initial: "hgeneral"}],
            classes: ["fief", "app", "overview"]
        });
    }

    get template() {

        return "modules/dsa-fief-system/templates/sheets/building-sheet.hbs"
    }

    getData() {

        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ## Creates Basic Datamodel, which is used to fill the HTML together with Handelbars with Data. ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################

        const baseData = super.getData();

        let sheetData = {

            // Set General Values

            owner: this.actor.isOwner,
            editable: this.isEditable,
            actor: baseData.actor,
            system: baseData.actor.system,
            items: baseData.items,
            config: CONFIG.Fief,
            isGM: game.user.isGM
        };

        // Calculate some values dependent on Items

        sheetData = this.calculateValues(sheetData);

        this.sheet = sheetData;

        return sheetData;
    }

    async activateListeners(html) {

        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ##    Set Listener for Buttons and Links with Functions to be executed on action. e.g. Roll    ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################

        if(this.isEditable) {

            let sheet = this.sheet;
        }

        super.activateListeners(html);
    }

    _onSortItem(event, itemData) {

        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ##        Overwrite of SortItem Function in order to have Drag n Drop Sorting of Items         ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################

        const source = this.actor.items.get(itemData._id);

        switch(source.type) {

            case "generals":

                const siblings = this.actor.items.filter(i => {
                    return (i._id !== source._id);
                });

                // Get the drop Target

                const dropTarget = event.target.closest(".item");
                const targetId = dropTarget ? dropTarget.dataset.itemId : null;
                const target = siblings.find(s => s._id === targetId);

                // Perform Sort

                const sortUpdates = SortingHelpers.performIntegerSort(source, { target: target, siblings }); 
                const updateData = sortUpdates.map(u => {
                    const update = u.update;
                    update._id = u.target._id;
                    return update;
                });

                // Perform Update
                
                return this.actor.updateEmbeddedDocuments("Item", updateData);

            default:
                return super._onSortItem(event, itemData);
        }
    }

    calculateValues(sheetData) {

        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ##    Calculation of Additional Values that are needed for the Sheet generated from Items      ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################
    
        return sheetData;
    }

    _onDragStart(event) {

        if(event.srcElement.className != "skillitem" && event.srcElement.className != "statitem") super._onDragStart(event);

        else if(event.srcElement.className === "skillitem") {

            // Get Element and Skill Infos

            let element = event.currentTarget;
            let message = element.closest(".skillitem");
            let isSpez = (message.querySelector("[class=skillTemp]").name === "spezi");
            let isMeta = (message.querySelector("[class=skillTemp]").name === "meta");
            
            // Prepare DragData

            const dragData = {
                type: "skill",
                name: message.querySelector("[class=skillTemp]").dataset.lbl,
                item: message.querySelector("[class=skillTemp]").dataset.stat,
                actorId: message.querySelector("[class=skillTemp]").dataset.actor,
                isSpez: isSpez,
                isMeta: isMeta
            };
    
            // Set data transfer
    
            event.dataTransfer.setData("text/plain", JSON.stringify(dragData));

        } else if(event.srcElement.className === "statitem") {

            // Get Element and Skill Infos

            let element = event.currentTarget;
            let message = element.closest(".statitem");
            
            // Prepare DragData

            const dragData = {
                type: "stat",
                actorId: message.dataset.actor,
                stat: message.dataset.stattype
            };
    
            // Set data transfer
    
            event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
        } 
    }
}