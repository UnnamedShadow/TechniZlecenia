import { BaseElement, html } from "./base"
export default class RouterView extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'route', 'data', 'json', 'origin'];

    render() {
        return html`
            <slot></slot>
            <slot name="${this.getAttribute('route')!}"></slot>
        `
    }
    attachCallbacks() {
        const origin = `${this.getAttribute('origin')!}/`
        const json = JSON.stringify(
            this.getAttribute('route')!
                .split('/')
                .slice(1, -1)
                .reduce((p, c) => [...p, { href: (p.at(-1)?.href || '') + c + '/', text: c + '/' }], [{ href: origin, text: origin }])
        )
        if (this.getAttribute('json') !== json) this.setAttribute('json', json)
        const raw_data = this.getAttribute('data')
        if (!raw_data) return
        const data = JSON.parse(raw_data)
        this.querySelectorAll(`[slot="${this.getAttribute('route')}"]`).forEach(slot => {
            Object.entries(data).forEach(([key, value]) => {
                this.getAttribute(`$${key}`)?.split(';').forEach(partial => {
                    const [path, name] = partial.split('%')
                    slot.querySelectorAll(path).forEach(el => {
                        el.setAttribute(name, JSON.stringify(value))
                    })
                })
            })
        })
    }
    setLocation(route: string, data: string) {
        this.setAttribute('route', route)
        this.setAttribute('data', data)
    }
    addLocation(route: string, data: string) {
        this.setAttribute('route', this.getAttribute('route')! + route)
        this.setAttribute('data', data)
    }
}
customElements.define('router-view', RouterView)
