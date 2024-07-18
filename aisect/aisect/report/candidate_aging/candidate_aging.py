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
		"fieldname":"aging",
		"label":"Aging",
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
					'< 30 days' AS aging,
					COUNT(*) AS count
				FROM 
					`tabCandidate Details` AS ca
				INNER JOIN `tabBatch` AS b ON ca.batch_id=b.name
				WHERE 
					DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY) <= b.end_date AND b.end_date <= CURRENT_DATE()
					AND ca.current_status IN ('Assessed','Certified')
					{str}
				UNION ALL
				SELECT 
					'31-60 days' AS aging,
					COUNT(*) AS count
				FROM 
					`tabCandidate Details` AS ca
				INNER JOIN `tabBatch` AS b ON ca.batch_id=b.name
				WHERE 
					DATE_SUB(CURRENT_DATE(), INTERVAL 60 DAY) <= b.end_date AND b.end_date < DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
					AND ca.current_status IN ('Assessed','Certified'){str}
				UNION ALL
				SELECT 
					'61-90 days' AS aging,
					COUNT(*) AS count
				FROM 
					`tabCandidate Details` AS ca
				INNER JOIN `tabBatch` AS b ON ca.batch_id=b.name
				WHERE 
					DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY) <= b.end_date AND b.end_date < DATE_SUB(CURRENT_DATE(), INTERVAL 60 DAY)
					AND ca.current_status IN ('Assessed','Certified'){str}
				UNION ALL
				SELECT 
					'> 90 days' AS aging,
					COUNT(*) AS count
				FROM 
					`tabCandidate Details` AS ca
				INNER JOIN `tabBatch` AS b ON ca.batch_id=b.name
				WHERE 
					b.end_date < DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)
					AND ca.current_status IN ('Assessed','Certified'){str}
	"""
	data = frappe.db.sql(sql_query,as_dict=True)
	data = [] if all(candidate['count'] == 0 for candidate in data) else data
	return columns, data
