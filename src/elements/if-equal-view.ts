import { BaseElement, html } from "./base"
export default class IfEqualView extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'a', 'b'];

    render() {
        if (this.getAttribute('a') !== this.getAttribute('b'))
            return html``
        return html`
            <slot></slot>
        `
    }
    attachCallbacks() {
        this.toggleAttribute('visible', this.getAttribute('a') === this.getAttribute('b'))
    }
}
customElements.define('if-equal-view', IfEqualView)
