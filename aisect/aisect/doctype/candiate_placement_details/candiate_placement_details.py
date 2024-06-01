# Copyright (c) 2024, Rahul Sah and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class CandiatePlacementDetails(Document):
    def on_update(self):
        doc = frappe.get_doc({
            "doctype": "Placement History",
            "candidate_name": self.candidate_name,
            "modified_at": self.modified,
            "modified_by1": self.modified_by
        })
        doc.save(ignore_permissions=True)
