sap.ui.define([
    //"sap/ui/core/mvc/Controller",
    "zov/controller/BaseController",
    "sap/m/MessageToast",
    "../model/formatter",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageToast,formatter,History,UIComponent) {
        "use strict";

        return Controller.extend("zov.controller.OrdemForm", {
            formatter: formatter,

            formMode: "I",

            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteOrdemNew").attachMatched(this._onRouteMatchedNew,this);
                oRouter.getRoute("RouteOrdemEdit").attachMatched(this._onRouteMatchedEdit,this);
            },

            liveChangeItemQuantity: function(oEvent){
                var _oInput = oEvent.getSource();
                var val = _oInput.getValue();
                val = val.replace(/[^\d]/g, '');
                _oInput.setValue(val);

                this.recalcOrder();
            },

            liveChangePrice: function(oEvent){
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
                    val = "0.0"+val;
                }else if(length == 2){
                    val = "0."+val;
                }else if(length > 2){
                    val = val.slice(0,length-2)+"."+val.slice(-2);
                }else{
                    val = "";
                }

                // GAMBIARRA para atualizar o model usando formatação e liveUpdate ao mesmo tempo
                // caso encontre uma solução melhor, faço o ajuste no futuro
                
                //_oInput.setValue(val);

                var oView      = this.getView();
                var oModel     = oView.getModel();
                var oData      = oModel.getData();
                var oContext   = _oInput.getBindingContext();
                var sInputPath = _oInput.mBindingInfos.value.binding.sPath;
                //debugger;
                
                if(sInputPath == "/TotalFrete"){
                    // TotalFrete
                    oData.TotalFrete = parseFloat(val);
                }else{
                    //var oObject = oContext.getObject();
                    var sPath  = oContext.getPath();
                    var aPath  = sPath.split("/");
                    var iIndex = [];

                    // PrecoUni
                    if(sInputPath == "PrecoUni"){
                        iIndex = parseInt(aPath[2]);
                        oData.toOVItem[iIndex].PrecoUni = parseFloat(val);
                    }
                }

                this.recalcOrder();
            },

            recalcOrder: function(){
                var oView  = this.getView();
                var oModel = oView.getModel();
                var oOrdem = this.getOrderObject();
                oModel.setData(oOrdem);
                oView.setModel(oModel);
            },

            onNewItem: function(){
                var oView     = this.getView();
                var oModel    = oView.getModel();
                var oOrdem    = oModel.getData();
                var aToOVItem = oOrdem.toOVItem;

                var lastItemId = 0;
                for(var i in aToOVItem){
                    if(aToOVItem[i].ItemId > lastItemId){
                        lastItemId = aToOVItem[i].ItemId;
                    }
                }

                // clonando objeto
                var item = this.createEmptyItem();

                item.ItemId = lastItemId + 1;

                aToOVItem.push(item);
                oOrdem.toOVItem = aToOVItem;

                oModel.setData(oOrdem);
                oView.setModel(oModel);
            },

            onDeleteItem: function(oEvent){
                var oSource   = oEvent.getSource();
                var sItemId   = oSource.data("ItemId");

                var oView     = this.getView();
                var oModel    = oView.getModel();
                var oOrdem    = oModel.getData();
                var aToOVItem = oOrdem.toOVItem;

                for(var i in aToOVItem){
                    if(aToOVItem[i].ItemId == sItemId){
                        aToOVItem.splice(i,1);
                        break;
                    }
                }

                oOrdem.toOVItem = aToOVItem;
                oModel.setData(oOrdem);
                oView.setModel(oModel);

                this.recalcOrder();
            },

            getOrderObject: function(){
                var oView  = this.getView();
                var oModel = oView.getModel();
                var oOrdem = oModel.getData();

                // cabeçalho
                oOrdem.OrdemId    = this.parseInt(oOrdem.OrdemId);
                oOrdem.TotalFrete = this.parsePrice(oOrdem.TotalFrete);
                
                // itens
                oOrdem.TotalItens = 0;
                for(var i in oOrdem.toOVItem){
                    oOrdem.toOVItem[i].Quantidade = this.parseInt(oOrdem.toOVItem[i].Quantidade);
                    oOrdem.toOVItem[i].PrecoUni   = this.parsePrice(oOrdem.toOVItem[i].PrecoUni);
                    oOrdem.toOVItem[i].PrecoTot   = oOrdem.toOVItem[i].Quantidade * oOrdem.toOVItem[i].PrecoUni;

                    oOrdem.TotalItens = oOrdem.TotalItens + oOrdem.toOVItem[i].PrecoTot;
                }
                oOrdem.TotalOrdem = oOrdem.TotalItens + oOrdem.TotalFrete;

                return oOrdem;
            },

            getOrderOData: function(){
                var oOrdem = this.getOrderObject();

                // cabeçalho
                if(oOrdem.OrdemId == ""){
                    oOrdem.OrdemId = 0;
                }
                oOrdem.ClienteId = this.parseInt(oOrdem.ClienteId);

                oOrdem.TotalItens = oOrdem.TotalItens.toFixed(2);
                oOrdem.TotalFrete = oOrdem.TotalFrete.toFixed(2);
                oOrdem.TotalOrdem = oOrdem.TotalOrdem.toFixed(2);

                // items
                for(var i in oOrdem.toOVItem){
                    oOrdem.toOVItem[i].PrecoUni = oOrdem.toOVItem[i].PrecoUni.toFixed(2);
                    oOrdem.toOVItem[i].PrecoTot = oOrdem.toOVItem[i].PrecoTot.toFixed(2);
                }

                return oOrdem;
            },

            createEmptyOrderObject: function(){
                var oOrdem = {
                    OrdemId: "",
                    DataCriacao: null,
                    CriadoPor: "",
                    ClienteId: "",
                    TotalItens: 0.0,
                    TotalFrete: 0,
                    TotalOrdem: 0.0,
                    Status: "",
                    toOVItem: []
                };
                return oOrdem;
            },

            createEmptyItem: function(){
                var oItem = {
                    ItemId: 0,
                    Material: "",
                    Descricao: "",
                    Quantidade: "",
                    PrecoUni: "",
                    PrecoTot: ""
                };
                return oItem;
            },

            onDelete: function(){
                var oOrdem = this.getOrderOData();
                var that   = this;

                if(oOrdem.OrdemId == 0){
                    MessageToast.show("Só é possível deletar uma ordem que existe");
                    return;
                }

                this.onDeleteOrder(oOrdem.OrdemId,function(sStatus){
                    if(sStatus=="S"){
                        // limpando dados da tela
                        var oModel = new sap.ui.model.json.JSONModel();
                        oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
                        oModel.setData(that.createEmptyOrderObject());
                        that.getView().setModel(oModel);

                        // redirecionando para a listagem
                        sap.ui.core.UIComponent.getRouterFor(that).navTo("RouteOrdemList");
                    }
                });
            },

            onSave: function(){
                var that     = this;
                var oView    = this.getView();
                var oModel1  = this.getOwnerComponent().getModel();
                var oModel2  = oView.getModel();
                var oOrdem   = this.getOrderOData();
                
                // validações
                var oClienteId = this.getView().byId("OVCab.ClienteId");
                oClienteId.setValueState("None");

                if(oOrdem.ClienteId == 0){
                    oClienteId.setValueState("Error");
                    MessageToast.show("Cliente vazio");
                    return;
                }

                if(this.formMode == "I"){
                    // gerar os IDs quando usa mockdata
                    if(this.isUsingMockData()){
                        if(!this.iLastOrdemId){
                            this.iLastOrdemId = 1000;
                        }
                        oOrdem.OrdemId = this.iLastOrdemId;
                        this.iLastOrdemId++;
                    }

                    oView.setBusy(true);
                    oModel1.create("/OVCabSet",oOrdem,{
                        success: function(oData, oResponse){
                            // ajustando itens que voltam dentro do campo results
                            oData.toOVItem = oData.toOVItem.results;

                            oModel2.setData(oData);
                            if(oResponse.statusCode == 201){
                                // bloqueando campos
                                oView.byId("OVCab.DataCriacao").setEditable(false);
                                oView.byId("OVCab.CriadoPor").setEditable(false);
                                oView.byId("bt-delete").setVisible(true);

                                MessageToast.show("Ordem cadastrada com sucesso");
                            }else{
                                MessageToast.show("Erro ao salvar");    
                            }

                            oView.setBusy(false);
                        },
                        error: function(oResponse){
                            var oError = JSON.parse(oResponse.responseText);
                            MessageToast.show(oError.error.message.value);
                            oView.setBusy(false);
                        }}
                    );
                }else{
                    oView.setBusy(true);
                    
                    if(this.isUsingMockData()){
                        // usando mock, o objeto esta sendo duplicado ao invés de ser atualizado
                        // para corrigir isso, o objeto anterior esta sendo deletado
                        oModel1.remove("/OVCabSet("+oOrdem.OrdemId+")",{
                            success: function(oData2, oResponse){
                                oModel1.create("/OVCabSet",oOrdem,{
                                    success: function(oData, oResponse){
                                        if(oResponse.statusCode == 204 || oResponse.statusCode == 201){
                                            MessageToast.show("Ordem atualizada com sucesso");
                                        }
                                        oView.setBusy(false);
                                    },
                                    error: function(oResponse){
                                        var oError = JSON.parse(oResponse.responseText);
                                        MessageToast.show(oError.error.message.value);
                                        oView.setBusy(false);
                                    }}
                                );
                            },
                            error: function(oResponse){}
                        });
                    }else{
                        // com deep entity, o método create é usado para atualizar também
                        oModel1.create("/OVCabSet",oOrdem,{
                            success: function(oData, oResponse){
                                if(oResponse.statusCode == 204 || oResponse.statusCode == 201){
                                    MessageToast.show("Ordem atualizada com sucesso");
                                }
                                oView.setBusy(false);
                            },
                            error: function(oResponse){
                                var oError = JSON.parse(oResponse.responseText);
                                MessageToast.show(oError.error.message.value);
                                oView.setBusy(false);
                            }}
                        );
                    }
                }
            },

            _onRouteMatchedNew: function(oEvent){
                this.formMode = "I";

                var oView = this.getView();

                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
                oModel.setData(this.createEmptyOrderObject());
                oView.setModel(oModel);

                oView.byId("OVCab.DataCriacao").setEditable(true);
                oView.byId("OVCab.CriadoPor").setEditable(true);
                oView.byId("OVCab.ClienteId").setValueState("None");
                oView.byId("bt-delete").setVisible(false);

                this.recalcOrder();
            },

            _onRouteMatchedEdit: function(oEvent){
                var that     = this;
                var oView    = this.getView();
                var oArgs    = oEvent.getParameter("arguments");
                var sOrdemId = oArgs.OrdemId;
                var oModel   = this.getOwnerComponent().getModel();
                var oModel1  = null;

                this.formMode = "U";
                
                // limpando dados
                oModel1 = new sap.ui.model.json.JSONModel(this.createEmptyOrderObject());
                oModel1.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);

                oView.byId("OVCab.DataCriacao").setEditable(false);
                oView.byId("OVCab.CriadoPor").setEditable(false);
                oView.byId("OVCab.ClienteId").setValueState("None");
                oView.byId("bt-delete").setVisible(true);
                
                oView.setBusy(true);

                // cabeçalho
                oModel.read("/OVCabSet("+sOrdemId+")",{
                    success: function(oOrdem, oResponse){
                        // items
                        oModel.read("/OVCabSet("+sOrdemId+")/toOVItem",{
                            success: function(oData, oResponse){
                                oOrdem.toOVItem = oData.results;
                                oModel1.setData(oOrdem);
                                oView.setModel(oModel1);
                                
                                that.recalcOrder();
                                oView.setBusy(false);
                            },
                            error: function(oError){
                                var oError = JSON.parse(oResponse.responseText);
                                MessageToast.show(oError.error.message.value);
                                oView.setBusy(false);
                            }
                        });
                    },
                    error: function(oResponse){
                        var oError = JSON.parse(oResponse.responseText);
                        MessageToast.show(oError.error.message.value);
                        oView.setBusy(false);
                    }
                });
            }
        });
    });