"use strict";

( d => {
  const timeInputs = d.querySelectorAll( "input[type=time][min][max][step]" );

  for ( let inp of timeInputs ) {
    const inpMin = inp.getAttribute( "min" );
    const inpMax = inp.getAttribute( "max" );
    const baseDate = inpMin < inpMax ? "January 1, 1970" : "January 2, 1970";

    const timeMin = new Date( `${baseDate } ${( inp.getAttribute( "min" ) )}` );
    const timeMax = new Date( `${baseDate } ${( inp.getAttribute( "max" ) )}` );
    const inpStep = parseInt( inp.getAttribute( "step" ) );

    const timeList = document.createElement( "datalist" );
    const timeListId = `dl-${timeMin.getSeconds()}-${timeMax.getSeconds()}${inpStep}`;
    timeList.setAttribute( "id", timeListId );

    if ( document.querySelector( `#${timeListId}` ) !== null ) {
      continue;
    }

    let listOptions = "",
      timeStep = timeMin;

    while ( timeStep.getTime() <= timeMax.getTime() ) {
      listOptions = `${listOptions}<option value="${( timeStep.toLocaleTimeString( "en-GB" ) )}">`;
      timeStep.setSeconds( timeStep.getSeconds() + inpStep );
    }

    inp.setAttribute( "list", timeListId );
    timeList.innerHTML = listOptions;
    document.querySelector( "body" ).appendChild( timeList );
  }
} )( document );
