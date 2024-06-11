// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

frappe.ui.form.on("Candidate Success Stories", {
    refresh(frm) {
        setPlaceholders(frm, [
            { fieldName: 'name_of_the_candidate', placeholderText: __("Enter your name of the candidate"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'achievement_after_training', placeholderText: __("Enter your achievement after training"), placeholderSize: "12px", placeholderFontWeight: 400 },
            { fieldName: 'remarks_of_the_training', placeholderText: __("Enter your remarks of the training"), placeholderSize: "12px", placeholderFontWeight: 400 },
        ])
    },
});
