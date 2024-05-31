// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt
// frappe.ui.form.on("Candiate Placement Details", {
//     refresh(frm) {

//     },
// });
frappe.ui.form.on("Placement Child", {
    hr_contact_no: function (frm) {
        mobile_number_validation(frm, frm.cur_grid.doc.hr_contact_no, 'hr_contact_no')
    }
});
