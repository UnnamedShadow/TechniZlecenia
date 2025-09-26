import { howShouldLog, memoizeAnything } from "./consts"

export async function formToBody(form: HTMLFormElement, start?: any): Promise<{ [key: string]: string | string[] }> {
    const data = new FormData(form)
    return (await Promise.all(Array.from(data).map(async ([k, v]) => {
        if (typeof v !== 'string') return [
            k,
            btoa(new Uint8Array(await v.arrayBuffer()).reduce((p, c) => p.concat(String.fromCodePoint(c)), '')) || undefined
        ]
        try {
            return [k, JSON.parse(v)]
        } catch {
            return [k, v]
        }
    }))).reduce((p: { [key: string]: string | string[] }, [k, v]) =>
        v === undefined ? p :
            k in p ? { ...p, [k]: typeof p[k] === 'string' ? [p[k], v] : [...p[k], v] } :
                { ...p, [k]: v }, start || {})
}

export class Debouncer<Params, Data> {
    private query
    private update
    constructor(query: (params: Params) => Promise<Data>, update: (data: Data) => void) {
        this.query = query
        this.update = update
    }
    private key?: Params
    private result?: Data
    async run(params: Params, config?: { delay_before?: number, delay_after?: number, memoize?: boolean }) {
        if (this.key === params) return
        this.key = params
        if (config && config.delay_before) {
            await new Promise(resolve => setTimeout(resolve, config.delay_before))
            if (this.key !== params) return
        }
        const data = await this.query(params)
        if (memoizeAnything && config && config.memoize) {
            if (this.result === data) return
            this.result = data
        }
        if (this.key !== params) return
        this.update(data)
        if (config && config.delay_after) await new Promise(resolve => setTimeout(resolve, config.delay_after))
        this.key = undefined
    }
}

export function log(e: any, type: string) {
    const message = howShouldLog[type] !== undefined ? howShouldLog[type] : howShouldLog.default
    if (message !== null) {
        alert(`${message} - ${e}`)
        console.error(e)
    } else {
        console.warn(e)
    }
}

export function handled<T>(data: Promise<T>, type: string): Promise<T> {
    data.catch(e => log(e, type))
    return data
}

export function invokeUpdates(toUpdate: string | null, rootNode: Node) {
    if (!toUpdate) return
    toUpdate.split(';').forEach(path => {
        const [id, attr] = path.split('%');
        (rootNode as Document | ShadowRoot).querySelectorAll(id).forEach(elem => {
            const method = (elem as any)[attr]
            if (typeof method === 'function')
                method.call(elem)
            else
                console.error(`No such function ${attr} in ${elem.tagName} of ${id}`)
        })
    })
}