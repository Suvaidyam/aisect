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
	if filters.project:
		str += f" AND cd.project = '{filters.project}'"
	if filters.district:
		str += f" AND cd.district = '{filters.district}'"
	if center or filters.center:
		str += f" AND cd.center_location = '{center or filters.center}'"
	if filters and filters.batch_id:
		str += f" AND cd.batch_id = '{filters.batch_id}'"
	if filters and filters.gender:
		str += f" AND cd.gender = '{filters.gender}'"
	columns = [
		{
		"fieldname":"sector",
		"label":"Sector",
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
				st.sector_name as sector,
				COUNT(cd.candidate_id) as count
			FROM
				`tabCandidate Details` AS cd
			INNER JOIN
				`tabSector` AS st ON cd.sector = st.name
			WHERE cd.current_status='Placed'
			{str}
			GROUP BY 
				st.sector_name
			ORDER BY
					count DESC
			LIMIT 10;
	"""
	data = frappe.db.sql(sql_query,as_dict=True)
	return columns, data
