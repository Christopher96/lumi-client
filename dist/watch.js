"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const diff = __importStar(require("diff"));
const readfile_go_1 = __importDefault(require("readfile-go"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const node_watch_1 = __importDefault(require("node-watch"));
const events_1 = __importDefault(require("events"));
const syncDirs = (syncSource, syncShadow) => {
    return new Promise((resolve, reject) => {
        if (fs_extra_1.default.existsSync(syncShadow)) {
            resolve();
        }
        else {
            fs_extra_1.default.copy(syncSource, syncShadow, err => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        }
    });
};
exports.patchWatch = (syncSource) => {
    const syncShadow = `.${syncSource}.shadow`;
    const emitter = new events_1.default();
    const watchDir = (sourceDir) => {
        node_watch_1.default(sourceDir, { recursive: true }, (event, sourceFile) => {
            if (event == 'update') {
                const path = sourceFile.substr(sourceFile.indexOf('/'));
                const shadowFile = `${syncShadow}${path}`;
                const sourceData = readfile_go_1.default(sourceFile);
                const shadowData = readfile_go_1.default(shadowFile);
                const patchData = diff.createPatch(shadowFile, shadowData, sourceData);
                const patch = diff.parsePatch(patchData);
                emitter.emit('patched', patch);
            }
        });
    };
    fs_extra_1.default.lstat(syncSource)
        .then(stat => {
        if (stat.isDirectory()) {
            return syncDirs(syncSource, syncShadow);
        }
        else {
            throw 'path is not a directory';
        }
    })
        .then(() => watchDir(syncSource));
    return emitter;
};
exports.patchApply = (patch) => {
    return new Promise((resolve, reject) => {
        patch.forEach(filePatch => {
            const filePath = filePatch.index;
            const oldStr = readfile_go_1.default(filePath);
            const appliedStr = diff.applyPatch(oldStr, filePatch);
            fs_extra_1.default.writeFile(filePath, appliedStr, err => {
                if (err)
                    reject('could not write to file');
                resolve();
            });
        });
    });
};
//# sourceMappingURL=watch.js.map