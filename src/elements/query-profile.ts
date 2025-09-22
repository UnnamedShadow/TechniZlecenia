import { API } from "../consts"
import { BaseElement, html } from "./base"
export default class QueryProfile extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'jwt', 'username', 'email', 'id', 'loaded'];
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
        const response = fetch(`${API}/user/${sub}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        response.catch((err) => window.alert(err))
        response.then(res => res.json()).then(res => {
            this.setAttribute('username', res.username)
            this.setAttribute('email', res.email)
            this.setAttribute('id', sub.toString())
            this.toggleAttribute('loaded', true)
        })
    }
}
customElements.define('query-profile', QueryProfile)
