# Copyright (c) 2024, Rahul Sah and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class CandidateSuccessStories(Document):
	def before_save(self):
		u = frappe.get_doc('Candidate Profile',self.name_of_the_candidate)
		self.full_name = u.full_name
