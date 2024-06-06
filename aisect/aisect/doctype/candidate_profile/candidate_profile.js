// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

let aadharPattern = /^\d{4}\d{4}\d{4}$/;
let mobilePattern = /^[6-9]\d{9}$/;

frappe.ui.form.on("Candidate Profile", {
    refresh(frm) {
        depended_dropdown(frm, frm.doc.project, 'batch_id', 'project')
        // depended_dropdown(frm, frm.doc.state, 'centre', 'state') 
        // depended_dropdown(frm, frm.doc.centre, 'batch_id', 'centre')
        // 
        // =============== setPlaceholders =============
        setPlaceholders(frm, [
            { fieldName: 'first_name', placeholderText: __("Enter your first name"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'last_name', placeholderText: __("Enter your last name"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'candidate_id', placeholderText: __("Enter your candidate id"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'contact_no', placeholderText: __("Enter your contact number"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'email', placeholderText: __("Enter your email address"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'aadhar_number', placeholderText: __("Enter your Aadhar number"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'qualification', placeholderText: __("Enter your qualification"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'project', placeholderText: __("Enter your project"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'batch_id', placeholderText: __("Enter your batch_id"), placeholderSize: "12px", placeholderFontWeight: 400 }

        ])
    },

    validate(frm) {
        if (!aadharPattern.test(frm.doc.aadhar_number)) {
            frappe.throw('Enter vaild aadhar number')
        }
        if (!mobilePattern.test(frm.doc.contact_no)) {
            frappe.throw('Enter vaild contact number')
        }
    },
    after_save(frm) {
        if (!aadharPattern.test(frm.doc.aadhar_number)) {
            frappe.throw('Enter vaild aadhar number')
        }
        if (!mobilePattern.test(frm.doc.contact_no)) {
            frappe.throw('Enter vaild contact number')
        }
    },
    project: function (frm) {
        depended_dropdown(frm, frm.doc.project, 'batch_id', 'project')
        frm.set_value('batch_id', '')
    },
    // state: function (frm) {
    //     depended_dropdown(frm, frm.doc.state, 'centre', 'state')
    //     frm.set_value('centre', '')
    // },
    // centre: function (frm) {
    //     depended_dropdown(frm, frm.doc.centre, 'batch_id', 'centre')
    //     frm.set_value('batch_id', '')
    // },
    aadhar_number: function (frm) {
        if (frm.doc.aadhar_number.length > 11) {
            if (!aadharPattern.test(frm.doc.aadhar_number)) {
                frappe.throw('Enter vaild aadhar number')
            }
        }
    },
    contact_no: function (frm) {
        mobile_number_validation(frm, frm.doc.contact_no, 'contact_no')
    }
});
