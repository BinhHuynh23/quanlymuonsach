const express = require("express");
const NhaXuatBanController = require("../controllers/nhaxuatban.controller");

const routerNXB = express.Router();

routerNXB.route("/")
    .get(NhaXuatBanController.findAll)
    .post(NhaXuatBanController.create)
    .delete(NhaXuatBanController.deleteAll);

routerNXB.route("/:maNXB")
    .get(NhaXuatBanController.findOne)
    .put(NhaXuatBanController.update)
    .delete(NhaXuatBanController.delete);

module.exports = routerNXB;