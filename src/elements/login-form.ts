import { API } from "../consts"
import { Debouncer, handled, log } from "../form-utils"
import { BaseElement, html } from "./base"
export default class LoginForm extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'jwt', 'logged-out', 'registering'];
    private debouncer = new Debouncer<{ isRegistering: boolean, body: string }, { text: string, isRegistering: boolean, ok: boolean }>(
        async ({ isRegistering, body }) => {
            const response = await handled(fetch(`${API}/user/${isRegistering ? 'register' : 'login'}`, {
                method: 'POST',
                body,
                headers: {
                    'Content-Type': 'application/json'
                }
            }), 'network')
            return { text: await handled(response.text(), 'response'), isRegistering, ok: response.ok }
        }, ({ text, isRegistering, ok }) => {
            if (!ok) {
                log(text, 'data')
                return
            }
            if (isRegistering) {
                this.toggleAttribute('registering', false)
            } else {
                localStorage.setItem('jwt', text)
                this.setAttribute('jwt', text)
                this.toggleAttribute('logged-out', false)
            }
        })
    render() {
        return this.hasAttribute('logged-out') ? html`
            <slot name="${this.hasAttribute('registering') ? 'register' : 'login'}"></slot>
        `: html``
    }
    attachCallbacks() {
        if (!this.hasAttribute('jwt') && !this.hasAttribute('logged-out'))
            this.tryRestoringJWT()
        if (!this.hasAttribute('logged-out')) return
        this.removeAttribute('jwt')
        const form = this.querySelector(`form[slot="${this.hasAttribute('registering') ? 'register' : 'login'}"]`) as HTMLFormElement | null
        if (!form) return
        const isRegistering = this.hasAttribute('registering')
        form.addEventListener('submit', async (e) => {
            e.preventDefault()
            const body = JSON.stringify(Object.fromEntries(new FormData(form).entries()))
            this.debouncer.run({ isRegistering, body })
        })
    }

    private tryRestoringJWT() {
        const jwt = localStorage.getItem('jwt')
        if (jwt === null) this.toggleAttribute('logged-out', true)
        else {
            this.setAttribute('jwt', jwt)
            this.toggleAttribute('logged-out', false)
        }
    }
}
customElements.define('login-form', LoginForm)
