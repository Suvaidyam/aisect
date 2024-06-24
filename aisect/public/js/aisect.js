const getRole = async () => {
    frappe.call({
        method: 'aisect.api.get_user_role',
        callback: function(response) {
            if (response.message!=='Administrator') {
                $('.standard-actions').hide()
                $('.custom-actions').hide()
            } else {
                console.error("Failed to fetch user roles");
            }
        }
    });
}
getRole()
frappe.router.on('change', async () => {
    let cur_router = await frappe.get_route()
    if(['Batch','Zone','State','District','Center','Project','Company','Sector','Job Role','Candidate Details','SVA User','Candidate Success Stories'].includes(cur_router[1])){
        $('.sidebar-toggle-btn').hide() 
    }else{
        $('.sidebar-toggle-btn').show() 
    }
});