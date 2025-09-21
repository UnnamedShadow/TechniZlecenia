import { BaseElement, html } from "./base"

export default class SidePanel extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'opened']
    render() {
        return html`
            <slot ${this.hasAttribute('opened') ? '' : 'aria-disabled'}></slot>
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    overflow-y: auto;
                    overflow-x: hidden;
                    transition: width 0.3s ease-in-out;
                    ${this.hasAttribute('opened') ? 'width: 300px;' : 'width: 0px;'}
                }
            </style>
        `
    }
    attachCallbacks() {
        this.addEventListener('transitionend', () => {
            this.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        })
    }
}

customElements.define('side-panel', SidePanel)