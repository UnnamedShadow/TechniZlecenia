import { API } from "../consts"
import { Debouncer, handled, log } from "../form-utils"
import { BaseElement, html } from "./base"
export default class QueryProfile extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'jwt', 'username', 'email', 'id', 'loaded'];
    debouncer = new Debouncer<{ jwt: string, method: 'GET' | 'DELETE' }, { method: 'GET' | 'DELETE', ok: boolean, text: string, sub: number }>(
        async ({ jwt, method }) => {
            const { sub }: { sub: number } = JSON.parse(atob(jwt.split('.')[1]))
            const response = await handled(fetch(`${API}/user/${sub}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt,
                }
            }), 'network')
            return { method, ok: response.ok, text: await handled(response.text(), 'response'), sub }
        }, ({ ok, text, sub, method }) => {
            if (!ok) log(text, 'data')
            else {
                if (method === 'GET') {
                    const { username, email } = JSON.parse(text)
                    this.setAttribute('username', username)
                    this.setAttribute('email', email)
                    this.setAttribute('id', sub.toString())
                }
            }
            this.toggleAttribute('loaded', true)
            if (method === 'DELETE') {
                localStorage.removeItem('jwt')
                location.reload()
            }
        })
    render() {
        if (this.hasAttribute('loaded'))
            return html`<slot></slot>`
        else
            return html`Loading...`
    }
    attachCallbacks() {
        if (this.hasAttribute('loaded') || !this.hasAttribute('jwt')) return
        this.debouncer.run({ jwt: this.getAttribute('jwt')!, method: 'GET' }, { delay_before: 50, delay_after: 500, memoize: true })
    }
    update() {
        this.toggleAttribute('loaded', false)
    }
    delete() {
        if (window.prompt('Are you sure? (type \'Yes\')', 'No') === 'Yes')
            this.debouncer.run({ jwt: this.getAttribute('jwt')!, method: 'DELETE' }, { delay_after: 200 })
    }
}
customElements.define('query-profile', QueryProfile)
