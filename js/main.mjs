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
	const threshold = 5;
	const details = d.querySelectorAll( "details" );
	const selects = d.querySelectorAll( "select" );
	const optionClones = [];

	for ( let select of selects ) {
		if ( select.options.length > threshold ) {
			let newList = d.createElement( "datalist" ),
				newOpt;
			select.dataset.idProxy = select.hasAttribute( "id" ) ?
				select.getAttribute( "id" ) :
				`select-${( [ ...selects ].indexOf( select ) )}`;

			newList.id = select.dataset.idProxy;
			for ( let opt of select.options ) {
				newOpt = d.createElement( "option" );
				newOpt.value = opt.value;
				newList.appendChild( newOpt );
			}

			optionClones.push( newList );

			console.log( select.options );
		}
	}

	for ( let detail of details ) {
		detail.addEventListener( "transitionend", event => {
			const tgt = event.target;
			if (
				tgt.matches( "details" ) &&
				tgt.open === true &&
				tgt.style.maxHeight !== `${tgt.dataset.maxHeight}px`
			) {
				tgt.open = false;
			}
		} );

		detail.querySelector( "summary" ).addEventListener( "click", event => {
			const parent = event.target.parentNode;
			if ( parent.open === true ) {
				event.preventDefault();
				parent.style.maxHeight = `${parent.dataset.maxHeight}px`;
				parent.style.maxHeight = `${parent.dataset.minHeight}px`;
				parent.classList.remove( "pseudo-open" );
			}
		} );
	}

	w.addEventListener( "load", () => {
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
						tgt.classList.add( "pseudo-open" );
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

	d.addEventListener( "focusout", event => {
		const sels = [
			"input:not([type=checkbox]):not([type=radio])",
			"select",
			"textarea"
		];
		const inputEl = event.target.closest( sels.join( "," ) );
		const theClass = "was-focused";

		if (
			inputEl !== null &&
			!inputEl.classList.contains( theClass )
		) {
			inputEl.classList.add( theClass );
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
