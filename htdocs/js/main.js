import timeInputFallback from "./modules/timeInputFallback.js";
import "./modules/detailsAnimation.js";
import "./modules/labeledClass.js";
import "./modules/searchSelects.js";

/**
 * A substitute for ':user-invalid', which is only supported in Firefox ATM as
 * ::-moz-ui-invalid
 */
((d) => {
    const menuGroups = d.querySelectorAll("#left [role='navigation'] dd");

    menuGroups.forEach((el) => {
        el.style.setProperty("--flex-basis", `${el.scrollHeight}px`);
    });

    d.addEventListener("focusout", (event) => {
        const sels = [
            "input:not([type=checkbox]):not([type=radio])",
            "select",
            "textarea"
        ];
        const inputEl = event.target.closest(sels.join(","));
        const theClass = "was-focused";

        if (inputEl !== null &&
            !inputEl.classList.contains(theClass)) {
            inputEl.classList.add(theClass);
        }
    });

    d.addEventListener("focusin", (event) => {
        const tgt = event.target.closest("input[type=time][min][max][step]");

        if (tgt !== null) {
            timeInputFallback(tgt);
        }
    });
})(document);