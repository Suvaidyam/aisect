// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

frappe.ui.form.on("Center", {
    async refresh(frm) {
        // role by permission
        set_value_by_role(frm,[{fieldname:"zone",allow:"Zone"},{fieldname:"state",allow:"State"}])
        // 
        check_active(frm, 'zone')
        depended_dropdown(frm, frm.doc.zone, 'state', 'zone');
        depended_dropdown(frm, frm.doc.state, 'district', 'state')
        if (frm.doc.center_location_code != undefined && frm.doc.__unsaved!=1) {
            frm.set_df_property('center_location_code', 'read_only', 1)
        }
        setPlaceholders(frm, [
            { fieldName: 'center_location_name', placeholderText: __("Enter your center name") },
            { fieldName: 'center_location_code', placeholderText: __("Enter your center code") },
            { fieldName: 'zone', placeholderText: __("Enter your zone") },
            { fieldName: 'state', placeholderText: __("Enter your state") },
            { fieldName: 'district', placeholderText: __("Enter your district") },

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
        if (frm.doc.center_location_code != undefined && frm.doc.__unsaved!=1) {
            frm.set_df_property('center_location_code', 'read_only', 1)
        }
    },

});
