import { BaseElement, html } from "./base"
export default abstract class TemplateList<T> extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'data'];
    protected elements: HTMLElement[][] = []
    render() {
        const list = JSON.parse(this.getAttribute('data')!) as T[]
        while (this.elements.length < list.length) {
            this.elements.push(Array.from(this.querySelectorAll('[slot=item]')).map(c => c.cloneNode(true) as HTMLElement))
        }
        return this.elements.reduce((p, c, i) => {
            return html`${p}${{ id: i.toString(), elem: c }}`
        }, html``)
    }
    attachCallbacks() {
        const list = JSON.parse(this.getAttribute('data')!) as T[]
        this.elements.forEach((c, i) => {
            Object.entries(this.each(list[i])).forEach(([attr, value]) => {
                const mapping = this.getAttribute(`$${attr}`)
                if (mapping === null) return
                mapping.split(';').forEach(partial => {
                    const [path, name] = partial.split('%')
                    c.forEach(elem => {
                        if (path === '')
                            elem.setAttribute(name, value)
                        else
                            elem.querySelectorAll(path).forEach(el => {
                                el.setAttribute(name, value)
                            })
                    })
                })
            })
        })
    }
    abstract each(item: T): { [key: string]: string }
}
