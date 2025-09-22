import { BaseElement, html } from "./base"

export default class ToggleButton extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'clicked', 'small'];

    render() {
        return html`
            <button>
                ${this.hasAttribute('clicked') ? html`<slot name="on"></slot>` : html`<slot name="off"></slot>`}
            </button>
            <style>
                button {
                    border: none;
                    border-radius: 10px;
                    min-height: ${this.hasAttribute('small') ? '25px' : '50px'};
                    background: ${this.hasAttribute('small') ? 'none' : 'revert'};
                    min-width: 50px;
                }
            </style>
        `
    }
    toggle(): void {
        if (this.dispatchEvent(new Event('clicked', { cancelable: true })))
            this.toggleAttribute('clicked')
    }
    attachCallbacks(): void {
        this.shadow!.querySelector('button')!.addEventListener('click', () => {
            this.toggle()
        })
    }
}
customElements.define('toggle-button', ToggleButton)
