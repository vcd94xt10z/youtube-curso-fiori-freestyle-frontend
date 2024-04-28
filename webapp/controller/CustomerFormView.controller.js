sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("zov.controller.CustomerFormView", {
            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                oRouter.getRoute("RouteCustomerNew").attachMatched(this._onRouteMatchedNew,this);
                oRouter.getRoute("RouteCustomerEdit").attachMatched(this._onRouteMatchedEdit,this);
            },

            onView1: function(){
                var r = sap.ui.core.UIComponent.getRouterFor(this);
                r.navTo("RouteView1");
            },

            onNavBack: function(){
                const oHistory = sap.ui.core.routing.History.getInstance();
                const sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    var r = sap.ui.core.UIComponent.getRouterFor(this);
                    r.navTo("RouteView1");
                }
            },

            _onRouteMatchedNew: function(oEvent){
                alert("Modo criação do cliente");
            },

            _onRouteMatchedEdit: function(oEvent){
                var that        = this;
                var oArgs       = oEvent.getParameter("arguments");
                var sCustomerId = oArgs.CustomerId;
                
                alert("Modo modificação do cliente "+sCustomerId);
            }
        });
    }
);