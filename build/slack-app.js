"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var typedi_1 = require("typedi");
var bolt_1 = require("@slack/bolt");
var SlackFactory = /** @class */ (function () {
    function SlackFactory() {
    }
    SlackFactory.prototype.create = function () {
        // Initializes your app with your bot token and signing secret
        var expressReceiver = new bolt_1.ExpressReceiver({
            signingSecret: process.env.SLACK_SIGNING_SECRET,
        });
        this.expressApp = expressReceiver.app;
        this.expressApp.get('/', function (req, res) {
            res.send({ message: 'API works' });
        });
        this.app = new bolt_1.App({
            token: process.env.SLACK_BOT_TOKEN,
            receiver: expressReceiver,
        });
        return this.app;
    };
    SlackFactory = __decorate([
        typedi_1.Service()
    ], SlackFactory);
    return SlackFactory;
}());
exports.default = SlackFactory;
//# sourceMappingURL=slack-app.js.map