// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt
// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt
var filters = [
]
if (frappe.user_roles.includes('Head Office (PMU)')) {
	filters.push({
		"fieldname": "zone",
		"fieldtype": "Link",
		"label": "Zone",
		"options": "Zone",
		"only_select": 1,
	})
}
if (frappe.user_roles.includes('Zonal Head') || frappe.user_roles.includes('Head Office (PMU)')) {
	filters.push(
		{
			"fieldname": "state",
			"fieldtype": "Link",
			"label": "State",
			"options": "State",
			"only_select": 1,
			"get_query": function () {
				var zone = frappe.query_report.get_filter_value('zone');
				if (!frappe.user_roles.includes('Zonal Head')) {
					return {
						filters: {
							'zone': zone
						}
					};
				}
			}
		})
}
filters.push(
	{
		"fieldname": "project",
		"fieldtype": "Link",
		"label": "Project",
		"options": "Project",
		"only_select": 1,
		"get_query": function () {
			var state = frappe.query_report.get_filter_value('state');
			if (frappe.user_roles.includes('Zonal Head') || frappe.user_roles.includes('Head Office (PMU)')) {
				return {
					filters: [
						['Project', 'state', 'IN', [state, '']]
					]
				};
			}
		}
	},
)
frappe.query_reports["Candidate Placement by sector"] = {
	filters: filters
};

