// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt
frappe.ui.form.on("Batch", {
    refresh(frm) {
        depended_dropdown(frm, frm.doc.zone, 'state', 'zone')
        depended_dropdown(frm, frm.doc.state, 'centre', 'state')
    },

    zone: function (frm) {
        depended_dropdown(frm, frm.doc.zone, 'state', 'zone')
        frm.set_value('state', '')
    },
    state: function (frm) {
        depended_dropdown(frm, frm.doc.state, 'centre', 'state')
        frm.set_value('centre', '')
    },
    setup: function (frm) {
        // Initialize the flags
        frm.is_end_date_being_set = false;
        frm.is_assessment_date_being_set = false;
        frm.is_actual_assessment_date_being_set = false;
    },
    end_date: function (frm) {
        if (frm.is_end_date_being_set) {
            return;
        }
        if (frm.doc.start_date && frm.doc.end_date && frm.doc.start_date > frm.doc.end_date) {
            frm.is_end_date_being_set = true;
            frm.set_value('end_date', '').then(() => {
                frm.is_end_date_being_set = false;
                frappe.msgprint({
                    title: __('Validation Error'),
                    indicator: 'red',
                    message: __("<strong>End date</strong> shall not be before the <strong>Start date</strong>")
                });
            });
        }
    },
    assessment_date: function (frm) {
        if (frm.is_assessment_date_being_set) {
            return;
        }
        if (frm.doc.end_date && frm.doc.assessment_date && frm.doc.end_date > frm.doc.assessment_date) {
            frm.is_assessment_date_being_set = true;
            frm.set_value('assessment_date', '').then(() => {
                frm.is_assessment_date_being_set = false;
                frappe.msgprint({
                    title: __('Validation Error'),
                    indicator: 'red',
                    message: __("<strong>Assessment date</strong> shall not be before the <strong>End date</strong>")
                });
            });
        }
    },
    actual_assessment_date: function (frm) {
        if (frm.is_actual_assessment_date_being_set) {
            return;
        }
        if (frm.doc.assessment_date && frm.doc.actual_assessment_date && frm.doc.assessment_date > frm.doc.actual_assessment_date) {
            frm.is_actual_assessment_date_being_set = true;
            frm.set_value('actual_assessment_date', '').then(() => {
                frm.is_actual_assessment_date_being_set = false;
                frappe.msgprint({
                    title: __('Validation Error'),
                    indicator: 'red',
                    message: __("<strong>Actual assessment date</strong> shall not be before the <strong>Assessment date</strong>")
                });
            });
        }
    }
});
