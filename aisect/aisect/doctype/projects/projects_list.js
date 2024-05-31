frappe.listview_settings['Projects'] = {
    onload: function (listview) {
        $('.layout-side-section').hide();
    },
    refresh: function (listview) {
        $(".list-row-activity").hide();
        $("use.like-icon").hide();
    }
};