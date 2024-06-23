// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

const filters = [
    {
        "fieldname": "gender",
        "fieldtype": "Select",
        "label": "Gender",
        "options": "\nMale\nFemale",
    },
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
    }
];

frappe.query_reports["Sector wise candidate"] = {
    filters: filters
};
