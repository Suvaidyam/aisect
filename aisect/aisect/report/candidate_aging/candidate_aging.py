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
		str += f" AND ca.zone = '{zone}'"
	if state:
		str += f" AND ca.state = '{state}'"
	if center:
		str += f" AND ca.center_location = '{center}'"
	# if filters and filters.get('gender'):
	# 	str += f" AND cd.gender = '{filters.get('gender')}'"
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
					'Under 30 days since assessment' AS aging,
					COUNT(*) AS count
				FROM 
					`tabCandidate Details` AS ca
				WHERE 
					DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY) <= ca.assessment_date AND ca.assessment_date <= CURRENT_DATE()
					AND ca.current_status IN ('Assessed','Certified')
					{str}
				UNION ALL
				SELECT 
					'31-60 days since assessment' AS aging,
					COUNT(*) AS count
				FROM 
					`tabCandidate Details` AS ca
				WHERE 
					DATE_SUB(CURRENT_DATE(), INTERVAL 60 DAY) <= ca.assessment_date AND ca.assessment_date < DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
					AND ca.current_status IN ('Assessed','Certified'){str}
				UNION ALL
				SELECT 
					'61-90 days since assessment' AS aging,
					COUNT(*) AS count
				FROM 
					`tabCandidate Details` AS ca
				WHERE 
					DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY) <= ca.assessment_date AND ca.assessment_date < DATE_SUB(CURRENT_DATE(), INTERVAL 60 DAY)
					AND ca.current_status IN ('Assessed','Certified'){str}
				UNION ALL
				SELECT 
					'More than 90 days since assessment' AS aging,
					COUNT(*) AS count
				FROM 
					`tabCandidate Details` AS ca
				WHERE 
					ca.assessment_date < DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)
					AND ca.current_status IN ('Assessed','Certified'){str}
	"""
	data = frappe.db.sql(sql_query,as_dict=True)
	return columns, data
