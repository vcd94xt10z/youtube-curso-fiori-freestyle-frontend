sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,History,UIComponent) {
        "use strict";

        return Controller.extend("zov.controller.View1", {

            onInit: function(){
            },

            onCadastroOrdem: function(){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteOrdemNew");
            },

            onModificarOrdem: function(){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteOrdemEdit",{OrdemId:'1'});
            }
        });
    });