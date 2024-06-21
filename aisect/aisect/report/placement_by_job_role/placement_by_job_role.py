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
				jr.job_role_name as job_role,
				COUNT(ca.candidate_id) as count
				
			FROM
				`tabCandidate Details` AS ca
			INNER JOIN
				`tabPlacement Child` AS pc ON ca.candidate_id = pc.parent
			INNER JOIN
				`tabCompany` AS cm ON pc.name_of_organization = cm.name
			INNER JOIN
				`tabSector` AS st ON cm.sector = st.name
			INNER JOIN
				`tabJob Role` AS jr ON st.name = jr.sector
			WHERE ca.current_status='Placed'
				{str}
			GROUP BY jr.job_role_name;
	"""
	data = frappe.db.sql(sql_query,as_dict=True)
	return columns, data
