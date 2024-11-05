// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

frappe.query_reports["Placed Candidate"] = {
	onload: async function(report) {
		let export_btn = await report.get_menu_items().find(item => item.label === 'Export');
		report.page.clear_menu();
		report.page.add_menu_item(
			__('Clear Filters'), function() {
				frappe.query_report.filters.forEach(filter => {
					filter.set_input(null);
				});
				frappe.query_report.refresh();
			}
		);
		report.page.add_menu_item(
			export_btn.label,
			export_btn.action,
			export_btn.standard,

		);
    },
	filters: [
		{
			"fieldname": "zone",
			"label": __("Zone"),
			"fieldtype": "Link",
			"options": "Zone",
			"only_select": 1,
		},
		{
			"fieldname": "state",
			"label": __("State"),
			"fieldtype": "Link",
			"options": "State",
			"only_select": 1,
			"get_query": function () {
				var zone = frappe.query_report.get_filter_value('zone');
				return {
					filters: {
						'zone': zone
					}
				};
			}
		},
		{
			"fieldname": "project",
			"label": __("Project"),
			"fieldtype": "Link",
			"options": "Project",
			"only_select": 1,
			"get_query": function () {
				var state = frappe.query_report.get_filter_value('state');
					return {
						filters: [
							['Project', 'state', 'IN', [state,'']]
						]
					};
			}
		},
		{
			"fieldname": "district",
			"label": __("District"),
			"fieldtype": "Link",
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
			"label": __("Center"),
			"fieldtype": "Link",
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
			"fieldname": "job_role",
			"label": __("Job Role"),
			"fieldtype": "Link",
			"options": "Job Role",
			"only_select": 1,
		},
		{
			"fieldname": "company_name",
			"label": __("Company"),
			"fieldtype": "Link",
			"options": "Company",
			"only_select": 1,
		},
		{
			"fieldname": "monthly_income",
			"label": __("Salary"),
			"fieldtype": "Select",
			"options": "\n<5K\n5K-10K\n10K-15K\n>15K",
			"only_select": 1,
		},
	],
};
