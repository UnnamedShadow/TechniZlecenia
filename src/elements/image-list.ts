import TemplateList from "./template-list"

export default class ImageList extends TemplateList<string> {
    each(item: string) {
        return {
            src: item,
        }
    }
}
customElements.define('image-list', ImageList)