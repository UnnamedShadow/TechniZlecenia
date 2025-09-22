import { API } from "../consts"
import { BaseElement, html } from "./base"
export default class QueryMyOrders extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'jwt', 'orders'];
    render() {
        if (this.hasAttribute('loaded'))
            return html`<slot></slot>`
        else
            return html`Loading...`
    }
    attachCallbacks() {
        if (this.hasAttribute('loaded') || !this.hasAttribute('jwt')) return
        const { sub }: { sub: number } = JSON.parse(atob(this.getAttribute('jwt')!.split('.')[1]))
        const response = fetch(`${API}/orders/user/${sub}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        response.catch((err) => window.alert(err))
        response.then(res => res.json()).then(res => {
            this.setAttribute('orders', JSON.stringify(res))
            this.toggleAttribute('loaded', true)
        })
    }
}
customElements.define('query-my-orders', QueryMyOrders)
