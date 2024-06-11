// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

frappe.ui.form.on("District", {
    refresh(frm) {
        depended_dropdown(frm, frm.doc.zone, 'state', 'zone')
        if(frm.doc.district_code!=undefined){
            frm.set_df_property('district_code','read_only',1)
        }
    },
    zone: function (frm) {
        depended_dropdown(frm, frm.doc.zone, 'state', 'zone')
        frm.set_value('state', '')
    },
    after_save:function(frm){
        if(frm.doc.district_code!=undefined){
            frm.set_df_property('district_code','read_only',1)
        }
    },
});
