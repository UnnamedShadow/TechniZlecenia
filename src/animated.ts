import { LitElement } from "lit"
import { property } from "lit/decorators.js"
import { type PropertyDeclaration } from "lit"

export default abstract class AnimatedElement<S extends string[]> extends LitElement {
    // @property(PropertyDeclaration < TypeHint=S > {
    //     reflect: true,
    //     // hasChanged(value, oldValue) {
    //     //     return value.toString() === oldValue.toString()
    //     // },
    // })
    @property({
        state: false,
        attribute: 'states',
        converter: {
            fromAttribute(value, type) {
                if (!value) return
                return JSON.parse(value)
            },
            toAttribute(value) {
                return JSON.stringify(value)
            },
        },
        reflect: true,
        hasChanged(value, oldValue) {
            console.log('update time')
            if (!(value && oldValue)) return false
            return value.toString() !== oldValue.toString()
        }
    } as PropertyDeclaration<S | undefined>)
    abstract states: {
        [I in keyof S]: `${I}is${S[I]}` | `${I}to${S[I]}`
    }
    protected abstract readonly timeouts: {
        [_ in keyof S]: number
    }
    private cancelCallbacks: Array<() => void> = []
    protected async setState<N extends keyof S & number>(n: N, state: S[N]) {
        if (this.isState(n, state)) return
        if (!this.cancelCallbacks.at(n)) this.cancelCallbacks[n] = () => { }
        this.cancelCallbacks[n]()
        this.states = AnimatedElement.replaceAt(this.states, n, `${n}to${state}`)
        let cancelled = false
        this.cancelCallbacks[n] = () => {
            cancelled = true
        }
        await new Promise(resolve => setTimeout(resolve, this.timeouts[n]))
        if (cancelled) return
        this.states = AnimatedElement.replaceAt(this.states, n, `${n}is${state}`)
    }

    protected isState<N extends keyof S & number>(n: N, state: S[N]) {
        return [`${n}is${state}`, `${n}to${state}`].includes(this.states[n])
    }

    private static replaceAt<T, K extends T[], I extends number & keyof K>(arr: K, index: I, value: K[I]) {
        arr[index] = value
        return arr
    }
}