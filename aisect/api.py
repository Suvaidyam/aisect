import frappe
from datetime import date ,timedelta,datetime
import time
import pytz

@frappe.whitelist()
def get_user_role_permission():
    user = frappe.session.user
    user_permissions = frappe.get_list('User Permission',filters={"user":user},fields=['allow','for_value'])
    result = {}
    for item in user_permissions:
        result[item["allow"]] = item["for_value"]
    return result

@frappe.whitelist()
def get_one_time_success_story():
    data = frappe.get_list('Candidate Success Stories',fields=['name'])
    one_time_success_story = [item["name"] for item in data]
    return one_time_success_story

@frappe.whitelist()
def is_batch_completed(batch_id):
    data = frappe.get_list('Batch',fields=['name'],filters={'name':batch_id,'status':'Completed'})
    is_completed = bool(data)
    return is_completed

@frappe.whitelist()
def candidate_placement_ging():
    user_role_permission=get_user_role_permission()
    str = ""
    zone = user_role_permission.get('Zone')
    state = user_role_permission.get('State')
    center = user_role_permission.get('Center')

    if zone:
        str += f" AND cd.zone = '{zone}'"
    if state:
        str += f" AND cd.state = '{state}'"
    if center:
        str += f" AND cd.center_location = '{center}'"
    sql = f"""
        SELECT
            COUNT(*) AS candidate_count
        FROM
            (
            SELECT
                COUNT(*) AS candidate_count
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
                cd.current_status IN ('Assessed', 'Certified')
                {str}
            GROUP BY 
                    cd.batch_id) AS query;
    """
    return frappe.db.sql(sql,as_dict=True)

@frappe.whitelist()
def target_vs_chievement():
    user_role_permission=get_user_role_permission()
    str = ""
    zone = user_role_permission.get('Zone')
    state = user_role_permission.get('State')
    center = user_role_permission.get('Center')

    if zone:
        str += f" AND cd.zone = '{zone}'"
    if state:
        str += f" AND cd.state = '{state}'"
    if center:
        str += f" AND cd.center_location = '{center}'"

    sql = f"""
        SELECT 
            COUNT(*) AS record_count
        FROM (
            SELECT 
                cd.batch_id,
                zn.zone_name,
                pr.project_name,
                dt.district_name,
                jb.job_role_name,
                st.state_name,
                ct.center_location_name,
                COUNT(*) AS candidate_count,
                ROUND(SUM(CASE WHEN cd.current_status = 'Certified' THEN 1 ELSE 0 END) * 0.7) AS target,
                ROUND(SUM(CASE WHEN cd.current_status = 'Placed' THEN 1 ELSE 0 END)) AS achievement,
                CASE 
                    WHEN ROUND(SUM(CASE WHEN cd.current_status = 'Certified' THEN 1 ELSE 0 END) * 0.7) <= ROUND(SUM(CASE WHEN cd.current_status = 'Placed' THEN 1 ELSE 0 END))
                    THEN 'Achieved'
                    ELSE 'In Progress'
                END AS achievements_status
            FROM
                `tabCandidate Details` cd
            INNER JOIN 
                `tabZone` zn ON cd.zone = zn.name
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
            WHERE 1 = 1 {str}
            GROUP BY 
                cd.batch_id
        ) AS subquery;

    """
    return frappe.db.sql(sql,as_dict=True)

@frappe.whitelist()
def set_candidate_status():
    current_time = time.time()
    inactive_datetime = datetime.fromtimestamp(current_time,pytz.timezone('Asia/Kolkata')).strftime("%Y-%m-%d %I:%M:%S %p")
    doc = frappe.new_doc('Cron Logs') 
    doc.running_time= datetime.strptime(inactive_datetime, "%Y-%m-%d %I:%M:%S %p").strftime("%Y-%m-%d %H:%M:%S.%f")
        
    doc.insert() 
    # cron form batch and candidate
    current_date = date.today()
    items = frappe.db.get_list('Batch', fields=['name','start_date','end_date'])
    
    for item in items:
        # batch status
        if item.end_date < current_date:
                frappe.db.set_value('Batch', item.name,'status','Completed')
        elif item.start_date > current_date:
                frappe.db.set_value('Batch', item.name,'status','To Be Started')
        elif item.start_date <= current_date <= item.end_date:
            frappe.db.set_value('Batch', item.name,'status','In Progress')

        # candidate status
        if item.end_date <= current_date:
            candidates = frappe.db.get_list('Candidate Details', fields=['name'], filters={'batch_id': item.name,'assessment_status':'Registered'})
            
            for candidate in candidates:
                try:
                    date_90_days = current_date + timedelta(days=90)
                    frappe.db.set_value('Candidate Details', candidate.name,
                    {
                        'current_status':'Assessed',
                        'assessment_status':'Assessed',
                        'assessment_date':current_date,
                        'placement_due_date':date_90_days
                    })
                except Exception as e:
                    print(f"Error updating candidate {candidate['name']}: {e}")
    frappe.db.commit()