sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function (Controller, JSONModel, History, MessageToast) {
	"use strict";
	return Controller.extend("com.apptech.app.controller.Imports", {
		/**
		 * Binding
		 */
		onInit: function () {
			this.oImportPage = this.getView().byId("VwImport");
			this.oMdlImportLog = new JSONModel("model/ImportLogs.json");
			this.getView().setModel(this.oMdlImportLog, "xxx");
		},
		OnClickBack: function (oEvent) {
			var that = this;
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
				oRouter.navTo("Main", true);
			}
		},
		/*********************************************************************************************************************************
		 * Transaction
		 */
		/**
		 * Items
		 */
		OnClickImportItem: function (oEvent) {
			/** MCA 11/28/2019
			 * Get Items/Units from RE-Database
			 */
			var url ="https://realestateru7pg0l128.jp1.hana.ondemand.com/public/rexsjs/ExecQuery.xsjs?dbName=APP_RE&procName=SPAPP_INTEG_B1&queryType=GET_MASTERDATA_UNIT&colName=&colValue=";
			var oCredential = {};
			oCredential.UserName = "SYSTEM";
			oCredential.Password = "P@ssw0rd12345678";
			$.ajax({
				url: url,
				type: "GET",
				async: false,
				xhrFields: {
					withCredentials: true
				},
				error: function (xhr, status, error) {
					MessageToast.show(error);
				},
				success: function (json) {},
				context: this
			}).done(function (results) {
				if (results) {
					/*var data = JSON.stringify(results).replace(/[\[\]"]+/g,"");*/
					var count = results.length;
					var oProgress = this.byId("ProgItem");
					oProgress.setPercentValue(0);
					/*var oStardListItem = this.byId("ListImportLogs");*/
					for (var x = 0; x < count; x++) {
						oProgress.setPercentValue(x / count * 100);
						/*MessageToast.show(results[x].Code);*/
						/** MCA 11/28/2019
						 * Post to API Service Layer / SAP HANA Database
						 */
						var oItemDetails = {};
						var UnitCode = results[x].UnitCode;
						oItemDetails.ItemCode = UnitCode;
						oItemDetails.ItemName = results[x].UnitDesc;
						oItemDetails.ValidRemarks = "Posted from SAP UI5";
						var MethodType = "POST";
						var oUrl = "https://202.175.234.102:50000";
						/*	if (this.FormMode === "Add") {*/
						MethodType = "POST";
						
						/*	} else {*/
						/*		MethodType = "PATCH";
							oUrl = "/destinations/APP_SL/b1s/v1/Items('" + UnitCode + "')";
					/*	}*/
						$.ajax({
							url: oUrl + "/destinations/APP_SL/b1s/v1/Items",
							data: JSON.stringify(oItemDetails),
							type: MethodType,
							async: false,
							context: this,
							xhrField: {
								withCredentials: true
							},
							error: function (xhr, Status, error) {
								/*push on List Model  */
								var oError = {};
								oError.Description = UnitCode;
								oError.Status = "Error";
								oError.InfoState = "Error";
								this.oMdlImportLog.getData().Logs.push(oError);
								this.oMdlImportLog.refresh();
							},
							success: function (json) {}
						}).done(function (PostResults) {
							if (PostResults) {
								var oSuccess = {};
								oSuccess.Description = UnitCode;
								oSuccess.Status = "Success";
								oSuccess.InfoState = "Success";
								this.oMdlImportLog.refresh();
							}
						});
					}
					oProgress.setPercentValue(100);
					MessageToast.show("Succesfully Added/Updated (" + count + ") Item");
				}
			});
		},
		/**
		 * BP
		 */
		OnClickImportBP: function (oEvent) {
				/** MCA 11/28/2019
				 * Get BP from RE-Database
				 */
				var url ="https://realestateru7pg0l128.jp1.hana.ondemand.com/public/rexsjs/public/rexsjs/ExecQuery.xsjs?dbName=APP_RE&procName=SPAPP_INTEG_B1&queryType=GET_MASTERDATA_CUSTOMER&colName=&colValue=";
				var oCredential = {};
				oCredential.UserName = "SYSTEM";
				oCredential.Password = "P@ssw0rd12345678";
				$.ajax({
					url: url,
					type: "GET",
					async: false,
					xhrFields: {
						withCredentials: true
					},
					error: function (xhr, status, error) {
						MessageToast.show(error);
					},
					success: function (json) {},
					context: this
				}).done(function (results) {
					if (results) {
						/*var data = JSON.stringify(results).replace(/[\[\]"]+/g,"");*/
						var count = results.length;
						var oProgress = this.byId("ProgBP");
						oProgress.setPercentValue(0);
						for (var x = 0; x < count; x++) {
							oProgress.setPercentValue(x / count * 100);
							/*MessageToast.show(results[x].Code);*/
							/** MCA 11/28/2019
							 * Post to API Service Layer / SAP HANA Database
							 */
							var oBPDetails = {};
							var i = x + 1;
							var CarCode = "C00000" + i;
							oBPDetails.CardCode = CarCode;
							oBPDetails.CardName = results[x].FirstName + " " + results[x].MiddleName + " " + results[x].LastName;
							oBPDetails.GlobalLocationNumber = "Posted from SAP UI5";
							var MethodType = "POST";
							var oUrl = "";
							/*	if (this.FormMode === "Add") {*/
							MethodType = "POST";
							oUrl = "https://202.175.234.102:50000/b1s/v1/BusinessPartners";
							/*	} else {*/
							/*		MethodType = "PATCH";
							oUrl = "/destinations/APP_SL/b1s/v1/BusinessPartners('" + CarCode + "')";
					/*	}*/
							$.ajax({
								url: oUrl,
								data: JSON.stringify(oBPDetails),
								type: MethodType,
								context: this,
								async: false,
								xhrField: {
									withCredentials: true
								},
								error: function (xhr, Status, error) {
								
									var oError = {};
									oError.Description = CarCode;
									oError.Status = "Error";
									oError.InfoState = "Error";
									this.oMdlImportLog.getData().Logs.push(oError);
									this.oMdlImportLog.refresh();
								},
								success: function (json) {}
							}).done(function (PostResults) {
								if (PostResults) {
									var oSuccess = {};
									oSuccess.Description = CarCode;
									oSuccess.Status = "Error";
									oSuccess.InfoState = "Error";
									this.oMdlImportLog.getData().Logs.push(oSuccess);
									this.oMdlImportLog.refresh();
								}
							});
						}
						oProgress.setPercentValue(100);
						MessageToast.show("Succesfully Added/Updated (" + count + ") Business Partner");
					}
				});
			},
		/**
		 * Project
		 */
		onClickImportProject: function (oEvent) {
		
				 /** MCA 11/28/2019
				 * Get Project from RE-Database
				 */
				var url ="https://realestateru7pg0l128.jp1.hana.ondemand.com/public/rexsjs/public/rexsjs/ExecQuery.xsjs?dbName=APP_RE&procName=SPAPP_INTEG_B1&queryType=GET_MASTERDATA_PROJECT&colName=&colValue=";
				var oCredential = {};
				oCredential.UserName = "SYSTEM";
				oCredential.Password = "P@ssw0rd12345678";
				$.ajax({
					url: url,
					type: "GET",
					async: false,
					xhrFields: {
						withCredentials: true
					},
					error: function (xhr, status, error) {
						MessageToast.show(error);
					},
					success: function (json) {},
					context: this
				}).done(function (results) {
					if (results) {
						/*var data = JSON.stringify(results).replace(/[\[\]"]+/g,"");*/
						var count = results.length;
						var oProgress = this.byId("ProgProj");
						oProgress.setPercentValue(0);
						for (var x = 0; x < count; x++) {
							oProgress.setPercentValue(x / count * 100);
							/*MessageToast.show(results[x].Code);*/
							/** MCA 11/28/2019
							 * Post to API Service Layer / SAP HANA Database
							 */
							var oProjDetails = {};
							var ProjCode = results[x].ProjectCode;
							oProjDetails.Code = ProjCode;
							oProjDetails.Name = results[x].ProjectDesc;
							/*oProjDetails.GlobalLocationNumber = "Posted from SAP UI5";*/
							var MethodType = "POST";
							var oUrl = "";
							/*	if (this.FormMode === "Add") {*/
							MethodType = "POST";
							oUrl = "https://202.175.234.102:50000/b1s/v1/Projects";
							/*	} else {*/
							/*		MethodType = "PATCH";
							oUrl = "/destinations/APP_SL/b1s/v1/BusinessPartners('" + CarCode + "')";
					/*	}*/
							$.ajax({
								url: oUrl,
								data: JSON.stringify(oProjDetails),
								type: MethodType,
								context: this,
								async: false,
								xhrField: {
									withCredentials: true
								},
								error: function (xhr, Status, error) {
								
									var oError = {};
									oError.Description = ProjCode;
									oError.Status = "Error";
									oError.InfoState = "Error";
									this.oMdlImportLog.getData().Logs.push(oError);
									this.oMdlImportLog.refresh();
								},
								success: function (json) {}
							}).done(function (PostResults) {
								if (PostResults) {
									var oSuccess = {};
									oSuccess.Description = ProjCode;
									oSuccess.Status = "Error";
									oSuccess.InfoState = "Error";
									this.oMdlImportLog.getData().Logs.push(oSuccess);
									this.oMdlImportLog.refresh();
								}
							});
						}
						oProgress.setPercentValue(100);
						MessageToast.show("Succesfully Added/Updated (" + count + ") Projects");
					}
				});
		
		
		}

	
		/*********************************************************************************************************************************
		 * End Transaction
		 */
		
	});
});