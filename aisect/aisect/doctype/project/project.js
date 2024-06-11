// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

frappe.ui.form.on("Project", {
	refresh(frm) {
        if(frm.doc.project_code!=undefined){
            frm.set_df_property('project_code','read_only',1)
        }
	},
    after_save:function(frm){
        if(frm.doc.project_code!=undefined){
            frm.set_df_property('project_code','read_only',1)
        }
    },
});
