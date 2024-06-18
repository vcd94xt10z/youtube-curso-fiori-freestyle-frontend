/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit",
	"./pages/OrderList",
	"./pages/OrderForm"
], function (opaTest) {
	"use strict";

	QUnit.module("Navigation Journey");

	setTimeout(function(){
		opaTest("I should see initial page", function (Given, When, Then) {
			// Arrangements
			Given.iStartMyApp();
	
			// Assertions
			Then.onTheOrderListPage.iShouldSeeThePage();
		});

		opaTest("I should create new order", function (Given, When, Then) {
			When.onTheOrderListPage.iPressOnTheNewButton();
			Then.onTheOrderFormPage.iShouldSeeThePage();

			When.onTheOrderFormPage.iEnterCreateAt("01/01/2000 01:50:00");
			When.onTheOrderFormPage.iEnterCreateBy("ABAP");
			When.onTheOrderFormPage.iEnterCustomerId(1);
			When.onTheOrderFormPage.iEnterTotalFreight("1,50");
			When.onTheOrderFormPage.iSelectStatus('N');

			When.onTheOrderFormPage.iPressOnTheSaveButton();
			Then.onTheOrderFormPage.iShouldSeeTheSuccessMessage();
			
			When.onTheOrderFormPage.iPressOnTheBackButton();
			Then.onTheOrderListPage.iShouldSeeThePage();
		});

		opaTest("I should edit order", function (Given, When, Then) {
			When.onTheOrderListPage.iSelectSortField("OrdemId");
			When.onTheOrderListPage.iSelectSortType("DESC");
			When.onTheOrderListPage.iEnterLimit(1);
			When.onTheOrderListPage.iPressOnTheFilterButton();
			Then.onTheOrderListPage.iShouldSeeTheOnlyOneRegister();
			When.onTheOrderListPage.iPressOnTheEditButton();

			Then.onTheOrderFormPage.iShouldSeeThePage();
			When.onTheOrderFormPage.iEnterCustomerId(2);
			When.onTheOrderFormPage.iEnterTotalFreight("20,33");
			When.onTheOrderFormPage.iSelectStatus('L');

			When.onTheOrderFormPage.iPressOnTheAddItemButton();
			When.onTheOrderFormPage.iAddItem(0,'100','TECLADO',1,"1,99");

			When.onTheOrderFormPage.iPressOnTheAddItemButton();
			When.onTheOrderFormPage.iAddItem(1,'200','MOUSE',1,"2,50");

			When.onTheOrderFormPage.iPressOnTheSaveButton();
			Then.onTheOrderFormPage.iShouldSeeTheSuccessMessage();
			When.onTheOrderFormPage.iPressOnTheBackButton();

			Then.onTheOrderListPage.iShouldSeeThePage();
		});

		opaTest("I should delete order", function (Given, When, Then) {
			When.onTheOrderListPage.iSelectSortField("OrdemId");
			When.onTheOrderListPage.iSelectSortType("DESC");
			When.onTheOrderListPage.iEnterLimit(1);
			When.onTheOrderListPage.iPressOnTheFilterButton();
			Then.onTheOrderListPage.iShouldSeeTheOnlyOneRegister();
			When.onTheOrderListPage.iPressOnTheDeleteButton();
			
			Then.onTheOrderListPage.iShouldSeeTheSuccessMessage();
		});

		opaTest("I should finish", function (Given, When, Then) {
			Then.onTheOrderListPage.iShouldSeeThePage();
			Then.iTeardownMyApp();
		});
	},1);
});