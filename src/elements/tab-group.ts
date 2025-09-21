import { BaseElement, html } from "./base"

export default class TabGroup extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'value']
    render() {
        return html`
            <slot></slot>
            <style>
                slot {
                    display: flex;
                    flex-direction: column;
                    border-left: black 2px solid;
                    margin-left: 10px;
                    padding-left: 1px;
                    gap: 6px;
                }
            </style>
        `
    }
    attachCallbacks() {
        if (!this.hasAttribute('disabled'))
            this.querySelectorAll('tab-button').forEach(button => {
                button.toggleAttribute('selected', button.getAttribute('value') === this.getAttribute('value'))
            })
    }
}

customElements.define('tab-group', TabGroup)