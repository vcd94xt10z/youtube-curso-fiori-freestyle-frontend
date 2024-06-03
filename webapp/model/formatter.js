sap.ui.define([
],function(){
    "use strict";

    return {
        formatPrice: function(sValue){
            var oFormatOptions = {
                groupingEnabled : true,
                groupingSeparator: '.',
                decimalSeparator: ',',
                decimals: 2
            };
            var oFloatFormat = sap.ui.core.format.NumberFormat.getFloatInstance(oFormatOptions);
            return oFloatFormat.format(parseFloat(sValue));
        }
    };
});
