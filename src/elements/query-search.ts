import { API } from "../consts"
import { Debouncer, handled, log } from "../form-utils"
import { BaseElement, html } from "./base"
export default class QuerySearch extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'jwt', 'data', 'is_user', 'query', 'type', 'loaded'];
    private debouncer = new Debouncer<{ type: string, query: string, jwt: string }, { text: string, ok: boolean }>(
        async ({ type, query, jwt }) => {
            this.toggleAttribute('loaded', false)
            const res = await handled(fetch(`${API}/${type}/search?query=${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                }
            }), 'network')
            return { text: await handled(res.text(), 'response'), ok: res.ok }
        }, ({ text, ok }) => {
            this.toggleAttribute('loaded', true)
            if (!ok) log(text, 'data')
            else this.setAttribute('data', text)
        })
    render() {
        if (!this.hasAttribute('data'))
            return html`Loading...`
        return html`
            <slot></slot>
            <style>
                :host {
                    cursor: ${this.hasAttribute('loaded') ? 'default' : 'wait'};
                }
            </style>
        `
    }
    attachCallbacks() {
        const type = this.hasAttribute('is_user') ? 'user' : 'orders'
        const typeChange = this.getAttribute('type') !== type
        if (typeChange) {
            this.setAttribute('type', type)
            this.toggleAttribute('loaded', false)
        }
        const jwt = this.getAttribute('jwt')
        if (!jwt) return
        const query = this.getAttribute('query') || ''
        this.debouncer.run({ type, query, jwt }, typeChange ? { delay_after: 50 } : { delay_before: 500 })
    }
    update() {
        this.attachCallbacks()
    }
}
customElements.define('query-search', QuerySearch)
