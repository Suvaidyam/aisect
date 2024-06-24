// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt
frappe.query_reports["Placement by job role"] = {
    filters: [
        // {
        //     "fieldname": "current_status",
        //     "fieldtype": "Select",
        //     "label": "Aging",
        //     "options":"\n1-30\n30-60\n60-90\nMore than 90"
        // },
        {
            "fieldname": "batch_id",
            "fieldtype": "Link",
            "label": "Batch",
            "options": "Batch"
        },
        {
            "fieldname": "zone",
            "fieldtype": "Link",
            "label": "Zone",
            "options": "Zone"
        },
        {
            "fieldname": "state",
            "fieldtype": "Link",
            "label": "State",
            "options": "State"
        },
        {
            "fieldname": "center",
            "fieldtype": "Link",
            "label": "Center",
            "options": "Center"
        },
        {
            "fieldname": "gender",
            "fieldtype": "Select",
            "label": "Gender",
            "options": "\nMale\nFemale",
        },
    ]
};
