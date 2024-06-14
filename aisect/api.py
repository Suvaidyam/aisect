import frappe
from datetime import date ,timedelta

@frappe.whitelist()
def get_user_role():
    user = frappe.session.user
    return user

@frappe.whitelist()
def set_candidate_status():
    current_date = date.today()
    items = frappe.db.get_list('Batch', fields=['name','start_date','end_date', 'expected_assessment_date'])
    
    for item in items:
        # batch status
        if item.end_date < current_date:
                frappe.db.set_value('Batch', item.name,'status','Completed')
        elif item.start_date > current_date:
                frappe.db.set_value('Batch', item.name,'status','To Be Started')
        elif item.start_date <= current_date <= item.end_date:
            frappe.db.set_value('Batch', item.name,'status','In Progress')

        # candidate status
        if item.expected_assessment_date == current_date:
            candidates = frappe.db.get_list('Candidate Profile', fields=['name'], filters={'batch_id': item.name})
            
            for candidate in candidates:
                date_90_days = current_date + timedelta(days=90)
                try:
                    frappe.db.set_value('Candidate Profile', candidate.name,
                                        {
                                            'current_status':'Assessed',
                                            'assessment_status':'Assessed',
                                            'assessment_date':current_date,
                                            'placement_due_date':date_90_days
                                        })
                except Exception as e:
                    print(f"Error updating candidate {candidate['name']}: {e}")
    frappe.db.commit()