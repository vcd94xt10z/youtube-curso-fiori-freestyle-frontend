sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageToast) {
        "use strict";

        return Controller.extend("zov.controller.View2", {
            onInit: function () {
                var oView   = this.getView();
                var oFModel = new sap.ui.model.json.JSONModel();
                
                oFModel.setData({
                    "OrdemId": "",
                    "DataCriacao": "",
                    "CriadoPor": "",
                    "ClienteId": "",
                    "TotalItens": "",
                    "TotalFrete": "",
                    "TotalOrdem": "",
                    "Status": "",
                    "OrdenacaoCampo": "OrdemId",
                    "OrdenacaoTipo": "ASC",
                    "Limite": 10,
                    "Offset": 0
                });
                oView.setModel(oFModel,"filter");

                var oTModel = new sap.ui.model.json.JSONModel();
                oTModel.setData([]);
                oView.setModel(oTModel,"table");
    
                this.onFilterSearch();
            },

            onFilterReset: function(){
            },
    
            onFilterSearch: function(oEvent){
                var oView   = this.getView();
                var oModel  = this.getOwnerComponent().getModel();
                var oFModel = oView.getModel("filter");
                var oTModel = oView.getModel("table");
                var oFData  = oFModel.getData();
                var oFilter = null;
                var aParams = [];
                var that    = this;
    
                // aplicando filtros
                var aSorter  = [];
                var aFilters = [];
                
                if(oFData.OrdemId != ''){
                    oFilter = new sap.ui.model.Filter({
                        path: 'OrdemId',
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: oFData.OrdemId
                    });
                    aFilters.push(oFilter);
                }
    
                if(oFData.DataCriacao != ''){
                    oFilter = new sap.ui.model.Filter({
                        path: 'DataCriacao',
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: oFData.DataCriacao
                    });
                    aFilters.push(oFilter);
                }
    
                if(oFData.ClienteId != ''){
                    oFilter = new sap.ui.model.Filter({
                        path: 'ClienteId',
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: oFData.ClienteId
                    });
                    aFilters.push(oFilter);
                }
    
                var bDescending = false;
                if(oFData.OrdenacaoTipo == "DESC"){
                    bDescending = true;
                }
                var oSort = new sap.ui.model.Sorter(oFData.OrdenacaoCampo,bDescending);
                aSorter.push(oSort);

                // limite, offset
                aParams.push("$top="+oFData.Limite);
                aParams.push("$skip="+oFData.Offset);

                // executando filtro
                this.getView().setBusy(true);
                oModel.read("/OVCabSet",{
                    sorters: aSorter,
                    filters: aFilters,
                    urlParameters: aParams,

                    success: function(oData2, oResponse){
                        that.getView().setBusy(false);
                        oTModel.setData(oData2.results);
                    },
                    error: function(oError){
                        that.getView().setBusy(false);
                        MessageToast.show("Erro");
                    }
                });
            }
        });
    });