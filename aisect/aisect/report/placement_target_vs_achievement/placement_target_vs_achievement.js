// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt
var filters = [
    {
        "fieldname": "state",
        "fieldtype": "Link",
        "label": "State",
        "options": "State",
        "only_select":1,
    },
    {
        "fieldname": "project",
        "fieldtype": "Link",
        "label": "Project",
        "options": "Project",
        "only_select":1,
        "get_query": function () {
            var state = frappe.query_report.get_filter_value('state');
            return {
                filters: [
                    ['Project', 'state', 'IN', [state, '']]
                ]
            };
        }
    },
    {
        "fieldname": "district",
        "fieldtype": "Link",
        "label": "District",
        "options": "District",
        "only_select":1,
        "get_query": function () {
            var state = frappe.query_report.get_filter_value('state');
            return {
                filters: {
                    'state': state
                }
            };
        }
    },
    {
        "fieldname": "center",
        "fieldtype": "Link",
        "label": "Center",
        "options": "Center",
        "only_select":1,
        "get_query": function () {
            var district = frappe.query_report.get_filter_value('district');
            return {
                filters: {
                    'district': district
                }
            };
        }
    },

    {
        "fieldname": "batch_id",
        "fieldtype": "Link",
        "label": "Batch",
        "options": "Batch",
        "only_select":1,
        "get_query": function () {
            var center = frappe.query_report.get_filter_value('center');
            return {
                filters: {
                    'center_location': center
                }
            };
        }
    },
    {
        "fieldname": "width",
        "fieldtype": "Data",
        "read_only": 1
    },
    {
        "fieldname": "job_role",
        "fieldtype": "Link",
        "label": "Job Role",
        "options": "Job Role",
        "only_select":1,
    },
    {
        "fieldname": "remaining_day",
        "fieldtype": "Select",
        "label": "Remaining days",
        "options": "\n0 day\n1-30 days\n30-60 days\n60-90 days"
    }
]

frappe.query_reports["Placement Target vs Achievement"] = {
    filters: filters,
    formatter: function (value, k, column) {
        if (column.fieldname == "batch_id") {
            return `<a href="/app/candidate-details/view/list?batch_id=${value}">${value}</a>`
        } else {
            return value
        }
    }
};

