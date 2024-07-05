# Copyright (c) 2024, Rahul Sah and contributors
# For license information, please see license.txt

import frappe
from aisect.services.api import get_user_role_permission
def execute(filters=None):
	user_role_permission=get_user_role_permission()
	str = ""
	zone = user_role_permission.get('Zone')
	state = user_role_permission.get('State')
	center = user_role_permission.get('Center')

	if zone:
		str += f" AND cd.zone = '{zone}'"
	if state:
		str += f" AND cd.state = '{state}'"
	if center:
		str += f" AND cd.center_location = '{center}'"
	if filters.current_status:
		str += f" AND cd.current_status = '{filters.current_status}'"
	# date_column = 'creation'
	# if filters.from_date and filters.to_date:
	# 	str = f"({date_column} between '{filters.from_date}' AND '{filters.to_date}')"
	# elif filters.from_date:
	# 	str = f"{date_column} >='{filters.from_date}'"
	# elif filters.to_date:
	# 	str = f"{date_column}<='{filters.to_date}'"
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
			COALESCE(NULLIF(cd.current_status, ''), 'Unknown') AS ps,
			COUNT(*) AS count
		FROM
			`tabCandidate Details` AS cd
		WHERE
			cd.current_status IN ('Certified', 'Placed')
			{str}
		GROUP BY
			COALESCE(NULLIF(cd.current_status, ''), 'Unknown');
	"""
	data = frappe.db.sql(sql_query,as_dict=True)
	return columns, data
