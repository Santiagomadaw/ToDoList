

/*
NOMBRE --> input-action

- Responsabilidad
registrar texto introducido y enviar ese texto cuando se pulse el botón. El botón
sólo estará habilitado cuando el input tenga texto escrito.

- Atributos
  - buttonLabel
  - placeholder

- Eventos
  - evento cuando pulsemos el botón con el texto escrito.

- Custom Properties
  - color del botón

*/

const templateElement = document.createElement("template");

templateElement.innerHTML = `
<style>
.input-action-wrapper{
    display: flex;
    flex-direction: row;
    border:black 1px solid;
    border-radius:10px;
    margin-bottom: 15px;
    background-color: white;
    margin-top: 45px;
    padding:0 0 0 8px  ;
    width: 382px;

    
    
}
.input-action-wrapper:has(input:focus-visible){
    outline: black solid 1px;
}

input{
    width: 362px;
    height: 30px;
    border:none;
    background-color: transparent;
    border-radius:10px;
    

}
input:focus-visible{
    outline: 0px;
}
button{
    position:relative;
    right:3px;
    background-color: transparent;
    font-size: large;
    border:0

    
}

</style>

<div class="input-action-wrapper">
    <input type="text">
    <button></button>
</div>

`;

class InputAction extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.buttonLabel = this.getAttribute('buttonLabel') || '➕';
        this.placeholder = this.getAttribute('placeholder') || 'write a task';
    }

    connectedCallback() {
        const template = templateElement.content.cloneNode(true);
        const input = template.querySelector('input');
        input.setAttribute('placeholder', this.placeholder);

        const button = template.querySelector('button');
        button.textContent = this.buttonLabel;
        button.disabled = true;
        button.addEventListener('click', (event) => {
            this.onButtonClicked(event.target);
        });
        input.addEventListener('submit', (event) => {
            this.onButtonClicked(event.target);
        });
        input.addEventListener('input', () => {
            this.switchButton(input.value, button);
        });

        this.shadowRoot.appendChild(template);
    }
    switchButton(inputvalue, button) {
        if (inputvalue.trim() != '') {
            button.disabled = false;
        }
        else {
            button.disabled = true;
        }

    }

    onButtonClicked(button) {
        const input = this.shadowRoot.querySelector('input');
        const event = new CustomEvent('send-action', {
            detail: input.value
        });
        input.value = '';
        this.dispatchEvent(event);
        this.switchButton("", button);
    }
    
}

window.customElements.define("input-action", InputAction);
