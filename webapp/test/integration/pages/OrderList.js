sap.ui.define([
	"sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/PropertyStrictEquals",
    "sap/ui/test/actions/EnterText",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/matchers/Ancestor",
	"sap/ui/test/matchers/AggregationFilled"
], function (Opa5,Press,PropertyStrictEquals,EnterText, Properties, Ancestor,AggregationFilled) {
	"use strict";
	var sViewName = "OrdemList";
	
	Opa5.createPageObjects({
		onTheOrderListPage: {

			actions: {
				iSelectSortField: function (sValue) {
					this.waitFor({
                        viewName: sViewName,
						id: "OrdenacaoCampo",
                        actions: new Press(),
                        success: function(oSelect){
                            this.waitFor({
                                viewName: sViewName,
                                controlType: "sap.ui.core.Item",
                                matchers: [
                                    new Ancestor(oSelect),
                                    new Properties({ key: sValue})
                                ],
                                actions: new Press(),
                                success: function() {
                                },
                                errorMessage: "Cannot select OrdenacaoCampo"
                            });
                        },
						errorMessage: "The OrdenacaoCampo field was not found"
					});
				},

				iSelectSortType: function (sValue) {
					this.waitFor({
                        viewName: sViewName,
						id: "OrdenacaoTipo",
                        actions: new Press(),
                        success: function(oSelect){
                            this.waitFor({
                                viewName: sViewName,
                                controlType: "sap.ui.core.Item",
                                matchers: [
                                    new Ancestor(oSelect),
                                    new Properties({ key: sValue})
                                ],
                                actions: new Press(),
                                success: function() {
                                },
                                errorMessage: "Cannot select OrdenacaoTipo"
                            });
                        },
						errorMessage: "The OrdenacaoTipo field was not found"
					});
				}, 

				iSelectFirstRecord: function () {
					return this.waitFor({
						viewName: sViewName,
						id: "table1",
						timeout: 15,
						matchers : new AggregationFilled({name : "rows"}),
						success: function(oTable){
							oTable.setSelectedIndex(0);
							
							//var aItems = oTable.getItems();

							//aItems[0].setSelected(true);

							return true;
						},
						errorMessage: "Fail to select first row of table table1"
					});
				},

				iEnterLimit: function (sName) {
					return this.waitFor({
                        viewName: sViewName,
						id: "Limite",
						actions: new EnterText({text: sName}),
						success: function () {
						},
						errorMessage: "Could not enter Limite"
					});
				},

				iEnterOrderId: function (sName) {
					return this.waitFor({
                        viewName: sViewName,
						id: "OVCab.OrdemId",
						actions: new EnterText({text: sName}),
						success: function () {
						},
						errorMessage: "Could not enter OrdemId"
					});
				},

				iPressOnTheFilterButton : function () {
					return this.waitFor({
						viewName: sViewName,
						id: "filterBar1",
						actions: function(oFilterBar){
							oFilterBar.search();
						},
						errorMessage : "The filter button could not be pressed"
					});
				},

				iPressOnTheNewButton : function () {
					return this.waitFor({
						viewName: sViewName,
						id: "bt-new",
						actions: new Press(),
						errorMessage : "The new button could not be pressed"
					});
				},

				iPressOnTheEditButton : function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new Properties({icon : "sap-icon://edit"}),
						actions: new Press(),
						errorMessage : "The edit button could not be pressed"
					});
				},

				iPressOnTheDeleteButton : function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new Properties({icon : "sap-icon://delete"}),
						actions: new Press(),
						errorMessage : "The delete button could not be pressed"
					});
				}
			},

			assertions: {

				iShouldSeeThePage: function () {
					return this.waitFor({
						id: "page1",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The " + sViewName + " view is displayed");
						},
						errorMessage: "Did not find the " + sViewName + " view"
					});
				},

				iShouldSeeTheOnlyOneRegister: function () {
					return this.waitFor({
						viewName: sViewName,
						id: "table1",
						timeout: 15,
						matchers : new AggregationFilled({name : "rows"}),
						check: function(oTable){
							var aRows  = oTable.getRows();

							var oBinding = oTable.getBinding("rows"); 
							//if(aRows.length == 1){
						    if(oBinding.getLength() == 1){
								return true;
							}
							return false;
						},
						success: function () {
							Opa5.assert.ok(true, "The record was found in table table1");
						},
						errorMessage: "The record was not found in table table1"
					});
				},

				iShouldSeeTheSuccessMessage: function () {
					return this.waitFor({
						//pollingInterval : 100,
						matchers: function () {
							return jQuery(".sapMMessageToast").text();
						  },
						success: function (sMessage) {
							if(sMessage.indexOf("sucesso") >= 0){
								Opa5.assert.ok(true, "Operation was successfully");
							}else{
								Opa5.assert.ok(false, "Fail to execute operation");
							}
						},
						errorMessage: "Fail to execute operation"
					});
				}
			}
		}
	});

});
