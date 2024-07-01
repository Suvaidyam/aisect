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

	if zone or filters.zone:
		str += f" AND cd.zone = '{zone or filters.zone}'"
	if state or filters.state:
		str += f" AND cd.state = '{state or filters.state}'"
	if center or filters.center:
		str += f" AND cd.center_location = '{center or filters.center}'"
	if filters and filters.batch_id:
		str += f" AND cd.batch_id = '{filters.batch_id}'"
	if filters and filters.job_role:
		str += f" AND cd.job_role = '{filters.job_role}'"
	if filters and filters.project:
		str += f" AND cd.project = '{filters.project}'"
	if filters and filters.remaining_day =='1-30':
		str += f" AND DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY) <= cd.assessment_date AND cd.assessment_date <= CURRENT_DATE()"
	elif filters and filters.remaining_day =='30-60':
		str += f" AND DATE_SUB(CURRENT_DATE(), INTERVAL 60 DAY) <= cd.assessment_date AND cd.assessment_date < DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)"
	elif filters and filters.remaining_day =='60-90':
		str += f" AND DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY) <= cd.assessment_date AND cd.assessment_date < DATE_SUB(CURRENT_DATE(), INTERVAL 60 DAY)"
	elif filters and filters.remaining_day =='More than 90':
		str += f" AND cd.assessment_date < DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)"
	columns = [
		{
		"fieldname":"full_name",
		"label":"Full Name",
		"fieldtype":"Data",
		"width":180
		},
		{
		"fieldname":"candidate_id",
		"label":"Candidate ID",
		"fieldtype":"Data",
		"width":200
		},
		{
		"fieldname":"state_name",
		"label":"State",
		"fieldtype":"Data",
		"width":100
		},
		{
		"fieldname":"project_name",
		"label":"Project",
		"fieldtype":"Data",
		"width":100
		},
		{
		"fieldname":"district_name",
		"label":"District",
		"fieldtype":"Data",
		"width":150
		},
		{
		"fieldname":"center_location_name",
		"label":"Center",
		"fieldtype":"Data",
		"width":150
		},
		{
		"fieldname":"job_role_name",
		"label":"Job Role",
		"fieldtype":"Data",
		"width":150
		},
		{
		"fieldname":"batch_id",
		"label":"Batch ID",
		"fieldtype":"Data",
		"width":150
		},
		{
		"fieldname":"due_date",
		"label":"Placement Due Date",
		"fieldtype":"Data",
		"width":160
		},
		{
		"fieldname":"remaining_days",
		"label":"Remaining Days",
		"fieldtype":"Data",
		"width":135
		},
		{
		"fieldname":"current_status",
		"label":"Candidate Status",
		"fieldtype":"int",
		"width":140
		}
	]
	sql_query = f"""
				SELECT
					cd.full_name,
					cd.candidate_id,
					pr.project_name,
					dt.district_name,
					jb.job_role_name,
					cd.batch_id,
					st.state_name,
					ct.center_location_name,
					cd.current_status,
					cd.placement_due_date AS due_date,
					DATEDIFF(cd.placement_due_date, CURRENT_DATE) AS remaining_days
				FROM
					`tabCandidate Details` cd
				 INNER JOIN 
					`tabState` st ON cd.state = st.name
				INNER JOIN 
					`tabCenter` ct ON cd.center_location = ct.name
				INNER JOIN 
					`tabDistrict` dt ON cd.district = dt.name
				INNER JOIN 
					`tabProject` pr ON cd.project = pr.name
				INNER JOIN 
					`tabJob Role` jb ON cd.job_role = jb.name
				WHERE 
					cd.current_status IN ('Assessed','Certified')
					{str};
				"""
	data = frappe.db.sql(sql_query,as_dict=True)
	return columns, data
