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

            oDialogMessageList: null,
            aUpdateStatusQueue: [],    // array da fila de atualização de status
            aUpdateStatusMessages: [], // array da mensagens

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
            },

            onChangeStatus: function(sStatus){
                var that   = this;
                var oView = that.getView();
                var oTable = oView.byId("table1");
                var aData  = oView.getModel("table").getData();

                var aIndex = oTable.getSelectedIndices();
                if(aIndex.length == 0){
                    MessageToast.show("Marque ao menos 1 item");
                    return;
                }

                this.aUpdateStatusQueue    = [];
                this.aUpdateStatusMessages = [];

                for(var i in aIndex){
                    try {
                        var iIndex   = aIndex[i];
                        //var oRow     = oTable.getRows()[iIndex];
                        //var sOrdemId = oRow.getCells()[0].getText();
                        var sOrdemId = aData[iIndex].OrdemId;

                        this.aUpdateStatusQueue.push({
                            OrdemId: sOrdemId,
                            Status: sStatus
                        });
                    }catch(e){
                        console.log(e);
                        console.log("i="+i);
                        console.log("iIndex="+iIndex);
                    }
                }

                this.runUpdateStatusQueue();
            },

            runUpdateStatusQueue: function(){
                var that   = this;
                var oQueue = this.aUpdateStatusQueue.pop();

                if(oQueue == undefined){
                    this.getView().setBusy(false);
                    this.onOpenMessageListDialog(this.aUpdateStatusMessages);
                    this.onFilterSearch();
                    return;
                }

                var oModel = this.getOwnerComponent().getModel();
                this.getView().setBusy(true);
                oModel.callFunction(
                    "/ZFI_ATUALIZA_STATUS",
                    {
                    method: "GET",
                    urlParameters: {
                        ID_ORDEMID: oQueue.OrdemId,
                        ID_STATUS: oQueue.Status
                    },
                    success: function(oData, response) {
                        for(var i in oData.results){
                            that.aUpdateStatusMessages.push(oData.results[i]);
                        }
                        that.runUpdateStatusQueue();
                    },
                    error: function(oResponse) {
                        try {
                            var oError = JSON.parse(oResponse.responseText);
                            //MessageToast.show(oError.error.message.value);
                            that.aUpdateStatusMessages.push({
                                "Tipo": "E",
                                "Mensagem": "Erro ao atualizar ordem "+oQueue.OrdemId+": "+oError.error.message.value 
                            });
                        }catch(e){
                            that.aUpdateStatusMessages.push({
                                "Tipo": "E",
                                "Mensagem": "Erro ao atualizar ordem "+oQueue.OrdemId 
                            });
                        }

                        that.runUpdateStatusQueue();
                    }
                });
            },

            onOpenMessageListDialog: function(aMessageList){
                var that  = this;
                var sName = "zov.view.MessageList";

                var oModel = new sap.ui.model.json.JSONModel(aMessageList);
                this.getView().setModel(oModel,"messageList");
                
                if(!this.oDialogMessageList){
                    this.loadFragment({
                        name: sName
                    }).then(function(oDialog2) {
                        that.oDialogMessageList = oDialog2;

                        that.oDialogMessageList.open();
                    }.bind(this));
                }else{
                    this.oDialogMessageList.open();
                }
            },

            onCloseMessageListDialog: function(){
                this.byId("MessageListDialog").close();
            }
        });
    });