import TemplateList from "./template-list"

export type Order = {
    order_id: number
    user_id: number,
    order_name: string,
    order_desc: string, //description
    price: number,
    image_urls: String[],
    created_at: Date,
}
export default class OrderList extends TemplateList<Order> {
    each(item: Order) {
        return {
            data: {
                order_id: `${item.order_id}`,
                user_id: `${item.user_id}`,
                name: `${item.order_name}`,
                description: `${item.order_desc}`,
                price: `${item.price}`,
                image_urls: JSON.stringify(item.image_urls),
                created_at: `${item.created_at}`,
            }, key: item.order_id.toString()
        }
    }
}
customElements.define('order-list', OrderList)