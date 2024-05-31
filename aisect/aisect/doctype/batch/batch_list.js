frappe.listview_settings['Batch'] = {
    onload: function (listview) {
        $('.layout-side-section').hide();
    },
    refresh: function (listview) {
        $(".list-row-activity").hide();
        $("use.like-icon").hide();
    }

};