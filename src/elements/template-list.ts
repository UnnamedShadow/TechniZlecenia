import { BaseElement } from "./base"
export default abstract class TemplateList<T> extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'data'];
    render() {
        const list = JSON.parse(this.getAttribute('data')!) as T[]
        console.log(list)
        return {
            html: list.map(() => '<slot></slot>').join(''),
            elements: {}
        }
    }
    attachCallbacks() {
        const list = JSON.parse(this.getAttribute('data')!) as T[]
        this.shadow!.querySelectorAll('slot').forEach((slot, i) => {
            const item = this.each(list[i])
            console.log(slot, item, i)
            Object.entries(item).forEach(([key, value]) => {
                const [path, attr] = this.getAttribute(`$${key}`)!.split('%');
                (slot.assignedElements() as HTMLElement[])
                    .flatMap(e => Array.from(e.querySelectorAll(path))! as HTMLElement[])
                    .forEach(elem => elem.setAttribute(attr, value))
            })
        })
    }
    abstract each(item: T): { [key: string]: string }
}
