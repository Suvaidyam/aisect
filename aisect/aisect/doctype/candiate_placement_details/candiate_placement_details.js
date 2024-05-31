// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt
// frappe.ui.form.on("Candiate Placement Details", {
//     refresh(frm) {

//     },
// });
let mobilePattern = /^[6-9]\d{9}$/;
frappe.ui.form.on("Placement Child", {
    hr_contact_no: function (frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn);
        if (!mobilePattern.test(row.hr_contact_no)) {
            frm.disable_save()
            frappe.msgprint({
                title: __('Validation Error'),
                indicator: 'red',
                message: __('Enter vaild contact number')
            });
        } else {
            frm.enable_save()
        }

    },
});

