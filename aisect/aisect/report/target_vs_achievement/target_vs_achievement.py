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
		"fieldname":"candidate_count",
		"label":"Candidate Count",
		"fieldtype":"Data",
		"width":160
		},
		{
		"fieldname":"target",
		"label":"Target",
		"fieldtype":"Data",
		"width":160
		},
		{
		"fieldname":"achievement",
		"label":"Achievement",
		"fieldtype":"Data",
		"width":135
		},
		{
		"fieldname":"achievements_status",
		"label":"Achievement Status",
		"fieldtype":"int",
		"width":180
		}
	]
	sql_query = f"""
				SELECT 
					cd.batch_id,
					zn.zone_name,
					st.state_name,
					ct.center_location_name,
					COUNT(*) AS candidate_count,
					ROUND(SUM(CASE WHEN cd.current_status = 'Certified' THEN 1 ELSE 0 END) * 0.7) AS target,
					ROUND(SUM(CASE WHEN cd.current_status = 'Placed' THEN 1 ELSE 0 END)) AS achievement,
					CASE 
						WHEN ROUND(SUM(CASE WHEN cd.current_status = 'Certified' THEN 1 ELSE 0 END) * 0.7) <= ROUND(SUM(CASE WHEN cd.current_status = 'Placed' THEN 1 ELSE 0 END))
						THEN 'Achieved'
						ELSE 'In Progress'
					END AS achievements_status
				FROM
					`tabCandidate Details` cd
				INNER JOIN 
					`tabZone` zn ON cd.zone = zn.name
				INNER JOIN 
					`tabState` st ON cd.state = st.name
				INNER JOIN 
					`tabCenter` ct ON cd.center_location = ct.name 
				 WHERE 1 = 1 {str}
				GROUP BY 
					cd.batch_id
				ORDER BY 
					candidate_count DESC;
	"""
	data = frappe.db.sql(sql_query,as_dict=True)
	return columns, data