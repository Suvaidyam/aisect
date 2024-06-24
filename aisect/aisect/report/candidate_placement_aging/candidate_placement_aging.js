// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

var filters = [
    {
        "fieldname": "batch_id",
        "fieldtype": "Link",
        "label": "Batch",
        "options": "Batch"
    },
    {
        "fieldname": "current_status",
        "fieldtype": "Select",
        "label": "Remaining days",
        "options": "\n1-30\n30-60\n60-90\nMore than 90"
    }
]
let state = {
    "fieldname": "state",
    "fieldtype": "Link",
    "label": "State",
    "options": "State"
}
let zone =  {
    "fieldname": "zone",
    "fieldtype": "Link",
    "label": "Zone",
    "options": "Zone"
}
let center = {
    "fieldname": "center",
    "fieldtype": "Link",
    "label": "Center",
    "options": "Center"
}
if (frappe.user_roles.includes('Head Office (PMU)')) {
    filters.splice(1,0,zone,state,center)
}
if (frappe.user_roles.includes('Zonal Head')) {
    filters.splice(1,0,state,center)
}
if (frappe.user_roles.includes('State Placement Coordinator') || frappe.user_roles.includes('State Head')) {
    filters.splice(1,0,center)
}
if (frappe.user_roles.includes('Centre Placement Coordinator') || frappe.user_roles.includes('Centre Head')) {
    filters.splice(1,0,center)
}
frappe.query_reports["Candidate Placement Aging"] = {
    filters: filters
};
