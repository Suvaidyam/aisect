// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt
let mobilePattern = /^\d{4}\d{4}\d{2}$/;
frappe.ui.form.on("Candiate Placement Details", {
    refresh(frm) {

    },

    hr_contact_no: function (frm) {
        if (frm.doc.hr_contact_no.length > 9) {
            if (!mobilePattern.test(frm.doc.hr_contact_no)) {
                frappe.throw('Enter vaild contact number')
            }
        }
    }

});
