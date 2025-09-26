import TemplateList from "./template-list"

export type Offer = {
    offer_id: number,
    order_id: number
    user_id: number,
    status: 'pending' | 'accepted' | 'declined',
    created_at: Date,
}
export default class OfferList extends TemplateList<Offer> {
    each(item: Offer) {
        return {
            offer_id: item.offer_id.toString(),
            order_id: item.order_id.toString(),
            user_id: item.user_id.toString(),
            status: item.status,
            created_at: item.created_at.toString(),
        }
    }
}
customElements.define('offer-list', OfferList)