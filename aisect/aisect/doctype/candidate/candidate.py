# Copyright (c) 2024, Rahul Sah and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Candidate(Document):
	def after_insert(self):
		print('*****************************************',self.batch)
		doc = frappe.get_doc({
			"doctype":"Candiate Placement Details",
			"candidate_name": self.name,
			"zone" : self.zone,
			"state" : self.state,
			"centre" : self.centre
		})
		doc.save(ignore_permissions=True)
	def on_update(self):
		print('*****************************************',self.batch)
