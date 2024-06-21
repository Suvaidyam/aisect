// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

var filters = [
    {
        "fieldname": "gender",
        "fieldtype": "Select",
        "label": "Gender",
        "options": "\nMale\nFemale",
    }
    
];
frappe.query_reports["Placement by job role"] = {
	filters: filters
};
