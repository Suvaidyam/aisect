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
        "fieldname": "gender",
        "fieldtype": "Select",
        "label": "Gender",
        "options": "\nMale\nFemale",
    },
  ]
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
frappe.query_reports["Placement by job role"] = {
    filters: filters
};
