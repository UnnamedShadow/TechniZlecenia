import { API } from "../consts"
import { Debouncer, handled, log } from "../form-utils"
import { BaseElement, html } from "./base"
export default class QueryProfile extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'jwt', 'username', 'email', 'id', 'loaded'];
    debouncer = new Debouncer<{ sub: number }, { ok: boolean, text: string, sub: number }>(async ({ sub }) => {
        const response = await handled(fetch(`${API}/user/${sub}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }), 'network')
        return { ok: response.ok, text: await handled(response.text(), 'response'), sub }
    }, ({ ok, text, sub }) => {
        if (!ok) log(text, 'data')
        else {
            const { username, email } = JSON.parse(text)
            this.setAttribute('username', username)
            this.setAttribute('email', email)
            this.setAttribute('id', sub.toString())
        }
        this.toggleAttribute('loaded', true)
    })
    render() {
        if (this.hasAttribute('loaded'))
            return html`<slot></slot>`
        else
            return html`
                <iframe src="https://giphy.com/embed/RgzryV9nRCMHPVVXPV" width="200" height="200" style="" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
                <p><a href="https://giphy.com/gifs/trippy-abstract-pi-slices-RgzryV9nRCMHPVVXPV">loader via GIPHY</a></p>
            `
    }
    attachCallbacks() {
        if (this.hasAttribute('loaded') || !this.hasAttribute('jwt')) return
        const { sub }: { sub: number } = JSON.parse(atob(this.getAttribute('jwt')!.split('.')[1]))
        this.debouncer.run({ sub }, { delay_before: 50, delay_after: 500, memoize: true })
    }
    update() {
        this.toggleAttribute('loaded', false)
    }
}
customElements.define('query-profile', QueryProfile)
