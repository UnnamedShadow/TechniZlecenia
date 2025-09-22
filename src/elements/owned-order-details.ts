import { API } from "../consts"
import { formToBody } from "../form-utils"
import { BaseElement, html } from "./base"
export default class OwnedOrderDetails extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'current', 'jwt', 'name', 'description', 'price'];

    render() {
        return html`
            <slot ${this.hasAttribute('current') ? '' : 'aria-disabled'}></slot>
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    overflow-y: hidden;
                    overflow-x: auto;
                    transition: height 0.3s ease-in-out;
                    ${this.hasAttribute('current') ? 'height: 300px;' : 'height: 0px;'}
                }
            </style>
        `
    }
    attachCallbacks() {
        this.addEventListener('transitionend', () => {
            this.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
            if (this.hasAttribute('current')) {
                const current = JSON.parse(this.getAttribute('current')!)
                this.setAttribute('name', current.name)
                this.setAttribute('description', current.description)
                this.setAttribute('price', current.price)
            }
        })
        if (!this.hasAttribute('current')) return
        const form = this.querySelector('form')!
        form.addEventListener('submit', async (e) => {
            e.preventDefault()
            const current: { [key: string]: string | string[] } = JSON.parse(this.getAttribute('current')!)
            this.removeAttribute('current')
            const res = fetch(`${API}/orders/${current.id}`, {
                method: 'POST',
                body: JSON.stringify(await formToBody(form)),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.getAttribute('jwt'),
                }
            })
            res.catch(window.alert)
            res.then(() => location.reload())
        })
    }
    delete() {
        this.removeAttribute('current_id')
        const res = fetch(`${API}/orders/${this.getAttribute('current')}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.getAttribute('jwt'),
            },
        })
        res.catch(window.alert)
        res.then(() => location.reload())
    }
}
customElements.define('owned-order-details', OwnedOrderDetails)
