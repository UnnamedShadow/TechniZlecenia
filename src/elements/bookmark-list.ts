import type { Bookmark } from "./bookmark-provider"
import TemplateList from "./template-list"

export default class BookmarkList extends TemplateList<Bookmark> {
    each(item: Bookmark) {
        return {
            data: {
                route: JSON.stringify(item.content),
                slot: item.tab,
            },
            key: item.tab,
        }
    }
}
customElements.define('bookmark-list', BookmarkList)