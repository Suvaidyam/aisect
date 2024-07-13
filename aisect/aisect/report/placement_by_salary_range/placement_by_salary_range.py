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
	if center or filters.center:
		str += f" AND ca.center_location = '{center or filters.center}'"
	if filters and filters.batch_id:
		str += f" AND ca.batch_id = '{filters.batch_id}'"
	columns = [
		{
		"fieldname":"monthly_income_range",
		"label":"Salary Range",
		"fieldtype":"Data",
		"width":300
		},
		{
		"fieldname":"candidate_count",
		"label":"Count",
		"fieldtype":"int",
		"width":200
		}
	]
	sql_query = f"""			
				SELECT
					ranges.monthly_income_range,
					COALESCE(candidate_count, 0) AS candidate_count
				FROM
					(SELECT 'Less than Rs. 5000' AS monthly_income_range
					UNION ALL
					SELECT 'Rs. 5000 to 10000'
					UNION ALL
					SELECT 'Rs. 10000 to 15000'
					UNION ALL
					SELECT 'More than Rs. 15000') AS ranges
				LEFT JOIN
					(SELECT
						CASE
							WHEN pc.monthly_income < 5000 THEN 'Less than Rs. 5000'
							WHEN pc.monthly_income BETWEEN 5000 AND 10000 THEN 'Rs. 5000 to 10000'
							WHEN pc.monthly_income BETWEEN 10000 AND 15000 THEN 'Rs. 10000 to 15000'
							ELSE 'More than Rs. 15000'
						END AS monthly_income_range,
						COUNT(*) AS candidate_count
					FROM
						`tabCandidate Details` AS ca
					INNER JOIN 
						`tabPlacement Child` AS pc ON pc.parent = ca.candidate_id
					WHERE ca.current_status='Placed'
					{str}
					GROUP BY
						monthly_income_range) AS counts
				ON
					ranges.monthly_income_range = counts.monthly_income_range
				ORDER BY
					FIELD(ranges.monthly_income_range, 'Less than Rs. 5000', 'Rs. 5000 to 10000', 'Rs. 10000 to 15000', 'More than Rs. 15000');
				"""
	data = frappe.db.sql(sql_query,as_dict=True)
	return columns, data
