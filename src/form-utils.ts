export async function formToBody(form: HTMLFormElement): Promise<{ [key: string]: string | string[] }> {
    const data = new FormData(form)
    return (await Promise.all(Array.from(data).map(async ([k, v]) => {
        if (typeof v !== 'string') return [k, btoa(new Uint8Array(await v.arrayBuffer()).reduce((p, c) => p.concat(String.fromCodePoint(c)), ''))]
        try {
            return [k, JSON.parse(v)]
        } catch {
            return [k, v]
        }
    }))).reduce((p: { [key: string]: string | string[] }, [k, v]) =>
        k in p ? { ...p, [k]: typeof p[k] === 'string' ? [p[k], v] : [...p[k], v] } : { ...p, [k]: v }, {})
}