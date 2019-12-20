sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
	"use strict";
	return Controller.extend("com.apptech.app.controller.Main", {
		onInit: function () {
			
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Main", true);
			
		
			var oModel = new JSONModel("model/News.json");
			this.getView().setModel(oModel, "news");
			
		},
		formatJSONDate: function (date) {
			var oDate = new Date(Date.parse(date));
			return oDate.toLocaleDateString();
		},
	
		 
		onClickConfig: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Configuration", true);
		},
		/**
		 *@memberOf UTILITY.UTILITY.controller.Main
		 */
		onClickImports: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Imports", true);
		}
	});
});