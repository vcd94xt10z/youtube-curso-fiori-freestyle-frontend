sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageToast) {
        "use strict";

        return Controller.extend("zov.controller.View1", {
            onInit: function () {
            },

            onExibirTotal: function(){
                //debugger;
                var that     = this;
                var sOrdemId = this.getView().byId("ordemid").getValue();
                var oModel   = this.getOwnerComponent().getModel();
                
                oModel.read("/OVCabSet("+sOrdemId+")",{
                    success: function(oData2, oResponse){
                        var sMensagem = that.montarMensagem(oData2);
                        alert(sMensagem);
                    },
                    error: function(oError){
                    }
                });
            },

            montarMensagem: function(oOrdem){
                var sMensagem = "";

                sMensagem += "O valor total da ordem é ";
                sMensagem += oOrdem.TotalOrdem;
                
                return sMensagem;
            }
        });
    });