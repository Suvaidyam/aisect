// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

frappe.ui.form.on("State", {
    refresh(frm) {
        if (frm.doc.state_code != undefined) {
            frm.set_df_property('state_code', 'read_only', 1)
        }
        setPlaceholders(frm, [
            { fieldName: 'state_name', placeholderText: __("Enter your state_name"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'achievement_after_training', placeholderText: __("Enter your state_code"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'remarks_of_the_training', placeholderText: __("Enter your zone"), placeholderSize: "12px", placeholderFontWeight: 400 },
        ])
    },
    after_save: function (frm) {
        if (frm.doc.state_code != undefined) {
            frm.set_df_property('state_code', 'read_only', 1)
        }
    },
});
