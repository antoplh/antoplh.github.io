// data structure = {id,{id,content}}
export default class KanbanAPI {
    static getItems(columnId) {
        const column = read().find(column => column.id == columnId); //check which column is the same as the argument columnId

        if(!column) {
            return [];
            
        }
        
        return column.items;
    }

    static insertItem(columnId, content) {
        const data = read();
        const column = data.find(column => column.id == columnId);
        const item = {
            id: Math.floor(Math.random() * 1000000),
            content : content 
        };

        if(!column) {
            throw new Error("Column does not exist");
        }

        column.items.push(item);
        save(data); //when saving data, changes made in column are made as well

        return item;
    }

    static updateItem(itemId, newProps) {
        const data = read();
        // Get the current item and column from where the change is being made
        const [item, currentColumn] = (() => {
            for (const column of data) {
                 const item = column.items.find(item => item.id == itemId);

                 if (item) {
                     return [item,column];
                 }
            }
        })();
                
        if (!item) {
            throw new Error("Item not found.")
        }
        // if there is no new content then set it to the current one
        item.content = newProps.content === undefined ? item.content : newProps.content;
        
        // Update column and position
        if (
            newProps.columnId !== undefined
            && newProps.position !== undefined // refers to the position inside the column
        ){
            const targetColumn = data.find(column => column.id == newProps.columnId);
            if(!targetColumn) {
                throw new Error ("Target column not found.");
            }

            // Delete item from its current column 
            // SPLICE(index from 0, 1 to delete and replace, 0 to insert at position index, value to be replaced with) )
            currentColumn.items.splice(currentColumn.items.indexOf(item), 1);
            
            // Move item into target column and new position 
            targetColumn.items.splice(newProps.position,0, item);
            }
            
            save(data);

    }

    static deleteItem(itemId) {
        const data = read();

        for (const column of data) {
            const item = column.items.find(item => item.id == itemId);

            if (item){
                column.items.splice(column.items.indexOf(item),1);
            }
        }

        save(data);
    }
}

function read(){ 
    const json= localStorage.getItem("kanban-data");

    if(!json){
        return [
            {
                id: 1,
                items: [{id : 123, content : "Limpiar mi cuarto"}]
            },
            {
                id: 2,
                items: [{id : 456, content : "Programar"}]
            },
            {
                id: 3,
                items: [{id : 234, content : "Lavar mi ropa"}]
            }
        ];
    }

    return JSON.parse(json);
}

function save(data) {
    localStorage.setItem("kanban-data",JSON.stringify(data,null," "));
}