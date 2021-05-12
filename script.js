'use strict'

function selectMode(modeName) {
    console.log('Selecting mode ' + modeName)

    let target = document.querySelector('#' + modeName)
    if (!target) {
        throw 'selectMode: target element not found'
    }
    target.classList.remove('hidden')

    let toHide = document.querySelectorAll('.js-hide-after-selecting-mode')
    toHide.forEach(node => {
        node.classList.add('hidden')
    })
}
