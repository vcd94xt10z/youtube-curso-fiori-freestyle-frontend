sap.ui.define([
    //"sap/ui/core/mvc/Controller",
    "zov/controller/BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,History,UIComponent) {
        "use strict";

        return Controller.extend("zov.controller.OrdemList", {

            onInit: function(){
            },

            onFormulario: function(){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteOrdemNew");
            }
        });
    });