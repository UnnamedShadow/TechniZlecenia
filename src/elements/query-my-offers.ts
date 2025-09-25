import { API } from "../consts"
import { Debouncer, handled, log } from "../form-utils"
import { BaseElement, html } from "./base"
export default class QueryMyOffers extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'jwt', 'offers', 'loaded']
    private debouncer = new Debouncer<{ sub: number }, { ok: boolean, text: string }>(async ({ sub }) => {
        const response = await handled(fetch(`${API}/offers/user/${sub}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }), 'network')
        return { ok: response.ok, text: await handled(response.text(), 'response') }
    }, ({ ok, text }) => {
        if (!ok) {
            log(text, 'data')
        } else {
            this.setAttribute('offers', text)
            this.toggleAttribute('loaded', true)
        }
    })
    render() {
        if (!this.hasAttribute('offers')) return html`Loading...`
        if (this.hasAttribute('loaded')) return html`<slot></slot>`
        return html`
            <slot></slot>
            <style>
                :host {
                    cursor: wait;
                }
            </style>
        `
    }
    attachCallbacks() {
        if (this.hasAttribute('loaded') || !this.hasAttribute('jwt')) return
        const { sub }: { sub: number } = JSON.parse(atob(this.getAttribute('jwt')!.split('.')[1]))
        this.debouncer.run({ sub })
    }
    update() {
        this.toggleAttribute('loaded', false)
    }
}

customElements.define('query-my-offers', QueryMyOffers)