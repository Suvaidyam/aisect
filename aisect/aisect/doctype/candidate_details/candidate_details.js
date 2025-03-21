let mobilePattern = /^[6-9]\d{9}$/;

frappe.ui.form.on("Candidate Details", {
    refresh(frm) {
        frm.image_uploaded = false;
        frm.fields_dict['placement'].grid.get_field('name_of_organization').get_query = function (doc, cdt, cdn) {
            return {
                filters: {
                    status: 'Active'
                }
            };
        };
        if (frappe.user_roles.includes('Head Office - Assessment Officer') && !frappe.user_roles.includes('Administrator')) {
            frm.set_df_property('project', 'read_only', 1);
            frm.set_df_property('batch_id', 'read_only', 1);
            frm.set_df_property('placement', 'read_only', 1);
        }

        if (frm.doc.assessment_status == 'Assessed') {
            frm.set_df_property('project', 'read_only', 1);
            frm.set_df_property('batch_id', 'read_only', 1);
        }
        if (frm.doc.candidate_id != undefined && frm.doc.__unsaved != 1) {
            frm.set_df_property('candidate_id', 'read_only', 1)
        }
        if (cur_frm.is_new()) {
            frm.set_value('batch_id', '')
        }

        check_active(frm, 'project');
        frm.fields_dict['zone'].get_query = function () {
            return {
                filters: { 'zone_name': 'Please select batch id' },
                page_length: 1000
            };
        };
        frm.fields_dict['state'].get_query = function () {
            return {
                filters: { 'state_name': 'Please select batch id' },
                page_length: 1000
            };
        };
        frm.fields_dict['district'].get_query = function () {
            return {
                filters: { 'district_name': 'Please select batch id' },
                page_length: 1000
            };
        };
        frm.fields_dict['center_location'].get_query = function () {
            return {
                filters: { 'center_location_name': 'Please select batch id' },
                page_length: 1000
            };
        };
        frm.fields_dict['sector'].get_query = function () {
            return {
                filters: { 'sector_name': 'Please select batch id' },
                page_length: 1000
            };
        };
        frm.fields_dict['job_role'].get_query = function () {
            return {
                filters: { 'job_role_name': 'Please select batch id' },
                page_length: 1000
            };
        };
        hide_advance_search(frm, ['project', 'batch_id', 'zone', 'state', 'district', 'center_location', 'sector', 'job_role']);
        if (frm.doc.batch_id) {
            setTimeout(() => {
                frm.set_df_property('zone', 'read_only', 1);
                frm.set_df_property('state', 'read_only', 1);
                frm.set_df_property('district', 'read_only', 1);
                frm.set_df_property('center_location', 'read_only', 1);
                frm.set_df_property('sector', 'read_only', 1);
                frm.set_df_property('job_role', 'read_only', 1);
            }, 500);
        }
        if (frm.doc.assessment_status != 'Assessed') {
            frm.set_df_property('certified_status', 'read_only', 1);
        }
        if (frm.doc.certified_status != 'Certified' || frappe.user_roles.includes('Head Office - Assessment Officer') && !frappe.user_roles.includes('Administrator')) {
            frm.set_df_property('placement_status', 'read_only', 1);
        } else if (frm.doc.placement_status != 'Placed') {
            frm.set_df_property('placement_status', 'read_only', 0);
        }
        if (frm.doc.placement_status == 'Placed') {
            frm.set_df_property('certified_status', 'read_only', 1);
        }
        if (frm.doc.assessment_date) {
            let today = new Date(frm.doc.assessment_date);
            today.setDate(today.getDate() + 1);
            frm.fields_dict.certification_date.$input.datepicker({ minDate: today });
        }
        if (frm.doc.certification_date) {
            let today = new Date(frm.doc.certification_date);
            today.setDate(today.getDate() + 1);
            frm.fields_dict.placement_date.$input.datepicker({ minDate: today });
        }
        depended_dropdown(frm, frm.doc.project, 'batch_id', 'project');
        setPlaceholders(frm, [
            { fieldName: 'first_name', placeholderText: __("Enter your first name") },
            { fieldName: 'last_name', placeholderText: __("Enter your last name") },
            { fieldName: 'candidate_id', placeholderText: __("Enter your candidate id") },
            { fieldName: 'mobile_number', placeholderText: __("Enter your contact number") },
            { fieldName: 'email', placeholderText: __("Enter your email address") },
            { fieldName: 'aadhar_number', placeholderText: __("Enter your Aadhar number") },
            { fieldName: 'qualification', placeholderText: __("Enter your qualification") },
            { fieldName: 'project', placeholderText: __("Enter your project") },
            { fieldName: 'batch_id', placeholderText: __("Enter your batch id") },
            { fieldName: 'zone', placeholderText: __("Enter your zone") },
            { fieldName: 'state', placeholderText: __("Enter your state") },
            { fieldName: 'district', placeholderText: __("Enter your district") },
            { fieldName: 'center_location', placeholderText: __("Enter your center") },
            { fieldName: 'sector', placeholderText: __("Enter your sector") },
            { fieldName: 'job_role', placeholderText: __("Enter your job role") }
        ]);
    },
    batch_id(frm) {
        if (frm.doc.batch_id) {
            setTimeout(() => {
                frm.set_df_property('zone', 'read_only', 1);
                frm.set_df_property('state', 'read_only', 1);
                frm.set_df_property('district', 'read_only', 1);
                frm.set_df_property('center_location', 'read_only', 1);
                frm.set_df_property('sector', 'read_only', 1);
                frm.set_df_property('job_role', 'read_only', 1);
            }, 500);
        }
    },
    validate(frm) {
        setTimeout(() => {
            document.querySelectorAll('.datepicker').forEach(e => {
                e.classList.remove('active')
            })
        }, 2000);
        if (frm.image_uploaded) {
            frappe.validated = false;
            frm.image_uploaded = false;
        }
        if (frm.doc.aadhar_number) {
            if (!isValidAadhaar(frm.doc.aadhar_number)) {
                frappe.throw('Enter valid aadhar number');
            }
        }
        if (!mobilePattern.test(frm.doc.mobile_number) && frm.doc.mobile_number) {
            frappe.throw('Enter valid mobile number');
        }
    },
    after_save(frm) {
        if (frm.doc.aadhar_number) {
            if (!isValidAadhaar(frm.doc.aadhar_number)) {
                frappe.throw('Enter valid aadhar number');
            }
        }
        if (!mobilePattern.test(frm.doc.mobile_number) && frm.doc.mobile_number) {
            frappe.throw('Enter valid mobile number');
        }
        if (frm.doc.placement_status == 'Placed') {
            frm.set_df_property('certified_status', 'read_only', 1);
        }
        if (frm.doc.certified_status == 'Certified' && frm.doc.placement_status != 'Placed') {
            frm.set_df_property('placement_status', 'read_only', 0);
        } else if (frm.doc.placement_status == 'Placed') {
            frm.set_df_property('placement_status', 'read_only', 1);
        }
    },
    project(frm) {
        frm.fields_dict['batch_id'].get_query = function () {
            return {
                filters: {
                    project: frm.doc.project,
                    // end_date: ['>=', frappe.datetime.now_date()]
                },
                page_length: 1000
            };
        };
        frm.set_value('batch_id', '');
    },
    assessment_status(frm) {
        if (frm.doc.assessment_status == 'Assessed') {
            frm.set_df_property('certified_status', 'read_only', 0);
        }
    },
    assessment_date(frm) {
        let today = new Date(frm.doc.assessment_date);
        today.setDate(today.getDate() + 1);
        frm.fields_dict.certification_date.$input.datepicker({ minDate: today });
    },
    certification_date(frm) {
        let today = new Date(frm.doc.certification_date);
        today.setDate(today.getDate() + 1);
        console.log(frm)
        frm.fields_dict.placement_date.$input.datepicker({ minDate: today });
    },
    certified_status(frm) {
        if (frm.doc.certified_status !== 'Certified') {
            frm.set_value('placement_date', '');
            frm.set_value('certification_date', '');
            frm.set_value('placement_status', 'N/A');
            frm.set_value('placement', []);
            frm.set_df_property('placement_status', 'read_only', 1);
        }
    },
    placement_status(frm) {
        if (frm.doc.placement_status !== 'Placed') {
            frm.set_value('placement_date', '');
            frm.set_value('placement', []);
        }
    },
    aadhar_number(frm) {
        if (frm.doc.aadhar_number && frm.doc.aadhar_number.length > 11) {
            if (!isValidAadhaar(frm.doc.aadhar_number)) {
                frappe.throw('Enter valid aadhar number');
            }
        }
    },
    mobile_number(frm) {
        mobile_number_validation(frm, frm.doc.mobile_number, 'mobile_number');
    }
});

// Child Table
let pin_codePattern = /^\d{6}$/;
frappe.ui.form.on("Placement Child", {
    placement_add(frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn);
        if (!frm.doc.placement[row.idx - 2]?.employment_end_date && frm.doc.placement.length > 1) {
            frappe.show_alert({ message: 'Please select employment end date in previous row.', indicator: 'red' })
            frm.cur_grid.remove()
        }

    },
    form_render(frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn);

        if (row.employment_start_date) {
            frm.cur_grid.grid_form.fields_dict.employment_start_date.df.read_only = 1;
            frm.cur_grid.refresh();
        }
        if (row.employment_end_date) {
            frm.cur_grid.grid_form.fields_dict.employment_end_date.df.read_only = 1;
            frm.cur_grid.refresh();
        }
        if (row.name_of_organization) {
            frm.cur_grid.grid_form.fields_dict.type_of_organization.df.read_only = 1;
            // frm.cur_grid.grid_form.fields_dict.state.df.read_only = 1;
            // frm.cur_grid.grid_form.fields_dict.district.df.read_only = 1;
            frm.cur_grid.refresh();
        }
        if (frm.doc.placement[row.idx - 2]?.employment_end_date && frm.doc.placement.length > 1) {
            let today = new Date(frm.doc.placement[row.idx - 2].employment_end_date);
            today.setDate(today.getDate() + 1);
            frm.cur_grid.grid_form.fields_dict.employment_start_date.$input.datepicker({ minDate: today });
        } else {
            let today = new Date(frm.doc.certification_date);
            today.setDate(today.getDate() + 1);
            frm.cur_grid.grid_form.fields_dict.employment_start_date.$input.datepicker({ minDate: today });
            frm.cur_grid.grid_form.fields_dict.employment_end_date.$input.datepicker({ minDate: today });
        }
    },
    pin_code(frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn);
        if (!pin_codePattern.test(row.pin_code)) {
            frm.disable_save();
            frappe.msgprint({
                title: __('Validation Error'),
                indicator: 'red',
                message: __(`Enter valid pin code in row ${row.idx}`)
            });
        } else {
            frm.enable_save();
        }
    },
    monthly_income: function (frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn);
        if (row.monthly_income > 50000 || row.monthly_income < 1) {
            frm.disable_save();
            truncate_child_table_field_value(row, frm, ['monthly_income']);
            frappe.show_alert({ message: "Monthly income should be less than 50000.00", indicator: "yellow" });
        } else {
            frm.enable_save();
        }
    },
    name_of_organization: function (frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn);
        if (row.name_of_organization) {
            setTimeout(() => {
                frm.cur_grid.grid_form.fields_dict.type_of_organization.df.read_only = 1;
                // frm.cur_grid.grid_form.fields_dict.state.df.read_only = 1;
                // frm.cur_grid.grid_form.fields_dict.district.df.read_only = 1;
                frm.cur_grid.refresh();
            }, 500);
        } else {
            frm.cur_grid.grid_form.fields_dict.type_of_organization.df.read_only = 0;
            // frm.cur_grid.grid_form.fields_dict.state.df.read_only = 0;
            // frm.cur_grid.grid_form.fields_dict.district.df.read_only = 0;
            frm.cur_grid.refresh();
        }
    },
    mobile_no(frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn);
        if (!mobilePattern.test(row.mobile_no)) {
            frm.disable_save();
            frappe.show_alert({
                message: __(`Enter valid mobile number in row ${row.idx}`),
                indicator: 'red'
            });
        } else {
            frm.enable_save();
        }
    },
    employment_start_date(frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn);
        let today = new Date(row.employment_start_date);
        today.setDate(today.getDate() + 1);
        frm.cur_grid.grid_form.fields_dict.employment_end_date.$input.datepicker({ minDate: today });
        if (row.employment_start_date >= row.employment_end_date) {
            truncate_child_table_field_value(row, frm, ['employment_end_date'])
            frappe.show_alert({ message: 'Employment end date must be greater than Employment start date', indicator: 'yellow' })
        }
    },
    job_joined(frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn);
        if (row.job_joined !== "Yes") {
            truncate_child_table_field_value(row, frm, [
                'offer_letter',
                'upload_offer_letter',
                'salary_slipm1',
                'upload_salary_slipm1',
                'bank_statementm1',
                'upload_bank_statementm1',
                'salary_slipm2',
                'upload__salary_slipm2',
                'bank_statementm2',
                'upload_bank_statementm2',
                'salary_slipm3',
                'upload_salary_slipm3',
                'bank_statementm3',
                'upload_bank_statementm3'
            ]);
        }
        if (row.job_joined == "No") {
            truncate_child_table_field_value(row, frm, ['if_no_give_reason']);
        }
    },
    offer_letter(frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn);
        if (row.offer_letter !== "Yes") {
            truncate_child_table_field_value(row, frm, [
                'upload_offer_letter',
                'salary_slipm1',
                'upload_salary_slipm1',
                'bank_statementm1',
                'upload_bank_statementm1',
                'salary_slipm2',
                'upload__salary_slipm2',
                'bank_statementm2',
                'upload_bank_statementm2',
                'salary_slipm3',
                'upload_salary_slipm3',
                'bank_statementm3',
                'upload_bank_statementm3'
            ]);
        }
    },
    salary_slipm1(frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn);
        if (row.salary_slipm1 !== "Yes" && row.bank_statementm1 !== "Yes") {
            truncate_child_table_field_value(row, frm, [
                'upload_salary_slipm1',
                'bank_statementm1',
                'upload_bank_statementm1',
                'salary_slipm2',
                'upload__salary_slipm2',
                'bank_statementm2',
                'upload_bank_statementm2',
                'salary_slipm3',
                'upload_salary_slipm3',
                'bank_statementm3',
                'upload_bank_statementm3'
            ]);
        }
    },
    bank_statementm1(frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn);
        if (row.salary_slipm1 !== "Yes" && row.bank_statementm1 !== "Yes") {
            truncate_child_table_field_value(row, frm, [
                'upload_bank_statementm1',
                'salary_slipm2',
                'upload__salary_slipm2',
                'bank_statementm2',
                'upload_bank_statementm2',
                'salary_slipm3',
                'upload_salary_slipm3',
                'bank_statementm3',
                'upload_bank_statementm3'
            ]);
        }
    },
    salary_slipm2(frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn);
        if (row.salary_slipm2 !== "Yes" && row.bank_statementm2 !== "Yes") {
            truncate_child_table_field_value(row, frm, [
                'upload__salary_slipm2',
                'bank_statementm2',
                'upload_bank_statementm2',
                'salary_slipm3',
                'upload_salary_slipm3',
                'bank_statementm3',
                'upload_bank_statementm3'
            ]);
        }
    },
    bank_statementm2(frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn);
        if (row.salary_slipm2 !== "Yes" && row.bank_statementm2 !== "Yes") {
            truncate_child_table_field_value(row, frm, [
                'upload__salary_slipm2',
                'salary_slipm3',
                'upload_salary_slipm3',
                'bank_statementm3',
                'upload_bank_statementm3'
            ]);
        }
    },
    salary_slipm3(frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn);
        if (row.salary_slipm3 !== "Yes") {
            truncate_child_table_field_value(row, frm, [
                'upload_salary_slipm3',
                'bank_statementm3',
                'upload_bank_statementm3'
            ]);
        }
    },
    bank_statementm3(frm, cdt, cdn) {
        let row = frappe.get_doc(cdt, cdn);
        if (row.bank_statementm3 !== "Yes") {
            truncate_child_table_field_value(row, frm, ['upload_bank_statementm3']);
        }
    },
    upload_offer_letter(frm, cdt, cdn) {
        // let cg = frm.cur_grid
        const row = locals[cdt][cdn];
        const child_row = row.upload_offer_letter;
        pdf_file_condition(frm, child_row, row, 'upload_offer_letter')
    },
    upload_salary_slipm1(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        const child_row = row.upload_salary_slipm1;
        pdf_file_condition(frm, child_row, row, 'upload_salary_slipm1')
    },
    upload_bank_statementm1(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        const child_row = row.upload_bank_statementm1;
        pdf_file_condition(frm, child_row, row, 'upload_bank_statementm1')
    },
    upload__salary_slipm2(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        const child_row = row.upload__salary_slipm2;
        pdf_file_condition(frm, child_row, row, 'upload__salary_slipm2')
    },
    upload_bank_statementm2(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        const child_row = row.upload_bank_statementm2;
        pdf_file_condition(frm, child_row, row, 'upload_bank_statementm2')
    },
    upload_salary_slipm3(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        const child_row = row.upload_salary_slipm3;
        pdf_file_condition(frm, child_row, row, 'upload_salary_slipm3')
    },
    upload_bank_statementm3(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        const child_row = row.upload_bank_statementm3;
        pdf_file_condition(frm, child_row, row, 'upload_bank_statementm3')
    },
    organization_address: function (frm, cdt, cdn) {
        const row = frappe.get_doc(cdt, cdn);
        const data = row.organization_address;
        if (data && data.length > 50) {
            frappe.show_alert({ message: `Organization address cannot exceed 50 characters`, indicator: "yellow" });
            row['organization_address'] = data.slice(0, 50);
            if (frm.cur_grid) {
                frm.cur_grid.refresh();
            }
        }
    },

    if_no_give_reason: function (frm, cdt, cdn) {
        const row = frappe.get_doc(cdt, cdn);
        const data = row.if_no_give_reason;
        if (data && data.length > 100) {
            frappe.show_alert({ message: `Reasons cannot exceed 100 characters`, indicator: "yellow" });
            row['if_no_give_reason'] = data.slice(0, 100);
            if (frm.cur_grid) {
                frm.cur_grid.refresh();
            }
        }
    },
});
