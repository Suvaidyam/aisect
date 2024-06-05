// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt
const truncate_child_table_field_value = async(row,frm,fields) => {
    if(fields.length >0){
        for (let field of fields){
            row[field] = ''
        }
        frm.cur_grid.refresh()
    }
}
// frappe.ui.form.on("Candiate Placement Details", {
//     refresh(frm) {

//     },
// });
let mobilePattern = /^[6-9]\d{9}$/;
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