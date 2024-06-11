// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

frappe.ui.form.on("Company", {
    refresh(frm) {
        depended_dropdown(frm, frm.doc.zone, 'state', 'zone')
        setPlaceholders(frm, [
            { fieldName: 'company_name', placeholderText: __("Enter your company name"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'zone', placeholderText: __("Enter your zone"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'state', placeholderText: __("Enter your state"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'district', placeholderText: __("Enter your district"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'sector', placeholderText: __("Enter your sector"), placeholderSize: "12px", placeholderFontWeight: 400 },
        ])
    },

    zone: function (frm) {
        depended_dropdown(frm, frm.doc.zone, 'state', 'zone')
        frm.set_value('state', '')
    },
});
