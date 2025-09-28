import { BaseElement, html } from "./base"
export type Fragment = { name: string, data: { [key: string]: unknown }, type: string }
export default class RouterView extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'route', 'json', 'origin'];
    private elements: { [href: string]: HTMLElement[] } = {}
    render() {
        const fragments: { data: Fragment, href: string }[] = (JSON.parse(this.getAttribute('route')!) as Fragment[]).reduce(
            (p, c) => [...p, { data: c, href: p.at(-1)!.href + c.name }],
            [{ href: '/', data: JSON.parse(this.getAttribute('origin')!) }]
        )
        const json = JSON.stringify(fragments.map(({ href, data: { name } }, i) => ({ href, text: name, i })))
        if (this.getAttribute('json') !== json) this.setAttribute('json', json)
        Object.keys(this.elements).forEach(href => {
            if (href in fragments.map(f => f.href)) return
            this.elements[href].forEach(el => el.remove())
            delete this.elements[href]
        })
        const current = fragments.at(-1)!
        if (!(current.href in this.elements)) {
            this.elements[current.href] = Array.from(this.children).filter(c => c.getAttribute('slot') === current.data.type).map(c => c.cloneNode(true) as HTMLElement)
        }
        const passthrough = Object.fromEntries((this.getAttribute('passthrough') || '').split(';').map(p => [p, this.getAttribute(p)]))
        Object.entries({ ...current.data, ...passthrough }).forEach(([k, v]) => {
            const mapping = this.getAttribute(`$${k}`)
            if (!mapping) return
            const stringified = JSON.stringify(v)
            mapping.split(';').forEach(partial => {
                const [path, name] = partial.split('%')
                this.elements[current.href].forEach(el => {
                    (path ? el.querySelectorAll(path) : [el]).forEach(
                        item => {
                            const current = item.getAttribute(name)
                            if (current !== stringified)
                                item.setAttribute(name, stringified)
                        }
                    )
                })
            })
        })
        this.elements[current.href].forEach(el => {
            el.toggleAttribute('current', true)
        })
        return html`
            <slot></slot>
            ${{ id: current.href, elem: this.elements[current.href] }}
        `
    }
    attachCallbacks() { }
    prev() {
        this.dispatchEvent(new Event('change'))
        const routes: Fragment[] = JSON.parse(this.getAttribute('route')!)
        this.setAttribute('route', JSON.stringify(routes.slice(0, -1)))
    }
    next(route: Fragment) {
        this.dispatchEvent(new Event('change'))
        const routes: Fragment[] = JSON.parse(this.getAttribute('route')!)
        this.setAttribute('route', JSON.stringify([...routes, route]))
    }
    to(count: number) {
        this.dispatchEvent(new Event('change'))
        const routes: Fragment[] = JSON.parse(this.getAttribute('route')!)
        this.setAttribute('route', JSON.stringify(routes.slice(0, count)))
    }
}
customElements.define('router-view', RouterView)
