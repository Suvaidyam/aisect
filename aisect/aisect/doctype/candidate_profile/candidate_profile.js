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
    batch_id: function (frm) {
        frm.refresh_field('zone');
        frm.refresh_field('state');
        frm.refresh_field('district');
        frm.refresh_field('center_location');
        frm.refresh_field('sector');
        frm.refresh_field('job_role');

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
    assessment_status: function (frm) {
        if(frm.doc.assessment_status=='Registered'){
            frm.set_value('certified_status', '')
            frm.set_value('placement_status', '')
        }
    },
    certified_status: function (frm) {
        if(frm.doc.certified_status=='Not Certified'){
            frm.set_value('placement_status', '')
        }
    },
    // placement_status: function (frm) {
    //    if(frm.doc.placement_status=='Placed'){
    //        frappe.set_route('candidate-profile/ANNA97#', 'placemet_details_tab');
    //    }
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


// child Table
const truncate_child_table_field_value = async(row,frm,fields) => {
    if(fields.length >0){
        for (let field of fields){
            row[field] = ''
        }
        frm.cur_grid.refresh()
    }
}
let pin_codePattern = /^\d{6}$/;
frappe.ui.form.on("Placement Child", {
    pin_code: function (frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn);
        if (!pin_codePattern.test(row.pin_code)) {
            frm.disable_save()
            frappe.msgprint({
                title: __('Validation Error'),
                indicator: 'red',
                message: __(`Enter vaild pin code in row ${row.idx} `)
            });
        } else {
            frm.enable_save()
        }

    },
    contact_no: function (frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn);
        if (!mobilePattern.test(row.contact_no)) {
            frm.disable_save()
            frappe.msgprint({
                title: __('Validation Error'),
                indicator: 'red',
                message: __(`Enter vaild contact number in row ${row.idx} `)
            });
        } else {
            frm.enable_save()
        }

    },
    job_joined: function (frm,cdt,cdn) {
        let row = frappe.get_doc(cdt,cdn)
        if(row.job_joined !== "Yes"){
            truncate_child_table_field_value(row, frm, [
                'offer_letter',
                'upload_offer_letter',
                'salary_slip',
                'upload_salary_slip',
                'bank_statement',
                'upload_bank_statement',
                'salary_slip_2',
                'upload_salary_slip_2',
                'bank_statement_2',
                'upload_bank_statement_2',
                'salary_slip_3',
                'upload_salary_slip_3',
                'bank_statement_3',
                'upload_bank_statement_3'
            ]);
        }
        if(row.job_joined == "No"){
            truncate_child_table_field_value(row, frm, [
                'if_no_give_reason'
            ]);
        }
    },
    offer_letter: function (frm,cdt,cdn) {
        let row = frappe.get_doc(cdt,cdn)
        if(row.offer_letter !== "Yes"){
            truncate_child_table_field_value(row, frm, [
                'upload_offer_letter',
                'salary_slip',
                'upload_salary_slip',
                'bank_statement',
                'upload_bank_statement',
                'salary_slip_2',
                'upload_salary_slip_2',
                'bank_statement_2',
                'upload_bank_statement_2',
                'salary_slip_3',
                'upload_salary_slip_3',
                'bank_statement_3',
                'upload_bank_statement_3'
            ]);
        }
    },
    salary_slip: function (frm,cdt,cdn) {
        let row = frappe.get_doc(cdt,cdn)
        if(row.salary_slip !== "Yes"){
            truncate_child_table_field_value(row, frm, [
                'upload_salary_slip',
                'bank_statement',
                'upload_bank_statement',
                'salary_slip_2',
                'upload_salary_slip_2',
                'bank_statement_2',
                'upload_bank_statement_2',
                'salary_slip_3',
                'upload_salary_slip_3',
                'bank_statement_3',
                'upload_bank_statement_3'
            ]);
        }
    },
    bank_statement: function (frm,cdt,cdn) {
        let row = frappe.get_doc(cdt,cdn)
        if(row.bank_statement !== "Yes"){
            truncate_child_table_field_value(row, frm, [
                'upload_bank_statement'
            ]);
        }
    },
    salary_slip_2: function (frm,cdt,cdn) {
        let row = frappe.get_doc(cdt,cdn)
        if(row.salary_slip_2 !== "Yes"){
            truncate_child_table_field_value(row, frm, [
                'upload_salary_slip_2',
                'bank_statement_2',
                'upload_bank_statement_2',
                'salary_slip_3',
                'upload_salary_slip_3',
                'bank_statement_3',
                'upload_bank_statement_3'
            ]);
        }
    },
    bank_statement_2: function (frm,cdt,cdn) {
        let row = frappe.get_doc(cdt,cdn)
        if(row.bank_statement_2 !== "Yes"){
            truncate_child_table_field_value(row, frm, [
                'upload_bank_statement_2'
            ]);
        }
    },
    salary_slip_3: function (frm,cdt,cdn) {
        let row = frappe.get_doc(cdt,cdn)
        if(row.salary_slip_3 !== "Yes"){
            truncate_child_table_field_value(row, frm, [
                'upload_salary_slip_3',
                'bank_statement_3',
                'upload_bank_statement_3'
            ]);
        }
    },
    bank_statement_3: function (frm,cdt,cdn) {
        let row = frappe.get_doc(cdt,cdn)
        if(row.bank_statement_3 !== "Yes"){
            truncate_child_table_field_value(row, frm, [
                'upload_bank_statement_3'
            ]);
        }
    },
});