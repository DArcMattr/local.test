import timeInputFallback from './modules/timeInputFallback.js';
import './modules/labeledClass.js';
import './modules/searchSelects.js';

/**
 * IIFE to apply behaviors
 * @param {HTMLDocument} d - the document
 */
((d) => {
    d.addEventListener('focusin', (event) => {
        const tgt = event.target.closest('input[type=time][min][max][step]');

        if (tgt !== null) {
            timeInputFallback(tgt);
        }
    });
})(document);
