# Copyright (c) 2024, Rahul Sah and contributors
# For license information, please see license.txt

import frappe
from datetime import date
from frappe.model.document import Document
from aisect.services.api import is_batch_completed

class CandidateDetails(Document):
    def validate(self):
    #     if self.assessment_status !='Assessed':
    #         is_completed = is_batch_completed(self.batch_id)
    #         if is_completed:
    #             frappe.throw('The batch is already completed.')
        # if (self.certified_status != 'Certified' or self.placement_status != 'Placed') and len(self.placement):
        #     frappe.throw("This Error")
    #step2
        if self.last_name:
            self.full_name = self.first_name+' '+self.last_name
        else:
            self.full_name = self.first_name
        if self.assessment_status and self.certified_status and self.placement_status and self.certified_status!='N/A' and self.placement_status!='N/A':
            self.current_status = self.placement_status
        elif self.assessment_status and self.certified_status and self.certified_status!='N/A':
            self.current_status = self.certified_status
        elif self.assessment_status:
            self.current_status = self.assessment_status
        #date
        current_date = date.today()
        if self.certified_status == 'Certified' and not self.certification_date:
            self.certification_date = current_date
        if self.placement_status == 'Placed' and not self.placement_date:
            self.placement_date = current_date

        #status base

        if self.certified_status != 'Certified':
            self.placement_status='N/A'
            self.placement_date=''
            if len(self.placement):
                self.placement=[]
                frappe.throw('Please input certified status.')
        else:
            if self.placement_status !='Placed':
                self.placement_date=''
                if len(self.placement):
                    self.placement=[]
                    frappe.throw('Please input placement status.')
    def before_save(self):
       pass

  