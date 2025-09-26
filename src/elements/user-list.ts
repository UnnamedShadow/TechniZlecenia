import TemplateList from "./template-list"

type User = {
    user_id: number,
    username: string,
    email: string,
    created_at: Date,
}

export default class UserList extends TemplateList<User> {
    each(item: User) {
        return {
            data: {
                'id': item.user_id.toString(),
                'name': item.username,
                'email': item.email,
                'created_at': item.created_at.toString(),
            }, key: item.user_id.toString()
        }
    }
}

customElements.define('user-list', UserList)