// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

frappe.ui.form.on("Candidate Success Stories", {
    refresh(frm) {
        setPlaceholders(frm, [
            { fieldName: 'name_of_the_candidate', placeholderText: __("Enter your name of the candidate") },
            { fieldName: 'achievement_after_training', placeholderText: __("Enter your achievement after training") },
            { fieldName: 'remarks_of_the_training', placeholderText: __("Enter your remarks of the training") },
        ])
    },
});
