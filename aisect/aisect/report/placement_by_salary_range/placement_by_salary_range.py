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
					(SELECT '< 5k' AS monthly_income_range
					UNION ALL
					SELECT '5k to 10k'
					UNION ALL
					SELECT '10k to 15k'
					UNION ALL
					SELECT '> 15k') AS ranges
				LEFT JOIN
					(SELECT
						CASE
							WHEN pc.monthly_income < 5000 THEN '< 5k'
							WHEN pc.monthly_income BETWEEN 5000 AND 10000 THEN '5k to 10k'
							WHEN pc.monthly_income BETWEEN 10000 AND 15000 THEN '10k to 15k'
							ELSE '> 15k'
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
					FIELD(ranges.monthly_income_range, '< 5k', '5k to 10k', '10k to 15k', '> 15k');
				"""
	data = frappe.db.sql(sql_query,as_dict=True)
	return columns, data
