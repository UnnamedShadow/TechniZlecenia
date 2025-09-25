import { API } from "../consts"
import { Debouncer, handled, log } from "../form-utils"
import { BaseElement, html } from "./base"
export default class QuerySearch extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'jwt', 'data', 'is_user', 'query', 'type', 'loaded'];
    private debouncer = new Debouncer<{ type: string, query: string, jwt: string }, { text: string, ok: boolean }>(
        async ({ type, query, jwt }) => {
            const res = await handled(fetch(`${API}/${type}/search?query=${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                }
            }), 'network')
            return { text: await handled(res.text(), 'response'), ok: res.ok }
        }, ({ text, ok }) => {
            if (!ok) log(text, 'data')
            else this.setAttribute('data', text)
            this.toggleAttribute('loaded', true)
        })
    render() {
        if (!this.hasAttribute('data'))
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
        return html`<slot></slot>`
    }
    attachCallbacks() {
        const type = this.hasAttribute('is_user') ? 'user' : 'orders'
        if (this.getAttribute('type') !== type) this.setAttribute('type', type)
        const jwt = this.getAttribute('jwt')
        if (!jwt) return
        const query = this.getAttribute('query') || ''
        this.toggleAttribute('loaded', false)
        this.debouncer.run({ type, query, jwt })
    }
    update() {
        this.toggleAttribute('loaded', false)
    }
}
customElements.define('query-search', QuerySearch)
