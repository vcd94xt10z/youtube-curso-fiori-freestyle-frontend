sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("zov.controller.View1", {
            onInit: function () {
            },

            onNewCustomer: function(){
                var r = sap.ui.core.UIComponent.getRouterFor(this);
                r.navTo("RouteCustomerNew");
            },

            onEditCustomer1: function(){
                var r = sap.ui.core.UIComponent.getRouterFor(this);
                r.navTo("RouteCustomerEdit",{CustomerId:1});
            }
        });
    });