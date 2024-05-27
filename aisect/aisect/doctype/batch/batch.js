// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

frappe.ui.form.on("Batch", {
	refresh(frm) {
        depended_dropdown(frm,frm.doc.zone,'state','zone')
        depended_dropdown(frm,frm.doc.state,'centre','state')
     },
     
     zone: function (frm) {
         depended_dropdown(frm,frm.doc.zone,'state','zone')
         frm.set_value('state', '')
     },
     state: function (frm) {
         depended_dropdown(frm,frm.doc.state,'centre','state')
         frm.set_value('centre', '')
     },
});
