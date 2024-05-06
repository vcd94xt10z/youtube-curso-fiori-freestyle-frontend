sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "../model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageToast,formatter) {
        "use strict";

        return Controller.extend("zov.controller.View1", {
            formatter: formatter,

            onInit: function () {
                var oView   = this.getView();
                var oModel = new sap.ui.model.json.JSONModel();
                
                oModel.setData({
                    "DataCriacao": new Date(),
                    "Preco": 1500.23,
                    "Status": "N",
                    "Moeda": "BRL",
                    "CPF": "12345678910"
                });
                
                oView.setModel(oModel,"dados");
            },

            onChangePrice: function(oEvent){
                var _oInput = oEvent.getSource();
                var val = _oInput.getValue();
                val = val.replace(/[^\d]/g, '');

                if(val == ""){
                    _oInput.setValue(val);
                    return;
                }

                // removendo zero a esquerda
                val = val.replace(/^0+/, '');

                var length = val.length;
                if(length == 1){
                    val = "0,0"+val;
                }else if(length == 2){
                    val = "0,"+val;
                }else if(length > 2){
                    val = val.slice(0,length-2)+"."+val.slice(-2);
                    val = formatter.formatPrice(val);
                }else{
                    val = "";
                }
                
                _oInput.setValue(val);
            }
        });
    });