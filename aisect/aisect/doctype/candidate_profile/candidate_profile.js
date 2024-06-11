// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

let aadharPattern = /^\d{4}\d{4}\d{4}$/;
let mobilePattern = /^[6-9]\d{9}$/;

frappe.ui.form.on("Candidate Profile", {
    refresh(frm) {
        depended_dropdown(frm, frm.doc.project, 'batch_id', 'project')
        // if(frm.doc.candidate_id!=undefined){
        //     frm.set_df_property('candidate_id','read_only',1)
        // }
        // depended_dropdown(frm, frm.doc.state, 'centre_location', 'state') 
        // depended_dropdown(frm, frm.doc.centre_location, 'batch_id', 'centre_location')
        // 
        // =============== setPlaceholders =============
        setPlaceholders(frm, [
            { fieldName: 'first_name', placeholderText: __("Enter your first name") },
            { fieldName: 'last_name', placeholderText: __("Enter your last name") },
            { fieldName: 'candidate_id', placeholderText: __("Enter your candidate id") },
            { fieldName: 'contact_no', placeholderText: __("Enter your contact number") },
            { fieldName: 'email', placeholderText: __("Enter your email address") },
            { fieldName: 'aadhar_number', placeholderText: __("Enter your Aadhar number") },
            { fieldName: 'qualification', placeholderText: __("Enter your qualification") },
            { fieldName: 'project', placeholderText: __("Enter your project") },
            { fieldName: 'batch_id', placeholderText: __("Enter your batch_id") }

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
    //     depended_dropdown(frm, frm.doc.state, 'centre_location', 'state')
    //     frm.set_value('centre_location', '')
    // },
    // centre_location: function (frm) {
    //     depended_dropdown(frm, frm.doc.centre_location, 'batch_id', 'centre_location')
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
    },
    // after_save:function(frm){
    //     if(frm.doc.candidate_id!=undefined){
    //         frm.set_df_property('candidate_id','read_only',1)
    //     }
    // },
});
