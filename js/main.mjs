"use strict";

import timeInputFallback from "./modules/timeInputFallback.mjs";
import "./modules/detailsAnimation.mjs";
import "./modules/labeledClass.mjs";

( d => {
	const $selects = [ ...d.querySelectorAll( "select" ) ];
	const defaultThreshold = 5;
	const $dataThreshold = d.querySelector( "[data-threshold]" );
	const threshold = $dataThreshold === null || $dataThreshold.dataset.threshold === undefined ?
		defaultThreshold :
		parseInt( $dataThreshold.dataset.threshold, 10 );

	for ( const [ i, $select ] of $selects.entries() ) {
		if ( threshold < $select.options.length ) {
			const sourceId = $select.hasAttribute( "id" ) ?
				$select.getAttribute( "id" ) :
				`select-${i}`; // or generate XPath instead?
			const newId = `datalist-${sourceId}`;
			let $newList = d.createElement( "datalist" ),
				$newInput = d.createElement( "input" ),
				$newOpt,
				patterns = "";
			$select.dataset.idProxy = newId;
			$select.setAttribute( "id", sourceId );
			$newList.setAttribute( "id", newId );

			$newInput.dataset.idProxy =  sourceId;
			$newInput.setAttribute( "list", newId );
			$newInput.setAttribute( "type", "text" );
			$newInput.addEventListener( "change", event => {
				const $this = event.currentTarget;
				const $match = d.querySelector( `#${$this.dataset.idProxy}` );
				let j = 0;

				for ( const $opt of $match.options ) {
					if ( $opt.text === $this.value ) {
						$match.selectedIndex = j;
						break;
					}
					j++;
				}
			} );

			$newList.id = $select.dataset.idProxy;
			for ( const $opt of $select.options ) {
				$newOpt = d.createElement( "option" );
				$newOpt.value = $opt.text;
				$newList.appendChild( $newOpt );
				patterns = `${patterns}|${$opt.text}`;
			}
			$newInput.setAttribute( "pattern", `^(${patterns})$` );

			d.querySelector( "body" ).appendChild( $newList );

			$select.setAttribute( "hidden", "" );
			$select.parentNode.insertBefore( $newInput, $select );
		}
	}

	// A substitute for ':user-invalid', which is only supported in Firefox ATM
	// as ::-moz-ui-invalid
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
} )( document );
