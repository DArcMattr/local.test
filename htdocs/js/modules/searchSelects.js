/**
 * TODO: Add a mutation observer watching for new <select> elements
 */
((d) => {
    const $selects = Array.from(d.querySelectorAll("select"));
    const defaultThreshold = 5;
    const $dataThreshold = d.querySelector("[data-threshold]");
    const threshold = $dataThreshold === null || $dataThreshold.dataset.threshold === undefined ?
        defaultThreshold :
        parseInt($dataThreshold.dataset.threshold, 10);

    $selects.forEach(($select, i) => {
        if (threshold < $select.options.length) {
            const sourceId = $select.hasAttribute("id") ?
                $select.getAttribute("id") :
                `select-${i}`; // or generate XPath instead?
            const newId = `datalist-${sourceId}`;
            const $newList = d.createElement("datalist");
            const $newInput = d.createElement("input");
            let $newOpt, patterns = "";
            $select.dataset.idProxy = newId;
            $select.setAttribute("id", sourceId);
            $newList.setAttribute("id", newId);

            $newInput.dataset.idProxy = sourceId;
            $newInput.setAttribute("list", newId);
            $newInput.setAttribute("type", "search");
            $newInput.setAttribute("placeholder", $select.options[$select.selectedIndex].text);
            $newInput.setAttribute("id", `search-for-${newId}`);
            $newInput.addEventListener("change", (event) => {
                const $this = event.currentTarget;
                const $match = d.querySelector(`#${$this.dataset.idProxy}`);

                Array.prototype.slice.call($match.options).forEach(($opt, j) => {
                    if ($opt.text === $this.value) {
                        $match.selectedIndex = j;
                    }
                });
            });

            $newList.id = $select.dataset.idProxy;
            Array.prototype.slice.call($select.options).forEach(($opt) => {
                $newOpt = d.createElement("option");
                $newOpt.value = $opt.text;
                $newList.appendChild($newOpt);
                patterns = `${patterns}|${$opt.text}`;
            });
            $newInput.setAttribute("pattern", `^(${patterns})$`);

            d.querySelector("body").appendChild($newList);

            $select.setAttribute("hidden", "");
            $select.parentNode.insertBefore($newInput, $select);
            if ($select.hasAttribute("autofocus")) {
                $select.removeAttribute("autofocus");
                $newInput.focus();
            }
        }
    });
})(document);
