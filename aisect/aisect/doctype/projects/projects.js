// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

frappe.ui.form.on("Projects", {
	refresh(frm) {
       depended_dropdown(frm,frm.doc.state,'centre','state')
	},
    
    state: function (frm) {
        depended_dropdown(frm,frm.doc.state,'centre','state')
        frm.set_value('centre', '')
    }
});
