const express = require("express");
const DocGiaController = require("../controllers/docgia.controller");

const routerDocGia = express.Router();

routerDocGia.route("/")
    .get(DocGiaController.findAll)
    .post(DocGiaController.create)
    .delete(DocGiaController.deleteAll);

routerDocGia.route("/:maDocGia")
    .get(DocGiaController.findOne)
    .put(DocGiaController.update)
    .delete(DocGiaController.delete);

module.exports = routerDocGia;