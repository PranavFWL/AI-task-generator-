"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAgent = void 0;
class BaseAgent {
    constructor(name, capabilities) {
        this.name = name;
        this.capabilities = capabilities;
    }
    getName() {
        return this.name;
    }
    getCapabilities() {
        return this.capabilities;
    }
    canHandleTask(task) {
        return this.capabilities.includes(task.type);
    }
    generateTaskId() {
        return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    validateTask(task) {
        return !!(task.title && task.description && task.type);
    }
}
exports.BaseAgent = BaseAgent;
//# sourceMappingURL=BaseAgent.js.map