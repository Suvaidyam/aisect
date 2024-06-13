# Copyright (c) 2024, Rahul Sah and contributors
# For license information, please see license.txt

# import frappe
from datetime import date, datetime
from frappe.model.document import Document


class Batch(Document):
	def before_save(self):
		current_date = date.today()
		
		self.start_date = datetime.strptime(self.start_date, '%Y-%m-%d').date()
		self.end_date = datetime.strptime(self.end_date, '%Y-%m-%d').date()
		
		if self.end_date < current_date:
			self.status = 'Completed'
		elif self.start_date > current_date:
			self.status = 'To Be Started'
		elif self.start_date <= current_date <= self.end_date:
			self.status = 'In Progress'