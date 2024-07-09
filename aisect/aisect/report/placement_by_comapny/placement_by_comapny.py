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
	if filters and filters.batch_id:
		str += f" AND cd.batch_id = '{filters.batch_id}'"
	columns = [
		{
		"fieldname":"company_name",
		"label":"Company",
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
					cp.company_name AS company_name
				FROM
					`tabCandidate Details` cd
				INNER JOIN 
						`tabPlacement Child` AS pc ON pc.parent = cd.candidate_id
				INNER JOIN
					`tabCompany` cp ON pc.name_of_organization = cp.name
				WHERE cd.current_status='Placed'
				{str}
				GROUP BY
					cp.company_name
				"""
	data = frappe.db.sql(sql_query,as_dict=True)
	return columns, data