// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt
var filters = [
    {
        "fieldname": "current_status",
        "fieldtype": "Select",
        "label": "Current Status",
        "options":"\nPlaced\nCertified"
    },
    // {
    //     "fieldname": "from_date",
    //     "fieldtype": "Date",
    //     "label": "From Date",
    // },
    // {
    //     "fieldname": "to_date",
    //     "fieldtype": "Date",
    //     "label": "To Date"
    // }
    
];
frappe.query_reports["Placement Status"] = {
	filters: filters
};
