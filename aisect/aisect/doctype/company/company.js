// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

frappe.ui.form.on("Company", {
    refresh(frm) {
        depended_dropdown(frm, frm.doc.zone, 'state', 'zone')
        setPlaceholders(frm, [
            { fieldName: 'company_name', placeholderText: __("Enter your company name") },
            { fieldName: 'zone', placeholderText: __("Enter your zone") },
            { fieldName: 'state', placeholderText: __("Enter your state") },
            { fieldName: 'district', placeholderText: __("Enter your district") },
            { fieldName: 'sector', placeholderText: __("Enter your sector") },
        ])
    },

    zone: function (frm) {
        depended_dropdown(frm, frm.doc.zone, 'state', 'zone')
        frm.set_value('state', '')
    },
});
