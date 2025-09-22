import TemplateList from "./template-list"

export default class OrderList extends TemplateList<string> {
    each(item: string) {
        return {
            src: item,
        }
    }
}
customElements.define('order-list', OrderList)