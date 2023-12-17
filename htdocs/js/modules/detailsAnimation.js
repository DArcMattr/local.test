(function (w) {
    const d = w.document;
    const details = d.querySelectorAll("details");

    if (d.querySelector("style#detailsOverride") === null) {
        d.querySelector("head").insertAdjacentHTML("afterbegin", `
<style id='detailsOverride'>
:root {
  --transition-timing: 0.3s;
  --transition-timing-function: ease-in-out;
}

details:not([open]) {
  max-block-size: none;
}

details {
  transition:
    max-block-size
    var( --transition-timing )
    var( --transition-timing-function );
  overflow: clip;
}

summary::marker {
  content: '';
}

summary:before {
  content: '';
  clip-path: polygon(
      0%  24%,
      0%  76%,
     80%  50%
  );
  background-color: currentColor;
  display: inline-block;
  transition:
    transform
    var( --transition-timing )
    var( --transition-timing-function );
  transform-origin: 60% 50%;
  line-height: inherit;
  margin-inline-end: .2rem;
  block-size: 1rem;
  inline-size: .5rem;
}

.pre-open > summary:before {
  transform: rotate(90deg); /* TODO account for writing-mode */
}
</style>
`);
    }

    details.forEach((detail) => {
        detail.addEventListener("transitionend", (event) => {
            const tgt = event.target;
            if (tgt instanceof HTMLDetailsElement &&
                tgt.open === true &&
                tgt.style.maxBlockSize !== `${tgt.dataset.maxBlockSize}px`) {
                tgt.open = false;
            }
        });

        detail.querySelector("summary").addEventListener("click", (event) => {
            const parent = event.target.parentElement;
            if (parent instanceof HTMLDetailsElement &&
                parent.open === true) {
                event.preventDefault();
                parent.style.maxBlockSize = `${parent.dataset.maxBlockSize}px`;
                parent.style.maxBlockSize = `${parent.dataset.minBlockSize}px`;
                parent.classList.remove("pre-open");
            }
        });
    });

    w.addEventListener("load", () => {

        /**
         * This allows for children to change size, yet keep the current
         * <details> element to animate around its current dimensions
         *
         * TODO: watch DOM for new <details> elements, attach eventlisteners in
         */
        const observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                const tgt = m.target;
                if (tgt instanceof HTMLDetailsElement &&
                    m.type === "attributes" &&
                    m.attributeName === "open") {
                    if (tgt.open === true) {
                        assignDetailMaxBlockSize(tgt);
                        tgt.style.maxBlockSize = `${tgt.dataset.maxBlockSize}px`;
                        tgt.classList.add("pre-open");
                    }
                    else {
                        tgt.style.maxBlockSize = `${tgt.dataset.minBlockSize}px`;
                    }
                }
            }
        });

        details.forEach((detail) => {
            assignDetailMaxBlockSize(detail);

            observer.observe(detail, { attributes: true });
        });
    });
})(window);

/**
 * @param {HTMLDetailsElement} el
 * @returns {void}
 */
const assignDetailMaxBlockSize = (el) => {
    const parent = el.parentElement;
    const parentPosition = parent.style.position;

    const elClone = el.cloneNode(true);
    const writingMode = getComputedStyle(document.body)['writingMode'];

    elClone.setAttribute("open", "open");
    elClone.style.position = "absolute";
    elClone.style.visibility = "hidden";
    elClone.style.inset = "0";

    parent.style.position = "relative";
    parent.insertBefore(elClone, el);
    el.style.maxBlockSize = `${el.dataset.minBlockSize}px`;

    if (writingMode === 'horizontal-tb' || writingMode === 'horizontal-bt') {
		el.dataset.maxBlockSize = String(elClone.scrollHeight);
		el.dataset.minBlockSize = String(elClone.querySelector("summary").scrollHeight);
    } else {
		el.dataset.maxBlockSize = String(elClone.scrollWidth);
		el.dataset.minBlockSize = String(elClone.querySelector("summary").scrollWidth);
    }

    elClone.remove();
    parent.style.position = parentPosition;
};
