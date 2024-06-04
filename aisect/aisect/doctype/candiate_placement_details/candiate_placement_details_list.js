frappe.listview_settings['Candiate Placement Details'] = {
    onload: function (listview) {
        $('.layout-side-section').hide();
    },
    refresh: function (listview) {
        $(".list-row-activity").hide();
        $("use.like-icon").hide();
    },
    add_fields: [
        'candidate_name'
    ],
    hide_name_column: true,
};