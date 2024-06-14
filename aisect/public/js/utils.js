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

function mobile_number_validation(frm, mobile_number, field_name) {
    let mobilePattern = /^[6-9]\d{9}$/;
    if (mobile_number.length > 9) {
        if (!mobilePattern.test(mobile_number)) {
            frm.set_value(field_name, '')
            frappe.msgprint({
                title: __('Validation Error'),
                indicator: 'red',
                message: __('Enter vaild mobile number')
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
const hide_advance_search = (frm, list) => {
    for (item of list) {
        frm.set_df_property(item, 'only_select', true);
    }
};

function isValidAadhaar(aadhaarNumber) {
    if (aadhaarNumber.length !== 12 || !/^\d{12}$/.test(aadhaarNumber)) {
        return false;
    }

    var Verhoeff = {
        d: [
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
            [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
            [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
            [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
            [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
            [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
            [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
            [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
            [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
        ],
        p: [
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
            [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
            [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
            [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
            [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
            [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
            [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
        ],
        j: [0, 4, 3, 2, 1, 5, 6, 7, 8, 9],

        check: function (str) {
            var c = 0;
            str.replace(/\D+/g, "").split("").reverse().join("").replace(/[\d]/g, function (u, i) {
                c = Verhoeff.d[c][Verhoeff.p[i % 8][parseInt(u, 10)]];
            });
            return c === 0;
        }
    };

    return Verhoeff.check(aadhaarNumber);
}