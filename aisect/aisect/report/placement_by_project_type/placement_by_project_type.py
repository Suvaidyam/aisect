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
		str += f" AND ca.zone = '{zone or filters.zone}'"
	if state or filters.state:
		str += f" AND ca.state = '{state or filters.state}'"
	if filters.project:
		str += f" AND ca.project = '{filters.project}'"
	if filters.district:
		str += f" AND ca.district = '{filters.district}'"
	if center or filters.center:
		str += f" AND ca.center_location = '{center or filters.center}'"
	if filters and filters.batch_id:
		str += f" AND ca.batch_id = '{filters.batch_id}'"
	columns = [
		{
		"fieldname":"project_type",
		"label":"Project Type",
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
					COUNT(ca.candidate_id) AS count,
					jr.project_type AS project_type

				FROM
					`tabCandidate Details` ca
				INNER JOIN
					`tabProject` jr on ca.project = jr.name
				WHERE ca.current_status='Placed' 
				{str}
				GROUP BY
					jr.project_type		
				"""
	data = frappe.db.sql(sql_query,as_dict=True)
	return columns, data
