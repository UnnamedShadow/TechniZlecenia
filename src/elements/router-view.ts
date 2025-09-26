import { BaseElement, html } from "./base"
export default class RouterView extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'route', 'json', 'origin'];

    render() {
        const origin = `${this.getAttribute('origin')!}/`
        const route: { name: string, data: string }[] = JSON.parse(this.getAttribute('route')!)
        const json = JSON.stringify(route.reduce(
            (p, { name }, i) =>
                [...p, { href: p.at(-1)!.href + name + '/', text: name + '/', i: i + 1 }],
            [{ href: origin, text: origin, i: 0 }]
        ))
        if (this.getAttribute('json') !== json) this.setAttribute('json', json)
        const data = route.at(-1)?.data
        const current_path = '/' + route.map(({ name }) => name).join('/')
        if (data) this.querySelectorAll(`[slot="${current_path}"]`).forEach(slot => {
            Object.entries(data).forEach(([key, value]) => {
                this.getAttribute(`$${key}`)?.split(';').forEach(partial => {
                    const [path, name] = partial.split('%')
                    slot.querySelectorAll(path).forEach(el => {
                        el.setAttribute(name, JSON.stringify(value))
                    })
                })
            })
        })
        return html`
            <slot></slot>
            <slot name="${current_path}"></slot>
        `
    }
    attachCallbacks() { }
    prev() {
        const route: { name: string, data: string }[] = JSON.parse(this.getAttribute('route')!)
        this.setAttribute('route', JSON.stringify(route.slice(0, -1)))
    }
    next(name: string, data: string) {
        const route: { name: string, data: string }[] = JSON.parse(this.getAttribute('route')!)
        this.setAttribute('route', JSON.stringify([...route, { name, data }]))
    }
    to(count: number) {
        console.log(count)
        const route: { name: string, data: string }[] = JSON.parse(this.getAttribute('route')!)
        this.setAttribute('route', JSON.stringify(route.slice(0, count)))
    }
}
customElements.define('router-view', RouterView)
