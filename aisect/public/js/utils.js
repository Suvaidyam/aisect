function depended_dropdown(frm, filter_value, child, parent, activeFilter = true) {
    frm.fields_dict[child].get_query = function () {
        if (filter_value && activeFilter) {
            return {
                filters: { [parent]: filter_value, 'status': 'Active' },
                page_length: 1000
            };
        } else if (filter_value) {
            return {
                filters: { [parent]: filter_value },
                page_length: 1000
            };
        } else {
            return { filters: { [parent]: `Please select ${[parent]}` } };
        }
    }
}
function check_active(frm, child) {
    frm.fields_dict[child].get_query = function () {
        return {
            filters: { 'status': 'Active' },
            page_length: 1000
        };
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
async function set_value_by_role(frm, mapper) {
    let response = await get_user_permission()
    for (let item of mapper) {
        if (response[item['allow']]) {
            await frm.set_value(item.fieldname, response[item['allow']])
            setTimeout(async () => {
                await frm.set_df_property(item.fieldname, 'read_only', 1)
            }, 200);
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
const get_user_permission = async () => {
    try {
        let list = await callAPI({
            method: 'aisect.services.api.get_user_role_permission',
            freeze: true,
            freeze_message: __("Getting Permissions"),
        })
        return list
    } catch (error) {
        console.error(error)
    }
}
function callAPI(options) {
    return new Promise((resolve, reject) => {
        frappe.call({
            ...options,
            callback: async function (response) {
                resolve(response?.message || response?.value)
            }
        });
    })
}
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
const truncate_child_table_field_value = async (row, frm, fields) => {
    if (fields.length > 0) {
        for (let field of fields) {
            row[field] = '';
        }
        if (frm.cur_grid) {
            frm.cur_grid.refresh();
        }
    }
};
const pdf_file_condition = (frm, child_row, row, cur_field) => {
    frm.image_uploaded = true;

    if (frm._alert_shown) {
        // truncate_child_table_field_value(row, frm, [cur_field]);
        return;
    }


    if (child_row) {
        const file_url = child_row;
        const file_extension = file_url.split('.').pop().toLowerCase();

        if (file_extension !== 'pdf') {
            frm._alert_shown = true; // Set flag to prevent duplicate alert
            frappe.show_alert({ message: "Only PDF files are allowed", indicator: "yellow" });
            setTimeout(() => {
                frm._alert_shown = false;
                truncate_child_table_field_value(row, frm, [cur_field]);
            }, 3000);
            return;
        }

        frappe.call({
            method: "frappe.client.get_value",
            args: {
                doctype: "File",
                filters: { file_url: file_url },
                fieldname: ["file_size"]
            },
            callback: function (response) {
                if (!response.message) {
                    frappe.show_alert({ message: "File not found", indicator: "red" });
                    truncate_child_table_field_value(row, frm, [cur_field]);
                    return;
                }

                const file_size = response.message.file_size;
                const maxFileSize = cur_field === 'upload_bank_statement_2' || cur_field === 'upload_bank_statement' || cur_field === 'upload_bank_statement_3'
                    ? 5 * 1024 * 1024
                    : 2 * 1024 * 1024;

                if (file_size > maxFileSize) {
                    frm._alert_shown = true; // Set flag to prevent duplicate alert
                    frappe.show_alert({ message: `File size must be less than ${maxFileSize / (1024 * 1024)} MB`, indicator: "yellow" });
                    setTimeout(() => {
                        frm._alert_shown = false;
                        truncate_child_table_field_value(row, frm, [cur_field]);
                    }, 3000);
                    return
                }
            }
        });
    }
};


const word_length_validation = (frm, data, field_name, length) => {
    msg = field_name.replace(/_/g, ' ');
    if (data && data.length > length) {
        frappe.show_alert({ message: `${msg} cannot exceed ${length} characters`, indicator: "yellow" });
        frm.set_value(field_name, data.slice(0, length));
    }
}
