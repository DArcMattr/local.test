/**
 * Enhances HTML Time Inputs with a datalist that checks
 * @param {HTMLInputElement} inp - an <input> element of type='time'
 * @return {void} void
 */
const timeInputFallback = (inp) => {
    const inpMin = inp.getAttribute("min");
    const inpMax = inp.getAttribute("max");
    const inpStep = Number(inp.getAttribute("step") || 60);

    const baseDate = inpMin < inpMax ? "January 1, 1970" : "January 2, 1970";
    const timeMin = new Date(`${baseDate} ${(inpMin)}`);
    const timeMax = new Date(`${baseDate} ${(inpMax)}`);

    const timeList = document.createElement("datalist");
    const timeListId = `dl-${timeMin.getSeconds()}-${timeMax.getSeconds()}${inpStep}`;

    if (document.querySelector(`#${timeListId}`) !== null ||
        inp.type !== "time") {
        return;
    }

    timeList.setAttribute("id", timeListId);


    let listOptions = "";

    while (timeMin.getTime() <= timeMax.getTime()) {
        listOptions = `
${listOptions}
<option value="${(timeMin.toLocaleTimeString("en-GB"))}">`;
        timeMin.setSeconds(timeMin.getSeconds() + inpStep);
    }

    inp.setAttribute("list", timeListId);
    timeList.innerHTML = listOptions;
    document.querySelector("body").appendChild(timeList);
};

export default timeInputFallback;
