import frappe

@frappe.whitelist()
def get_user_role():
    user = frappe.session.user
    return user