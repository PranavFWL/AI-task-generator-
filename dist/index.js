"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIAgentSystem = exports.BaseAgent = exports.BackendAgent = exports.FrontendAgent = exports.CoordinatorAgent = void 0;
var CoordinatorAgent_1 = require("./agents/CoordinatorAgent");
Object.defineProperty(exports, "CoordinatorAgent", { enumerable: true, get: function () { return CoordinatorAgent_1.CoordinatorAgent; } });
var FrontendAgent_1 = require("./agents/FrontendAgent");
Object.defineProperty(exports, "FrontendAgent", { enumerable: true, get: function () { return FrontendAgent_1.FrontendAgent; } });
var BackendAgent_1 = require("./agents/BackendAgent");
Object.defineProperty(exports, "BackendAgent", { enumerable: true, get: function () { return BackendAgent_1.BackendAgent; } });
var BaseAgent_1 = require("./agents/BaseAgent");
Object.defineProperty(exports, "BaseAgent", { enumerable: true, get: function () { return BaseAgent_1.BaseAgent; } });
__exportStar(require("./types"), exports);
// Main entry point for the AI Agent system
var AIAgentSystem_1 = require("./AIAgentSystem");
Object.defineProperty(exports, "AIAgentSystem", { enumerable: true, get: function () { return AIAgentSystem_1.AIAgentSystem; } });
//# sourceMappingURL=index.js.map