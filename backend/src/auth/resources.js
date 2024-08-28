const {get_database, post_database} = require('../../config/db_utils')

exports.get_resource = async(req, res)=>{
    const role = req.query.role;
    
    if(!role){
        return res.status(400).json({error: "role id is required"})
        
    }
    try{
        const query = `
        SELECT name, icon_path, path
        FROM resources
        INNER JOIN role_resources
        ON role_resources.resources_id = resources.id
        WHERE role_id = ?
        AND role_resources.status IN ('1')
        ORDER BY order_by
        `;

        const resources = await get_database(query, [role]);
        res.json(resources)
    }catch(err){
        console.error("Error fetching resources", err)
        res.status(500).json({error: "Error fetching resources"})
    }

}