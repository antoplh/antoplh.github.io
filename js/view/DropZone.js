import KanbanAPI from "../api/KanbanAPI.js";

export default class DropZone {
    static createDropZone() {
        const range = document.createRange();

        range.selectNode(document.body);

        const dropZone = range.createContextualFragment(`
            <div class="kanban__dropzone"></div>
        `).children[0];
        
        //Add CSS Active Class when dragging element over it
        dropZone.addEventListener("dragover", e => {
            e.preventDefault(); //remove to prevent out of focus
            dropZone.classList.add("kanban__dropzone--active"); //adds the active class to the current class
        })

        // Remove CSS Active Class when dragging element away from drop zone
        dropZone.addEventListener("dragleave", () => {
            dropZone.classList.remove("kanban__dropzone--active");
        });

        dropZone.addEventListener("drop", e => {
            e.preventDefault();
            dropZone.classList.remove("kanban__dropzone--active");

            const columnElement = dropZone.closest(".kanban__column");
            const columnId = Number(columnElement.dataset.id)
            const dropZonesInColumn = Array.from(columnElement.querySelectorAll(".kanban__dropzone"))
            const droppedIndex = dropZonesInColumn.indexOf(dropZone)
            const itemId = Number(e.dataTransfer.getData("text/plain")) //get the id from the element being dragged
            const droppedItemElement = document.querySelector(`[data-id="${itemId}"]`)
            const insertAfter = dropZone.parentElement.classList.contains("kanban__item") ? dropZone.parentElement : dropZone 
            
            if(droppedItemElement.contains(dropZone)){//avoid updating the API when element dragged into current drop zone
                return;
            }

            insertAfter.after(droppedItemElement) //VISUALLY insert the NewElement after the topElement topElement.after(NewElement)

            // call API so changes are not only visual
            KanbanAPI.updateItem(itemId, {
                columnId,
                position: droppedIndex
            })
        })
        return dropZone
    }
}