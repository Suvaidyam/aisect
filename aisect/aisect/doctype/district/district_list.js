frappe.listview_settings['District'] = {
    onload: function (listview) {
        $('.layout-side-section').hide();
    },
    refresh: function (listview) {
        $(".list-row-activity").hide();
        $("use.like-icon").hide();
    }
};