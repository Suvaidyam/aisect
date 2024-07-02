// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

var filters = []

// if (frappe.user_roles.includes('Head Office (PMU)')) {
//     filters.push({
//         "fieldname": "zone",
//         "fieldtype": "Link",
//         "label": "Zone",
//         "options": "Zone"
//     })
// }
if (frappe.user_roles.includes('Zonal Head') || frappe.user_roles.includes('Head Office (PMU)')) {
    filters.push({
        "fieldname": "state",
        "fieldtype": "Link",
        "label": "State",
        "options": "State"
    })
}
filters.push({
    "fieldname": "project",
    "fieldtype": "Link",
    "label": "Project",
    "options": "Project"
})
if (frappe.user_roles.includes('Head Office (PMU)') || frappe.user_roles.includes('State Placement Coordinator') || frappe.user_roles.includes('State Head') || frappe.user_roles.includes('Zonal Head')) {
    filters.push(
        {
            "fieldname": "district",
            "fieldtype": "Link",
            "label": "District",
            "options": "District"
        },
        {
            "fieldname": "center",
            "fieldtype": "Link",
            "label": "Center",
            "options": "Center"
        })
}
filters.push({
    "fieldname": "batch_id",
    "fieldtype": "Link",
    "label": "Batch",
    "options": "Batch"
},
    {
        "fieldname": "job_role",
        "fieldtype": "Link",
        "label": "Job Role",
        "options": "Job Role"
    },
    {
        "fieldname": "remaining_day",
        "fieldtype": "Select",
        "label": "Remaining days",
        "options": "\n0 day\n1-30 days\n30-60 days\n60-90 days"
    })
frappe.query_reports["Candidate Placement Aging"] = {
    filters: filters
};
