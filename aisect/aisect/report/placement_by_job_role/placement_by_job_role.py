# Copyright (c) 2024, Rahul Sah and contributors
# For license information, please see license.txt

import frappe
def execute(filters=None):
	str = ""
	if filters.gender:
		str = f"AND gender = '{filters.gender}'"
	columns = [
		{
		"fieldname":"job_role",
		"label":"Job Role",
		"fieldtype":"Data",
		"width":300
		},
		{
		"fieldname":"count",
		"label":"Count",
		"fieldtype":"int",
		"width":200
		}
	]
	sql_query = f"""
				SELECT
					COUNT(cd.candidate_id) AS count,
					jr.job_role_name AS job_role
				FROM
					`tabCandidate Details` cd
				INNER JOIN
					`tabJob Role` jr on cd.job_role = jr.name
				WHERE cd.current_status='Placed'
				GROUP BY
					job_role;
				"""
	data = frappe.db.sql(sql_query,as_dict=True)
	return columns, data
