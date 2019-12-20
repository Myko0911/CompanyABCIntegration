sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/routing/History"
], function (Controller, JSONModel, MessageToast, History) {
	"use strict";
	return Controller.extend("com.apptech.app.controller.Configuration", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf UTILITY.UTILITY.view.Configuration
		 */
		onInit: function () {
			
			this.oConfigPage = this.getView().byId("VwConfig");
		
			
		},
	
		/** MCA Add this Click Back get the previous Form */
		
		OnClickBack: function (oEvent) {
		
			var that=this;
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
				oRouter.navTo("Main", true);
			}
			
		
			
			
		},
		/**
		 *@memberOf UTILITY.UTILITY.controller.Configuration
		 */
		OnConnectToAPI: function (oEvent) {
			//This code was generated by the layout editor.
			
		
			
		},
		/**
		 *@memberOf UTILITY.UTILITY.controller.Configuration
		 */
		OnConnectToSAPCloud: function (oEvent) {
		
				var that = this;
				var oPassword = that.byId("SAPPassword").getValue();
				var oLoginCredentials = {};
				oLoginCredentials.CompanyDB = that.getView().byId("SAPDB").getSelectedKey();
				oLoginCredentials.UserName = that.byId("SAPUserName").getValue();
				oLoginCredentials.Password = oPassword;
				var cred = btoa('{"CompanyDB":"SBODEMOAU","UserName":"manager"}' + ":" + oPassword);

				$.ajax({
					url: "https://202.175.234.102:50000/b1s/v1/Login",
					beforeSend: function (request){
						request.withCredentials = true;
						request.setRequestHeader("Authorization", "Basic " + cred );
						},
					data: JSON.stringify(oLoginCredentials),	
					async: false,
					type: "POST",
					xhrField: {
						withCredentials: true
					},
					error: function (xhr, Status, error) {
					
					//	MessageToast.show("Invalid Credentials " + error);

					},
					success: function (json) {}
				}).done(function (results) {
					if (results) {
						//sap.m.MessageToast.show("Session ID", results.SessionId);
						MessageToast.show("Successfully Login " + results.SessionId);
						



					}
				});

			
		
		
		}
	});
});