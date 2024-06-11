// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt
let alert_end = false;
let alert_expected = false;
let alert_actual = false;
frappe.ui.form.on("Batch", {
    refresh(frm) {
        depended_dropdown(frm, frm.doc.zone, 'state', 'zone')
        depended_dropdown(frm, frm.doc.state, 'district', 'state')
        depended_dropdown(frm, frm.doc.district, 'center_location', 'district')
        depended_dropdown(frm, frm.doc.sector, 'job_role', 'sector')
        depened_date(frm.doc.start_date, frm.fields_dict.end_date)
        depened_date(frm.doc.end_date, frm.fields_dict.expected_assessment_date)
        depened_date(frm.doc.expected_assessment_date, frm.fields_dict.actual_assessment_date)
        setPlaceholders(frm, [
            { fieldName: 'zone', placeholderText: __("Enter your zone"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'state', placeholderText: __("Enter your state"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'district', placeholderText: __("Enter your district"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'center_location', placeholderText: __("Enter your center location"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'batch_id', placeholderText: __("Enter your batch id"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'project', placeholderText: __("Enter your project"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'sector', placeholderText: __("Enter your sector"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'project', placeholderText: __("Enter your project"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'job_role', placeholderText: __("Enter your job_role"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'start_date', placeholderText: __("Enter your start date"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'end_date', placeholderText: __("Enter your end date"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'expected_assessment_date', placeholderText: __("Enter your expected assessment date"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'actual_assessment_date', placeholderText: __("Enter your actual assessment date"), placeholderSize: "12px", placeholderFontWeight: 400 },

        ])
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
        depended_dropdown(frm, frm.doc.district, 'center_location', 'district')
        frm.set_value('center_location', '')
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
