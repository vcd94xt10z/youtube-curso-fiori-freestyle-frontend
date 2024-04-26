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
                var oView  = this.getView();

                var oModel1 = new sap.ui.model.json.JSONModel();
                oModel1.setData({"usuario": {"nome": "José"}});
                oModel1.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
                oView.setModel(oModel1,"oneway");

                var oModel2 = new sap.ui.model.json.JSONModel();
                oModel2.setData({"usuario": {"nome": "José"}});
                oModel2.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
                oView.setModel(oModel2,"twoway");

                var oModel3 = new sap.ui.model.json.JSONModel();
                oModel3.setData({"usuario": {"nome": "José"}});
                oModel3.setDefaultBindingMode(sap.ui.model.BindingMode.OneTime);
                oView.setModel(oModel3,"onetime");
            },

            onTestOneWay: function(){
                var oView  = this.getView();

                var oModel = oView.getModel("oneway");
                var oData  = oModel.getData();
                oData.usuario.nome += ".";
                oModel.setData(oData);
                oView.setModel(oModel);
            },

            onTestTwoWay: function(){
                var oView  = this.getView();
                
                var oModel = oView.getModel("twoway");
                var oData  = oModel.getData();
                oData.usuario.nome += ".";
                oModel.setData(oData);
                oView.setModel(oModel);
            },

            onTestOneTime: function(){
                var oView  = this.getView();
                
                var oModel = oView.getModel("onetime");
                var oData  = oModel.getData();

                debugger;

                oData.usuario.nome += ".";
                oModel.setData(oData);
                oView.setModel(oModel);
            }
        });
    });