import { API } from "../consts"
import { BaseElement, html } from "./base"
export default class LoginForm extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'jwt', 'logged-out', 'registering'];

    render() {
        return this.hasAttribute('logged-out') ? html`
            <slot name="${this.hasAttribute('registering') ? 'register' : 'login'}"></slot>
        `: html``
    }
    attachCallbacks() {
        if (!this.hasAttribute('jwt') && !this.hasAttribute('logged-out'))
            this.tryRestoringJWT()
        if (!this.hasAttribute('logged-out')) return
        const form = this.querySelector(`form[slot="${this.hasAttribute('registering') ? 'register' : 'login'}"]`) as HTMLFormElement | null
        if (!form) return
        const isRegistering = this.hasAttribute('registering')
        form.addEventListener('submit', async (e) => {
            e.preventDefault()
            const data = new FormData(form)
            const response = await fetch(`${API}/user/${isRegistering ? 'register' : 'login'}`, {
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(data.entries())),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                alert(await response.text())
                return
            }
            if (isRegistering) {
                this.toggleAttribute('registering', false)
            } else {
                const jwt = await response.text()
                localStorage.setItem('jwt', jwt)
                this.setAttribute('jwt', jwt)
                this.toggleAttribute('logged-out', false)
            }
        })
    }

    tryRestoringJWT() {
        const jwt = localStorage.getItem('jwt')
        if (jwt === null) this.toggleAttribute('logged-out', true)
        else {
            this.setAttribute('jwt', jwt)
            this.toggleAttribute('logged-out', false)
        }
    }
}
customElements.define('login-form', LoginForm)
