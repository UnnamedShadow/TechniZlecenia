import { BaseElement, html } from "./base"
import anonIcon from "../assets/person_off_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"

export default class ProfilePicture extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'jwt'];

    render() {
        const jwt = this.getAttribute('jwt')
        if (jwt === null)
            return html`
                <img src="${anonIcon}" />
                <span>?</span>
                <style>
                    * {
                        color: #e3e3e3;
                    }
                </style>
            `
        const { sub }: { sub: number } = JSON.parse(atob(jwt.split('.')[1]))
        return html`
            <img src="https://api.dicebear.com/9.x/bottts/webp?seed=${sub.toString()}" width="35px" height="35px"/>
        `
    }
    attachCallbacks(): void {
    }
}
customElements.define('profile-picture', ProfilePicture)