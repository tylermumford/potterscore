import { gsap, TimelineMax } from './gsap-core.js'
import * as CssPlugin from './gsap-css-plugin.js'

gsap.registerPlugin(CssPlugin)

/**
 * A golden snitch will fly around the screen at certain
 * intervals. It won't appear immediately, and it won't
 * stick around for long. */
class GoldenSnitch extends HTMLElement {
    /** @property {ShadowRoot} root */
    root

    isAnimated = false

    static get observedAttributes() { return ['class'] }

    constructor() {
        super()

        this.root = this.attachShadow({ mode: 'closed' })
        this.root.innerHTML = html

        const style = document.createElement('style')
        style.textContent = styleContent
        this.root.append(style)

        this.maybeBeginAnimation()
    }

    attributeChangedCallback() {
        this.maybeBeginAnimation()
    }

    maybeBeginAnimation() {
        if (this.isAnimated || this.classList.contains('hidden')) {
            return
        }
        this.beginAnimation()
    }

    beginAnimation() {
        console.log('Animating the snitch')

        const snitchInitialDelay = 2 * 60 // 2 minutes
        const snitchVisibleDuration = 5 // 5 seconds
        const snitchReappearInterval = 3 * 60 // 3 minutes

        const flyingTimeline = new TimelineMax()
        const movingTimeline = new TimelineMax({ repeat: -1 })
        const appearingTimeline = new TimelineMax({
            repeat: -1,
            repeatDelay: snitchReappearInterval
        })

        const snitch = this.root.querySelector('#snitch')

        const fly = () => {
            const leftWing = this.root.querySelector('#leftwing')
            flyingTimeline.to(leftWing, 0.06, {
                rotation: -35,
                yoyo: true,
                transformOrigin: "right",
                repeat: -1
            })

            const rightWing = this.root.querySelector('#rightwing')
            flyingTimeline.to(rightWing, 0.06, {
                rotate: 35,
                yoyo: true,
                transformOrigin: "left",
                repeat: -1
            })

            flyingTimeline.to(snitch, 1, {
                y: -10,
                ease: "linear",
                yoyo: true,
                repeat: -1
            })
        }

        const moveSnitchRandomly = (e) => {
            movingTimeline.to(snitch, 1, {
                x: Math.floor(Math.random() * window.innerWidth),
                y: Math.floor(Math.random() * window.innerHeight),
                onComplete: function () {
                    this.vars.x = Math.floor(Math.random() * window.innerWidth)
                    this.vars.y = Math.floor(Math.random() * window.innerHeight)
                    this.invalidate()
                }
            })
        }

        const appearAndDisappear = () => {
            appearingTimeline.set(snitch, {
                opacity: 0
            })
            appearingTimeline.to(snitch, {
                duration: 0.340,
                opacity: 1
            }, snitchInitialDelay)
            appearingTimeline.to(snitch, {
                duration: 0.680,
                opacity: 0,
            }, `+=${snitchVisibleDuration}`)
        }

        // start flying and moving

        fly()
        moveSnitchRandomly()
        appearAndDisappear()

        this.isAnimated = true
    }
}

const html = `
<svg id="snitch" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="308.89px" height="99.76px" viewBox="0 0 617.78 199.52" style="enable-background:new 0 0 617.78 199.52;" xml:space="preserve">
<style type="text/css">
    .st0 {
    fill: #DAA621;
    }
</style>
<defs>
</defs>
<path id="leftwing" class="st0" d="M228.02,97.17c-9.21,4.19-12.49,3.48-18.36-3.98v0c-5.88-7.47-5.34-17.87,1.63-31.34
c2.04-3.94,3.16-7.71,2.5-8.37c-3.43,1.36-15.1,27.93-19.46,29.68c-9.06,7.85-29.66,3.65-40.72-4.04
c10.64-0.11,61.16-36.65,59.49-38.93c-6.57,2.14-54.41,37.55-61.6,34.21c-21.57,2.43-32.11-4.49-11.78-7.74
c8.04-1.19,68.97-29.63,72.39-34.68c-15.16,3.79-87.59,42.12-98.19,32.12c-10-2.51-7.49-5.74,5.46-7.03
c12.21-0.36,68.25-24.31,79.6-26.17c4.51-0.73,8.19-2.32,8.19-3.54c-2.83-6.74-106.93,40.15-120.67,23.62
c-4.16-2.42-2.71-3.08,9.96-4.52c16.61-1.39,76.33-20.99,92.29-23.57c9.07-1.52,10.23-2.12,4.5-2.34
c-38.75,4.6-127.76,37.62-152.95,11.66c40.98,2.16,104.8-10.85,145.69-16.63C134.71,12.79,43.24,45.64,5.38,15.15
c-5.52-4.91-6.86-7.06-3.69-5.92C74.71,44.94,244.8-53.38,229.97,45.79c-0.39,19,0.42,26.42,3.33,30.87
C238.3,84.28,235.9,93.58,228.02,97.17" />
<path id="rightwing" class="st0" d="M385.24,98.25c-7.17-11.99,6.15-12.26,3.2-45.74c-0.64-20.72-0.09-24.48,4.48-30.67
c12.31-16.69,26.19-17.52,95.66-5.74c57.6,9.77,104.16,11.45,120.17,4.33c12.42-5.52,11.9-1.19-0.87,7.26
c-11.6,17.4-125.43,0.17-159.86-3.86c-6.56,0.28-6.88,0.52-1.78,1.33c3.42,0.54,21.36,3.91,39.85,7.49
c27.09,7.11,69.76,5.6,89.65,8.69c-29.58,26.43-117.48-12.23-160.63-12.81c29.9,4.01,71.53,20.15,101.44,24.93
c20.46,2.9,22.76,4.02,12.79,6.25C504.22,75.01,420.5,27.85,408.89,35.75c0,1.48,2.84,2.69,6.31,2.69
c10.08,0.51,73.17,26.89,83.98,26.82c12.95,1.32,15.45,4.55,5.46,7.06c-12.81,3.22-28.86-1.08-60.23-16.14
c-43.53-20.89-46.87-19.29-4.55,2.18c18.9,9.59,37.53,17.43,41.4,17.43c27.34,2.9-18.06,19.58-49.94-10.96
c-14.31-11.18-24.69-17.48-26.25-15.93c4.72,5.86,42.74,35.84,59.87,38.54c-19.99,10.89-41.48,15.72-53.32-13.52
c-14.31-28.16,0.46,11.02,3.42,19.04c-5.03,7.83-13.8,18.34-23.01,13.58" />
<g id="body">
    <path class="st0" d="M300.54,199.23c-18.46-22.41-19.87-79.89-56.98-89.3c-7.02-1.54-7.69-2.44-6.21-8.33
    c2.28-9.1,2.28-9.1,18.59-8.29c13.81,0.68,14.95,0.28,23.27-8.29c4.81-4.95,11.93-15.1,15.82-22.55
    c5.88-11.26,8.2-13.55,13.74-13.55c19.51,1.12,19.13,54.93,63.07,42.17c-37.05,28.43-66.63,41.48-111.97,11.33
    c-17.62-10.61-21.31-9.92-4.53,0.85c77.72,56.6,122.83-33.22,125.22-0.65c0,4.42-1.36,6.08-4.98,6.08
    c-25.54,10.69-29.92,28.84-44.97,70.98c-3.04,9.59-5.66,17.59-5.81,17.77C323.78,198.68,303.84,200.16,300.54,199.23L300.54,199.23
    z" />
    <path class="st0" d="M274.24,190.69c-11.33-5.61-21.34-14.96-11.98-11.19c4.29,2.44,27.01,5.9,28.2,12.16
    C291.53,197.23,286.89,196.95,274.24,190.69L274.24,190.69z" />
    <path class="st0" d="M328.3,193.99c-2.46-8.09,26.08-15.81,31.7-14.55C361.49,179.97,330.64,201.33,328.3,193.99z" />
    <path class="st0" d="M270.85,179.57c-15.9-5.58-30.81-18.16-32.69-31.35c9,4.93,20.25,10.07,30.86,11.56
    c11.02,1.65,11.82,2.32,15.36,12.69C288.6,184.84,288.36,184.96,270.85,179.57z" />
    <path class="st0" d="M334.55,175.64c4.93-15.8,5.52-16.42,16.86-17.7c8.71-0.1,22.26-7.36,28.18-8.72
    c-3.74,14.55-17.41,28.07-37.28,30.61C333.04,181.51,332.77,181.36,334.55,175.64z" />
    <path class="st0" d="M260.72,155.06c-15.19-5.43-27.1-13.97-27.1-19.45c0-3.69,1.12-4.62,4.16-3.45c8.6,3.3,26.14,6.45,28.34,5.09
    c2.46-1.52,12.3,12.97,12.32,18.13C278.45,159.31,272.29,159.2,260.72,155.06L260.72,155.06z" />
    <path class="st0" d="M343.21,153.71c0-5.8,7.58-17.43,10.6-16.27c1.7,0.65,8.98-0.34,16.17-2.21c13.01-3.38,13.08-3.36,13.08,2.42
    C384.21,149.98,342.38,159.74,343.21,153.71z" />
    <path class="st0" d="M241.71,130.49c-7.01-2.25-8.09-3.72-8.09-10.95c0-9.52,1.13-9.86,14.74-4.41
    c8.34,3.34,17.63,12.37,17.63,17.14C266,134.43,250.46,133.3,241.71,130.49z" />
    <path class="st0" d="M353.17,131.58c0-3.93,15.69-18,21.77-19.52c6.88-1.73,10.51,2,10.57,10.84c0.03,4.23-2.1,6.08-9.3,8.08
    C365.04,134.07,353.17,134.38,353.17,131.58L353.17,131.58z" />
    <path class="st0" d="M247.94,89.54c-14.33-2.72,15.93-26.28,25.18-31.65c11.5-5.74,25.25-10.08,25.25-7.95
    c0,3.68-19.17,32.36-24.34,36.43C268.2,90.95,258.07,92.19,247.94,89.54L247.94,89.54z" />
    <path class="st0" d="M347.96,87.65c-9.41-5.26-29.88-34.36-26.53-37.71c14.05-2.16,54.77,29.47,50.34,36.1
    C367.34,90.59,354.74,91.44,347.96,87.65z" />
</g>
</svg>
`

const styleContent = `
#wing {
  transform-origin: left;
}

#leftwing {
  transform: translateX(-15px);
}

#rightwing {
  transform: translateX(15px);
}

#body {
  boxshadow: "0 4px 2px -2px red";
}

#snitch {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
}
`

customElements.define('golden-snitch', GoldenSnitch)
