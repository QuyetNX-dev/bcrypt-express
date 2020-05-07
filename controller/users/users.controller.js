const shortid = require('shortid')
const db = require('../../db');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

module.exports.index = (req, res) => {
    db.get("users")
        .forEach((item, index) => {
        item.stt = index + 1;
        })
        .write();
    res.render("users/index", {
        users: db.get("users").value(),
        titleHeader: 'Danh sách khách hàng',
        activeUsers: 'text-primary'
    });
}

module.exports.delete = (req, res) => {
    let id = req.params.id;
    res.render("users/delete", {
        id
    });
}

module.exports.deleteOk = (req, res) => {
    var id = req.params.id;
    db.get("users")
        .remove({ id: id })
        .write();
    db.get("transection")
        .remove({ userId: id })
        .write();
    res.redirect("/users");
}

module.exports.create =  (req, res) => {
    res.render("users/post", {});
}

module.exports.postCreate = (req, res) => {
    req.body.stt = db.get("users").value().length + 1;
    req.body.id = shortid.generate();
    req.body.isAdmin = false;
    req.body. wrongLoginCount = 0;
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        req.body.password = hash;
        db.get("users")
            .push(req.body)
            .write();
        res.redirect("/users");
    });
}

module.exports.update = (req, res) => {
    let id = req.params.id;
    let isUser = db
        .get("users")
        .find({ id: id })
        .value();
    res.render("users/update", {
        id, isUser
    });
}

module.exports.updateDone = (req, res) => {
    let id = req.params.id;
    let name = req.body.name;
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        db.get("users")
            .find({ id: id })
            .assign({ 
              name: name,
              phone: req.body.phone,
              email: req.body.email,
              password: hash
            })
            .write();
        res.redirect("/users");
    });
}