const db = require('../../db.js')
module.exports.validateLogin = (req, res, next) => {
    if(!req.cookies.userId){
        res.redirect('/login');
        return
    }
    const user = db.get('users').find({id: req.cookies.userId}).value()
    if(!user){
        res.redirect('/login');
        return
    }
    if(user.isAdmin === false){
        res.locals.user = user;
    }
    // console.log(user.isAdmin)
    next()
}

module.exports.UnauthMember = (req, res, next) => {
    const user = res.locals.user
    if(!user){
      next();
      return
    }
    if(user.isAdmin === false){
        res.send('Bạn không có quyền truy cập')
        return
    }
    next()
}

module.exports.AuthMember = (req, res, next) => {
    const user = res.locals.user
    // if(user.isAdmin === false){
    //     res.send('Bạn không có quyền truy cập')
    //     return
    // }
    next()
}

module.exports.authAdmin = (req, res) => {

}