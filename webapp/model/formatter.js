sap.ui.define([
],function(){
    "use strict";

    return {
        formatCPF: function(sValue){
            // removendo tudo, exceto números
            sValue = sValue.replace(/\D/g, '');

            if(sValue == ""){
                return "";
            }

            // adicionando pontuação
            sValue = sValue.slice(0,3)+"."+
                     sValue.slice(3,6)+"."+
                     sValue.slice(6,9)+"-"+
                     sValue.slice(9,11);


            return sValue;
        },
        
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

        formatStatus: function(sValue){
            if(sValue == null){
                return "Desconhecido";    
            }
            const oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			return oResourceBundle.getText("Status"+sValue);
        },

        getIconStatus: function(sStatus){
            var sIcon = "sap-icon://message-information";
            switch(sStatus){
            case "S":
                sIcon = "sap-icon://message-success";
                break;
            case "E":
                sIcon = "sap-icon://message-error";
                break;
            }
            return sIcon;
        },

        getColorStatus: function(sStatus){
            var sColor = "#FFFFFF";
            switch(sStatus){
            case "S":
                sColor = "#00AA00";
                break;
            case "E":
                sColor = "#AA0000";
                break;
            }
            return sColor;
        }
    };
});
