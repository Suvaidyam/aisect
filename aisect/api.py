import frappe
from datetime import date ,timedelta

@frappe.whitelist(allow_guest=True)
def get_user_role():
    user = frappe.session.user
    return user

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
def set_candidate_status():
    current_date = date.today()
    items = frappe.db.get_list('Batch', fields=['name','start_date','end_date', 'expected_assessment_date','actual_assessment_date'])
    
    for item in items:
        # batch status
        if item.end_date < current_date:
                frappe.db.set_value('Batch', item.name,'status','Completed')
        elif item.start_date > current_date:
                frappe.db.set_value('Batch', item.name,'status','To Be Started')
        elif item.start_date <= current_date <= item.end_date:
            frappe.db.set_value('Batch', item.name,'status','In Progress')

        # candidate status
        if item.expected_assessment_date <= current_date:
            candidates = frappe.db.get_list('Candidate Details', fields=['name'], filters={'batch_id': item.name,'assessment_status':'Registered'})
            
            for candidate in candidates:
                try:
                    if item.expected_assessment_date and item.actual_assessment_date:
                        date_90_days = current_date + timedelta(days=90)
                        frappe.db.set_value('Candidate Details', candidate.name,
                            {
                                'current_status':'Assessed',
                                'assessment_status':'Assessed',
                                'assessment_date':current_date,
                                'placement_due_date':date_90_days
                            })
                    else:
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