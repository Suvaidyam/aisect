// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

frappe.ui.form.on("Candidate Success Stories", {
    refresh(frm) {
        frappe.call({
            method: "aisect.api.get_one_time_success_story",
            args: {},
            callback: function(r) {
                if(r.message) {
                    frm.fields_dict['name_of_the_candidate'].get_query = function () {
                        return {
                            filters: [
                                ['Candidate Details','name', 'NOT IN',r.message ],
                                ['Candidate Details','placement_status', '=','Placed' ]  
                            ],
                            page_length: 1000
                        };
                    }
                }
            }
        });
        setPlaceholders(frm, [
            { fieldName: 'name_of_the_candidate', placeholderText: __("Enter your name of the candidate") },
            { fieldName: 'achievement_after_training', placeholderText: __("Enter your achievement after training") },
            { fieldName: 'remarks_of_the_training', placeholderText: __("Enter your remarks of the training") },
        ])
        hide_advance_search(frm,['name_of_the_candidate'])
    },
    
});
