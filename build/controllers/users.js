"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
//config database for send query
var PrismaClient = require('@prisma/client').PrismaClient;
var add = require('lodash').add;
var db = new PrismaClient();
require('dotenv').config();
exports.create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, firstname, lastname, address, email, phone, password, gender, username_check, email_check, phone_check, newUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.body.username;
                firstname = req.body.firstName;
                lastname = req.body.lastname;
                address = req.body.address;
                email = req.body.email;
                phone = req.body.phone;
                password = req.body.password;
                gender = req.body.gender;
                return [4 /*yield*/, db.User.findFirst({
                        where: {
                            username: username
                        }
                    })
                    //chech uniqe email
                ];
            case 1:
                username_check = _a.sent();
                if (!!email) return [3 /*break*/, 2];
                email_check = null;
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, db.User.findFirst({
                    where: {
                        email: email
                    }
                })];
            case 3:
                email_check = _a.sent();
                _a.label = 4;
            case 4:
                if (!!phone) return [3 /*break*/, 5];
                phone_check = null;
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, db.User.findFirst({
                    where: {
                        phone: phone
                    }
                })];
            case 6:
                phone_check = _a.sent();
                _a.label = 7;
            case 7:
                if (!(!username_check && !email_check && !phone_check)) return [3 /*break*/, 9];
                return [4 /*yield*/, db.User.create({
                        data: {
                            username: username,
                            firstname: firstname,
                            lastname: lastname,
                            address: address,
                            email: email,
                            phone: phone,
                            password: password,
                            gender: gender
                        }
                    })];
            case 8:
                newUser = _a.sent();
                return [2 /*return*/, res.json({
                        staus: 200,
                        msg: "ثبت نام با موفقیت انجام شد",
                        data: newUser
                    })];
            case 9:
                if (username_check) {
                    return [2 /*return*/, res.json({
                            staus: -1,
                            msg: "نام کاربری تکراری می‌باشد",
                        })];
                }
                else if (email_check) {
                    return [2 /*return*/, res.json({
                            staus: -1,
                            msg: "ایمیل تکراری می‌باشد",
                        })];
                }
                else if (phone_check) {
                    return [2 /*return*/, res.json({
                            staus: -1,
                            msg: "شماره تلفن تکراری می‌باشد",
                        })];
                }
                _a.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, email, phone, password, user_username, user_password, user_all_option, user_no_email, user_no_phone;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.body.username;
                email = req.body.email;
                phone = req.body.phone;
                password = req.body.password;
                return [4 /*yield*/, db.User.findFirst({
                        where: {
                            username: username,
                        }
                    })];
            case 1:
                user_username = _a.sent();
                if (!user_username) {
                    return [2 /*return*/, res.json({
                            status: -1,
                            msg: "شخصی با این نام کاربری موجود نمی‌باشد"
                        })];
                }
                return [4 /*yield*/, db.User.findFirst({
                        where: {
                            username: username,
                            password: password,
                        }
                    })];
            case 2:
                user_password = _a.sent();
                if (!user_password) {
                    return [2 /*return*/, res.json({
                            status: -1,
                            msg: "رمز عبور صحیح نمی‌باشد"
                        })];
                }
                return [4 /*yield*/, db.User.findFirst({
                        where: {
                            username: username,
                            email: email,
                            phone: phone,
                            password: password
                        }
                    })
                    //check user in database without email
                ];
            case 3:
                user_all_option = _a.sent();
                return [4 /*yield*/, db.User.findFirst({
                        where: {
                            username: username,
                            phone: phone,
                            password: password
                        }
                    })
                    //check user in database without phone number
                ];
            case 4:
                user_no_email = _a.sent();
                return [4 /*yield*/, db.User.findFirst({
                        where: {
                            username: username,
                            email: email,
                            password: password
                        }
                    })];
            case 5:
                user_no_phone = _a.sent();
                if (email && phone && !user_all_option) {
                    return [2 /*return*/, res.json({
                            staus: -1,
                            msg: "کاربری با این شماره تلفن یا ایمیل وجود ندارد"
                        })];
                }
                else if (!email && !user_no_email) {
                    return [2 /*return*/, res.json({
                            staus: -1,
                            msg: "کاربری با این شماره تلفن وجود ندارد"
                        })];
                }
                else if (!phone && !user_no_phone) {
                    return [2 /*return*/, res.json({
                            staus: -1,
                            msg: "کاربری با این ایمیل وجود ندارد"
                        })];
                }
                else {
                    return [2 /*return*/, res.json({
                            status: 200,
                            msg: "ورود با موفقیت انجام شد"
                        })];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.update = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, new_username, new_firstName, new_lastName, new_address, new_email, new_phone, new_password, updated_user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = parseInt(req.body.id);
                new_username = req.body.username;
                new_firstName = req.body.firstName;
                new_lastName = req.body.lastName;
                new_address = req.body.address;
                new_email = req.body.email;
                new_phone = req.body.phone;
                new_password = req.body.password;
                return [4 /*yield*/, db.User.update({
                        where: {
                            id: id
                        },
                        data: {
                            username: new_username,
                            first_name: new_firstName,
                            lastName: new_lastName,
                            address: new_address,
                            email: new_email,
                            phone: new_phone,
                            password: new_password
                        }
                    })];
            case 1:
                updated_user = _a.sent();
                if (updated_user) {
                    return [2 /*return*/, res.json({
                            status: 200,
                            msg: "به‌روز‌رسانی با موفقیت انجام شد"
                        })];
                }
                else {
                    return [2 /*return*/, res.json({
                            status: -1,
                            msg: "خطا: به‌روز رسانی انجام نشد"
                        })];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.delete = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = parseInt(req.params.userId);
                return [4 /*yield*/, db.User.delete({
                        where: {
                            id: id
                        }
                    })];
            case 1:
                user = _a.sent();
                if (user) {
                    return [2 /*return*/, res.json({
                            status: 200,
                            msg: "کاربر با موفقیت حذف شد"
                        })];
                }
                else {
                    return [2 /*return*/, res.json({
                            status: -1,
                            msg: "خطا: حذف کاربر ناموفق انجام شد"
                        })];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getOne = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = parseInt(req.params.userId);
                return [4 /*yield*/, db.User.findFirst({
                        where: {
                            id: id
                        }
                    })];
            case 1:
                user = _a.sent();
                if (user) {
                    return [2 /*return*/, res.json({
                            status: 200,
                            data: {
                                id: user.id,
                                username: user.username,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                address: user.address,
                                email: user.email,
                                phone: user.phone,
                            }
                        })];
                }
                else {
                    return [2 /*return*/, res.json({
                            status: -1,
                            msg: "کاربری با این آی‌دی وجود ندارد"
                        })];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getAll = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db.User.findMany({
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        address: true,
                        email: true,
                        phone: true
                    }
                })];
            case 1:
                users = _a.sent();
                return [2 /*return*/, res.json({
                        staus: 200,
                        data: users
                    })];
        }
    });
}); };
