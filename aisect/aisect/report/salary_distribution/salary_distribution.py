# Copyright (c) 2024, Rahul Sah and contributors
# For license information, please see license.txt

import frappe
def execute(filters=None):
	str = ""
	if filters.gender:
		str = f"WHERE gender = '{filters.gender}'"
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
				pc.monthly_income = (SELECT min_income FROM statistics)
			UNION ALL
			SELECT 
				'Median Salary' AS salary_category, 
				COUNT(*) AS count
			FROM 
				`tabPlacement Child` AS pc
			INNER JOIN 
				`tabCandidate Details` AS ca ON ca.candidate_id = pc.parent
			WHERE 
				pc.monthly_income = (SELECT median_income FROM statistics)
			UNION ALL
			SELECT 
				'Max Salary' AS salary_category, 
				COUNT(*) AS count
			FROM 
				`tabPlacement Child` AS pc
			INNER JOIN 
				`tabCandidate Details` AS ca ON ca.candidate_id = pc.parent
			WHERE 
				pc.monthly_income = (SELECT max_income FROM statistics);

	"""
	data = frappe.db.sql(sql_query,as_dict=True)
	return columns, data
