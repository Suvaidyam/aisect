// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

frappe.ui.form.on("State", {
    refresh(frm) {
        if (frm.doc.state_code != undefined) {
            frm.set_df_property('state_code', 'read_only', 1)
        }
        setPlaceholders(frm, [
            { fieldName: 'state_name', placeholderText: __("Enter your state name") },
            { fieldName: 'state_code', placeholderText: __("Enter your state code") },
            { fieldName: 'zone', placeholderText: __("Enter your zone") },
        ])
    },
    after_save: function (frm) {
        if (frm.doc.state_code != undefined) {
            frm.set_df_property('state_code', 'read_only', 1)
        }
    },
});
