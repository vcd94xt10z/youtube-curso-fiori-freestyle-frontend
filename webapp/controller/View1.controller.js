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
                    "OrdenacaoTipo": "ASC"
                });
                oView.setModel(oFModel,"filter");
    
                this.onFilterSearch();
            },

            onFilterReset: function(){
    
            },
    
            onFilterSearch: function(oEvent){
                var oView   = this.getView();
                var oTable  = oView.byId("table1");
                var oFModel = oView.getModel("filter");
                var oFData  = oFModel.getData();
                var oFilter = null;
                var aParams = [];
    
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
    
                // executando filtro
                oTable.bindRows({
                    path: '/OVCabSet',
                    sorter: aSorter,
                    filters: aFilters
                });
            }
        });
    });