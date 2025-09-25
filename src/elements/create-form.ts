import { API } from "../consts"
import { Debouncer, formToBody, handled, invokeUpdates, log } from "../form-utils"
import { BaseElement, html } from "./base"
type CreateParams = { data: { [key: string]: string | string[] }, address: string, jwt: string }
export default class CreateForm extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'jwt', 'address', 'toupdate'];
    private debouncer = new Debouncer<CreateParams, { ok: boolean, statusText: string }>(
        async ({ data, address, jwt }) => {
            const res = await handled(fetch(`${API}${address}`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
            }), 'network')
            return { ok: res.ok, statusText: res.statusText }
        },
        (data) => {
            if (!data.ok) log(data.statusText, 'data')
            else window.alert('Created successfully')
            invokeUpdates(this.getAttribute('toupdate'), this.getRootNode())
        }
    )
    render() {
        return html`<slot></slot>`
    }
    attachCallbacks() {
        const form = this.querySelector('form')!
        form.addEventListener('submit', async e => {
            e.preventDefault(); this.debouncer.run({
                data: await formToBody(form),
                address: this.getAttribute('address')!,
                jwt: this.getAttribute('jwt')!,
            })
        })
    }
}
customElements.define('create-form', CreateForm)