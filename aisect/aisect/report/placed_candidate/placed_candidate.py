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
			"label": _("Name"),
			"fieldname": "first_name",
			"fieldtype": "Data",
		},
		{
			"label": _("Candidate ID"),
			"fieldname": "candidate_id",
			"fieldtype": "Data",
		},
		{
			"label": _("Gender"),
			"fieldname": "gender",
			"fieldtype": "Data",
		},
	]
	
	sql_query = """
		SELECT
			cd.first_name,
			cd.candidate_id,
			cd.gender
		FROM
			`tabCandidate Details` as cd
		WHERE
            cd.placement_status='Placed'	
	"""
	data = frappe.db.sql(sql_query, as_dict=True)

	return columns, data
