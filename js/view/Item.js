import KanbanAPI from "../api/KanbanAPI.js";
import DropZone from "./Dropzone.js";

export default class Item{
    constructor(id, content){
        const bottomDropZone = DropZone.createDropZone();

        this.elements = {};
        this.elements.root = Item.createRoot();
        this.elements.input = this.elements.root.querySelector(".kanban__item-input");

        // inserts arguments id, content into the html
        this.elements.root.dataset.id = id;
        this.elements.input.textContent = content;
        this.content = content; 
        this.elements.root.appendChild(bottomDropZone);

        this.elements.input.innerHTML = marked.parse(content)
        // Save content when blurred
        const onBlur = () => {
            //this.elements.input.innerHTML = content
            const newContent = this.elements.input.textContent.trim();
            this.elements.input.innerHTML = marked.parse(newContent)
            if (newContent == this.content){
                return;
            }
            
            this.content = newContent;
            KanbanAPI.updateItem(id, {
                content: this.content
            });
            

        };


        this.elements.input.addEventListener("blur",onBlur)
        this.elements.input.addEventListener("focus", () => {
            this.elements.input.innerHTML = this.content
        })
        this.elements.root.addEventListener("dblclick", () => {
            const check = confirm("Are you sure you want to delete this item?");

            if(check){
                // remove from local storage
                KanbanAPI.deleteItem(id)
                
                //remove event listener and html element
                this.elements.input.removeEventListener("blur",onBlur);
                this.elements.root.parentElement.removeChild(this.elements.root);
            }
        })

        // DRAG AND DROP FUNCTIONALITY starter
        this.elements.root.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", id)
        });
        this.elements.root.addEventListener("drop", e => {
            e.preventDefault();
        })
        
    }

    static createRoot() {
        const range = document.createRange();

        range.selectNode(document.body);

        return range.createContextualFragment(`
        <div class="kanban__item" draggable="true">
            <div class="kanban__item-input" contenteditable></div>
        </div>
        `).children[0];
    }
}