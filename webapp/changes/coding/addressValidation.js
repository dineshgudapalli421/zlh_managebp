sap.ui.define(
    [
        'sap/ui/core/mvc/ControllerExtension',
        "sap/m/MessageToast",
        "sap/m/MessageBox",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator"

        // ,'sap/ui/core/mvc/OverrideExecution'
    ],
    function (
        ControllerExtension,
        MessageToast,
        MessageBox,
        Filter,
        FilterOperator
        // ,OverrideExecution
    ) {
        'use strict';
        var sTableId;
        return ControllerExtension.extend("customer.app.managebp.addressValidation", {
            override: {
                beforeSaveExtension: function () {
                    let manageBPStreet = sap.ui.getCore().byId("mdm.md.businesspartner.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::C_BusinessPartner--com.sap.vocabularies.UI.v1.FieldGroup::stdaddress1::to_BusinessPartnerAddrFilter::CustomerSupplierStreetName::Field");
                    let manageBPPostalCode = sap.ui.getCore().byId("mdm.md.businesspartner.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::C_BusinessPartner--com.sap.vocabularies.UI.v1.FieldGroup::stdaddress1::to_BusinessPartnerAddrFilter::PostalCode::Field");
                    let manageBPCity = sap.ui.getCore().byId("mdm.md.businesspartner.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::C_BusinessPartner--com.sap.vocabularies.UI.v1.FieldGroup::stdaddress1::to_BusinessPartnerAddrFilter::CustomerSupplierCityName::Field");
                    let manageBPRegion = sap.ui.getCore().byId("mdm.md.businesspartner.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::C_BusinessPartner--to_BusinessPartnerAddrFilter::com.sap.vocabularies.UI.v1.FieldGroup::stdaddress2::Region::Field-input");
                    let manageBPHouseNo = sap.ui.getCore().byId("mdm.md.businesspartner.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::C_BusinessPartner--com.sap.vocabularies.UI.v1.FieldGroup::stdaddress1::to_BusinessPartnerAddrFilter::HouseNumber::Field-input");
                    let manageBPPostBox = sap.ui.getCore().byId("mdm.md.businesspartner.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::C_BusinessPartner--to_BusinessPartnerAddrFilter::com.sap.vocabularies.UI.v1.FieldGroup::stdaddress3::POBox::Field-input");
                    let manageBPPoBoxLobby = sap.ui.getCore().byId("mdm.md.businesspartner.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::C_BusinessPartner--to_BusinessPartnerAddrFilter::com.sap.vocabularies.UI.v1.FieldGroup::stdaddress3::POBoxPostalCode::Field-input");
                    return new Promise((resolve, reject) => {
                        debugger;
                        // if (!manageBPRegion?.getValue()) {
                        //     MessageBox.error("Address is incomplete. Please enter country/region");
                        //     reject;
                        // }
                        // else if (!manageBPStreet?.getValue() && !manageBPCity?.getValue() && !manageBPPostalCode?.getValue()) {
                        //     MessageBox.error("Please enter Street, City, Region and Postal Code to validate the address via Street Sweeper.");
                        //     reject;
                        // }
                        // else if (!manageBPStreet?.getValue() && manageBPCity?.getValue() && manageBPPostalCode?.getValue()) {
                        //     MessageBox.error("Please enter Street to validate the address via Street Sweeper.");
                        //     reject;
                        // }
                        // } else if (!manageBPPostalCode?.getValue()) {
                        //     MessageBox.error("Postal Code is not Empty.");
                        //     reject;
                        // } else if (!manageBPCity?.getValue()) {
                        //     MessageBox.error("City is not Empty.");
                        //     reject;
                        // } else if (!manageBPRegion?.getValue()) {
                        //     MessageBox.error("Region is not Empty.");
                        //     reject;
                        // } else if (!manageBPHouseNo?.getValue()) {
                        //     MessageBox.error("House No is not Empty.");
                        //     reject;
                        // } 
                        // else {
                        debugger;
                        let manageRegion = manageBPRegion?.getValue();
                        const oStreet = manageBPStreet?.getValue();
                        const oPostalCode = manageBPPostalCode?.getValue();
                        const oRegion = (manageRegion === '' || manageRegion === undefined) ? '' : manageRegion.match(/\((.*?)\)/);
                        const oCity = manageBPCity?.getValue();
                        const oHouseNo = manageBPHouseNo?.getValue();
                        const oPostBox = manageBPPostBox?.getValue();
                        const oPoBoxLobby = manageBPPoBoxLobby?.getValue();

                        var oModel = this.getView().getModel("customer.oData");
                        oModel.callFunction("/AddressValidation", {
                            method: "GET",
                            urlParameters: {
                                City: oCity,
                                PostalCode: oPostalCode,
                                Region: (manageRegion === '' || manageRegion === undefined) ? '' : oRegion[1],
                                Street: oStreet,
                                HouseNo: oHouseNo,
                                PoBox: oPostBox,
                                PoBoxLobby: oPoBoxLobby
                            },
                            success: function (response) {
                                debugger;
                                let oProposed = response.AddressValidation.Proposed;
                                oProposed = oProposed.replaceAll('<br>', '\n');
                                sTableId = "dynamicTable_" + new Date().getTime();
                                var oTable = new sap.m.Table(sTableId, {
                                    mode: sap.m.ListMode.SingleSelectLeft,
                                    inset: true,
                                    showOverlay: false,
                                    headerDesign: sap.m.ListHeaderDesign.Standard,
                                    itemPress: "onSelectionChange"
                                });

                                var oModel = new sap.ui.model.json.JSONModel();
                                oTable.setModel(oModel);
                                var aColumnData = [
                                    { id: "col1", text: "Result" },
                                    { id: "col2", text: "Correction" },
                                    { id: "col3", text: "Proposed" }
                                ];

                                aColumnData.forEach(function (oCol) {
                                    oTable.addColumn(new sap.m.Column({
                                        header: new sap.m.Label({ text: oCol.text })
                                    }));
                                });
                                var oSingleRowData = {
                                    col1: response.AddressValidation.Result,
                                    col2: response.AddressValidation.Correction,
                                    col3: oProposed
                                };
                                oModel.setData({
                                    rows: [oSingleRowData] // Wrap the single row data in an array
                                });

                                oTable.bindItems("/rows", new sap.m.ColumnListItem({
                                    cells: [
                                        new sap.m.Text({ text: "{col1}" }),
                                        new sap.m.Text({ text: "{col2}" }),
                                        new sap.m.Text({ text: "{col3}" })
                                    ]
                                }));
                                var oDialog = new sap.m.Dialog({
                                    title: "Information",
                                    ok: function (oEvent) {
                                        debugger;
                                        var oSelectedItem = oEvent.getParameter("listItem");
                                    },
                                    closed: function (oEvent) {
                                        oTable.destroy();
                                        oEvent.getSource().destroy();
                                        resolve;
                                    }
                                });

                                oDialog.addContent(oTable);
                                oDialog.addButton(new sap.m.Button({
                                    text: "Confirm", press: function (oEvent) {
                                        debugger;
                                        var oTable1 = sap.ui.getCore().byId(sTableId);
                                        var oSelectedItem = oTable1.getSelectedItems();
                                        if (oSelectedItem.length > 0) {
                                            var oCorrection = oSelectedItem[0].getBindingContext().getModel().getData().rows[0].col2;
                                            if (oCorrection.length > 0) {
                                                if (oCorrection.includes("#") === true) {
                                                    debugger;
                                                    var objFinal = {};
                                                    var objParameters = oCorrection.split('#');
                                                    objParameters.forEach(function (sfield) {
                                                        var oFields = sfield.split(':');
                                                        if (oFields.length === 2) {
                                                            var sKey = oFields[0];
                                                            var sValue = oFields[1];
                                                            objFinal[sKey.trim()] = sValue.trim();
                                                        }
                                                    });
                                                    if (objFinal.hasOwnProperty("Postal Code") === true) {
                                                        let sPostalCode = objFinal["Postal Code"];
                                                        sap.ui.getCore().byId("mdm.md.businesspartner.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::C_BusinessPartner--com.sap.vocabularies.UI.v1.FieldGroup::stdaddress1::to_BusinessPartnerAddrFilter::PostalCode::Field").setValue(sPostalCode);
                                                    }
                                                    if (objFinal.hasOwnProperty("Province") === true) {
                                                        let sProvince = objFinal["Province"];
                                                        sap.ui.getCore().byId("mdm.md.businesspartner.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::C_BusinessPartner--to_BusinessPartnerAddrFilter::com.sap.vocabularies.UI.v1.FieldGroup::stdaddress2::Region::Field-input").setValue(sProvince);
                                                    }
                                                    if (objFinal.hasOwnProperty("StreetName") === true) {
                                                        var oStreetName = objFinal["StreetName"];
                                                        sap.ui.getCore().byId("mdm.md.businesspartner.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::C_BusinessPartner--com.sap.vocabularies.UI.v1.FieldGroup::stdaddress1::to_BusinessPartnerAddrFilter::CustomerSupplierStreetName::Field").setValue(oStreetName.trim());
                                                    }
                                                    if (objFinal.hasOwnProperty("City") === true) {
                                                        var sCity = objFinal["City"];
                                                        sap.ui.getCore().byId("mdm.md.businesspartner.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::C_BusinessPartner--com.sap.vocabularies.UI.v1.FieldGroup::stdaddress1::to_BusinessPartnerAddrFilter::CustomerSupplierCityName::Field").setValue(sCity);
                                                    }
                                                }
                                                else if (oCorrection.includes("StreetName") === true) {
                                                    var oStreetName = oCorrection.substring(12, oCorrection.length);
                                                    sap.ui.getCore().byId("mdm.md.businesspartner.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::C_BusinessPartner--com.sap.vocabularies.UI.v1.FieldGroup::stdaddress1::to_BusinessPartnerAddrFilter::CustomerSupplierStreetName::Field").setValue(oStreetName.trim());
                                                }
                                                else if (oCorrection.includes("Postal Code") === true) {
                                                    let sPostalCode = oCorrection.substring(13, oCorrection.length);
                                                    sap.ui.getCore().byId("mdm.md.businesspartner.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::C_BusinessPartner--com.sap.vocabularies.UI.v1.FieldGroup::stdaddress1::to_BusinessPartnerAddrFilter::PostalCode::Field").setValue(sPostalCode);
                                                }
                                                else if (oCorrection.includes("Province") === true) {
                                                    let sProvince = oCorrection.substring(11, oCorrection.length);
                                                    sap.ui.getCore().byId("mdm.md.businesspartner.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::C_BusinessPartner--to_BusinessPartnerAddrFilter::com.sap.vocabularies.UI.v1.FieldGroup::stdaddress2::Region::Field-input").setValue(sProvince);
                                                }
                                                else if (oCorrection.includes("City") === true) {
                                                    var sCity = oCorrection.substring(7, oCorrection.length);
                                                    sap.ui.getCore().byId("mdm.md.businesspartner.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::C_BusinessPartner--com.sap.vocabularies.UI.v1.FieldGroup::stdaddress1::to_BusinessPartnerAddrFilter::CustomerSupplierCityName::Field").setValue(sCity);
                                                }
                                                oTable.destroy();
                                                oEvent.getSource().destroy();
                                                oDialog.close();
                                                resolve;
                                            } else {
                                                MessageBox.error("Correction field should not be empty..");
                                            }

                                        }
                                        else {
                                            MessageBox.error("Please select row..")
                                        }

                                        //var oSelectedItem = oEvent.getParameter("listItem");
                                    }
                                }));				//Button for printing
                                oDialog.addButton(new sap.m.Button({ text: "Cancel", press: function () { oDialog.close(); } }));	//Button for closing Dialog
                                oDialog.open();
                                resolve;
                            },
                            error: (oError) => {
                                debugger;
                                MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                                reject;
                            }
                        });
                        // }
                    });
                },
                onSelectionChange: function (oEvent) {
                    debugger;
                    var oSelectedItem = oEvent.getParameter("listItem"); // For sap.m.Table
                    // ... proceed to get data from oSelectedItem ...
                }
            }




            // metadata: {
            // 	// extension can declare the public methods
            // 	// in general methods that start with "_" are private
            // 	methods: {
            // 		publicMethod: {
            // 			public: true /*default*/ ,
            // 			final: false /*default*/ ,
            // 			overrideExecution: OverrideExecution.Instead /*default*/
            // 		},
            // 		finalPublicMethod: {
            // 			final: true
            // 		},
            // 		onMyHook: {
            // 			public: true /*default*/ ,
            // 			final: false /*default*/ ,
            // 			overrideExecution: OverrideExecution.After
            // 		},
            // 		couldBePrivate: {
            // 			public: false
            // 		}
            // 	}
            // },
            // // adding a private method, only accessible from this controller extension
            // _privateMethod: function() {},
            // // adding a public method, might be called from or overridden by other controller extensions as well
            // publicMethod: function() {},
            // // adding final public method, might be called from, but not overridden by other controller extensions as well
            // finalPublicMethod: function() {},
            // // adding a hook method, might be called by or overridden from other controller extensions
            // // override these method does not replace the implementation, but executes after the original method
            // onMyHook: function() {},
            // // method public per default, but made private via metadata
            // couldBePrivate: function() {},
            // // this section allows to extend lifecycle hooks or override public methods of the base controller
            // override: {
            // 	/**
            // 	 * Called when a controller is instantiated and its View controls (if available) are already created.
            // 	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
            // 	 * @memberOf customer.app.managebp.addressValidation
            // 	 */
            // 	onInit: function() {
            // 	},
            // 	/**
            // 	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
            // 	 * (NOT before the first rendering! onInit() is used for that one!).
            // 	 * @memberOf customer.app.managebp.addressValidation
            // 	 */
            // 	onBeforeRendering: function() {
            // 	},
            // 	/**
            // 	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
            // 	 * This hook is the same one that SAPUI5 controls get after being rendered.
            // 	 * @memberOf customer.app.managebp.addressValidation
            // 	 */
            // 	onAfterRendering: function() {
            // 	},
            // 	/**
            // 	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
            // 	 * @memberOf customer.app.managebp.addressValidation
            // 	 */
            // 	onExit: function() {
            // 	},
            // 	// override public method of the base controller
            // 	basePublicMethod: function() {
            // 	}
            // }
        });
    }
);
