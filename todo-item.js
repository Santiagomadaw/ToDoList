

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
    --colorp: black;
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
        color: var(--colorp);

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
            this.updateItem(this.idValue, text.textContent, input.checked,this.order,this.createdAt);
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
        const [divColor,colorp] = this.getColorForDays(days)
        this.style.setProperty('--colortask', divColor);
        this.style.setProperty('--colorp', colorp);
    }
    


getColorForDays(days, fresh=7,overripe=15,rotten=31){
    const colortext = (days>=overripe) ? 'white':'black'
    let red = 255, green =255, blue = 0
    if (days<=fresh) { 
        red=parseInt(days*255/fresh)
    }else if (days<=overripe){
        green=255 - parseInt((days-fresh)*200/(overripe-fresh))
    }else if (days<=rotten){
        red = 255-parseInt((days-overripe)*200/(rotten-overripe))
        green=parseInt((days-overripe)*55/(rotten-overripe))
    }else{
        red = 55
        green =55
    }
    return [`rgb(${red}, ${green}, ${blue})`,colortext]
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
