import timeInputFallback from "./modules/timeInputFallback.js";
import "./modules/detailsAnimation.js";
import "./modules/labeledClass.js";
import "./modules/searchSelects.js";

((d) => {
	// apply expando max size to side menu,
	// TODO: recompute when page dimensions change
    const menuGroups = d.querySelectorAll("#left [role='navigation'] dd");

    menuGroups.forEach((el) => {
        el.style.setProperty("--flex-basis", `${el.scrollHeight}px`);
    });

    d.addEventListener("focusin", (event) => {
        const tgt = event.target.closest("input[type=time][min][max][step]");

        if (tgt !== null) {
            timeInputFallback(tgt);
        }
    });
})(document);
