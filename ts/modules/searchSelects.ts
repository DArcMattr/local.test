( (d: HTMLDocument): void => {
	const $selects: Array<HTMLSelectElement> = Array.from(d.querySelectorAll("select"));
	const defaultThreshold = 5;
	const $dataThreshold: HTMLElement = d.querySelector( "[data-threshold]" );
	const threshold: number = $dataThreshold === null || $dataThreshold.dataset.threshold === undefined ?
		defaultThreshold :
		parseInt( $dataThreshold.dataset.threshold, 10 );

	$selects.forEach( ($select: HTMLSelectElement, i: number) => {
		if ( threshold < $select.options.length ) {
			const sourceId: string = $select.hasAttribute( "id" ) ?
				$select.getAttribute( "id" ) :
				`select-${i}`; // or generate XPath instead?
			const newId = `datalist-${sourceId}`;
			const $newList: HTMLElement = d.createElement( "datalist" );
			const $newInput: HTMLInputElement = d.createElement( "input" );
			let $newOpt,
				patterns = "";
			$select.dataset.idProxy = newId;
			$select.setAttribute( "id", sourceId );
			$newList.setAttribute( "id", newId );

			$newInput.dataset.idProxy =  sourceId;
			$newInput.setAttribute( "list", newId );
			$newInput.setAttribute( "type", "text" );
			$newInput.addEventListener( "change", (event: Event): void => {
				const $this: HTMLInputElement = event.currentTarget as HTMLInputElement;
				const $match: HTMLSelectElement = d.querySelector( `#${$this.dataset.idProxy}` );

				Array.prototype.slice.call($match.options).forEach( ($opt: HTMLOptionElement, j: number): void => {
					if ( $opt.text === $this.value ) {
						$match.selectedIndex = j;
					}
				} );
			} );

			$newList.id = $select.dataset.idProxy;
			Array.prototype.slice.call($select.options).forEach( ($opt: HTMLOptionElement) => {
				$newOpt = d.createElement( "option" );
				$newOpt.value = $opt.text;
				$newList.appendChild( $newOpt );
				patterns = `${patterns}|${$opt.text}`;
			}
			);
			$newInput.setAttribute( "pattern", `^(${patterns})$` );

			d.querySelector( "body" ).appendChild( $newList );

			$select.setAttribute( "hidden", "" );
			$select.parentNode.insertBefore( $newInput, $select );
		}
	} );
} )( document );
