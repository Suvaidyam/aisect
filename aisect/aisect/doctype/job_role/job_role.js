// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

frappe.ui.form.on("Job Role", {
    refresh(frm) {
        setPlaceholders(frm, [
            { fieldName: 'job_role_name', placeholderText: __("Enter your job role name"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'sector', placeholderText: __("Enter your sector"), placeholderSize: "12px", placeholderFontWeight: 400 },
        ])
    },
});
