sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
],function(Controller,UIComponent,History,MessageToast){
    'use strict';

    return Controller.extend("zov.controller.BaseController",{
        isUsingMockData: function(){
            var oParams = new URLSearchParams(window.location.search);
            if(oParams.get("mockdata") == 'true'){
                return true;
            }
            return false;
        },

        parseInt: function(sValue){
            if(sValue == "" || sValue == null || sValue == undefined){
                return 0;
            }

            sValue = parseInt(sValue);
            if(sValue == null || isNaN(sValue)){
                sValue = 0;
            }
            return sValue;
        },

        parsePrice: function(sValue){
            if(sValue == "" || sValue == null || sValue == undefined){
                return 0.00;
            }

            if(typeof(sValue) == "number"){
                return sValue;
            }

            sValue = sValue.toString();

            if(sValue.indexOf(",") === -1){
                return parseFloat(sValue);
            }

            sValue = sValue.toString().replaceAll(/[^0-9\.\,]/g,'');
            sValue = sValue.replace(/^0+/, '');
            sValue = sValue.replace(".","");
            sValue = sValue.replace(",",".");
            return parseFloat(sValue);
        },

        formatPrice: function(fPrice){
            if(typeof(fPrice) != "number"){
                return "0,00";
            }
            var sPrice = fPrice.toFixed(2);
            sPrice = sPrice.replace(".",",");
            return sPrice;
        },

        onPageBack: function(){
            var oHistory      = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                UIComponent.getRouterFor(this).navTo("RouteOrdemList");
            }
        },

        onDeleteOrder: function(iOrdemId,callback){
            var oModel1 = this.getOwnerComponent().getModel();
            var oView   = this.getView();
            
            oView.setBusy(true);
            oModel1.remove("/OVCabSet("+iOrdemId+")",{
                success: function(oData2, oResponse){
                    if(oResponse.statusCode == 204){
                        MessageToast.show("Deletado com sucesso");
                    }else{
                        MessageToast.show("Erro em deletar");
                    }

                    oView.setBusy(false);
                    callback("S");
                },
                error: function(oResponse){
                    var oError = JSON.parse(oResponse.responseText);
                    MessageToast.show(oError.error.message.value);
                    oView.setBusy(false);
                    callback("E");
                }}
            );
        }
    });
});