( function(w: Window): void {
	const d: HTMLDocument = w.document;
	const details: NodeListOf<Element> = d.querySelectorAll( "details" );

	if ( d.querySelector( "style#detailsOverride" ) === null ) {
		d.querySelector( "head" ).insertAdjacentHTML( "afterbegin", `
<style id='detailsOverride'>
:root {
  --font-size: 1rem;
  --line-height-multiplier: 1.25;
  --lh: calc( var( --line-height-multiplier ) * var( --font-size ) );
  --transition-timing: 0.3s;
  --transition-timing-function: ease-in-out;
}

details:not([open]) {
  max-height: none;
}

details {
  transition:
    max-height
    var( --transition-timing )
    var( --transition-timing-function );
  overflow-y: hidden;
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
  line-height: var( --font-size );
  margin-right: calc( var( --lh ) / 5 );
  height: var( --font-size );
  width: calc( 1 * var( --font-size ) / 2 );
}

.pre-open > summary:before {
  transform: rotate(90deg);
}
</style>
`
		);
	}

	details.forEach( (detail: HTMLDetailsElement) => {
		detail.addEventListener( "transitionend", (event: Event) => {
			const tgt: HTMLElement = <HTMLElement> event.target;
			if (
				tgt instanceof HTMLDetailsElement &&
				tgt.open === true &&
				tgt.style.maxHeight !== `${tgt.dataset.maxHeight}px`
			) {
				tgt.open = false;
			}
		} );

		detail.querySelector( "summary" ).addEventListener( "click", (event: Event): void => {
			const parent: HTMLElement = (event.target as HTMLElement).parentElement;
			if (
				parent instanceof HTMLDetailsElement &&
				parent.open === true
			   ) {
				event.preventDefault();
				parent.style.maxHeight = `${parent.dataset.maxHeight}px`;
				parent.style.maxHeight = `${parent.dataset.minHeight}px`;
				parent.classList.remove( "pre-open" );
			}
		} );
	} );

	w.addEventListener( "load", () => {

		/**
		 * This allows for children to change size, yet keep the current
		 * <details> element to animate around its current dimensions
		 *
		 * TODO: watch DOM for new <details> elements, attach eventlisteners in
		 */
		const observer = new MutationObserver( mutations => {
			for ( const m of mutations ) {
				const tgt: HTMLElement = <HTMLElement> m.target;
				if (
					tgt instanceof HTMLDetailsElement &&
					m.type === "attributes" &&
					m.attributeName === "open"
				) {
					if ( tgt.open === true ) {
						assignDetailMaxHeight( tgt );
						tgt.style.maxHeight = `${tgt.dataset.maxHeight}px`;
						tgt.classList.add( "pre-open" );
					} else {
						tgt.style.maxHeight = `${tgt.dataset.minHeight}px`;
					}
				}
			}
		} );

		details.forEach( (detail: HTMLDetailsElement) => {
			assignDetailMaxHeight( detail );

			observer.observe(
				detail,
				{ attributes: true }
			);
		} );
	} );
} )( window );

/**
 * @param {HTMLDetailsElement} el
 */
const assignDetailMaxHeight = (el: HTMLDetailsElement): void => {
	const parent: HTMLElement = el.parentElement;
	const parentPosition: string = parent.style.position;

	const elClone: HTMLDetailsElement = <HTMLDetailsElement> el.cloneNode( true );

	elClone.setAttribute( "open", "open" );
	elClone.style.position = "absolute";
	elClone.style.visibility = "hidden";
	elClone.style.top = "0";
	elClone.style.right = "0";
	elClone.style.left = "0";

	parent.style.position = "relative";
	parent.insertBefore( elClone, el );
	el.dataset.maxHeight = String(elClone.scrollHeight);
	el.dataset.minHeight = String(elClone.querySelector( "summary" ).scrollHeight);
	el.style.maxHeight = `${el.dataset.minHeight}px`;

	elClone.remove();
	parent.style.position = parentPosition;
};
