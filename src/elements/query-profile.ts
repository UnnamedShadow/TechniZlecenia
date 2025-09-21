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
        fetch(`${API}/user/${this.getAttribute('jwt')!}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(res => {
            this.setAttribute('username', res.username)
            this.setAttribute('email', res.email)
            this.setAttribute('id', res.id)
            this.toggleAttribute('loaded', true)
        })
    }
}
customElements.define('query-profile', QueryProfile)
