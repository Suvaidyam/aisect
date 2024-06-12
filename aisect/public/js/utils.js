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
function depened_date(parent, child) {
    const today = new Date();
    if (parent == undefined) {
        child.$input.datepicker({ minDate: today });
    } else {
        const today = new Date(parent);
        today.setDate(today.getDate() + 1);
        child.$input.datepicker({ minDate: today });
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

function setPlaceholders(frm, fieldsPlaceholders) {
    fieldsPlaceholders.forEach(function (item) {
        var fieldName = item.fieldName;
        var placeholderText = item.placeholderText;
        var placeholderSize = "14px";
        var placeholderFontWeight = "500";

        if (frm.fields_dict[fieldName] && frm.fields_dict[fieldName].$input) {
            var $input = frm.fields_dict[fieldName].$input;
            $input.attr("placeholder", placeholderText);
            $input.attr("style", "font-weight: " + placeholderFontWeight + " !important");
            $input.css("font-size", placeholderSize);
        }
    });
}