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
    con_str = ""
    zone = user_role_permission.get('Zone')
    state = user_role_permission.get('State')
    center = user_role_permission.get('Center')

    if zone:
        con_str += f" AND cd.zone = '{zone}'"
    if state:
        con_str += f" AND cd.state = '{state}'"
    if center:
        con_str += f" AND cd.center_location = '{center}'"
    sql = f"""
        SELECT 
              (SELECT COUNT(*)
            FROM (SELECT COUNT(*) AS candidate_count
                FROM `tabCandidate Details` cd
                INNER JOIN `tabState` st ON cd.state = st.name
                INNER JOIN `tabCenter` ct ON cd.center_location = ct.name
                INNER JOIN `tabDistrict` dt ON cd.district = dt.name
                INNER JOIN `tabProject` pr ON cd.project = pr.name
                INNER JOIN `tabJob Role` jb ON cd.job_role = jb.name
                WHERE cd.current_status IN ('Assessed', 'Certified','Placed')
                {con_str}
                GROUP BY cd.batch_id) AS query) AS `Placement Target vs Achievement`,
            (SELECT COUNT(company_counts.count)
            FROM (SELECT COUNT(cd.candidate_id) AS count
                FROM `tabCandidate Details` cd
                INNER JOIN `tabPlacement Child` AS pc ON pc.parent = cd.candidate_id
                INNER JOIN `tabCompany` cp ON pc.name_of_organization = cp.name
                WHERE cd.current_status='Placed'
                {con_str}
                GROUP BY cp.company_name) AS company_counts) AS `Candidate Placement by Company`,
            (SELECT COUNT(job_role_counts.count)
            FROM (SELECT COUNT(cd.candidate_id) AS count
                FROM `tabCandidate Details` cd
                INNER JOIN `tabJob Role` jr ON cd.job_role = jr.name
                WHERE cd.current_status = 'Placed'
                {con_str}
                GROUP BY jr.job_role_name) AS job_role_counts) AS `Candidate Placement by Job Role`,
            (SELECT COUNT(sector_counts.count)
            FROM (SELECT COUNT(cd.candidate_id) AS count
                FROM `tabCandidate Details` cd
                INNER JOIN `tabSector` AS st ON cd.sector = st.name
                WHERE cd.current_status = 'Placed'
                {con_str}
                GROUP BY st.sector_name) AS sector_counts) AS `Candidate Placement by Sector`,
            (SELECT COUNT(state_counts.count)
            FROM (SELECT COUNT(cd.candidate_id) AS count
                FROM `tabCandidate Details` cd
                WHERE cd.current_status='Placed' 
				{con_str}
				GROUP BY cd.state) AS state_counts) AS `Candidate Placement by State`;
    """
    data = frappe.db.sql(sql, as_dict=True)[0]
    url_mapping = {
        'Candidate Placement by Company': "Candidate%20Placement%20By%20Comapny",
        'Candidate Placement by Job Role': 'Candidate%20Placement%20by%20job%20role',
        'Candidate Placement by Sector': 'Candidate%20Placement%20by%20sector',
        "Placement Target vs Achievement":"Placement%20Target%20vs%20Achievement",
        "Candidate Placement by State":"Candidate%20Placement%20By%20State"
    }
    response = []
    if data:
        for key,value in data.items():
            response.append({"name":key,"value":value,"url":url_mapping.get(key, "")})
    return response


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
       ORDER BY 
        TCS.village_name,
        TB.block_name,
        CL.center_location_name,
        TD.district_name,
        TS.state_name,
        ZN.zone_name;
   """
    return frappe.db.sql(sql_query, as_dict=True)


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
            ca.current_status='Placed'
    """
    return frappe.db.sql(sql, as_dict=True)