function depended_dropdown(frm, filters, child, parent) {
    frm.fields_dict[child].get_query = function () {
        if (filters) {
            return {
                filters: { [parent]: filters },
                page_length: 1000
            };
        } else {
            return { filters: { [parent]: `Please select ${[parent]}` } };
        }
    }
}

function date_validation(frm, child, parent, isset, is, pmess, cmess) {
    if (isset) {
        return;
    }
    if (parent && child && parent > child) {
        isset = true;
        frm.set_value(is, '').then(() => {
            isset = false;
            frappe.msgprint({
                title: __('Validation Error'),
                indicator: 'red',
                message: __(`<strong>${cmess}</strong> shall not be before the <strong>${pmess}</strong>`)
            });
        });
    }
}

function mobile_number_validation(frm, contact_number, field_name) {
    let mobilePattern = /^[6-9]\d{9}$/;
    if (contact_number.length > 9) {
        if (!mobilePattern.test(contact_number)) {
            frm.set_value(field_name, '')
            frappe.msgprint({
                title: __('Validation Error'),
                indicator: 'red',
                message: __('Enter vaild contact number')
            });
        }
    }
}