// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

frappe.ui.form.on("Candidate Enrollment", {
    refresh(frm) {
        depended_dropdown(frm,frm.doc.centre,'project','centre')
        depended_dropdown(frm,frm.doc.centre,'candidate','centre')
	},
    centre: function (frm) {
        depended_dropdown(frm,frm.doc.centre,'project','centre')
        depended_dropdown(frm,frm.doc.centre,'candidate','centre')
        frm.set_value('project', '')
        frm.set_value('candidate', '')
    },
   
});
