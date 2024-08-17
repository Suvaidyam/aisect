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

	if zone or filters.zone:
		str += f" AND cd.zone = '{zone or filters.zone}'"
	if state or filters.state:
		str += f" AND cd.state = '{state or filters.state}'"
	if center or filters.center:
		str += f" AND cd.center_location = '{center or filters.center}'"
	# if filters.project:
	# 	str += f" AND cd.project = '{filters.project}'"
	# if filters.district:
	# 	str += f" AND cd.district = '{filters.district}'"
	# if filters and filters.batch_id:
	# 	str += f" AND cd.batch_id = '{filters.batch_id}'"
	# if filters and filters.gender:
	# 	str += f" AND cd.gender = '{filters.gender}'"
	columns = [
		{
		"fieldname":"job_role",
		"label":"Job Role",
		"fieldtype":"Data",
		"width":300
		},
		{
		"fieldname":"count",
		"label":"Placed Candidates",
		"fieldtype":"Int",
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
				{str}
				GROUP BY
					job_role;
				"""
	data = frappe.db.sql(sql_query,as_dict=True)
	return columns, data
