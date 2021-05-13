'use strict'

const keyPrefix = 'potterscore-'
const keys = ['slytherin', 'ravenclaw', 'gryffindor', 'hufflepuff']

/**
 * Un-hides the element with the ID of `modeName` and hides all elements
 * marked with a hook class.
 * @param {string} modeName
 */
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

/**
 * Each binding has a human-readable `name`. Periodically and as needed, the page will be searched
 * for all nodes that match `selector`. Then, `updateNode` will be called and passed each matching
 * node. If `datasetProperty` is defined, each node's property value will be found, which will then
 * be used as a key to look up the stored value (number of house points), which will then be passed
 * to `updateNode` as the second argument.
 */
const bindingDefinitions = [
    {
        name: 'innerText',
        selector: '[data-bind-inner-text]',
        datasetProperty: 'bindInnerText',
        updateNode: (node, storedValue) => {
            node.innerText = storedValue
        }
    },
    {
        name: 'barHeight',
        selector: '[data-bind-bar-height]',
        datasetProperty: 'bindBarHeight',
        updateNode: (node, storedValue) => {
            const scaleFactor = 1.2
            node.style.height = `${storedValue * scaleFactor}px`
        }
    },
    {
        name: 'value',
        selector: '[data-bind-value]',
        datasetProperty: 'bindValue',
        /** @param {HTMLElement} node  */
        updateNode: (node, storedValue) => {
            node.value = storedValue

            node.addEventListener('change', handleNodeValueChange)
        }
    }
]

/** @param {InputEvent} event */
function handleNodeValueChange(event) {
    let value = Number(event.target.value)
    if (!value && value !== 0) {
        console.warn(`Not a valid number: ${event.target.value}`)
        return
    }

    let key = event.target.dataset[bindingDefinitions.find(d => d.name == 'value').datasetProperty]
    console.log(`Setting [${keyPrefix + key}] to value ${value.toString()}`)
    localStorage.setItem(keyPrefix + key, value.toString())

    updateAllBindings()
}

function handleStorageEvent(event) {
    console.debug('Storage event', event)
    updateAllBindings()
}

function handleResizeEvent() {
    let group1 = document.querySelectorAll('.js-position-1')
    let group2 = document.querySelectorAll('.js-position-2')
    let group3 = document.querySelectorAll('.js-position-3')
    let group4 = document.querySelectorAll('.js-position-4')
    let ratio = window.innerWidth / window.innerHeight
    // Scale factors are pretty much magic numbers that work at the intended aspect ratio of 16x9.
    let gap = 5.8
    let scale1 = 16
    let scale2 = scale1 + gap
    let scale3 = scale2 + gap
    let scale4 = scale3 + gap

    group1.forEach(node => node.style.left = `${ratio * scale1}%`)
    group2.forEach(node => node.style.left = `${ratio * scale2}%`)
    group3.forEach(node => node.style.left = `${ratio * scale3}%`)
    group4.forEach(node => node.style.left = `${ratio * scale4}%`)
}

function updateAllBindings() {
    console.time('updateAllBindings')

    bindingDefinitions.forEach(binding => {
        let nodes = document.querySelectorAll(binding.selector)
        if (nodes.length === 0 || nodes.length % keys.length !== 0) {
            console.warn(`Binding '${binding.name}' was applied to ${nodes.length} found nodes :raised_eyebrow:`)
        }

        nodes.forEach(node => {
            if (!binding.datasetProperty) {
                binding.updateNode(node)
                return
            }

            let providedKey = node.dataset[binding.datasetProperty]
            if (!providedKey) {
                throw `dataset.${binding.datasetProperty} provided no value (no key)`
            }

            let storedValue = localStorage.getItem(keyPrefix + providedKey)
            if (!storedValue) {
                throw `dataset.${binding.datasetProperty}="${providedKey}" did not match a localStorage key`
            }

            binding.updateNode(node, storedValue)
        })
    })

    console.timeEnd('updateAllBindings')
}

/**
 * @param {string} key
 */
function incrementScore(key, amount) {
    if (!amount) {
        let promptMessage = `Add to ${key.charAt(0).toUpperCase()}${key.slice(1)}:`
        let promptResult = prompt(promptMessage, '7')
        if (promptResult === null) {
            return
        }
        amount = Number(promptResult)
    }

    let fullKey = keyPrefix + key
    let currentValue = Number(localStorage.getItem(fullKey))

    localStorage.setItem(keyPrefix + key, currentValue + amount)

    updateAllBindings()
}

/* INITIALIZATION-ONLY FUNCTIONS */

/** Sets each key to 0, unless the key already has a value. */
function initializeData() {
    keys.forEach(key => {
        const fullKey = keyPrefix + key;
        if (localStorage.getItem(fullKey)) {
            return
        }
        localStorage.setItem(fullKey, "0")
    })
}

function initializeEvents() {
    window.addEventListener('storage', handleStorageEvent)
    window.addEventListener('resize', handleResizeEvent, { passive: true })
    handleResizeEvent()
}

/* INITIALIZATION CALLS */
initializeData()
initializeEvents()
updateAllBindings()
