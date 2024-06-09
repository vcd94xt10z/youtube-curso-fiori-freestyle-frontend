/*global QUnit*/

sap.ui.define([
	"zov/controller/OrdemForm.controller"
], function (Controller) {
	"use strict";

	QUnit.module("OrdemFormController");

	QUnit.test("Testando o método createEmptyOrderObject", function (assert) {
		var oAppController = new Controller();
		var oOrder = oAppController.createEmptyOrderObject();
		assert.strictEqual(typeof(oOrder),"object","Criação de objeto da ordem OK");
	});

	QUnit.test("Testando o método getOrderObject", function (assert) {
		var oAppController = new Controller();

		oAppController.getView = function(){
			return {
				getModel: function(){
					return {
						getData: function(){
							return {
								OrdemId: 0,
								DataCriacao: null,
								CriadoPor: "",
								ClienteId: "",
								TotalItens: 0.0,
								TotalFrete: 10.50,
								TotalOrdem: 0.0,
								Status: "N",
								toOVItem: [
									{
										ItemId: 1,
										Material: "1",
										Descricao: "Teste",
										Quantidade: 2,
										PrecoUni: 10,
										PrecoTot: 20
									}
								]
							};
						}
					}
				}
			}
		};

		assert.strictEqual(oAppController.getOrderObject().TotalOrdem,30.50,"getOrderObject OK");
	});
});