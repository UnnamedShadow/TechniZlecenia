import { BaseElement, html } from "./base"
import type { Fragment } from "./router-view"
export type Bookmark = {
    tab: string,
    content: Fragment[],
}
export default class BookmarkProvider extends BaseElement {
    static override observedAttributes = [...super.observedAttributes, 'bookmarks', 'tabs', 'data', 'base']
    render() {
        if (!this.hasAttribute('bookmarks'))
            return html`loading...`
        if (this.getAttribute('bookmarks') === '[]')
            return html`None`
        return html`<slot></slot>`
    }
    attachCallbacks() {
        const bookmarks = this.getAttribute('bookmarks')
        if (bookmarks === null) {
            const saved = localStorage.getItem('bookmarks')
            this.setAttribute('bookmarks', saved === null ? '[]' : saved)
            return
        }
        const base = this.getAttribute('base') || '[]'
        localStorage.setItem('bookmarks', bookmarks)
        const pure: Bookmark[] = JSON.parse(bookmarks)
        const full = [...(JSON.parse(base) as Bookmark[]).map(b => ({ ...b, base: true })), ...pure.map(p => ({ ...p, base: false }))]
        const tabs = JSON.stringify(pure.map(b => b.tab))
        if (this.getAttribute('tabs') !== tabs) this.setAttribute('tabs', tabs)
        const data = JSON.stringify(full)
        if (this.getAttribute('data') !== data) this.setAttribute('data', data)
    }
}
customElements.define('bookmark-provider', BookmarkProvider)