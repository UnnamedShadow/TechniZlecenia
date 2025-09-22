import { BaseElement, html } from "./base"
export default class OwnedOrderDetails extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'current'];

    render() {
        return html`
            <slot ${this.hasAttribute('current') ? '' : 'aria-disabled'}></slot>
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    overflow-y: hidden;
                    overflow-x: auto;
                    transition: height 0.3s ease-in-out;
                    ${this.hasAttribute('current') ? 'height: 300px;' : 'height: 0px;'}
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
customElements.define('owned-order-details', OwnedOrderDetails)
