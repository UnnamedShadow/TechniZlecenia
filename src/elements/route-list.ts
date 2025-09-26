import TemplateList from "./template-list"

export type Elem = { href: string, text: string }
export default class RouteList extends TemplateList<Elem> {
    each(item: Elem) {
        return { href: item.href, text: item.text }
    }
}
customElements.define('route-list', RouteList)