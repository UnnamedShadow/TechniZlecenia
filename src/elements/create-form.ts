import { API } from "../consts"
import { formToBody } from "../form-utils"
import { BaseElement, html } from "./base"
export default class CreateForm extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'jwt', 'address'];
    render() {
        return html`<slot></slot>`
    }
    attachCallbacks() {
        const form = this.querySelector('form')!
        form.addEventListener('submit', async (e) => {
            e.preventDefault()
            const data = new FormData(form)
            const response = await fetch(`${API}${this.getAttribute('address')}`, {
                method: 'POST',
                body: JSON.stringify(await formToBody(form)),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAttribute('jwt')}`
                },
            })
            if (!response.ok)
                alert(await response.text())
            else
                location.reload()
        })
    }
}
customElements.define('create-form', CreateForm)