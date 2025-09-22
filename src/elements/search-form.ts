import { API } from "../consts"
import { BaseElement, html } from "./base"
export default class SearchForm extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'jwt', 'orders', 'query'];
    render() {
        if (this.hasAttribute('loaded'))
            return html`<slot></slot>`
        else
            return html`Loading...`
    }
    attachCallbacks() {
        if (this.hasAttribute('loaded') || !this.hasAttribute('jwt')) return
        const response = fetch(`${API}/orders/search/?query=${this.getAttribute('query')!}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.getAttribute('jwt'),
            },
        })
        response.catch((err) => window.alert(err))
        response.then(res => res.json()).then(res => {
            this.setAttribute('orders', JSON.stringify(res))
            this.toggleAttribute('loaded', true)
        })
    }
}
customElements.define('login-form', SearchForm)
