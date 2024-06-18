sap.ui.define([
	"sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/PropertyStrictEquals",
    "sap/ui/test/actions/EnterText",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/matchers/Ancestor",
	"sap/ui/test/matchers/AggregationFilled"
], function (Opa5,Press,PropertyStrictEquals,EnterText, Properties, Ancestor, AggregationFilled) {
	"use strict";
	var sViewName = "OrdemForm";
	
	Opa5.createPageObjects({
		onTheOrderFormPage: {

			actions: {
				iEnterCreateAt: function (sName) {
					return this.waitFor({
                        viewName: sViewName,
						id: "OVCab.DataCriacao",
						actions: new EnterText({text: sName}),
						success: function () {
						},
						errorMessage: "Could not enter createAt"
					});
				},

				iEnterCreateBy: function (sName) {
					return this.waitFor({
                        viewName: sViewName,
						id: "OVCab.CriadoPor",
						actions: new EnterText({text: sName}),
						success: function () {
						},
						errorMessage: "Could not enter createBy"
					});
				},

				iEnterCustomerId: function (sName) {
					return this.waitFor({
                        viewName: sViewName,
						id: "OVCab.ClienteId",
						actions: new EnterText({text: sName}),
						success: function () {
						},
						errorMessage: "Could not enter customerid"
					});
				},

				iEnterTotalFreight: function (sName) {
					return this.waitFor({
                        viewName: sViewName,
						id: "OVCab.TotalFrete",
						actions: new EnterText({text: sName}),
						success: function () {
						},
						errorMessage: "Could not enter totalfreight"
					});
				},

				iAddItem: function (iIndex,sMatnr,sMaktx,iQuantity,fPriceUni) {
					return this.waitFor({
						viewName: sViewName,
						id: "table2",
						timeout: 5,
						matchers : new AggregationFilled({name : "rows"}),
						success: function(oTable){
							var aRows  = oTable.getRows();
							var aCells = aRows[iIndex].getCells();
							for(var j in aCells){
								var oCell = aCells[j];
								switch(j){
								case "1":
									oCell.setValue(sMatnr);
									break;
							    case "2":
								    oCell.setValue(sMaktx);
									break;
								case "3":
								    oCell.setValue(iQuantity);
									break;
								case "4":
									oCell.setValue(fPriceUni);
									break;
								}
							}
						},
						errorMessage: "The additem didn't work"
					});
				},

				iPressOnTheAddItemButton : function () {
					return this.waitFor({
						viewName: sViewName,
						id: "bt-additem",
						actions : new Press(),
						errorMessage : "The additem button could not be pressed"
					});
				},

				iSelectStatus: function (sValue) {
					this.waitFor({
                        viewName: sViewName,
						id: "OVCab.Status",
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
                                errorMessage: "Cannot select Status"
                            });
                        },
						errorMessage: "The status field was not found"
					});
				},

				iPressOnTheSaveButton : function () {
					return this.waitFor({
						viewName: sViewName,
						id: "bt-save",
						actions : new Press(),
						errorMessage : "The save button could not be pressed"
					});
				},

				iPressOnTheBackButton : function () {
					return this.waitFor({
						viewName: sViewName,
						id: "page2",
						actions: new Press(),
						errorMessage : "The back button could not be pressed"
					});
				}
			},

			assertions: {
				iShouldSeeThePage: function () {
					return this.waitFor({
						id: "page2",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The " + sViewName + " view is displayed");
						},
						errorMessage: "Did not find the " + sViewName + " view"
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
								Opa5.assert.ok(true, "The order was created successfully");
							}else{
								Opa5.assert.ok(false, "Fail to create order");
							}
						},
						errorMessage: "Fail to create order"
					});
				}
			}
		}
	});

});
