frappe.listview_settings['District'] = {
    onload: function (listview) {
        $('.layout-side-section').hide();
        $('.sidebar-section.filter-section').hide();
        $('.sidebar-section.save-filter-section').hide();
        $(".custom-actions").hide();
    },
    refresh: function (listview) {
        $(".list-row-activity").hide();
        $("use.like-icon").hide();
    }
};