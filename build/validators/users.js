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
//lodash
var parseInt = require('lodash').parseInt;
var _ = require('lodash');
exports.vUserCraete = function (req, res, next) {
    try {
        //const email_validation = require('email-validator')
        // if (!email_validation.validate(req.body.email)){
        //     //res.status(400).send('invalid email')
        //     res.send('invalid email')
        // }
        var username = req.body.username;
        var firstname = req.body.firstName;
        var lastname = req.body.lastName;
        var email = req.body.email;
        var phone = req.body.phone;
        //check username
        if (!username) {
            return res.json({
                status: -1,
                msg: "خطا: نام کاربری الزامی می‌باشد"
            });
        }
        //check email or phone number
        else if (!email && !phone) {
            return res.json({
                status: -1,
                msg: "خطا: حداقل باید یکی از دو قسمت ایمیل یا شماره تلفن را وارد کنید"
            });
        }
        //validate email
        else if (email) {
            if (email.indexOf("@") < 1) {
                return res.json({
                    status: -1,
                    msg: "خطا: ایمیل شما صحیح نمی‌باشد"
                });
            }
            if (!_.endsWith(email, ".com")) {
                return res.json({
                    status: -1,
                    msg: "خطا: ایمیل باید با .com تمام شود"
                });
            }
        }
        //validate phone
        else if (phone) {
            if (!(phone.length === 11)) {
                return res.json({
                    status: -1,
                    msg: "خطا: شماره تلفن باید ۱۱ رقم داشته باشد"
                });
            }
            if (isNaN(phone)) {
                return res.json({
                    status: -1,
                    msg: "خطا: شماره تلفن باید عدد باشد"
                });
            }
        }
        //validate firstName
        else if (_.isNumber(firstname)) {
            return res.json({
                status: -1,
                msg: "نام نباید شامل عدد باشد"
            });
        }
        //validate lastName
        else if (_.isNumber(lastname)) {
            return res.json({
                status: -1,
                msg: "نام خانوادگی نباید شامل عدد باشد"
            });
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.json({
            status: -1,
            msg: "خطا: عملیات با خطا مواجه شد"
        });
    }
};
exports.vUserLogin = function (req, res, next) {
    try {
        var username = req.body.username;
        var email = req.body.email;
        var phone = req.body.phone;
        var password = req.body.password;
        //validate username
        if (!username) {
            return res.json({
                status: -1,
                msg: "خطا: نام کاربری وارد نشده است"
            });
        }
        //validate password
        else if (!password) {
            return res.json({
                status: -1,
                msg: "خطا: رمز وارد نشده است"
            });
        }
        //validate email & phone
        else if (!email && !phone) {
            return res.json({
                status: -1,
                msg: "خطا: حداقل باید یکی از دو قسمت ایمیل یا شماره تلفن را وارد کنید"
            });
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.json({
            status: -1,
            msg: "خطا: عملیات با خطا مواجه شد"
        });
    }
};
exports.vUserUpdate = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, old_password, new_username, new_firstName, new_lastName, new_email, new_phone, user, duplicate_user, duplicate_email, duplicate_phone, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                id = parseInt(req.body.id);
                old_password = req.body.oldPassword;
                new_username = req.body.username;
                new_firstName = req.body.firstName;
                new_lastName = req.body.lastName;
                new_email = req.body.email;
                new_phone = req.body.phone;
                return [4 /*yield*/, db.User.findFirst({
                        where: {
                            id: id
                        }
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.json({
                            status: -1,
                            msg: "خطا: کاربری با این آی‌دی وجود ندارد"
                        })];
                }
                //authentication old password
                if (!old_password) {
                    return [2 /*return*/, res.json({
                            status: -1,
                            msg: "خطا: وارد کردن رمز عبور قبلی الزامی است"
                        })];
                }
                return [4 /*yield*/, db.User.findFirst({
                        where: {
                            id: id,
                            password: old_password
                        }
                    })];
            case 2:
                user_auth = _a.sent();
                if (!user_auth) {
                    return [2 /*return*/, res.json({
                            status: -1,
                            msg: "خطا: رمز عبور صحیح نمی‌باشد"
                        })];
                }
                return [4 /*yield*/, db.User.findFirst({
                        where: {
                            NOT: {
                                id: id
                            },
                            username: new_username
                        }
                    })];
            case 3:
                duplicate_user = _a.sent();
                if (duplicate_user) {
                    return [2 /*return*/, res.json({
                            status: -1,
                            msg: "خطا: نام کاربری تکراری می‌باشد"
                        })];
                }
                //check email or phone
                if (!new_email && !new_phone) {
                    return [2 /*return*/, res.json({
                            status: -1,
                            msg: "خطا: حداقل باید یکی از دو قسمت ایمیل یا شماره تلفن را وارد کنید"
                        })];
                }
                //validate email
                else if (new_email) {
                    if (new_email.indexOf("@") < 1) {
                        return [2 /*return*/, res.json({
                                status: -1,
                                msg: "خطا: ایمیل شما صحیح نمی‌باشد"
                            })];
                    }
                    if (!_.endsWith(new_email, ".com")) {
                        return [2 /*return*/, res.json({
                                status: -1,
                                msg: "خطا: ایمیل باید با .com تمام شود"
                            })];
                    }
                }
                return [4 /*yield*/, db.User.findFirst({
                        where: {
                            NOT: {
                                id: id
                            },
                            email: new_email
                        }
                    })];
            case 4:
                duplicate_email = _a.sent();
                if (duplicate_email) {
                    return [2 /*return*/, res.json({
                            status: -1,
                            msg: "خطا: ایمیل تکراری می‌باشد"
                        })];
                }
                //validate phone
                else if (new_phone) {
                    if (!(new_phone.length === 11)) {
                        return [2 /*return*/, res.json({
                                status: -1,
                                msg: "خطا: شماره تلفن باید ۱۱ رقم داشته باشد"
                            })];
                    }
                    if (isNaN(new_phone)) {
                        return [2 /*return*/, res.json({
                                status: -1,
                                msg: "خطا: شماره تلفن باید عدد باشد"
                            })];
                    }
                }
                return [4 /*yield*/, db.User.findFirst({
                        where: {
                            NOT: {
                                id: id
                            },
                            phone: new_phone
                        }
                    })];
            case 5:
                duplicate_phone = _a.sent();
                if (duplicate_phone) {
                    return [2 /*return*/, res.json({
                            status: -1,
                            msg: "خطا: شماره تلفن تکراری می‌باشد"
                        })];
                }
                //validate firstName
                else if (_.isNumber(new_firstName)) {
                    return [2 /*return*/, res.json({
                            status: -1,
                            msg: "نام نباید شامل عدد باشد"
                        })];
                }
                //validate lastName
                else if (_.isNumber(new_lastName)) {
                    return [2 /*return*/, res.json({
                            status: -1,
                            msg: "نام خانوادگی نباید شامل عدد باشد"
                        })];
                }
                next();
                return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                console.log(error_1);
                return [2 /*return*/, res.json({
                        status: -1,
                        msg: "خطا: عملیات با خطا مواجه شد"
                    })];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.vUserDelete = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                //validate id parameter in url
                id = req.params.userId;
                if (isNaN(id)) {
                    return [2 /*return*/, res.json({
                            status: -1,
                            msg: "خطا: آی‌دی باید به صورت عددی باشد"
                        })];
                }
                return [4 /*yield*/, db.User.findFirst({
                        where: {
                            id: parseInt(id)
                        }
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.json({
                            status: -1,
                            msg: "خطا: کاربری با این آی‌دی وجود ندارد"
                        })];
                }
                next();
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.log(error_2);
                return [2 /*return*/, res.json({
                        status: -1,
                        msg: "خطا: عملیات با خطا مواجه شد"
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.vGetOne = function (req, res, next) {
    try {
        //validate id parameter in url
        id = req.params.userId;
        if (isNaN(id)) {
            return res.json({
                status: -1,
                msg: "خطا: آی‌دی باید به صورت عددی باشد"
            });
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.json({
            status: -1,
            msg: "خطا: عملیات با خطا مواجه شد"
        });
    }
};
