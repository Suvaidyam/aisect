// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

frappe.ui.form.on("Center Location", {
    refresh(frm) {
        depended_dropdown(frm, frm.doc.zone, 'state', 'zone');
        depended_dropdown(frm, frm.doc.state, 'district', 'state')
        if (frm.doc.center_location_code != undefined) {
            frm.set_df_property('center_location_code', 'read_only', 1)
        }
        setPlaceholders(frm, [
            { fieldName: 'center_location_name', placeholderText: __("Enter your center location name"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'center_location_code', placeholderText: __("Enter your center location code"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'zone', placeholderText: __("Enter your zone"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'state', placeholderText: __("Enter your state"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'district', placeholderText: __("Enter your district"), placeholderSize: "12px", placeholderFontWeight: 400 },

        ])
    },

    zone: function (frm) {
        depended_dropdown(frm, frm.doc.zone, 'state', 'zone')
        frm.set_value('state', '')
    },
    state: function (frm) {
        depended_dropdown(frm, frm.doc.state, 'district', 'state')
        frm.set_value('district', '')
    },
    after_save: function (frm) {
        if (frm.doc.center_location_code != undefined) {
            frm.set_df_property('center_location_code', 'read_only', 1)
        }
    },

});
