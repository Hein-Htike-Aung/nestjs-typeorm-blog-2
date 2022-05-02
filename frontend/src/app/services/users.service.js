"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UsersService = void 0;
var rxjs_1 = require("rxjs");
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var environment_1 = require("../../environments/environment");
var API = "".concat(environment_1.environment.apiUrl, "/users");
var UsersService = /** @class */ (function () {
    function UsersService(http) {
        this.http = http;
    }
    UsersService.prototype.findAll = function (page, limit) {
        var params = new http_1.HttpParams();
        params = params.append('page', String(page));
        params = params.append('limit', String(limit));
        return this.http.get("".concat(API), { params: params }).pipe((0, rxjs_1.map)(function (userData) { return userData; }), (0, rxjs_1.catchError)(function (err) { return (0, rxjs_1.throwError)(function () { return err; }); }));
    };
    UsersService.prototype.paginateByName = function (_a) {
        var username = _a.username, limit = _a.limit, _b = _a.page, page = _b === void 0 ? 0 : _b;
        var params = new http_1.HttpParams();
        params = params.append('page', String(page));
        params = params.append('limit', String(limit));
        params = params.append('username', username);
        return this.http.get("".concat(API), { params: params }).pipe((0, rxjs_1.map)(function (userData) { return userData; }), (0, rxjs_1.catchError)(function (err) { return (0, rxjs_1.throwError)(function () { return err; }); }));
    };
    UsersService = __decorate([
        (0, core_1.Injectable)({
            providedIn: 'root'
        })
    ], UsersService);
    return UsersService;
}());
exports.UsersService = UsersService;
