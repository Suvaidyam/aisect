const getRole = async () => {
    frappe.call({
        method: 'aisect.api.get_user_role',
        callback: function (response) {
            if (response.message !== 'Administrator') {
                $('.standard-actions').hide()
                $('.custom-actions').hide()
                $('.search-bar').hide()
            } else {
                console.error("Failed to fetch user roles");
            }
        }
    });
}
getRole()
window.setTimeout(()=>{
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
},3000)
frappe.router.on('change', async () => {
    let cur_router = await frappe.get_route()
    if (['Batch', 'Zone', 'State', 'District', 'Center', 'Project', 'Company', 'Sector', 'Job Role', 'Candidate Details', 'SVA User', 'Candidate Success Stories'].includes(cur_router[1])) {
        $('.sidebar-toggle-btn').hide()
    } else {
        $('.sidebar-toggle-btn').show()
    }
});