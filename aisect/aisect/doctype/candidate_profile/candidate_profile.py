# Copyright (c) 2024, Rahul Sah and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class CandidateProfile(Document):
    def on_update(self):
        existing_docs = frappe.get_all('Candidate Placement Details', filters={'candidate_name': self.name})
        if existing_docs:
            doc = frappe.get_doc('Candidate Placement Details', existing_docs[0].name)
        else:
            doc = frappe.get_doc({
                'doctype': 'Candidate Placement Details',
                'candidate_name': self.name
            })

        doc.full_name = self.first_name + ' ' + self.last_name
        doc.zone = self.zone
        doc.state = self.state
        doc.district = self.district
        doc.center_location = self.center_location
        doc.project = self.project
        doc.batch_id = self.batch_id
        doc.sector = self.sector
        doc.job_role = self.job_role

        doc.save(ignore_permissions=True)

    def before_save(self):
        self.full_name = self.first_name+' '+self.last_name

  