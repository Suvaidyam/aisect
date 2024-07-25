// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt
// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt
var filters = [
	{
		"fieldname": "zone",
		"fieldtype": "Link",
		"label": "Zone",
		"options": "Zone",
		"only_select": 1,
	},
	{
		"fieldname": "state",
		"fieldtype": "Link",
		"label": "State",
		"options": "State",
		"only_select": 1,
		"get_query": function () {
			var zone = frappe.query_report.get_filter_value('zone');
			if (frappe.user_roles.includes('Zonal Head') || frappe.user_roles.includes('Head Office (PMU)')) {
				return {
					filters: [
						['Project', 'state', 'IN', [state, '']]
					]
				};
			}
		}
	},
	{
		"fieldname": "project",
		"fieldtype": "Link",
		"label": "Project",
		"options": "Project",
		"only_select": 1,
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
		"only_select": 1,
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
		"only_select": 1,
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
		"only_select": 1,
		"get_query": function () {
			var center = frappe.query_report.get_filter_value('center');
			return {
				filters: {
					'center_location': center
				}
			};
		}
	},
]
frappe.query_reports["Candidate Placement By Comapny"] = {
	filters: filters
};

