// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

frappe.ui.form.on("Project", {
    refresh(frm) {
        if (frm.doc.project_code != undefined) {
            frm.set_df_property('project_code', 'read_only', 1)
        }
        setPlaceholders(frm, [
            { fieldName: 'project_name', placeholderText: __("Enter your project name"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'project_code', placeholderText: __("Enter your project code"), placeholderSize: "12px", placeholderFontWeight: 400 },
        ])
    },
    after_save: function (frm) {
        if (frm.doc.project_code != undefined) {
            frm.set_df_property('project_code', 'read_only', 1)
        }
    },
});
