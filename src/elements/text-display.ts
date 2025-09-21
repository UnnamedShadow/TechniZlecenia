import { BaseElement, html } from "./base"
export default class TextDisplay extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'content', 'alt'];
    render() {
        return html`${this.getAttribute('content') || this.getAttribute('alt') || ''}`
    }
    attachCallbacks() { }
}
customElements.define('text-display', TextDisplay)
