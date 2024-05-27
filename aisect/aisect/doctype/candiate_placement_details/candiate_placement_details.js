// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

frappe.ui.form.on("Candiate Placement Details", {
    refresh(frm) {
        depended_dropdown(frm,frm.doc.state,'centre','state')
        depended_dropdown(frm,frm.doc.centre,'project','centre')
	},

    state: function (frm) {
        depended_dropdown(frm,frm.doc.state,'centre','state')
        frm.set_value('centre', '')
    },
    centre: function (frm) {
        depended_dropdown(frm,frm.doc.centre,'project','centre')
        frm.set_value('project', '')
    }

});
