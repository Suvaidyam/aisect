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
	if zone:
		str += f" AND ca.zone = '{zone}'"
	if filters.district:
		str += f" AND ca.district = '{filters.district}'"
	if state or filters.state:
		str += f" AND ca.state = '{state or filters.state}'"
	if center or filters.center:
		str += f" AND ca.center_location = '{center or filters.center}'"
	columns = [
		
		{
		"fieldname":"first_month_slip_count",
		"label":"First Month Salary Slip",
		"fieldtype":"Int",
		"width":200
		},
		{
		"fieldname":"second_month_slip_count",
		"label":"Second Month Salary Slip",
		"fieldtype":"Int",
		"width":200
		},
		{
		"fieldname":"third_month_slip_count",
		"label":"Third Month Salary Slip",
		"fieldtype":"Int",
		"width":200
		}
	]
	sql_query = f"""
				SELECT  
					COUNT(DISTINCT CASE WHEN pc.salary_slipm1 = 'Yes' THEN ca.candidate_id END) AS first_month_slip_count,
					COUNT(DISTINCT CASE WHEN pc.salary_slipm2 = 'Yes' THEN ca.candidate_id END) AS second_month_slip_count,
					COUNT(DISTINCT CASE WHEN pc.salary_slipm3 = 'Yes' THEN ca.candidate_id END) AS third_month_slip_count
				FROM 
					`tabCandidate Details` AS ca
				INNER JOIN 
					`tabPlacement Child` AS pc ON pc.parent = ca.candidate_id
				WHERE 
					ca.current_status = 'Placed'
				{str};
				"""
	data = frappe.db.sql(sql_query,as_dict=True)
	return columns, data
