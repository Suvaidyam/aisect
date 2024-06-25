// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

let mobilePattern = /^[6-9]\d{9}$/;

frappe.ui.form.on("Candidate Details", {
    refresh(frm) {
        check_active(frm, 'project')
        frm.fields_dict['zone'].get_query = function () {
            return {
                filters: { 'zone_name': 'Please select batch id' },
                page_length: 1000
            };
        }
        frm.fields_dict['state'].get_query = function () {
            return {
                filters: { 'state_name': 'Please select batch id' },
                page_length: 1000
            };
        }
        frm.fields_dict['district'].get_query = function () {
            return {
                filters: { 'district_name': 'Please select batch id' },
                page_length: 1000
            };
        }
        frm.fields_dict['center_location'].get_query = function () {
            return {
                filters: { 'center_location_name': 'Please select batch id' },
                page_length: 1000
            };
        }
        frm.fields_dict['sector'].get_query = function () {
            return {
                filters: { 'sector_name': 'Please select batch id' },
                page_length: 1000
            };
        }
        frm.fields_dict['job_role'].get_query = function () {
            return {
                filters: { 'job_role_name': 'Please select batch id' },
                page_length: 1000
            };
        }
        hide_advance_search(frm, ['project', 'batch_id', 'zone', 'state', 'district', 'center_location', 'sector', 'job_role'])
        if (frm.doc.batch_id) {
            setTimeout(() => {
                frm.set_df_property('zone', 'read_only', 1)
                frm.set_df_property('state', 'read_only', 1)
                frm.set_df_property('district', 'read_only', 1)
                frm.set_df_property('center_location', 'read_only', 1)
                frm.set_df_property('sector', 'read_only', 1)
                frm.set_df_property('job_role', 'read_only', 1)
            }, 500);
        }
        if (frm.doc.assessment_status != 'Assessed') {
            frm.set_df_property('certified_status', 'read_only', 1)
        }
        if (frm.doc.certified_status != 'Certified') {
            frm.set_df_property('placement_status', 'read_only', 1)
        }
        if(frm.doc.placement_status=='Placed'){
            frm.set_df_property('certified_status','read_only',1)
        }
        depended_dropdown(frm, frm.doc.project, 'batch_id', 'project')

        // =============== setPlaceholders =============
        setPlaceholders(frm, [
            { fieldName: 'first_name', placeholderText: __("Enter your first name") },
            { fieldName: 'last_name', placeholderText: __("Enter your last name") },
            { fieldName: 'candidate_id', placeholderText: __("Enter your candidate id") },
            { fieldName: 'mobile_number', placeholderText: __("Enter your contact number") },
            { fieldName: 'email', placeholderText: __("Enter your email address") },
            { fieldName: 'aadhar_number', placeholderText: __("Enter your Aadhar number") },
            { fieldName: 'qualification', placeholderText: __("Enter your qualification") },
            { fieldName: 'project', placeholderText: __("Enter your project") },
            { fieldName: 'batch_id', placeholderText: __("Enter your batch id") },
            { fieldName: 'zone', placeholderText: __("Enter your zone") },
            { fieldName: 'state', placeholderText: __("Enter your state") },
            { fieldName: 'district', placeholderText: __("Enter your district") },
            { fieldName: 'center_location', placeholderText: __("Enter your center") },
            { fieldName: 'sector', placeholderText: __("Enter your sector") },
            { fieldName: 'job_role', placeholderText: __("Enter your job role") },

        ])

    },
    batch_id: function (frm) {
        if (frm.doc.batch_id) {
            setTimeout(() => {
                frm.set_df_property('zone', 'read_only', 1)
                frm.set_df_property('state', 'read_only', 1)
                frm.set_df_property('district', 'read_only', 1)
                frm.set_df_property('center_location', 'read_only', 1)
                frm.set_df_property('sector', 'read_only', 1)
                frm.set_df_property('job_role', 'read_only', 1)
            }, 500);
        }
    },
    validate(frm) {
        if (frm.doc.aadhar_number) {
            if (!isValidAadhaar(frm.doc.aadhar_number)) {
                frappe.throw('Enter vaild aadhar number')
            }
        }
        if (!mobilePattern.test(frm.doc.mobile_number) && frm.doc.mobile_number) {
            frappe.throw('Enter vaild mobile number')
        }
    },
    after_save(frm) {
        if (frm.doc.aadhar_number) {
            if (!isValidAadhaar(frm.doc.aadhar_number)) {
                frappe.throw('Enter vaild aadhar number')
            }
        }
        if (!mobilePattern.test(frm.doc.mobile_number) && frm.doc.mobile_number) {
            frappe.throw('Enter vaild mobile number')
        }
        if(frm.doc.placement_status=='Placed'){
            frm.set_df_property('certified_status','read_only',1)
        }
        if (frm.doc.certified_status == 'Certified') {
            frm.set_df_property('placement_status', 'read_only', 0)
        } else {
            frm.set_df_property('placement_status', 'read_only', 1)
        }
    },
    project: function (frm) {
        frm.fields_dict['batch_id'].get_query = function () {
            return {
                filters: {
                    project: frm.doc.project,
                    end_date: ['>=', frappe.datetime.now_date()]
                },
                page_length: 1000
            };
        };
        frm.set_value('batch_id', '')
    },
    assessment_status: function (frm) {
        if (frm.doc.assessment_status == 'Assessed') {
            frm.set_df_property('certified_status', 'read_only', 0)
        }
    },
    certified_status: function (frm) {
        if (frm.doc.certified_status !== 'Certified') {
            frm.set_value('placement_status', 'N/A')
            frm.set_value('certification_date', '')
            frm.set_value('placement_date', '')
        }
    },
    placement_status: function (frm) {
        if (frm.doc.placement_status !== 'Placed') {
            frm.set_value('placement_date', '')
            frm.set_value('placement', [])
            frm.set_df_property('certified_status','read_only',0)
        }else{
            frm.set_df_property('certified_status','read_only',1)
        }
    },
    aadhar_number: function (frm) {
        if (frm.doc.aadhar_number && frm.doc.aadhar_number.length > 11) {
            if (!isValidAadhaar(frm.doc.aadhar_number)) {
                frappe.throw('Enter vaild aadhar number')
            }
        }
    },
    mobile_number: function (frm) {
        mobile_number_validation(frm, frm.doc.mobile_number, 'mobile_number')
    },
});


// child Table
const truncate_child_table_field_value = async (row, frm, fields) => {
    if (fields.length > 0) {
        for (let field of fields) {
            row[field] = ''
        }
        frm.cur_grid.refresh()
    }
}
let pin_codePattern = /^\d{6}$/;
frappe.ui.form.on("Placement Child", {
    form_render:async function(frm){
        console.log(frm.cur_grid)
        frm.cur_grid.grid.grid_custom_buttons.add('jhjhgjh')
        let today = new Date(frm.doc.certification_date);
        today.setDate(today.getDate() + 1);
        frm.cur_grid.grid_form.fields_dict.employment_start_date.$input.datepicker({ minDate: today })
    },
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
    mobile_number: function (frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn);
        if (!mobilePattern.test(row.mobile_number)) {
            frm.disable_save()
            frappe.msgprint({
                title: __('Validation Error'),
                indicator: 'red',
                message: __(`Enter vaild mobile number in row ${row.idx} `)
            });
        } else {
            frm.enable_save()
        }

    },
    
    employment_start_date: function (frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn)
        let sd = new Date(row.employment_start_date);
        frm.cur_grid.grid_form.fields_dict.employment_end_date.$input.datepicker({ minDate: sd })
    },
    job_joined: function (frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn)
        if (row.job_joined !== "Yes") {
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
        if (row.job_joined == "No") {
            truncate_child_table_field_value(row, frm, [
                'if_no_give_reason'
            ]);
        }
    },
    offer_letter: function (frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn)
        if (row.offer_letter !== "Yes") {
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
    salary_slip: function (frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn)
        if (row.salary_slip !== "Yes") {
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
    bank_statement: function (frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn)
        if (row.bank_statement !== "Yes") {
            truncate_child_table_field_value(row, frm, [
                'upload_bank_statement'
            ]);
        }
    },
    salary_slip_2: function (frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn)
        if (row.salary_slip_2 !== "Yes") {
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
    bank_statement_2: function (frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn)
        if (row.bank_statement_2 !== "Yes") {
            truncate_child_table_field_value(row, frm, [
                'upload_bank_statement_2'
            ]);
        }
    },
    salary_slip_3: function (frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn)
        if (row.salary_slip_3 !== "Yes") {
            truncate_child_table_field_value(row, frm, [
                'upload_salary_slip_3',
                'bank_statement_3',
                'upload_bank_statement_3'
            ]);
        }
    },
    bank_statement_3: function (frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn)
        if (row.bank_statement_3 !== "Yes") {
            truncate_child_table_field_value(row, frm, [
                'upload_bank_statement_3'
            ]);
        }
    },
    // upload_offer_letter:function(frm,cdt, cdn){
    //     let row = frappe.get_doc(cdt, cdn)
    //     if(!(row.upload_offer_letter.split('.').pop().toLowerCase()=='pdf')){
    //         frappe.show_alert({message:'Only PDF files are allowed',indicator:'yellow'})
    //         console.log(frm.attachments)
    //         frm.attachments.attachment_uploaded = () => {
    //             console.log('first')
    //             return
    //         }
            // truncate_child_table_field_value(row, frm, [
            //     'upload_offer_letter'
            // ]);
    //     }
    // }
});