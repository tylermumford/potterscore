const content = `
<p>Instructions:</p>

<ol>
  <li>Open two browser windows, and navigate to this page in both of them. One device, one browser, two windows.</li>
  <li>Choose "Enter scores" in one window, and choose "View scores" in the other window.</li>
  <li>The scores will be linked in all open windows. The "View scores" window can be displayed on a TV, for example.</li>
</ol>

<p>Notes:</p>

<ul>
  <li>The "View scores" window currently only looks right when the browser window has a 16x9 aspect ratio. Working on it. :)</li>
  <li>Scores are saved, even if the computer restarts. But they're not online, so different devices and different browsers won't have linked scores.</li>
  <li>To change a window from "View scores" to "Enter scores" or vice versa, reload the page.</li>
  <li>You may see a surprise every few minutes.</li>
</ul>
`

class Instructions extends HTMLElement {
  constructor() {
    super()
    this.innerHTML = content
  }
}

customElements.define('app-instructions', Instructions)