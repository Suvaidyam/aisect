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
			"label": _("Job Role"),
			"fieldname": "job_role",
			"fieldtype": "Data",
			"width": 150,
		},
		{
			"label": _("Company"),
			"fieldname": "name_of_organization",
			"fieldtype": "Data",
			"width": 150,
		},
		{
			"label": _("Salary"),
			"fieldname": "salary",
			"fieldtype": "Data",
			"width": 150,
		},
		
	]
	
	sql=f"""
			SELECT 
				cd.name,
				cd.full_name,
				jr.job_role_name AS job_role,
				c.company_name AS name_of_organization,
				pc.monthly_income as salary
			FROM 
				`tabCandidate Details` AS cd
			LEFT JOIN 
				`tabJob Role` AS jr ON cd.job_role = jr.name
			LEFT JOIN 
				`tabPlacement Child` AS pc ON cd.name = pc.parent
			LEFT JOIN 
				`tabCompany` AS c ON pc.name_of_organization = c.name
			"""
	data= frappe.db.sql(sql, as_dict=1)

	return columns, data
