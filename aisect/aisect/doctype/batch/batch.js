// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt
let alert_end = false;
let alert_expected = false;
let alert_actual = false;
frappe.ui.form.on("Batch", {
    refresh(frm) {
        depended_dropdown(frm, frm.doc.zone, 'state', 'zone')
        depended_dropdown(frm, frm.doc.state, 'district', 'state')
        depended_dropdown(frm, frm.doc.district, 'centre_location', 'district')
        depended_dropdown(frm, frm.doc.sector, 'job_role', 'sector')
        const today = new Date(); 
        frm.fields_dict.start_date.$input.datepicker({minDate: today});
        frm.fields_dict.end_date.$input.datepicker({minDate: today});
        frm.fields_dict.expected_assessment_date.$input.datepicker({minDate: today});
        frm.fields_dict.actual_assessment_date.$input.datepicker({minDate: today});
    },

    zone: function (frm) {
        depended_dropdown(frm, frm.doc.zone, 'state', 'zone')
        frm.set_value('state', '')
    },
    state: function (frm) {
        depended_dropdown(frm, frm.doc.state, 'district', 'state')
        frm.set_value('district', '')
    },
    district: function (frm) {
        depended_dropdown(frm, frm.doc.district, 'centre_location', 'district')
        frm.set_value('centre_location', '')
    },
    sector: function (frm) {
        depended_dropdown(frm, frm.doc.sector, 'job_role', 'sector')
        frm.set_value('job_role', '')
    },
    setup: function (frm) {
        // Initialize the flags
        frm.is_end_date_being_set = false;
        frm.is_assessment_date_being_set = false;
        frm.is_actual_assessment_date_being_set = false;
    },
    start_date: function (frm) {
        const today = new Date(frm.doc.start_date); 
        today.setDate(today.getDate() + 1);
        frm.fields_dict.end_date.$input.datepicker({minDate: today});
    },
    end_date: function (frm) {
        if (frm.doc.start_date == undefined) {
            frm.set_value('end_date', '');
            if (!alert_end) {
                frappe.show_alert({ message: "Please select first start date", indicator: "yellow" });
                alert_end = true;
            }
        } else {
            alert_end = false; 
        }
        const today = new Date(frm.doc.end_date);
        // today.setDate(today.getDate() + 1);
        frm.fields_dict.expected_assessment_date.$input.datepicker({minDate: today});
        date_validation(frm, frm.doc.end_date, frm.doc.start_date, frm.is_end_date_being_set, 'end_date', 'Start Date', 'End Date')
    },
    expected_assessment_date: function (frm) {
        if (frm.doc.end_date == undefined) {
            frm.set_value('expected_assessment_date','')
            if (!alert_expected) {
                frappe.show_alert({ message: "Please select first end date", indicator: "yellow" });
                alert_expected = true;
            }
        } else {
            alert_expected = false; 
        }
        const today = new Date(frm.doc.expected_assessment_date); 
        today.setDate(today.getDate() + 1);
        frm.fields_dict.actual_assessment_date.$input.datepicker({minDate: today});
        date_validation(frm, frm.doc.expected_assessment_date, frm.doc.end_date, frm.is_expected_assessment_date_being_set, 'expected_assessment_date', 'End Date', 'Expected Assessment Date')
    },
    actual_assessment_date: function (frm) {
        if (frm.doc.expected_assessment_date == undefined) {
            frm.set_value('actual_assessment_date', '');
            if (!alert_actual) {
                frappe.show_alert({ message: "Please select first expected assessment date", indicator: "yellow" });
                alert_actual = true;
            }
        } else {
            alert_actual = false; 
        }
       date_validation(frm, frm.doc.actual_assessment_date, frm.doc.assessment_date, frm.is_actual_assessment_date_being_set, 'actual_assessment_date', 'Assessment date', 'Actual assessment date')
    }
});
