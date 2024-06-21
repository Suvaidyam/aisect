// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt
let alert_end = false;
let alert_expected = false;
let alert_actual = false;
frappe.ui.form.on("Batch", {
    async refresh(frm) {
        set_value_by_role(frm)
        // filter
        check_active(frm, 'zone')
        check_active(frm, 'project')
        check_active(frm, 'sector')
        depended_dropdown(frm, frm.doc.zone, 'state', 'zone')
        depended_dropdown(frm, frm.doc.state, 'district', 'state')
        depended_dropdown(frm, frm.doc.district, 'center_location', 'district')
        depended_dropdown(frm, frm.doc.sector, 'job_role', 'sector', false)
        depened_date(frm.doc.start_date, frm.fields_dict.end_date)
        depened_date(frm.doc.end_date, frm.fields_dict.expected_assessment_date)
        depened_date(frm.doc.expected_assessment_date, frm.fields_dict.actual_assessment_date)
        // add placeholder in input
        setPlaceholders(frm, [
            { fieldName: 'zone', placeholderText: __("Enter your zone") },
            { fieldName: 'state', placeholderText: __("Enter your state") },
            { fieldName: 'district', placeholderText: __("Enter your district") },
            { fieldName: 'center_location', placeholderText: __("Enter your center") },
            { fieldName: 'batch_id', placeholderText: __("Enter your batch id") },
            { fieldName: 'project', placeholderText: __("Enter your project") },
            { fieldName: 'sector', placeholderText: __("Enter your sector") },
            { fieldName: 'project', placeholderText: __("Enter your project") },
            { fieldName: 'job_role', placeholderText: __("Enter your job role") },
            { fieldName: 'start_date', placeholderText: __("Enter your start date") },
            { fieldName: 'end_date', placeholderText: __("Enter your end date") },
            { fieldName: 'expected_assessment_date', placeholderText: __("Enter your expected assessment date") },
            { fieldName: 'actual_assessment_date', placeholderText: __("Enter your actual assessment date") },
        ])
    },
    // depened on filter
    zone: function (frm) {
        depended_dropdown(frm, frm.doc.zone, 'state', 'zone')
        frm.set_value('state', '')
    },
    state: function (frm) {
        depended_dropdown(frm, frm.doc.state, 'district', 'state')
        frm.set_value('district', '')
    },
    district: function (frm) {
        depended_dropdown(frm, frm.doc.district, 'center_location', 'district')
        frm.set_value('center_location', '')
    },
    sector: function (frm) {
        depended_dropdown(frm, frm.doc.sector, 'job_role', 'sector', false)
        frm.set_value('job_role', '')
    },
    setup: function (frm) {
        // Initialize the flags
        frm.is_end_date_being_set = false;
        frm.is_assessment_date_being_set = false;
        frm.is_actual_assessment_date_being_set = false;
    },
    start_date: function (frm) {
        if (frm.doc.end_date < frm.doc.start_date) {
            frm.set_value('end_date', '')
            frm.set_value('expected_assessment_date', '')
            frm.set_value('actual_assessment_date', '')
        }
        depened_date(frm.doc.start_date, frm.fields_dict.end_date)
    },
    end_date: function (frm) {
        if (frm.doc.start_date == undefined) {
            frm.set_value('end_date', '');
            if (!alert_end) {
                frappe.show_alert({ message: "Please select the start date first.", indicator: "yellow" });
                alert_end = true;
            }
        } else {
            alert_end = false;
        }
        depened_date(frm.doc.end_date, frm.fields_dict.expected_assessment_date)
        date_validation(frm, frm.doc.end_date, frm.doc.start_date, frm.is_end_date_being_set, 'end_date', 'Start Date', 'End Date')
        if (frm.doc.expected_assessment_date < frm.doc.end_date) {
            frm.set_value('expected_assessment_date', '')
            frm.set_value('actual_assessment_date', '')
        }
    },
    expected_assessment_date: function (frm) {
        if (frm.doc.end_date == undefined) {
            frm.set_value('expected_assessment_date', '')
            if (!alert_expected) {
                frappe.show_alert({ message: "Please select the end date first.", indicator: "yellow" });
                alert_expected = true;
            }
        } else {
            alert_expected = false;
        }
        depened_date(frm.doc.expected_assessment_date, frm.fields_dict.actual_assessment_date)
        date_validation(frm, frm.doc.expected_assessment_date, frm.doc.end_date, frm.is_expected_assessment_date_being_set, 'expected_assessment_date', 'End Date', 'Expected Assessment Date')
        if (frm.doc.actual_assessment_date < frm.doc.expected_assessment_date) {
            frm.set_value('actual_assessment_date', '')
        }
    },
    actual_assessment_date: function (frm) {
        if (frm.doc.expected_assessment_date == undefined) {
            frm.set_value('actual_assessment_date', '');
            if (!alert_actual) {
                frappe.show_alert({ message: "Please select the expected assessment date first.", indicator: "yellow" });
                alert_actual = true;
            }
        } else {
            alert_actual = false;
        }
        date_validation(frm, frm.doc.actual_assessment_date, frm.doc.assessment_date, frm.is_actual_assessment_date_being_set, 'actual_assessment_date', 'Assessment date', 'Actual assessment date')
    }
});
