sap.ui.define([
    "zov/model/formatter"
],function(formatter){
    "use strict";

    QUnit.module("formatter");

    QUnit.test("Testando formatação de CPF",function(assert){
        var sCPF = "12345678910"; // 123.456.789-10
        var sValue = formatter.formatCPF(sCPF);
        assert.strictEqual(sValue,"123.456.789-10","Formatação de CPF OK");
    });

    QUnit.test("Testando formatação de CPF com 10 digitos",function(assert){
        var sCPF = "1234567891";
        var sValue = formatter.formatCPF(sCPF);
        assert.strictEqual(sValue,"123.456.789-1","Formatação de CPF 10 digitos OK");
    });

    QUnit.module("formatter2");
    QUnit.test("Testando formatação de CPF com letras",function(assert){
        var sCPF = "ABC";
        var sValue = formatter.formatCPF(sCPF);
        assert.ok(sValue == "123");
        //assert.strictEqual(sValue,"","Formatação de CPF com letras OK");
    });
});