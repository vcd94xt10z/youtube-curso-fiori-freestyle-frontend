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

        return Controller.extend("zov.controller.OrdemForm", {
            onInit: function () {
            },

            onPageBack: function(){
                var oHistory      = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
    
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    UIComponent.getRouterFor(this).navTo("RouteOrdemList");
                }
            }
        });
    });