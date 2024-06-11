// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

frappe.ui.form.on("Zone", {
    refresh(frm) {
        setPlaceholders(frm, [
            { fieldName: 'zone_name', placeholderText: __("Enter your zone name") },
        ])
    },
});
