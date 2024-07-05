import frappe

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
    return frappe.get_list('Candidate Success Stories',pluck='name')

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
                cd.current_status IN ('Assessed', 'Certified','Placed')
                {str}
            GROUP BY 
                    cd.batch_id) AS query;
    """
    return frappe.db.sql(sql,as_dict=True)
