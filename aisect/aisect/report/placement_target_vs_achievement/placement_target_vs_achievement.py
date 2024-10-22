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
	having_str = ""
	if zone:
		str += f" AND cd.zone = '{zone}'"
	if filters.district:
		str += f" AND cd.district = '{filters.district}'"
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
	if filters and filters.remaining_day =='1-30 days':
		having_str += f" AND remaining_days > 0 AND remaining_days <= 30"
	elif filters and filters.remaining_day =='30-60 days':
		having_str += f" AND remaining_days > 30 AND remaining_days <= 60"
	elif filters and filters.remaining_day =='60-90 days':
		having_str += f" AND remaining_days > 60 AND remaining_days <= 90"
	elif filters and filters.remaining_day =='Less than 0 days':
		having_str += f" AND remaining_days < 0"
	columns = [
		{
		"fieldname":"state_name",
		"label":"State/UT",
		"fieldtype":"Data",
		"width":160
		},
		{
		"fieldname":"project_name",
		"label":"Project",
		"fieldtype":"Data",
		"width":160
		},
		{
		"fieldname":"district_name",
		"label":"District",
		"fieldtype":"Data",
		"width":160
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
		"fieldtype":"Link",
		"options":"Batch",
		"width":250
		},
		{
		"fieldname":"candidate_count",
		"label":"Candidate count",
		"fieldtype":"Int",
		"width":160
		},
		{
		"fieldname":"due_date",
		"label":"Placement Due Date",
		"fieldtype":"Date",
		"width":160
		},
		{
		"fieldname":"remaining_days",
		"label":"Remaining Days",
		"fieldtype":"Int",
		"width":135
		},
		{
		"fieldname":"target",
		"label":"Target",
		"fieldtype":"Int",
		"width":160
		},
		{
		"fieldname":"achievement",
		"label":"Achievement",
		"fieldtype":"Int",
		"width":135
		},
		{
		"fieldname":"achievements_status",
		"label":"Achievement Status",
		"fieldtype":"Data",
		"width":180
		}
	]
	sql_query = f"""
		with tmp as (SELECT
			pr.project_name,
			dt.district_name,
			jb.job_role_name,
			cd.batch_id,
			st.state_name,
			ct.center_location_name,
			
			COUNT(cd.candidate_id) AS candidate_count,
			cd.placement_due_date AS due_date,
			DATEDIFF(cd.placement_due_date, CURRENT_DATE) AS remaining_days,
			ROUND(SUM(CASE WHEN cd.certified_status = 'Certified' THEN 1 ELSE 0 END) * 0.7) AS target,
			ROUND(SUM(CASE WHEN cd.current_status = 'Placed' THEN 1 ELSE 0 END)) AS achievement,
			CASE 
				WHEN ROUND(SUM(CASE WHEN cd.certified_status = 'Certified' THEN 1 ELSE 0 END) * 0.7) = 0 
					AND ROUND(SUM(CASE WHEN cd.current_status = 'Placed' THEN 1 ELSE 0 END)) = 0
				THEN 'N/A'
				WHEN ROUND(SUM(CASE WHEN cd.certified_status = 'Certified' THEN 1 ELSE 0 END) * 0.7) <= ROUND(SUM(CASE WHEN cd.current_status = 'Placed' THEN 1 ELSE 0 END))
				THEN 'Achieved'
				ELSE 'In Progress'
			END AS achievements_status,
			CASE 
				WHEN DATEDIFF(cd.placement_due_date, CURRENT_DATE) < 0 AND ROUND(SUM(CASE WHEN cd.certified_status = 'Certified' THEN 1 ELSE 0 END) * 0.7) > ROUND(SUM(CASE WHEN cd.current_status = 'Placed' THEN 1 ELSE 0 END)) 
				THEN 'Overdue and underachieved'
				WHEN DATEDIFF(cd.placement_due_date, CURRENT_DATE) < 0 AND ROUND(SUM(CASE WHEN cd.certified_status = 'Certified' THEN 1 ELSE 0 END) * 0.7) <= ROUND(SUM(CASE WHEN cd.current_status = 'Placed' THEN 1 ELSE 0 END)) 
				THEN 'Overdue and overachieved'
				WHEN DATEDIFF(cd.placement_due_date, CURRENT_DATE) >= 0 AND ROUND(SUM(CASE WHEN cd.certified_status = 'Certified' THEN 1 ELSE 0 END) * 0.7) > ROUND(SUM(CASE WHEN cd.current_status = 'Placed' THEN 1 ELSE 0 END)) 
				THEN 'Underdue and underachieved'
				WHEN DATEDIFF(cd.placement_due_date, CURRENT_DATE) >= 0 AND ROUND(SUM(CASE WHEN cd.certified_status = 'Certified' THEN 1 ELSE 0 END) * 0.7) < ROUND(SUM(CASE WHEN cd.current_status = 'Placed' THEN 1 ELSE 0 END)) 
				THEN 'Underdue and overachieved'
				ELSE 'Achieved'
					END AS category,
					CASE 
						WHEN DATEDIFF(cd.placement_due_date, CURRENT_DATE) < 0 AND ROUND(SUM(CASE WHEN cd.certified_status = 'Certified' THEN 1 ELSE 0 END) * 0.7) > ROUND(SUM(CASE WHEN cd.current_status = 'Placed' THEN 1 ELSE 0 END)) 
						THEN 1
						WHEN DATEDIFF(cd.placement_due_date, CURRENT_DATE) < 0 AND ROUND(SUM(CASE WHEN cd.certified_status = 'Certified' THEN 1 ELSE 0 END) * 0.7) <= ROUND(SUM(CASE WHEN cd.current_status = 'Placed' THEN 1 ELSE 0 END)) 
						THEN 5
						WHEN DATEDIFF(cd.placement_due_date, CURRENT_DATE) >= 0 AND ROUND(SUM(CASE WHEN cd.certified_status = 'Certified' THEN 1 ELSE 0 END) * 0.7) > ROUND(SUM(CASE WHEN cd.current_status = 'Placed' THEN 1 ELSE 0 END)) 
						THEN 2
						WHEN DATEDIFF(cd.placement_due_date, CURRENT_DATE) >= 0 AND ROUND(SUM(CASE WHEN cd.certified_status = 'Certified' THEN 1 ELSE 0 END) * 0.7) < ROUND(SUM(CASE WHEN cd.current_status = 'Placed' THEN 1 ELSE 0 END)) 
						THEN 3
				ELSE 4
					END AS priority,
				CASE 
					WHEN DATEDIFF(cd.placement_due_date, CURRENT_DATE) > 0 
					THEN (ROUND(SUM(CASE WHEN cd.certified_status = 'Certified' THEN 1 ELSE 0 END) * 0.7) - ROUND(SUM(CASE WHEN cd.current_status = 'Placed' THEN 1 ELSE 0 END))) / DATEDIFF(cd.placement_due_date, CURRENT_DATE)
					ELSE NULL
				END AS target_achievement_ratio
					
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
					cd.current_status IN ('Assessed', 'Certified', 'Placed', 'Not Certified', 'Not Placed')
					{str}
				GROUP BY 
					cd.batch_id 
				HAVING SUM(CASE WHEN cd.certified_status = 'Certified' THEN 1 ELSE 0 END) > 0 
		
				{having_str}
				ORDER BY priority ASC, target_achievement_ratio DESC, target DESC,remaining_days ASC
		)
		(select * from tmp where tmp.achievements_status != 'Achieved')
		UNION ALL
		(select * from tmp where tmp.achievements_status = 'Achieved')	
	"""
	data = frappe.db.sql(sql_query,as_dict=True)
	return columns, data
