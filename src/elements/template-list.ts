import { BaseElement, html } from "./base"
export default abstract class TemplateList<T> extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'data'];
    protected elements: { [key: string]: HTMLElement[] } = {}
    render() {
        const current_keys = Object.keys(this.elements)
        const list = (JSON.parse(this.getAttribute('data')!) as T[]).map(this.each)
        current_keys.forEach(key => {
            if (!(key in list.map(l => l.key))) {
                this.elements[key].forEach(el => {
                    el.remove()
                })
                delete this.elements[key]
            }
        })
        list.forEach(({ data, key }) => {
            if (!(key in this.elements))
                this.elements[key] = Array.from(this.children).filter(c => c.getAttribute('slot') === 'item').map(c => c.cloneNode(true) as HTMLElement)
            Object.entries({ ...data, datum: JSON.stringify(data) }).forEach(([k, v]) => {
                const mapping = this.getAttribute(`$${k}`)
                if (!mapping) return
                mapping.split(';').forEach(partial => {
                    const [path, name] = partial.split('%')
                    this.elements[key].forEach(el => {
                        (path ? el.querySelectorAll(path) : [el]).forEach(
                            item => {
                                const current = item.getAttribute(name)
                                if (current !== v)
                                    item.setAttribute(name, v)
                            }
                        )
                    })
                })
            })
        })
        return list.reduce((p, { key }) => {
            return html`${p}${{ id: key, elem: this.elements[key] }}`
        }, html``)
    }
    attachCallbacks() { }
    abstract each(item: T): { data: { [key: string]: string }, key: string }
}
