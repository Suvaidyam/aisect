# Copyright (c) 2024, Rahul Sah and contributors
# For license information, please see license.txt

import frappe
from aisect.api import get_user_role_permission
def execute(filters=None):
	user_role_permission=get_user_role_permission()
	str = ""
	# if user_role_permission['Zone'] and user_role_permission['State'] and user_role_permission['Center Location']:
	# 	str = f" AND zone = '{user_role_permission['Zone']}' AND state = '{user_role_permission['State']}'"
	# elif user_role_permission['Zone'] and user_role_permission['State']:
	# 	str = f" AND zone = '{user_role_permission['Zone']}'"
	# elif user_role_permission['Zone']:
	# 	str = f" AND zone = '{user_role_permission['Zone']}'"
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
					'Under 30 days' AS aging,
					COUNT(*) AS count
				FROM 
					`tabCandidate Details` AS ca
				WHERE 
					DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY) <= ca.assessment_date AND ca.assessment_date <= CURRENT_DATE()
					AND ca.current_status IN ('Assessed','Certified')
				UNION ALL
				SELECT 
					'31-60 days' AS aging,
					COUNT(*) AS count
				FROM 
					`tabCandidate Details` AS ca
				WHERE 
					DATE_SUB(CURRENT_DATE(), INTERVAL 60 DAY) <= ca.assessment_date AND ca.assessment_date < DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
					AND ca.current_status IN ('Assessed','Certified')
				UNION ALL
				SELECT 
					'61-90 days' AS aging,
					COUNT(*) AS count
				FROM 
					`tabCandidate Details` AS ca
				WHERE 
					DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY) <= ca.assessment_date AND ca.assessment_date < DATE_SUB(CURRENT_DATE(), INTERVAL 60 DAY)
					AND ca.current_status IN ('Assessed','Certified')
				UNION ALL
				SELECT 
					'More than 90 days' AS aging,
					COUNT(*) AS count
				FROM 
					`tabCandidate Details` AS ca
				WHERE 
					ca.assessment_date < DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)
					AND ca.current_status IN ('Assessed','Certified');
	"""
	data = frappe.db.sql(sql_query,as_dict=True)
	return columns, data
