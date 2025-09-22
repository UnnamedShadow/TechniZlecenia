import { API } from "../consts"
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
                body: JSON.stringify((await Promise.all(Array.from(data).map(async ([k, v]) => {
                    if (typeof v !== 'string') return [k, btoa(new Uint8Array(await v.arrayBuffer()).reduce((p, c) => p.concat(String.fromCodePoint(c)), ''))]
                    try {
                        return [k, JSON.parse(v)]
                    } catch {
                        return [k, v]
                    }
                }))).reduce((p: { [key: string]: string | string[] }, [k, v]) =>
                    k in p ? { ...p, [k]: typeof p[k] === 'string' ? [p[k], v] : [...p[k], v] } : { ...p, [k]: v }, {})),
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