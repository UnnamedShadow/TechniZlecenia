import { BaseElement, html } from "./base"
export default class PagedView extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'page'];

    render() {
        return html`
            <slot></slot>
            <slot name="${this.getAttribute(`page`) || '0'}"></slot>
        `
    }
    attachCallbacks() { }
}
customElements.define('paged-view', PagedView)
