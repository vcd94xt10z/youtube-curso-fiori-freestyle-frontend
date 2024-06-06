sap.ui.define([
    //"sap/ui/core/mvc/Controller",
    "zov/controller/BaseController",
    "sap/m/MessageToast",
    "../model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageToast,formatter) {
        "use strict";

        return Controller.extend("zov.controller.OrdemList", {
            formatter: formatter,

            onInit: function(){
                var oView   = this.getView();
                var oFModel = new sap.ui.model.json.JSONModel();
    
                oFModel.setData({
                    "OrdemId": "",
                    "DataCriacao": null,
                    "CriadoPor": "",
                    "ClienteId": "",
                    "TotalItens": 0,
                    "TotalFrete": 0,
                    "TotalOrdem": 0,
                    "Status": "",
                    "OrdenacaoCampo": "OrdemId",
                    "OrdenacaoTipo": "ASC",
                    "Limite": 25,
                    "Ignorar": 0
                });
                oView.setModel(oFModel,"filter");

                var oTModel = new sap.ui.model.json.JSONModel();
                oTModel.setData([]);
                oView.setModel(oTModel,"table");
    
                //this.onFilterSearch();

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteOrdemList").attachMatched(this._onRouteMatchedList,this);
            },
    
            onFilterReset: function(){
    
            },
    
            onFilterSearch: function(oEvent){
                var oView   = this.getView();
                var oModel  = this.getOwnerComponent().getModel();
                var oTable  = oView.byId("table1");
                var oFModel = oView.getModel("filter");
                var oTModel = oView.getModel("table");
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
                if(oFData.OrdenacaoCampo != ''){
                    var oSort = new sap.ui.model.Sorter(oFData.OrdenacaoCampo,bDescending);
                    aSorter.push(oSort);
                }
    
                // limite, offset
                aParams.push("$top="+oFData.Limite);
                aParams.push("$skip="+oFData.Ignorar);
    
                // executando filtro
                oView.setBusy(true);
                oModel.read("/OVCabSet",{
                    sorters: aSorter,
                    filters: aFilters,
                    urlParameters: aParams,

                    success: function(oData2, oResponse){
                        oView.setBusy(false);
                        oTModel.setData(oData2.results);
                    },
                    error: function(oError){
                        oView.setBusy(false);
                        MessageToast.show("Erro");
                    }
                });
            },
    
            onNew: function(oEvent){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteOrdemNew");
            },

            onEdit: function(oEvent){
                var oSource = oEvent.getSource();
                var sOrdemId = oSource.data("OrdemId");
                
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteOrdemEdit",{OrdemId:sOrdemId});
            },

            onDelete: function(oEvent){
                var oSource  = oEvent.getSource();
                var sOrdemId = oSource.data("OrdemId");
                var that     = this;

                this.onDeleteOrder(sOrdemId,function(sStatus){
                    if(sStatus == 'S'){
                        that.onFilterSearch();
                    }
                });
            },
            
            _onRouteMatchedList: function(oEvent){
                this.onFilterSearch();
            }
        });
    });