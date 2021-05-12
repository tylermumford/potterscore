'use strict'

const keyPrefix = 'potterscore-'
const keys = ['slytherin', 'ravenclaw', 'gryffindor', 'hufflepuff']

/**
 * Un-hides the element with the ID of `modeName` and hides all elements
 * marked with a hook class.
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
        updateNode: node => {
            console.log('Todo: Implement bar height binding')
        }
    },
    {
        name: 'value',
        selector: '[data-bind-value]',
        updateNode: node => {
            console.log('Todo: Implement value binding')
        }
    }
]

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

/* INITIALIZATION */
initializeData()
updateAllBindings()
