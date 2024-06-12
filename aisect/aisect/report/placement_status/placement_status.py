# Copyright (c) 2024, Rahul Sah and contributors
# For license information, please see license.txt

import frappe
def execute(filters=None):
	str = ""
	date_column = 'creation'
	if filters.from_date and filters.to_date:
		str = f"({date_column} between '{filters.from_date}' AND '{filters.to_date}')"
	elif filters.from_date:
		str = f"{date_column} >='{filters.from_date}'"
	elif filters.to_date:
		str = f"{date_column}<='{filters.to_date}'"
	columns = [
		{
		"fieldname":"ps",
		"label":"Placement Status",
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
			COALESCE(NULLIF(current_status, ''), 'Unknown') as ps,
			COUNT(*) as count
		FROM
			`tabCandidate Profile`
		WHERE
			{str if str else "1=1"}
		GROUP BY
			COALESCE(NULLIF(current_status, ''), 'Unknown');
	"""
	data = frappe.db.sql(sql_query,as_dict=True)
	return columns, data
