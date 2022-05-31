import KanbanAPI from "../api/KanbanAPI.js";
import DropZone from "./Dropzone.js";
import Item from "./Item.js";
import Kanban from "./Kanban.js";

export default class Column{
    constructor(id, title){
        const topDropZone= DropZone.createDropZone();

        this.elements = {};
        this.elements.root = Column.createRoot();
        this.elements.title = this.elements.root.querySelector(".kanban__column-title"); //relates the root to the html class
        this.elements.items = this.elements.root.querySelector(".kanban__column-items"); //relates the root to the html class
        this.elements.addItem = this.elements.root.querySelector(".kanban__add-item"); //relates the root to the html class

        this.elements.root.dataset.id = id;
        this.elements.title.textContent = title;
        this.elements.items.appendChild(topDropZone);//insertdrop zone above items

        this.elements.addItem.addEventListener("click", () => {
            //TODO ADD ITEM
            const newItem = KanbanAPI.insertItem(id,"");

            this.renderItem(newItem)
        });

        KanbanAPI.getItems(id).forEach(item => {
            this.renderItem(item);
        });
    }

    static createRoot() {
        const range = document.createRange()

        range.selectNode(document.body);

        return range.createContextualFragment(`
        <div class="kanban__column">
            <div class="kanban__column-title"></div>
            <div class="kanban__column-items"></div>
            <button class="kanban__add-item" type="button">+ Add</button>
        </div>
        `).children[0];
    }

    renderItem(data) {
        //receives new data for new item, renders it into the html
        const item = new Item(data.id, data.content);

        this.elements.items.appendChild(item.elements.root);
    }
}