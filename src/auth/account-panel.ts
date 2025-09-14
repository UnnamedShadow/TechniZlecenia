import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import AnimatedElement from '../animated'

@customElement('account-panel')
export class AccountPanel extends AnimatedElement<['open' | 'closed']> {
  timeouts = [500] as [number]
  states = ['0isopen'] as ['0isopen']

  public toggle() {
    this.setState(0, this.isState(0, 'open') ? 'closed' : 'open')
  }

  render() {
    return html`
      <h1>Your account</h1>`
  }

  static styles = css`
    :host {
      transition-property: max-width, padding;
      transition-duration: 0.5s;
      &[states*=open] {
        max-width: 1280px;
        padding: 2rem;
      }
      &[states*=closed] {
        max-width: 0px;
        padding: 0rem;
        color: red;
      }


      margin: 0 auto;
      text-align: center;
    }
  `
}
