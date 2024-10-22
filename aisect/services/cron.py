import frappe
from datetime import date ,timedelta

@frappe.whitelist()
def set_candidate_status():
    # cron form batch and candidate
    current_date = date.today()
    items = frappe.db.get_list('Batch', fields=['name','start_date','end_date', 'expected_assessment_date'])
    
    for item in items:
        # batch status
        if item.end_date <= current_date:
                frappe.db.set_value('Batch', item.name,'status','Completed')
        elif item.start_date >= current_date:
                frappe.db.set_value('Batch', item.name,'status','To Be Started')
        elif item.start_date <= current_date <= item.end_date:
            frappe.db.set_value('Batch', item.name,'status','In Progress')

        # candidate status
        if item.end_date <= current_date:
            candidates = frappe.db.get_list('Candidate Details', fields=['name'], filters={'batch_id': item.name,'assessment_status':'Registered'})
            
            for candidate in candidates:
                try: 
                    date_90_days = item.end_date + timedelta(days=90)
                    frappe.db.set_value('Candidate Details', candidate.name,{'placement_due_date':date_90_days})
                    
                    if item.expected_assessment_date <= current_date:
                         frappe.db.set_value('Candidate Details', candidate.name,
                            {
                                'current_status':'Assessed',
                                'assessment_status':'Assessed',
                                'assessment_date':item.expected_assessment_date
                            })
                except Exception as e:
                    print(f"Error updating candidate {candidate['name']}: {e}")
    frappe.db.commit()