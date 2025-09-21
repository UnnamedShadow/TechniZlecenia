import { BaseElement, html } from "./base"

export default class TabButton extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'value', 'selected']
    render() {
        return html`
            <button><slot></slot></button>
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                }
                button {
                    background-color: #3c3c3cEA;
                    border: none;
                    border-radius: 0 10px 10px 0;
                    width: 80%;
                    text-wrap: nowrap;
                    font-size: 1rem;
                    height: 2rem;
                    margin-left: ${this.hasAttribute('selected') ? '10px' : '1px'};
                }
                button:hover {
                    box-shadow: 10px 5px 4px #FFF3;
                }
                button:active {
                    box-shadow: 10px 5px 4px #FFF3, 1px 1px 0 #FFA5004E inset;
                }
            </style>
        `
    }
    private findTabGroup(): HTMLElement {
        let parent = this.parentElement!
        while (parent.tagName !== 'TAB-GROUP' || parent.hasAttribute('disabled')) {
            parent = parent.parentElement!
        }
        return parent
    }
    attachCallbacks() {
        if (this.hasAttribute('selected')) {
            const name = this.getAttribute('value')
            const tabGroup = this.findTabGroup()
            if (name !== null && tabGroup.getAttribute('value') !== name)
                tabGroup.setAttribute('value', name)
        }
        this.shadow!.querySelector('button')!.addEventListener('click', () => {
            this.toggleAttribute('selected', true)
        })
    }
}

customElements.define('tab-button', TabButton)