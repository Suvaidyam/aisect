# Copyright (c) 2024, Rahul Sah and contributors
# For license information, please see license.txt

import frappe
from datetime import date
from frappe.model.document import Document
from aisect.services.api import is_batch_completed

class CandidateDetails(Document):
    # def validate(self):
    #     if self.assessment_status !='Assessed':
    #         is_completed = is_batch_completed(self.batch_id)
    #         if is_completed:
    #             frappe.throw('The batch is already completed.')
        
    def before_save(self):
        self.full_name = self.first_name+' '+self.last_name
        if self.assessment_status and self.certified_status and self.placement_status and self.certified_status!='N/A' and self.placement_status!='N/A':
            self.current_status = self.placement_status
        elif self.assessment_status and self.certified_status and self.certified_status!='N/A':
            self.current_status = self.certified_status
        elif self.assessment_status:
            self.current_status = self.assessment_status
        
        current_date = date.today()
        if self.certified_status == 'Certified':
            self.certification_date = current_date
        if self.placement_status == 'Placed':
            self.placement_date = current_date

  