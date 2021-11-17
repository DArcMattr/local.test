import timeInputFallback from "./modules/timeInputFallback";
import "./modules/detailsAnimation";
import "./modules/labeledClass";
import "./modules/searchSelects";

/**
 * A substitute for ':user-invalid', which is only supported in Firefox ATM as
 * ::-moz-ui-invalid
 */
( (d: Document): void => {
	const menuGroups : NodeListOf<HTMLElement> = d.querySelectorAll( "#left [role='navigation'] dd" );

	menuGroups.forEach( (el: HTMLElement): void => {
		el.style.setProperty( "--flex-basis", `${el.scrollHeight}px` );
	} );

	d.addEventListener( "focusout", (event: Event) => {
		const sels : Array<string> = [
			"input:not([type=checkbox]):not([type=radio])",
			"select",
			"textarea"
		];
		const inputEl: HTMLElement = (event.target as HTMLElement).closest( sels.join( "," ) );
		const theClass = "was-focused";

		if (
			inputEl !== null &&
			!inputEl.classList.contains( theClass )
		) {
			inputEl.classList.add( theClass );
		}
	} );

	d.addEventListener( "focusin", (event: Event): void => {
		const tgt : HTMLInputElement = (event.target as HTMLElement).closest( "input[type=time][min][max][step]" );

		if ( tgt !== null ) {
			timeInputFallback( tgt );
		}
	} );
} )( document );
