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
		"fieldname":"full_name",
		"label":"Full Name",
		"fieldtype":"Data",
		"width":180
		},
		{
		"fieldname":"candidate_id",
		"label":"Candidate ID",
		"fieldtype":"Data",
		"width":200
		},
		{
		"fieldname":"batch_id",
		"label":"Batch ID",
		"fieldtype":"Data",
		"width":150
		},
		{
		"fieldname":"zone_name",
		"label":"Zone",
		"fieldtype":"Data",
		"width":100
		},
		{
		"fieldname":"state_name",
		"label":"State",
		"fieldtype":"Data",
		"width":100
		},
		{
		"fieldname":"center_location_name",
		"label":"Center",
		"fieldtype":"Data",
		"width":150
		},
		{
		"fieldname":"due_date",
		"label":"Placement Due Date",
		"fieldtype":"Data",
		"width":160
		},
		{
		"fieldname":"remaining_days",
		"label":"Remaining Days",
		"fieldtype":"Data",
		"width":135
		},
		{
		"fieldname":"current_status",
		"label":"Status",
		"fieldtype":"int",
		"width":120
		}
	]
	sql_query = f"""
				SELECT
					cd.full_name,
					cd.candidate_id,
					cd.batch_id,
					zn.zone_name,
					st.state_name,
					ct.center_location_name,
					cd.current_status,
					cd.placement_due_date AS due_date,
					DATEDIFF(cd.placement_due_date, CURRENT_DATE) AS remaining_days
				FROM
					`tabCandidate Details` cd
				INNER JOIN 
					`tabZone` zn ON cd.zone = zn.name
				INNER JOIN 
					`tabState` st ON cd.state = st.name
				INNER JOIN 
					`tabCenter` ct ON cd.center_location = ct.name
				WHERE 
					cd.current_status IN ('Assessed','Certified')
					{str};
				"""
	data = frappe.db.sql(sql_query,as_dict=True)
	return columns, data
