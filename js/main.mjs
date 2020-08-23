"use strict";

import timeInputFallback from "./modules/timeInputFallback.mjs";

const computeDetailMaxHeight = el => {
	const parent = el.parentNode;
	const parentPosition = parent.style.position;

	let elClone = el.cloneNode( true );

	elClone.setAttribute( "open", "open" );
	elClone.style.position = "absolute";
	elClone.style.visibility = "hidden";
	elClone.style.top = "0";
	elClone.style.right = "0";
	elClone.style.left = "0";

	parent.style.position = "relative";
	parent.insertBefore( elClone, el );
	el.dataset.maxHeight = elClone.scrollHeight;
	el.dataset.minHeight = elClone.querySelector( "summary" ).scrollHeight;
	el.style.maxHeight = `${el.dataset.minHeight}px`;

	elClone.remove();
	parent.style.position = parentPosition;
};

( ( d, w ) => {
	w.addEventListener( "load", () => {
		const details = d.querySelectorAll( "details" );
		const observer = new MutationObserver( mutations => {
			for ( let m of mutations ) {
				const tgt = m.target;
				if (
					m.type === "attributes" &&
					m.attributeName === "open"
				) {
					if ( tgt.open === true ) {
						computeDetailMaxHeight( tgt );
						tgt.style.maxHeight = `${tgt.dataset.maxHeight}px`;
					} else {
						tgt.style.maxHeight = `${tgt.dataset.minHeight}px`;
					}
				}
			}
		} );

		for ( let detail of details ) {
			computeDetailMaxHeight( detail );

			observer.observe(
				detail,
				{ attributes: true }
			);
		}
	} );

	d.addEventListener( "focusin", event => {
		const tgt = event.target.closest( "input[type=time][min][max][step]" );

		if ( tgt !== null ) {
			timeInputFallback( tgt );
		}
	} );

	d.addEventListener( "mouseover", event => {
		const tgt = event.target.closest( "label" );

		if ( tgt !== null ) {
			const control = tgt.control;

			control.classList.add( "labeled" );
		}
	} );

	d.addEventListener( "mouseout", event => {
		const tgt = event.target.closest( "label" );

		if ( tgt !== null ) {
			const control = tgt.control;

			control.classList.remove( "labeled" );
		}
	} );
} )( document, window );
