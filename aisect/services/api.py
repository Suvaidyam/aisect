import frappe


@frappe.whitelist()
def get_user_role_permission():
    user = frappe.session.user
    user_permissions = frappe.get_list('User Permission', filters={
                                       "user": user}, fields=['allow', 'for_value'])
    result = {}
    for item in user_permissions:
        result[item["allow"]] = item["for_value"]
    return result


@frappe.whitelist()
def get_one_time_success_story():
    return frappe.get_list('Candidate Success Stories', pluck='name')


@frappe.whitelist()
def success_story_data():
    return frappe.get_all('Candidate Success Stories', fields=['*'])


@frappe.whitelist()
def is_batch_completed(batch_id):
    data = frappe.get_list('Batch', fields=['name'], filters={
                           'name': batch_id, 'status': 'Completed'})
    is_completed = bool(data)
    return is_completed


@frappe.whitelist()
def candidate_placement_ging():
    user_role_permission = get_user_role_permission()
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
    return frappe.db.sql(sql, as_dict=True)


@frappe.whitelist()
def Avg_monthly_salary():
    sql = f"""
        SELECT
            ROUND(AVG(pc.monthly_income)) as average_income
        FROM
            `tabCandidate Details` AS ca
        INNER JOIN
            `tabPlacement Child` AS pc ON pc.parent = ca.candidate_id
        WHERE
            ca.current_status='Placed';
    """
    return frappe.db.sql(sql, as_dict=True)


@frappe.whitelist()
def user_assign_geography(user, join_con=[]):
    sql_query = f"""
       SELECT
           CASE
               WHEN UP.allow = 'Zone' THEN ZN.zone_name
               WHEN UP.allow = 'State' THEN TS.state_name
               WHEN UP.allow = 'District' THEN TD.district_name
               WHEN UP.allow = 'Center' THEN CL.center_location_name
               WHEN UP.allow = 'Block' THEN TB.block_name
               WHEN UP.allow = 'Village' THEN TCS.village_name
           END AS name_value,
           UP.for_value,
           UP.name,
           UP.allow,
           UP.user
       FROM `tabUser Permission` AS UP
       LEFT JOIN `tabZone` AS ZN ON UP.for_value = ZN.name AND UP.allow = 'Zone'
       LEFT JOIN `tabState` AS TS ON UP.for_value = TS.name AND UP.allow = 'State'
       LEFT JOIN `tabDistrict` AS TD ON UP.for_value = TD.name AND UP.allow = 'District'
       LEFT JOIN `tabCenter` AS CL ON UP.for_value = CL.name AND UP.allow = 'Center'
       LEFT JOIN `tabBlock` AS TB ON UP.for_value = TB.name AND UP.allow = 'Block'
       LEFT JOIN `tabVillage` AS TCS ON UP.for_value = TCS.name AND UP.allow = 'Village'
       WHERE UP.user = '{user}'
   """
    return frappe.db.sql(sql_query, as_dict=True)
