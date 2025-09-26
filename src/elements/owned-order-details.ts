import { API } from "../consts"
import { Debouncer, formToBody, handled, invokeUpdates, log } from "../form-utils"
import { BaseElement, html } from "./base"

type POST = { method: 'POST', id: number, body: string, jwt: string }
type DELETE = { method: 'DELETE', id: number, jwt: string }

export default class OwnedOrderDetails extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'current', 'jwt', 'name', 'description', 'price', 'toupdate'];
    private debouncer = new Debouncer<POST | DELETE, { text: string, ok: boolean }>(async (data) => {
        const res = await handled(fetch(`${API}/orders/${data.id}`, {
            method: data.method,
            body: data.method === 'POST' ? data.body : undefined,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + data.jwt,
            },
        }), 'network')
        return { text: await handled(res.text(), 'response'), ok: res.ok }
    }, ({ text, ok }) => {
        invokeUpdates(this.getAttribute('toupdate'), this.getRootNode())
        if (!ok) log(text, 'data')
        else window.alert('Updated successfully')
    })
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
            const id = JSON.parse(this.getAttribute('current')!).order_id
            this.removeAttribute('current')
            this.debouncer.run({
                method: 'POST',
                id,
                body: JSON.stringify(await formToBody(form)),
                jwt: this.getAttribute('jwt')!,
            }, { delay_before: 100, delay_after: 200 })
        })
    }
    delete() {
        const id = JSON.parse(this.getAttribute('current')!).order_id
        this.removeAttribute('current')
        this.debouncer.run({
            method: 'DELETE',
            id,
            jwt: this.getAttribute('jwt')!,
        }, { delay_after: 200 })
    }
}
customElements.define('owned-order-details', OwnedOrderDetails)
