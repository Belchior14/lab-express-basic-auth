const res = require("express/lib/response");

function isLoggedIn (req,resp,next){
    if(!req.session.currentUser){
        res.redirect("login")
    } else{
        next()
    }
}

module.exports = {isLoggedIn}