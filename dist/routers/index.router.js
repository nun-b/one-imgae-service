"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_control_1 = require("./controllers/index.control");
const router = (0, express_1.Router)();
router.get('^/$|index(.html)?', index_control_1.MainPage);
exports.default = router;
