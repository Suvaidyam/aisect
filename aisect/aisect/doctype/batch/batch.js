// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt
frappe.ui.form.on("Batch", {
    refresh(frm) {
        depended_dropdown(frm, frm.doc.zone, 'state', 'zone')
        depended_dropdown(frm, frm.doc.state, 'centre', 'state')
        depended_dropdown(frm, frm.doc.sector, 'job_role', 'sector')
    },

    zone: function (frm) {
        depended_dropdown(frm, frm.doc.zone, 'state', 'zone')
        frm.set_value('state', '')
    },
    state: function (frm) {
        depended_dropdown(frm, frm.doc.state, 'centre', 'state')
        frm.set_value('centre', '')
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
    end_date: function (frm) {
        date_validation(frm, frm.doc.end_date, frm.doc.start_date, frm.is_end_date_being_set, 'end_date', 'Start Date', 'End Date')
    },
    assessment_date: function (frm) {
        date_validation(frm, frm.doc.assessment_date, frm.doc.end_date, frm.is_assessment_date_being_set, 'assessment_date', 'End Date', 'Assessment Date')
    },
    actual_assessment_date: function (frm) {
        date_validation(frm, frm.doc.actual_assessment_date, frm.doc.assessment_date, frm.is_actual_assessment_date_being_set, 'actual_assessment_date', 'Assessment date', 'Actual assessment date')
    }
});
