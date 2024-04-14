/*
NOMBRE --> input-action

- Responsabilidad
contener el input acction
leer local storage
pintar los items guardos
escucnar los eventos que provienen de input acction (nueva tarea)
y pintar el todo item asi como guardar persistencia
escuchar los eventos que provienen de todo-item (remove)
modificar dom y persistencia

- Atributos

- Eventos

- Custom Properties
- color del task

*/



const templateElement = document.createElement("template");

templateElement.innerHTML = `
<style>
.components-wrapper{
    margin:auto;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 500px;
    gap:2px;
}
</style>

<div class="components-wrapper">
    <input-action id="add-todo"></input-action>
    <div id="tasks-continer"></div>
</div>

`;

class todoMasterChief extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.maxiorder=0
    }
    connectedCallback() {
        const template = templateElement.content.cloneNode(true);
        const input = template.querySelector('#add-todo');
        const continer = template.querySelector('#tasks-continer');
        input.addEventListener('send-action', (event) => {
            
            const date = Date.now();
            const id = this.generarUUID()
            this.maxiorder++
            this.drawTask(id, event.detail, false,this.maxiorder, date, continer);
            this.saveData(id, event.detail, false, this.maxiorder, date);

        });
        
        this.shadowRoot.appendChild(template);
        this.readLocalStorage(continer);
        
    }

    readLocalStorage(container) {
        const todos = JSON.parse(localStorage.getItem('todos')) || {};
        const todosArray = Object.keys(todos).map(key => ({ id: key, ...todos[key] }));
        console.log(todosArray)
        todosArray.sort((a, b) => a.order - b.order);
        todosArray.forEach(todo => {
            this.drawTask(todo.id, todo.text, todo.finished, todo.order, todo.createdAt, container);
        });
    }
    drawTask(id, text, isCompleted,order,date, continer) {
        const isCompletedAttribute = isCompleted ? 'isCompleted=""' : '';
        const newTask = `<to-do-item ${isCompletedAttribute} text="${text}" id="${id}" order="${order}" createdat="${date}"></to-do-item>`;
        const tempDiv = document.createElement('div');
        
        tempDiv.innerHTML = newTask;
        
        const toDoItemElement = tempDiv.firstChild;
        continer.appendChild(toDoItemElement);


        toDoItemElement.addEventListener('remove', (event) => {
            this.deleteData(event.detail);
        });
        toDoItemElement.addEventListener('changeStatus', (event) => {
            this.saveData(event.detail.id, event.detail.text, event.detail.isCompleted,event.detail.order,event.detail.date);
        });
        toDoItemElement.addEventListener('taskUp', (event) => {
        
            this.clickUpbt(toDoItemElement)
        });

        toDoItemElement.addEventListener('taskDown', (event) => {
            this.clickDownbt(toDoItemElement)
        });

    }
    

    saveData(id, text, isCompleted, order, date) {

        const newTodo = JSON.parse(localStorage.getItem('todos')) || {};
        newTodo[id] = { 'finished': isCompleted, 'text': text,'order':order,'createdAt':date};
        localStorage.setItem('todos', JSON.stringify(newTodo));
    }
    deleteData(id) {

        const newTodo = JSON.parse(localStorage.getItem('todos')) || {};
        delete newTodo[id];
        localStorage.setItem('todos', JSON.stringify(newTodo));
    }
    generarUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    clickUpbt = (divMove) => {
        const divPrev = divMove.previousElementSibling;
        console.log
        if (!divPrev) return;
        divMove.parentNode.insertBefore(divMove, divPrev);
        this.swaporder(divMove.id,divPrev.id)
    };
    clickDownbt = (divMove) => {
        const divpost = divMove.nextElementSibling;
        if (!divpost) return;
        divMove.parentNode.insertBefore(divpost, divMove);
        this.swaporder(divMove.id,divpost.id)
    };
    swaporder(id1, id2){
        const newTodo = JSON.parse(localStorage.getItem('todos')) || {}
        console.log(newTodo[id1].order,newTodo[id2].order)
        const order1 =newTodo[id1].order
        const order2 =newTodo[id2].order
        newTodo[id1].order =order2
        newTodo[id2].order =order1
        console.log(newTodo[id1].order,newTodo[id2].order)
        localStorage.setItem('todos', JSON.stringify(newTodo));


    }
}
window.customElements.define("todo-master-chief", todoMasterChief);

