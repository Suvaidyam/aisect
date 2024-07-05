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
		"fieldname":"salary_category",
		"label":"Salary",
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
			 WITH ranked_salaries AS (
            SELECT 
                pc.monthly_income,
                ROW_NUMBER() OVER (ORDER BY pc.monthly_income) AS row_num,
                COUNT(*) OVER () AS total_rows
            FROM 
                `tabPlacement Child` AS pc
            INNER JOIN 
                `tabCandidate Details` AS ca ON ca.candidate_id = pc.parent
            WHERE
                1 = 1 {str}
        ),
        statistics AS (
            SELECT
                MIN(pc.monthly_income) AS min_income,
                MAX(pc.monthly_income) AS max_income,
                AVG(ranked_salaries.monthly_income) AS median_income
            FROM 
                `tabPlacement Child` AS pc
            INNER JOIN 
                `tabCandidate Details` AS ca ON ca.candidate_id = pc.parent,
                ranked_salaries
            WHERE
                1 = 1 {str} AND
                ranked_salaries.row_num IN (FLOOR((ranked_salaries.total_rows + 1) / 2), CEIL((ranked_salaries.total_rows + 1) / 2))
        )
        SELECT 
            'Min Salary' AS salary_category, 
            COUNT(*) AS count
        FROM 
            `tabPlacement Child` AS pc
        INNER JOIN 
            `tabCandidate Details` AS ca ON ca.candidate_id = pc.parent
        WHERE 
            pc.monthly_income = (SELECT min_income FROM statistics) AND 1 = 1 {str}
        UNION ALL
        SELECT 
            'Median Salary' AS salary_category, 
            COUNT(*) AS count
        FROM 
            `tabPlacement Child` AS pc
        INNER JOIN 
            `tabCandidate Details` AS ca ON ca.candidate_id = pc.parent
        WHERE 
            pc.monthly_income = (SELECT median_income FROM statistics) AND 1 = 1 {str}
        UNION ALL
        SELECT 
            'Max Salary' AS salary_category, 
            COUNT(*) AS count
        FROM 
            `tabPlacement Child` AS pc
        INNER JOIN 
            `tabCandidate Details` AS ca ON ca.candidate_id = pc.parent
        WHERE 
            pc.monthly_income = (SELECT max_income FROM statistics) AND 1 = 1 {str};
	"""
	data = frappe.db.sql(sql_query,as_dict=True)
	return columns, data
