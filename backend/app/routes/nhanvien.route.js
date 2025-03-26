const express = require("express");
const NhanVienController = require("../controllers/nhanvien.controller");

const routerNhanVien = express.Router();

routerNhanVien.route("/")
    .get(NhanVienController.findAll)
    .post(NhanVienController.create);

routerNhanVien.route("/:msnv")
    .get(NhanVienController.findOne)
    .put(NhanVienController.update)
    .delete(NhanVienController.delete);

routerNhanVien.route("/login")
    .post(NhanVienController.authenticate);

module.exports = routerNhanVien;