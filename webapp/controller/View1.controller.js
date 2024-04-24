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
                //alert("onInit");
            },

            onBeforeRendering: function(){
                //alert("onBeforeRendering");
            },

            onAfterRendering: function(){
                //alert("onAfterRendering");
            },

            onExit: function(){
                //alert("onExit");
            },

            onCalcular: function(){
                var oView = this.getView();
                var iB1 = parseInt(oView.byId("b1").getValue());
                var iB2 = parseInt(oView.byId("b2").getValue());
                var iB3 = parseInt(oView.byId("b3").getValue());
                var iB4 = parseInt(oView.byId("b4").getValue());
                var fResultado = 0;
                
                fResultado = ( iB1 + iB2 + iB3 + iB4) / 4;

                oView.byId("resultado").setValue(fResultado);

                MessageToast.show("Resultado = "+fResultado);

                // MessageToast
                // sap.m.MessageToast
                
                //oView.destroy();
            }
        });
    });
