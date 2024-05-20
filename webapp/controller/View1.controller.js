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

            onTestCallback() {
                console.log("[Processo 1] Inicio");
                this.onConsultaOrdem(1,function(oData,oResponse){
                    console.log("[Processo 2] Terminou consulta");
                    console.log(oData);
                    console.log(oResponse);
                });
                console.log("[Processo 1] Fim");
            },

            onConsultaOrdem: function(iId,callback){
                var oModel = this.getOwnerComponent().getModel();
                oModel.setUseBatch(false);

                oModel.read("/OVCabSet("+iId+")",{
                    success: function(oData2, oResponse){
                        callback(oData2,oResponse);
                    },
                    error: function(oError){
                    }
                });
            },

            onTestPromise1() {
                console.log("[Processo 1] Inicio");
                var oPromise1 = this.onConsultaOrdem2(1);
                oPromise1.then(function(oData,oResponse){
                    console.log("[Processo 2] Terminou");
                    console.log(oData);
                    console.log(oResponse);
                });
                console.log("[Processo 1] Fim");
            },

            onTestPromise2() {
                console.log("[Processo 1] Inicio");

                var oPromise1 = this.onConsultaOrdem2(1);
                oPromise1.then(function(oData,oResponse){
                    console.log("[Processo 2] Terminou");
                    //console.log(oData);
                    //console.log(oResponse);
                });

                var oPromise2 = this.onConsultaOrdem2(2);
                oPromise2.then(function(oData,oResponse){
                    console.log("[Processo 3] Terminou");
                    //console.log(oData);
                    //console.log(oResponse);
                });
                
                Promise.all([oPromise1,oPromise2]).then(function(aRetorno){
                    console.log("[Processo 4] Promise.all terminou");
                    console.log(aRetorno);
                });

                console.log("[Processo 1] Fim");
            },

            onConsultaOrdem2: function(iId){
                var oModel = this.getOwnerComponent().getModel();
                oModel.setUseBatch(false);

                return new Promise(function(resolve,reject){
                    oModel.read("/OVCabSet("+iId+")",{
                        success: function(oData2, oResponse){
                            resolve({oData: oData2, oResponse: oResponse});
                        },
                        error: function(oError){
                            reject({oError:oError});
                        }
                    });
                });
            }
        });
    });