import TemplateList from "./template-list"

export default class ImageList extends TemplateList<string> {
    each(item: string) {
        return {
            data: { src: item },
            key: item,
        }
    }
}
customElements.define('image-list', ImageList)