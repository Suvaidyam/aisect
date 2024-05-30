// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

frappe.ui.form.on("District", {
    refresh(frm) {
        depended_dropdown(frm, frm.doc.zone, 'state', 'zone')
    },
    zone: function (frm) {
        depended_dropdown(frm, frm.doc.zone, 'state', 'zone')
        frm.set_value('state', '')
    },
});
