// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

frappe.ui.form.on("Sector", {
    refresh(frm) {
        setPlaceholders(frm, [
            { fieldName: 'sector_name', placeholderText: __("Enter your sector name"), placeholderSize: "12px", placeholderFontWeight: 400 },
        ])
    },
});
