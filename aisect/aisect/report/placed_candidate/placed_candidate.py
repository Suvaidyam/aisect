# Copyright (c) 2024, Rahul Sah and contributors
# For license information, please see license.txt

import frappe
from frappe import _


def execute(filters: dict | None = None):
	"""Return columns and data for the report.

	This is the main entry point for the report. It accepts the filters as a
	dictionary and should return columns and data. It is called by the framework
	every time the report is refreshed or a filter is updated.
	"""
	columns = [
		{
			"label": _("Candidate ID"),
			"fieldname": "name",
			"fieldtype": "Data",
			"width": 150,
		},
		{
			"label": _("Full Name"),
			"fieldname": "full_name",
			"fieldtype": "Data",
			"width": 150,
		},
		{
			"label": _("Gender"),
			"fieldname": "gender",
			"fieldtype": "Data",
			"width": 150,
		},
		{
			"label": _("State/UT"),
			"fieldname": "state",
			"fieldtype": "Data",
			"width": 150,
		},
		{
			"label": _("Project"),
			"fieldname": "project",
			"fieldtype": "Data",
			"width": 150,
		},
		{
			"label": _("District"),
			"fieldname": "district",
			"fieldtype": "Data",
			"width": 150,
		},
		{
			"label": _("Center"),
			"fieldname": "center",
			"fieldtype": "Data",
			"width": 150,
		},
		{
			"label": _("Job Role"),
			"fieldname": "job_role",
			"fieldtype": "Data",
			"width": 150,
		},
		{
			"label": _("BAtch ID"),
			"fieldname": "batch_id",
			"fieldtype": "Data",
			"width": 150,
		}
	]
	
	
	data = frappe.get_all("Candidate Details", filters=filters, fields=["full_name", "name","gender","project.project_name as project","state.state_name as state","batch_id","district.district_name as district","center_location.center_location_name as center","job_role.job_role_name as job_role"])

	return columns, data
