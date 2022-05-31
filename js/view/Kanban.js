import Column from "./Column.js";

export default class Kanban {
    constructor(root){//referes to the div class="kanban"
        this.root = root;

        Kanban.columns().forEach(column => {
            const columnView = new Column(column.id, column.title);

            this.root.appendChild(columnView.elements.root);
        })
    }

    static columns() {
        return [
            {id: 1,
            title: "NOT STARTED"},
            {id: 2,
                title: "IN PROGRESS"},
            {id: 3,
              title: "COMPLETED"},

        ]
    }
}