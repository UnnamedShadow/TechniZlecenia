type HTMLTemplate = {
    html: string
    elements: { [id: string]: HTMLElement[] }
}

export abstract class BaseElement extends HTMLElement {
    static observedAttributes: string[] = []
    shadow?: ShadowRoot

    connectedCallback() {
        (this.constructor as typeof BaseElement).observedAttributes.forEach(attr => {
            const syncPaths = this.getAttribute(`@${attr}`)
            if (syncPaths) this.syncAttribute(this.getAttribute(attr), syncPaths)
        })
        this.shadow = this.attachShadow({ mode: 'closed' })
        this.rerender()
    }

    syncAttribute(value: string | null, paths: string) {
        paths.split(';').forEach(path => {
            const [id, attr] = path.split('%');
            (this.getRootNode() as Document | ShadowRoot).querySelectorAll(id).forEach(
                elem => {
                    if (value === null)
                        elem?.removeAttribute(attr)
                    else
                        elem?.setAttribute(attr, value)
                })
        })
    }
    private rerender() {
        const rendered = this.render()
        this.shadow!.innerHTML = rendered.html
        this.shadow!.querySelectorAll('slot').forEach(slot => {
            if (slot.name[0] !== '_') return
            const id = slot.name.slice(1)
            const elem = rendered.elements[id]
            elem.forEach(e => {
                e.slot = `_${id}`
                this.append(e)
            })
        })
        this.attachCallbacks()
    }
    disconnectedCallback() { }
    connectedMoveCallback() { }
    adoptedCallback() { }
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        const syncPaths = this.getAttribute(`@${name}`)
        if (syncPaths) this.syncAttribute(newValue, syncPaths)
        this.rerender()
    }
    abstract render(): HTMLTemplate
    abstract attachCallbacks(): void

    constructor() {
        super()
    }
}

export function html(strings: TemplateStringsArray, ...values: ({ id: string, elem: HTMLElement[] } | HTMLTemplate | string)[]): HTMLTemplate {
    const elements = values.length ? values.reduce((p, c, _) => {
        const v = c
        if (typeof v === 'string') return p
        if ('html' in v) return { ...p, ...v.elements }
        return { ...p, [v.id]: v.elem }
    }, {} as { [id: string]: HTMLElement[] }) : {}
    const html: string = strings.length > 1 ? strings.slice(1).reduce((p, c, i) => {
        const v = values[i]
        if (typeof v === 'string') return p.concat(v, c)
        if ('html' in v) return p.concat(v.html, c)
        return p.concat(`<slot name="_${v.id}"></slot>`, c)
    }, strings[0]) : strings[0]
    return { html, elements }
}
