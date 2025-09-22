import TemplateList from "./template-list"

type Order = {
    order_id: number
    user_id: number,
    order_name: string,
    order_desc: string, ///???
    price: number,
    image_urls: [String],
    created_at: Date,
}
export default class OrderList extends TemplateList<Order> {
    each(item: Order) {
        return {
            order_id: `${item.order_id}`,
            user_id: `${item.user_id}`,
            order_name: `${item.order_name}`,
            price: `${item.price}`,
            image_urls: `${item.image_urls}`,
            created_at: `${item.created_at}`,
        }
    }
}
customElements.define('order-list', OrderList)