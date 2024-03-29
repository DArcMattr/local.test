/** @extends HTMLElement */
class cooldownIcon extends HTMLElement {

    /** @public
     * @static
     */
    static get observedAttributes() {
        return ['duration', 'time-left', 'src', 'size'];
    }

    get timeLeft() {
        return parseInt(this.getAttribute("time-left") ?? "0", 10);
    }

    set timeLeft(time) {
        this.setAttribute("time-left", time.toString());
    }

    get duration() {
        return parseInt(this.getAttribute("duration") ?? "0", 10);
    }

    set duration(time) {
        this.setAttribute("duration", time.toString());
    }

    get size() {
        return parseInt(this.getAttribute("size") ?? "0", 10);
    }

    set size(width) {
        this.setAttribute("size", width.toString());
    }

    get src() {
        return this.getAttribute("src") ?? "";
    }

    /** @public
     * @param {string} name
     * @param {string} oldValue
     * @param {string} newValue
     * @returns {void}
     */
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'duration':
                if (oldValue !== null && oldValue !== newValue) {
                    this.render();
                }

                break;
            case 'size':
                this.$icon.style.width = `${newValue}px`;
                break;
            default:
        }
    }

    /** @private
     * @default document.createElement( "template" )
     */
    template = document.createElement("template");

    /** @private */
    $icon = undefined;

    /** @private */
    $swirl = undefined;

    /** @private */
    $countdown = undefined;

    /** @private
     * @returns {void}
     */
    render() {
        let swirlClass = "";

        const startDiff = this.duration - this.timeLeft;

        // Firefox & Blink engines support it so far, waiting on WebKit
        const style = `
:host {
	display: inline-block;
}

.icon {
	display: inline-grid;
	place-content: center;
	aspect-ratio: 1;
	position: relative;
}

[part='swirl'] {
	display: inherit;
	position: absolute;
	inset: 0;
	z-index: 1;
	background-color: black;
	opacity: .5;
	transform: rotateY(180deg);
	animation-name: swirl;
	animation-timing-function: linear;
	animation-fill-mode: both;
	animation-play-state: paused;
}

[part='swirl'].running {
	animation-play-state: running;
}

[part='countdown'] { /* TODO: different scaling and colors for time remaining ranges */
	display: inherit;
	position: absolute;
	inset: 0;
	z-index: 2;
	color: white;
	text-stroke: 1px black;
	position: relative;
	z-index: 2;
	-webkit-text-stroke: 1px black;
	text-stroke: 1px black;
}

/* XXX Firefox does not smoothly animate clip-path */
@keyframes swirl { /* TODO: reverse Y-axis direction */
  to {
    clip-path: polygon(50% 50%, 50% 0%, 50% 0%);
  }
  87.5000001% {
    clip-path: polygon(50% 50%, 50% 0%, 100% 0%);
  }
  87.5% {
    clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 0%);
  }
  62.5000001% {
    clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%);
  }
  62.5% {
    clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 100% 100%);
  }
  37.5000001% {
    clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%);
  }
  37.5% {
    clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 100%);
  }
  12.5000001% {
    clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%);
  }
  12.5% {
    clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 0% 0%);
  }
  from {
    clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%);
  }
}

[part='countdown'] {
	font-size: calc( var( --countdown-scale, .8 ) * ${this.size}px );
	line-height: ${this.size}px;
}
`;
        if (startDiff > 0) {
            swirlClass = "running";
        }

        this.template.innerHTML = `
<style>
${style}
</style>
<div class='icon' style='width: ${this.size}px; background-image: url(${this.src})'>
	<div
		part='swirl'
		class='${swirlClass}'
	>
	</div>
	<div part='countdown' style=''>
		${(this.timeLeft)}
	</div>
</div>
`;

        this.shadowRoot.replaceChildren(this.template.content.cloneNode(true));

        this.$icon = this.shadowRoot.querySelector(".icon");
        this.$countdown = this.shadowRoot.querySelector("[part='countdown']");
        this.$swirl = this.shadowRoot.querySelector("[part='swirl']");

        this.$swirl.style.animationDuration = `${this.duration}s`;
        this.$swirl.style.animationDelay = `${(-1 * startDiff)}s`;

        const countdownInterval = setInterval(() => {
            const $countdown = this.shadowRoot.querySelector("[part='countdown']");

            this.timeLeft--;

            if (this.timeLeft <= 0) {
                $countdown.innerHTML = "";
                clearInterval(countdownInterval);
                this.$swirl.classList.remove("running");
            }
            else {
                $countdown.innerHTML = this.timeLeft.toString();
            }
        }, 1000);
    }

    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(this.template.content.cloneNode(true));
        this.render();
    }
}

customElements.define("cooldown-icon", cooldownIcon);
