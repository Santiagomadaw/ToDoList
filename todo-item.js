

/*
NOMBRE --> input-action

- Responsabilidad
    pintar checkbox, texto y papelera
    dar funcionalidad a la papelera y al checkbox

- Atributos
    checkstate true|false
    button leble

- Eventos
    lanzar evento con cambios en el check y papelera con el fin de poder usarlo en otro modulo diferente que queramos implementar
- Custom Properties
    style de texto, color de la caja

*/

const templateElement = document.createElement("template");

templateElement.innerHTML = `
<style>
:host {
    --colortask: lightblue;
}

    h3 {
        overflow: hidden;
    }

    input:checked + h3 {
        text-decoration: line-through;
    }

    .task-wrapper > .inner-task-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border: black 1px solid;
        border-radius: 8px;
        padding: 0 0 0 8px;
        background-color: whitesmoke;
        gap: 4px;
        top: 12px;
    }

    .task-wrapper {
        width: 364px;

        
    }

    button {
        background-color: transparent;
        font-size: x-large;
        border: 0;
    }
    .button-wrapper{
        display: flex;
        flex-direction: column;
        width: 26px;

    }
    .outer-task-wrapper{
        display: flex;
        border: grey 1px solid;
        border-radius: 10px;
        background-color: var(--colortask);
        margin-bottom: 6px;
        box-shadow: 0px 0px 2px 1px grey;
    }

    p {
        margin: 0;
        text-align: right;
        padding: 1px 12px;
        font-size: small;

    }
</style>

<div class="outer-task-wrapper">                                                                                           
<div class="task-wrapper">                                                                                           
    
    <div class="inner-task-wrapper">       
        <input type="checkbox">
        <h3 contenteditable></h3>
        <button></button>
    </div>
    
    <p></p>
</div>
<div class="button-wrapper">
        <button class="btn-up">⬆</button>
        <button class="btn-down">⬇</button>
</div>
</div>

`;

class ToDoItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.buttonLabel = this.getAttribute('buttonLabel') || '🗑';
        this.taskText = this.getAttribute('text') || 'New Task';
        this.idValue = this.getAttribute('id') || 'New Task';
        this.isCompleted = this.hasAttribute('isCompleted') || false
        this.createdAt = parseInt(this.getAttribute('createdAt'));
        this.order = parseInt(this.getAttribute('order'))

    }

    connectedCallback() {
        const template = templateElement.content.cloneNode(true);
        const input = template.querySelector('input');
        const button = template.querySelector('button');
        const text = template.querySelector('h3')
        const date = template.querySelector('p')
        date.textContent=` Creado el ${this.milisegundosAFecha(this.createdAt)}`
        button.textContent = this.buttonLabel;
        text.textContent = this.taskText;
        input.checked=this.isCompleted
        const btnsDown = template.querySelector(".btn-down")
        const btnsUp = template.querySelector(".btn-up");
        btnsUp.addEventListener('click',()=>{ this.clickUp(this.idValue,this.order)})
        
        btnsDown.addEventListener('click',()=>{this.clickDown(this.idValue,this.order)})
        
        button.addEventListener('click', () => {
            this.removeItem(this.idValue);
        });
        input.addEventListener('change', () => {
            this.updateItem(this.idValue, text.textContent, input.checked,this.order,this.createdAt);
        });
        text.addEventListener('keyup', () => {
            this.taskText = text.textContent;
            this.updateItem(this.idValue, text.textContent, input.checked);
        });
        this.setColor(this.createdAt)
        if (!this.shadowRoot.querySelector('.task-wrapper')) {
            this.shadowRoot.appendChild(template);
        }
    }

    

    removeItem(id) {
        if (window.confirm('Borrar?')) {
            const event = new CustomEvent('remove', { detail: id });
            this.dispatchEvent(event);
            this.remove();
        }
    }
    updateItem(id, text, isCompleted, order, date){
        const event = new CustomEvent('changeStatus', { detail: {id,isCompleted,text,order,date} }); 
        this.dispatchEvent(event);
    }
    clickUp(id,order){
        const event = new CustomEvent('taskUp', { detail: {id,order} }); 
        this.dispatchEvent(event);

    }
    clickDown(id,order){
        const event = new CustomEvent('taskDown', { detail: {id,order} }); 
        this.dispatchEvent(event);

    }
    setColor(date){
        
        const segundosEnUnaSemana =  24 * 60 * 60 * 1000;
        const days = Math.floor((Date.now()-date) / segundosEnUnaSemana);
        const color=this.getColorForDays(days)
        this.style.setProperty('--colortask', color);
    }
    

    getColorForDays(days) {
    if (days < 1) {
        return 'lightgreen'; 
    } else if (days <= 1) {
        return `rgb(155, 244, 144)`;
    } else if (days <= 2) {
        return `rgb(175, 244, 144)`;
    } else if (days <= 3) {
        return `rgb(185, 244, 144)`;
    } else if (days <= 4) {
        return `rgb(195, 244, 144)`;
    } else if (days <= 5) {
        return `rgb(205, 244, 144)`;
    } else if (days <= 6) {
        return `rgb(235, 244, 144)`;
    } else if (days <= 7) {
        return `rgb(255, 244, 144)`;
    } else if (days <= 14) {
        return `rgb(255, 234, 144)`;
    } else if (days <= 21) {
        return `rgb(255, 214, 144)`;
    } else if (days <= 28) {
        return `rgb(255, 194, 144)`;
    } else if (days <= 60) {
        return `rgb(255, 174, 144)`;
    } else if (days <= 90) {
        return `rgb(255, 154, 144)`;
    } else if (days <= 120) {
        return `rgb(255, 144, 144)`;
    } else if (days <= 365) {
        return `rgb(97, 1, 1)`;
    } else {
        return 'rgb(51, 15, 15)';
    }
}
milisegundosAFecha(milisegundos) {
    const fecha = new Date(milisegundos);
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const año = fecha.getFullYear();
    const diaFormateado = (dia < 10) ? `0${dia}` : dia;
    const mesFormateado = (mes < 10) ? `0${mes}` : mes;
        return `${diaFormateado}-${mesFormateado}-${año}`;
}

}
window.customElements.define("to-do-item", ToDoItem);
