# Copyright (c) 2024, Rahul Sah and contributors
# For license information, please see license.txt

import frappe
def execute(filters=None):
	# str = ""
	# date_column = 'creation'
	# if filters.from_date and filters.to_date:
	# 	str = f"({date_column} between '{filters.from_date}' AND '{filters.to_date}')"
	# elif filters.from_date:
	# 	str = f"{date_column} >='{filters.from_date}'"
	# elif filters.to_date:
	# 	str = f"{date_column}<='{filters.to_date}'"
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
				UNION ALL
				SELECT 
					'31-60 days' AS aging,
					COUNT(*) AS count
				FROM 
					`tabCandidate Details` AS ca
				WHERE 
					DATE_SUB(CURRENT_DATE(), INTERVAL 60 DAY) <= ca.assessment_date AND ca.assessment_date < DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)

				UNION ALL
				SELECT 
					'61-90 days' AS aging,
					COUNT(*) AS count
				FROM 
					`tabCandidate Details` AS ca
				WHERE 
					DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY) <= ca.assessment_date AND ca.assessment_date < DATE_SUB(CURRENT_DATE(), INTERVAL 60 DAY)

				UNION ALL
				SELECT 
					'More than 90 days' AS aging,
					COUNT(*) AS count
				FROM 
					`tabCandidate Details` AS ca
				WHERE 
					ca.assessment_date < DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY);
	"""
	data = frappe.db.sql(sql_query,as_dict=True)
	return columns, data
