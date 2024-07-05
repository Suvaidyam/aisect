// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

frappe.ui.form.on("Candidate Success Stories", {
    refresh(frm) {
        frm.image_uploaded = false;
        frappe.call({
            method: "aisect.api.get_one_time_success_story",
            args: {},
            callback: function (r) {
                if (r.message) {
                    frm.fields_dict['name_of_the_candidate'].get_query = function () {
                        return {
                            filters: [
                                ['Candidate Details', 'name', 'NOT IN', r.message],
                                ['Candidate Details', 'placement_status', '=', 'Placed']
                            ],
                            page_length: 1000
                        };
                    };
                }
            }
        });
        if (frm.doc.name_of_the_candidate) {
            setTimeout(() => {
                frm.set_df_property('project', 'read_only', 1);
                frm.set_df_property('batch_id', 'read_only', 1);
                frm.set_df_property('sector', 'read_only', 1);
                frm.set_df_property('job_role', 'read_only', 1);
            }, 500);
        }
        frm.fields_dict['project'].get_query = function () {
            return {
                filters: { 'project_name': 'Please select name of the candidate' },
                page_length: 1000
            };
        };
        frm.fields_dict['batch_id'].get_query = function () {
            return {
                filters: { 'batch_id': 'Please select name of the candidate' },
                page_length: 1000
            };
        };
        frm.fields_dict['sector'].get_query = function () {
            return {
                filters: { 'sector_name': 'Please select name of the candidate' },
                page_length: 1000
            };
        };
        frm.fields_dict['job_role'].get_query = function () {
            return {
                filters: { 'job_role_name': 'Please select name of the candidate' },
                page_length: 1000
            };
        };

        setPlaceholders(frm, [
            { fieldName: 'project', placeholderText: __("Enter your project") },
            { fieldName: 'batch_id', placeholderText: __("Enter your batch id") },
            { fieldName: 'sector', placeholderText: __("Enter your sector") },
            { fieldName: 'job_role', placeholderText: __("Enter your job role") },
            { fieldName: 'name_of_the_candidate', placeholderText: __("Enter your name of the candidate") },
            { fieldName: 'achievement_after_training', placeholderText: __("Enter your achievement after training") },
            { fieldName: 'remarks_of_the_training', placeholderText: __("Enter your remarks of the training") },
        ]);

        hide_advance_search(frm, ['name_of_the_candidate', 'project', 'batch_id', 'sector', 'job_role']);
    },

    candidate_image: function (frm) {
        frm.image_uploaded = true;
        const file_url = frm.doc.candidate_image;
        const maxFileSize = 2 * 1024 * 1024;

        if (file_url) {
            frappe.call({
                method: "frappe.client.get_value",
                args: {
                    doctype: "File",
                    filters: { file_url: file_url },
                    fieldname: ["file_size"]
                },
                callback: function (response) {
                    if (!response.message) {
                        frappe.show_alert({ message: "File not found", indicator: "red" });
                        frm.set_value('candidate_image', '');
                        return;
                    }
                    const file_size = response.message.file_size;
                    if (file_size > maxFileSize) {
                        frm.set_value('candidate_image', '');
                        frappe.show_alert({ message: "File size must be less than 2 MB", indicator: "yellow" });
                    }
                }
            });
        }
    },



    name_of_the_candidate: function (frm) {
        if (frm.doc.name_of_the_candidate) {
            setTimeout(() => {
                frm.set_df_property('project', 'read_only', 1);
                frm.set_df_property('batch_id', 'read_only', 1);
                frm.set_df_property('sector', 'read_only', 1);
                frm.set_df_property('job_role', 'read_only', 1);
            }, 500);
        } else {
            frm.set_df_property('project', 'read_only', 0);
            frm.set_df_property('batch_id', 'read_only', 0);
            frm.set_df_property('sector', 'read_only', 0);
            frm.set_df_property('job_role', 'read_only', 0);
        }
    },

    validate: function (frm) {
        if (frm.image_uploaded) {
            frappe.validated = false;
            frm.image_uploaded = false;
        }
    }
});
