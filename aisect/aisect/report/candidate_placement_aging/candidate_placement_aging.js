// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

var filters = [
    {
        "fieldname": "batch_id",
        "fieldtype": "Link",
        "label": "Batch",
        "options": "Batch"
    },
]

if (frappe.user_roles.includes('Head Office (PMU)')) {
    filters.push({
        "fieldname": "zone",
        "fieldtype": "Link",
        "label": "Zone",
        "options": "Zone"
    })
}
if (frappe.user_roles.includes('Zonal Head') || frappe.user_roles.includes('Head Office (PMU)')) {
    filters.push({
        "fieldname": "state",
        "fieldtype": "Link",
        "label": "State",
        "options": "State"
    })
}
if (frappe.user_roles.includes('Head Office (PMU)') || frappe.user_roles.includes('State Placement Coordinator') || frappe.user_roles.includes('State Head') || frappe.user_roles.includes('Zonal Head')) {
    filters.push({
        "fieldname": "center",
        "fieldtype": "Link",
        "label": "Center",
        "options": "Center"
    })
}
filters.push({
    "fieldname": "current_status",
    "fieldtype": "Select",
    "label": "Remaining days",
    "options": "\n1-30\n30-60\n60-90\nMore than 90"
})
frappe.query_reports["Candidate Placement Aging"] = {
    filters: filters
};
