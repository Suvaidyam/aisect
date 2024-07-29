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
		str += f" AND cd.zone = '{zone}'"
	if filters.district:
		str += f" AND cd.district = '{filters.district}'"
	if state or filters.state:
		str += f" AND cd.state = '{state or filters.state}'"
	if center or filters.center:
		str += f" AND cd.center_location = '{center or filters.center}'"
	columns = [
		
		{
		"fieldname":"count",
		"label":"No. of Companies where candidates are placed",
		"fieldtype":"Data",
		"width":200
		}
		
	]
	sql_query = f"""
				SELECT  
					COUNT(DISTINCT(cp.company_name)) as count
				FROM `tabCandidate Details` cd
				INNER JOIN 
					`tabPlacement Child` AS pc ON pc.parent = cd.candidate_id
				INNER JOIN 
					`tabCompany` cp ON pc.name_of_organization = cp.name
				WHERE 
					cd.current_status='Placed' 
				{str};
				"""
	data = frappe.db.sql(sql_query,as_dict=True)
	return columns, data
