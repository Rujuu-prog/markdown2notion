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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readMD = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const gray_matter_1 = __importDefault(require("gray-matter"));
const martian_1 = require("@tryfabric/martian");
function readMD(dirPath) {
    const result = [];
    function walk(currentPath) {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });
        for (const entry of entries) {
            const entryPath = path.join(currentPath, entry.name);
            if (entry.isDirectory()) {
                walk(entryPath);
            }
            else if (entry.isFile() && entry.name.endsWith('.md')) {
                const content = (0, gray_matter_1.default)(fs.readFileSync(entryPath, 'utf-8')).content;
                const blockContent = (0, martian_1.markdownToBlocks)(content);
                const relativePath = path.relative(dirPath, entryPath);
                const pathParts = relativePath.split(path.sep);
                const fileNameWithExtension = pathParts.pop();
                const fileNameWithoutExtension = path.basename(fileNameWithExtension, '.md');
                const folderNames = pathParts.map(folderName => ({ name: folderName }));
                result.push({ folderNames, fileName: fileNameWithoutExtension, blockContent });
            }
        }
    }
    walk(dirPath);
    return result;
}
exports.readMD = readMD;
// const markdownFiles = readMD('sample');
// console.dir(markdownFiles);
// console.log('%o', markdownFiles);
