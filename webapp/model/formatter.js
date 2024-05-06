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
        },

        formatCPF: function(sValue){
            // removendo tudo, exceto números
            sValue = sValue.replace(/\D/g, '');

            // adicionando pontuação
            sValue = sValue.slice(0,3)+"."+
                     sValue.slice(3,6)+"."+
                     sValue.slice(6,9)+"-"+
                     sValue.slice(9,11);


            return sValue;
        },

        formatStatus: function(sValue){
            const oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			return oResourceBundle.getText("Status"+sValue);
        }
    };
});
