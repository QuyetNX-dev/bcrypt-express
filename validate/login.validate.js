const db = require('../db.js')
const bcrypt = require('bcrypt');

module.exports.validateLogin = (req, res, next) => {
    let errors = [];

    if(!req.body.email){
        errors.push('Bạn chưa nhập tài khoản')
    }
    if(!req.body.password){
        errors.push('Bạn chưa nhập mật khẩu')
    }
    if(errors.length){
        res.render('authentication/login',{
            errors: errors,
            values: req.body
        })
        return;
    }

    const user = db.get('users').find({email: req.body.email}).value()

    if(!user){
        errors.push('Tài khoản không đúng')
        res.render('authentication/login',{
            errors: errors,
            values: req.body
        })
        return;
    }

    bcrypt.compare(req.body.password, user.password, function(err, result) {
        
        if(user.wrongLoginCount > 3){
            errors.push('Lượn đê, quá 3 lần rồi, đừng để anh cáu')
            res.render('authentication/login',{
                errors: errors,
                values: req.body
            })
            return;
        }
        if(result == false){
            db.get("users")
            .find({email: req.body.email})
            .assign({ 
                wrongLoginCount:  user.wrongLoginCount + 1
            })
            .write();
            errors.push('Mật khẩu không đúng')
            res.render('authentication/login',{
                errors: errors,
                values: req.body
            })
            return;
        }
        res.cookie('userId',user.id)
        res.redirect('/transection')
        
    });
    
}