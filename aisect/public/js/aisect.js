setTimeout(() => {
    if (!frappe.is_user_logged_in()) {
        if (window.location.pathname != '/login') {
            document.location.href = "/login";
        }
    }
}, 500);
window.setTimeout(() => {
    frappe.app.logout = async () => {
        var me = this;
        me.logged_out = true;
        localStorage.removeItem('current_page')
        await frappe.call({
            method: "logout",
            callback: function (r) {
                if (r.exc) {
                    return;
                }
                document.location.href = "/login";
            },
        });
    };
}, 3000)

frappe.router.on('change', async () => {
    let cur_router = await frappe.get_route()

    if (cur_router[0] != 'Workspaces') {
        $('.sidebar-toggle-btn').hide()
        $('.layout-side-section').hide();
        $('.custom-actions').hide()
        $('.standard-actions').show();
        if (!frappe.user_roles.includes('Administrator')) {
            $('.search-bar').hide()
        }
        
    } else {
        // $('.sidebar-toggle-btn').show()
        // $('.layout-side-section').show();
        // search bar and create workspace
        if (!frappe.user_roles.includes('Administrator')) {
            $('.standard-actions').hide();
            $('.custom-actions').hide();
            $('.search-bar').hide()
        }
        if (cur_router[1] == "Dashboards") {
            $('.sidebar-toggle-btn').show()
            $('.layout-side-section').hide();
        } else {
            $('.sidebar-toggle-btn').show()
            $('.layout-side-section').show();
        }
    }
});