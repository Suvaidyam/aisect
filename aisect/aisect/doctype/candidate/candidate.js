// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

let aadharPattern = /^\d{4}\d{4}\d{4}$/;
frappe.ui.form.on("Candidate", {
    refresh(frm) {
        depended_dropdown(frm, frm.doc.zone, 'state', 'zone')
        depended_dropdown(frm, frm.doc.state, 'centre', 'state')
    },
    validate(frm) {
        if (!aadharPattern.test(frm.doc.aadhar_number)) {
            frappe.throw('Enter vaild aadhar number')
        }
    },
    after_save(frm) {
        if (!aadharPattern.test(frm.doc.aadhar_number)) {
            frappe.throw('Enter vaild aadhar number')
        }
    },
    zone: function (frm) {
        depended_dropdown(frm, frm.doc.zone, 'state', 'zone')
        frm.set_value('state', '')
    },
    state: function (frm) {
        depended_dropdown(frm, frm.doc.state, 'centre', 'state')
        frm.set_value('centre', '')
    },
    aadhar_number: function (frm) {
        if (frm.doc.aadhar_number.length > 11) {
            if (!aadharPattern.test(frm.doc.aadhar_number)) {
                frappe.throw('Enter vaild aadhar number')
            }
        }
    }
});
