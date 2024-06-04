# Copyright (c) 2024, Rahul Sah and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class CandidateProfile(Document):
    def after_insert(self):
        doc = frappe.get_doc({
            "doctype": "Candiate Placement Details",
            "candidate_name": self.name,
            "zone": self.zone,
            "state": self.state,
            "centre": self.centre,
            "project": self.project,
            "batch_id": self.batch_id,
            "sector": self.sector,
            "job_role": self.job_role,
        })
        doc.save(ignore_permissions=True)

    def before_save(self):
        self.full_name = self.first_name+' '+self.last_name
