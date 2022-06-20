class cooldownIcon extends HTMLElement {

	public static get observedAttributes(): string[] {
		return [ 'duration', 'time-left', 'src', 'size' ];
	}

	get timeLeft(): number {
		return parseInt( this.getAttribute( "time-left" ) ?? "0", 10 );
	}

	set timeLeft( time: number ) {
		this.setAttribute( "time-left", time.toString() );
	}

	get duration(): number {
		return parseInt( this.getAttribute( "duration" ) ?? "0", 10 );
	}

	set duration( time: number ) {
		this.setAttribute( "duration", time.toString() );
	}

	get size(): number {
		return parseInt( this.getAttribute( "size" ) ?? "0", 10 );
	}

	set size( width: number ) {
		this.setAttribute( "size", width.toString() );
	}

	get src(): string {
		return this.getAttribute( "src" ) ?? "";
	}

	public attributeChangedCallback(
		name: string,
		oldValue: string,
		newValue: string
	): void {
		switch ( name ) {
			case 'duration':
				if ( oldValue !== null && oldValue !== newValue ) {
					this.render();
				}

				break;
			case 'size':
				this.$icon.style.width = `${newValue}px`;
				break;
			default:
		}
	}

	private template: HTMLTemplateElement = document.createElement( "template" );

	private $icon: HTMLElement;

	private $swirl: HTMLElement;

	private $countdown: HTMLElement;

	private render(): void {
		// TODO: wait until TypeScript supports constructable stylesheets
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

		this.template.innerHTML = `
<style>
${style}
</style>
<div class='icon' style='width: ${this.size}px; background-image: url(${this.src})'>
	<div part='swirl' style='animation-delay: ${( this.timeLeft - this.duration )}s; animation-duration: ${this.duration};'>
	</div>
	<div part='countdown' style=''>
		${( this.timeLeft )}
	</div>
</div>
`;

		this.shadowRoot.replaceChildren( this.template.content.cloneNode( true ) );

		this.$icon = this.shadowRoot.querySelector( ".icon" );
		this.$countdown = this.shadowRoot.querySelector( "[part='countdown']" );
		this.$swirl = this.shadowRoot.querySelector( "[part='swirl']" );

		const countdownInterval = setInterval( () => {
			const $countdown = this.shadowRoot.querySelector( "[part='countdown']" );

			this.timeLeft--;

			if ( this.timeLeft <= 0 ) {
				$countdown.innerHTML = "";
				clearInterval( countdownInterval );
			} else {
				$countdown.innerHTML = this.timeLeft.toString();
			}
		}, 1000 );
	}

	constructor() {
		super();

		this.attachShadow( { mode: "open" } );
		this.shadowRoot.appendChild( this.template.content.cloneNode( true ) );
		this.render();
	}
}

customElements.define( "cooldown-icon", cooldownIcon );
