import timeInputFallback from "./modules/timeInputFallback.js";
import "./modules/labeledClass.js";
import "./modules/searchSelects.js";

/**
 * @param HTMLDocument d
 */
((d) => {
    d.addEventListener("focusin", (event) => {
        const tgt = event.target.closest("input[type=time][min][max][step]");

        if (tgt !== null) {
            timeInputFallback(tgt);
        }
    });
})(document);
