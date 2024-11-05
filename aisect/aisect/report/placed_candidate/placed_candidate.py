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
			"width": 250,
		},
		{
			"label": _("Full Name"),
			"fieldname": "full_name",
			"fieldtype": "Data",
			"width": 250,
		},
		{
			"label": _("Job Role"),
			"fieldname": "job_role",
			"fieldtype": "Data",
			"width": 250,
		},
		{
			"label": _("Company"),
			"fieldname": "name_of_organization",
			"fieldtype": "Data",
			"width": 250,
		},
		{
			"label": _("Salary"),
			"fieldname": "salary",
			"fieldtype": "Int",
			"width": 250,
		},	
	]

	str = ""
	
	if filters.zone:
		str += f" AND cd.zone = '{filters.zone}'"
	if filters.state:
		str += f" AND cd.state = '{filters.state}'"
	if filters.project:
		str += f" AND cd.project = '{filters.project}'"
	if filters.district:
		str += f" AND cd.district = '{filters.district}'"
	if filters.center:
		str += f" AND cd.center_location = '{filters.center}'"
	if filters.job_role:
		str += f" AND cd.job_role = '{filters.job_role}'"
	if	filters.company_name:
		str += f" AND pc.name_of_organization = '{filters.company_name}'"
	if filters.monthly_income:
		if filters.monthly_income == "<5K":
			str += f" AND pc.monthly_income < 5000"
		if filters.monthly_income == "5K-10K":
			str += f" AND pc.monthly_income BETWEEN 5000 AND 10000"
		if filters.monthly_income == "10K-15K":
			str += f" AND pc.monthly_income BETWEEN 10000 AND 15000"
		if filters.monthly_income == ">15K":
			str += f" AND pc.monthly_income > 15000"

	
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
			WHERE
				cd.placement_status = 'Placed'
				{str}	
			"""
	data= frappe.db.sql(sql, as_dict=1)

	return columns, data
