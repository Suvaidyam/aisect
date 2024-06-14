# Copyright (c) 2024, Rahul Sah and contributors
# For license information, please see license.txt

# import frappe
from datetime import date
from frappe.model.document import Document


class CandidateDetails(Document):
    def before_save(self):
        self.full_name = self.first_name+' '+self.last_name
        if self.assessment_status and self.certified_status and self.placement_status:
            self.current_status = self.placement_status
        elif self.assessment_status and self.certified_status:
            self.current_status = self.certified_status
        elif self.assessment_status:
            self.current_status = self.assessment_status
        
        current_date = date.today()
        if self.certified_status == 'Certified' and self.certification_date is None:
            self.certification_date = current_date
        elif self.placement_status == 'Placed' and self.placement_date is None:
            self.placement_date = current_date

  