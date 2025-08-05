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
                        if (!manageBPStreet?.getValue()) {
                            MessageBox.error("Street is not Empty.");
                            reject;
                        } else if (!manageBPPostalCode?.getValue()) {
                            MessageBox.error("Postal Code is not Empty.");
                            reject;
                        } else if (!manageBPCity?.getValue()) {
                            MessageBox.error("City is not Empty.");
                            reject;
                        } else if (!manageBPRegion?.getValue()) {
                            MessageBox.error("Region is not Empty.");
                            reject;
                        } else if (!manageBPHouseNo?.getValue()) {
                            MessageBox.error("House No is not Empty.");
                            reject;
                        } else {
                            debugger;
                            let manageRegion = manageBPRegion?.getValue();
                            const oStreet = manageBPStreet?.getValue();
                            const oPostalCode = manageBPPostalCode?.getValue();
                            const oRegion = manageRegion.match(/\((.*?)\)/);
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
                                    Region: oRegion[1],
                                    Street: oStreet,
                                    HouseNo: oHouseNo,
                                    PoBox: oPostBox,
                                    PoBoxLobby: oPoBoxLobby
                                },
                                success: function (response) {
                                    debugger;
                                    if (response.AddressValidation.Correction === "") {
                                        MessageBox.success(response.AddressValidation.Result);
                                        resolve;
                                    }
                                    else if (response.AddressValidation.Correction !== "") {
                                        MessageBox.error(response.AddressValidation.Correction);
                                        reject;
                                    }

                                },
                                error: (oError) => {
                                    debugger;
                                    MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                                    reject;
                                }
                            });
                        }
                    });
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
