if (!Object.values) {
  Object.values = function( obj ){
    var ownProps = Object.keys( obj ),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array
    while (i--)
      resArray[i] = obj[ownProps[i]];
    
    return resArray;
  };
}