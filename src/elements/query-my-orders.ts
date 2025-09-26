import { API } from "../consts"
import { Debouncer, handled, log } from "../form-utils"
import { BaseElement, html } from "./base"
export default class QueryMyOrders extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'jwt', 'orders', 'loaded'];
    private debouncer = new Debouncer<{ sub: number }, { ok: boolean, text: string }>(async ({ sub }) => {
        const response = await handled(fetch(`${API}/orders/user/${sub}`, {
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
            this.setAttribute('orders', text)
            this.toggleAttribute('loaded', true)
        }
    })
    render() {
        if (!this.hasAttribute('orders'))
            return html`Loading...`
        if (!this.hasAttribute('loaded'))
            return html`
                <slot></slot>
                <style>
                    :host {
                        cursor: wait;
                    }
                </style>
            `
        return html`
            <slot></slot>
            <style>
                :host {
                    cursor: default;
                }
            </style>
        `
    }
    attachCallbacks() {
        if (this.hasAttribute('loaded') || !this.hasAttribute('jwt')) return
        const { sub }: { sub: number } = JSON.parse(atob(this.getAttribute('jwt')!.split('.')[1]))
        this.debouncer.run({ sub }, { delay_after: 500, memoize: true })
    }
    update() {
        this.toggleAttribute('loaded', false)
    }
}
customElements.define('query-my-orders', QueryMyOrders)
