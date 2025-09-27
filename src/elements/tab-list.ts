import TemplateList from "./template-list"

export default class TabList extends TemplateList<string> {
    each(item: string) {
        return {
            data: { text: item, value: `-${item}` },
            key: item,
        }
    }
}
customElements.define('tab-list', TabList)