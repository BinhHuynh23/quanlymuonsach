const express = require("express");
const SachController = require("../controllers/sach.controller");

const routerSach = express.Router();

routerSach.route("/")
    .get(SachController.findAll)
    .post(SachController.create);

routerSach.route("/:maSach")
    .get(SachController.findOne)
    .put(SachController.update)
    .delete(SachController.delete);

module.exports = routerSach;