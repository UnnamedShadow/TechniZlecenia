import TemplateList from "./template-list"

export type Elem = { href: string, text: string }
export default class RouteList extends TemplateList<Elem> {
    each(item: Elem) {
        return { data: { href: item.href, text: item.text }, key: item.href }
    }
}
customElements.define('route-list', RouteList)