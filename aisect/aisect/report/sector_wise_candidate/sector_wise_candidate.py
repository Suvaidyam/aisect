# Copyright (c) 2024, Rahul Sah and contributors
# For license information, please see license.txt

import frappe
from aisect.api import get_user_role_permission
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
	if filters and filters.get('gender'):
		str += f" AND cd.gender = '{filters.get('gender')}'"
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
			GROUP BY st.sector_name;
	"""
	data = frappe.db.sql(sql_query,as_dict=True)
	return columns, data
