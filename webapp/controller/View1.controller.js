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

            digaOla: function(){
                alert("Olá");
            },

            onTest: function(){
                var oModel = this.getOwnerComponent().getModel();
                oModel.setUseBatch(false);

                console.log("this dentro do controller");
                console.log(this);

                var that = this;
                //var controller = this;
                
                oModel.read("/OVCabSet(1)",{
                    success: function(oData2, oResponse){
                        console.log("this fora do controller");
                        console.log(this);

                        //console.log("that fora do controller");
                        //console.log(that);

                        that.digaOla();
                        //controller.digaOla();
                    },
                    error: function(oError){
                    }
                });
            }
        });
    });