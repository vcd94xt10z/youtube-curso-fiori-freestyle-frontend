sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageToast) {
        "use strict";

        return Controller.extend("zov.controller.Footer", {
            onInit: function () {
            },

            onFooter: function(){
                alert("onFooter");
            }
        });
    });