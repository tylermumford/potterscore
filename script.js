'use strict'

const keyPrefix = 'potterscore-'
const keys = ['slytherin', 'ravenclaw', 'gryffindor', 'hufflepuff']

function getScoreForKey(key) {
    return Number(localStorage.getItem(keyPrefix + key))
}

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
            let percentageFull = storedValue / 350 * 100
            let boundedPercentageFull = Math.min(Math.max(0, percentageFull), 100)

            node.style.transform = `translateY(${100 - boundedPercentageFull}%)`
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
    },
    {
        name: 'banners',
        selector: '[data-bind-winning-banner]',
        /** @param {HTMLElement} node  */
        updateNode: node => {
            let currentWinner = getCurrentWinningKey()
            let boundKey = node.dataset.bindWinningBanner
            if (currentWinner === boundKey) {
                node.classList.remove('transparent')
            } else {
                node.classList.add('transparent')
            }
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

function getCurrentWinningKey() {
    let currentWinner = 'hogwarts'
    let currentHighScore = -1

    keys.forEach(key => {
        let score = getScoreForKey(key)
        if (score > currentHighScore) {
            currentWinner = key
            currentHighScore = score
        } else if (score === currentHighScore) {
            currentWinner = 'hogwarts'
        }
    })

    console.log('current winner:', currentWinner)
    return currentWinner
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

            let storedValue = getScoreForKey(providedKey)
            if (!storedValue && storedValue !== 0) {
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

    let currentValue = getScoreForKey(key)

    localStorage.setItem(keyPrefix + key, currentValue + amount)

    updateAllBindings()
}

/* INITIALIZATION-ONLY FUNCTIONS */

/** Sets each key to 0, unless the key already has a value. */
function initializeData() {
    keys.forEach(key => {
        const fullKey = keyPrefix + key
        if (localStorage.getItem(fullKey)) {
            return
        }
        localStorage.setItem(fullKey, "0")
    })
}

function initializeEvents() {
    window.addEventListener('storage', handleStorageEvent)
}

/* INITIALIZATION CALLS */
initializeData()
initializeEvents()
updateAllBindings()
