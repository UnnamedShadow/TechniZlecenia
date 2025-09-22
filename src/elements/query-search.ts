import { API } from "../consts"
import { BaseElement, html } from "./base"
export default class QuerySearch extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'jwt', 'data', 'is_user', 'query', 'type'];
    render() {
        if (this.hasAttribute('data'))
            return html`<slot></slot>`
        else
            return html`Loading...`
    }
    private prevQuery?: string
    attachCallbacks() {
        const type = this.hasAttribute('is_user') ? 'user' : 'orders'
        if (this.getAttribute('type') !== type) this.setAttribute('type', type)
        if (!(this.hasAttribute('jwt') && this.hasAttribute('query'))) return
        const query = this.getAttribute('query')!
        if (this.prevQuery === type + query) return
        const response = fetch(`${API}/${type}/search?query=${query}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.getAttribute('jwt'),
            },
        })
        response.catch((err) => window.alert(err))
        response.then(res => res.json()).then(res => {
            if (this.prevQuery === type + query) return
            this.setAttribute('data', JSON.stringify(res))
            this.prevQuery = type + query
        })
    }
}
customElements.define('query-search', QuerySearch)
