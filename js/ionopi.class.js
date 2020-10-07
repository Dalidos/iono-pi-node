"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IonopiClass = void 0;
const fs = __importStar(require("fs"));
// DEFAULT =======================
const deviceFilenameDefault = {
    analog_in: "ai",
    digital_in: "di",
    open_coll: "oc",
    relay: "o",
    led: "status",
    wiegand: "w"
};
const deviceOptionsDefault = {
    analog_in: "_mv",
    digital_in: "",
    open_coll: "",
    relay: "",
    led: "",
    wiegand: "_enabled"
};
class IonopiClass {
    constructor() {
        this.sysPath = "/sys/class/ionopi/";
    }
    /**
     * Reads the value of the analog input.
     * @param id [ 1 | 2 | 3 | 4 ] - id of the analog input
     */
    ai(id) {
        return new Promise((resolve, reject) => {
            this.read("analog_in", id)
                .then((content) => { resolve(Number(content)); })
                .catch((errRead) => { reject(errRead); });
        });
    }
    /**
     * Reads the value of the digital input.
     * @param id [ 1 | 2 | 3 | 4 | 5 | 6 ] - id of the digital input
     */
    di(id) {
        return new Promise((resolve, reject) => {
            this.read("digital_in", id)
                .then((content) => { resolve(content === "1"); })
                .catch((errRead) => { reject(errRead); });
        });
    }
    /**
     * Reads the state of the digital output. If a value is entered as a parameter, this sets the value of the digital output.
     * @param id [ 1 | 2 | 3 ] - id of the relay
     * @param value [ 0 | 1 | 'F' ] - <optional> If entered, sets it to the digital output ('F'= toggles the state).
     */
    oc(id, value) {
        return new Promise((resolve, reject) => {
            if (value) {
                this.write(value, "open_coll", id)
                    .then(() => {
                    this.read("open_coll", id)
                        .then((content) => { resolve(content === "1"); })
                        .catch((errRead) => { reject(errRead); });
                })
                    .catch((errorWrite) => { reject(errorWrite); });
            }
            else {
                this.read("open_coll", id)
                    .then((content) => { resolve(content === "1"); })
                    .catch((errRead) => { reject(errRead); });
            }
        });
    }
    /**
     * Reads the state of the relay. If a value is entered as a parameter, this sets the value of the relay.
     * @param id [ 1 | 2 | 3 | 4 ] - id of the relay
     * @param value [ 0 | 1 | 'F' ] - <optional> If entered, sets it to the relay ('F'= toggles the state).
     */
    relay(id, value) {
        return new Promise((resolve, reject) => {
            if (value || value === 0) {
                this.write(value, "relay", id)
                    .then(() => {
                    this.read("relay", id)
                        .then((content) => { resolve(content === "1"); })
                        .catch((errRead) => { reject(errRead); });
                })
                    .catch((errorWrite) => { reject(errorWrite); });
            }
            else {
                this.read("relay", id)
                    .then((content) => { resolve(content === "1"); })
                    .catch((errRead) => { reject(errRead); });
            }
        });
    }
    /**
     * Reads the status of the LED. If a value is entered as a parameter, this sets the value of the LED.
     * When blink mode is entered, return a response at the end.
     *
     * blinkProperties = {
     *
     *      **tOn**: time in milliseconds that the LED turns on. If tOff and rep are not entered, turn on the LED once,
     *
     *      **tOff** ?: _<optional>_ off time in milliseconds for the LED,
     *
     *      **rep** ?: _<optional>_ number of repetitions
     *
     * }
     * @param value [ 0 | 1 | 'F' | blinkProperties ] - <optional> If entered, sets it to the LED ('F'= toggles the state).
     */
    led(value) {
        return new Promise((resolve, reject) => {
            if (value) {
                // if value is 0, 1 or 'F'
                if (typeof value === "string" || typeof value === "number") {
                    // -- write
                    this.write(value, "led")
                        .then(() => {
                        this.read("led")
                            .then((content) => { resolve(content === "1"); })
                            .catch((errRead) => { reject(errRead); });
                    })
                        .catch((errorWrite) => { reject(errorWrite); });
                }
                else { // if value has blink properties
                    // -- default value
                    let timeout = value.tOn;
                    let data = value.tOn.toString();
                    // -- if tOff and rep entered
                    if (value.tOff && value.rep) {
                        timeout = (value.tOn + value.tOff) * value.rep;
                        data = value.tOn + " " + value.tOff + " " + value.rep;
                    }
                    // -- write
                    this.write(data, "led", undefined, "blink")
                        .then(() => {
                        setTimeout(() => {
                            this.read("led")
                                .then((content) => { resolve(content === "1"); })
                                .catch((errRead) => { reject(errRead); });
                        }, timeout);
                    })
                        .catch((errorWrite) => { reject(errorWrite); });
                }
            }
            else {
                // if no value entered
                // -- read
                this.read("led")
                    .then((content) => { resolve(content === "1"); })
                    .catch((errRead) => { reject(errRead); });
            }
        });
    }
    /**
     * This method is not yet operational. Only read available.
     * @param id
     */
    wiegand(id) {
        return new Promise((resolve, reject) => {
            this.read("wiegand", id)
                .then((content) => { resolve(content); })
                .catch((errRead) => { reject(errRead); });
        });
    }
    /**
     * This method is not yet operational.
     */
    oneWire() {
        console.log("This method is not yet operational.");
        return;
    }
    // PRIVATE =================================================
    read(device, id, option) {
        return new Promise((resolve, reject) => {
            let filename = deviceFilenameDefault[device];
            let extendFn;
            if (option) {
                extendFn = "_" + option;
                if (option === "blink") {
                    filename = "blink";
                    extendFn = "";
                }
            }
            else {
                extendFn = deviceOptionsDefault[device] ? deviceOptionsDefault[device] : "";
            }
            fs.readFile(`${this.sysPath}${device}/${filename}${id ? id : ""}${extendFn ? extendFn : ""}`, "utf8", (errRead, contents) => {
                if (errRead) {
                    reject(errRead);
                }
                else {
                    if (contents) {
                        resolve(contents.trim());
                    }
                }
            });
        });
    }
    write(data, device, id, option) {
        return new Promise((resolve, reject) => {
            let filename = deviceFilenameDefault[device];
            let extendFn;
            if (option) {
                extendFn = "_" + option;
                if (option === "blink") {
                    filename = "blink";
                    extendFn = "";
                }
            }
            else {
                extendFn = deviceOptionsDefault[device] ? deviceOptionsDefault[device] : "";
            }
            fs.writeFile(`${this.sysPath}${device}/${filename}${id ? id : ""}${extendFn ? extendFn : ""}`, data, "utf8", (errWrite) => {
                if (errWrite) {
                    reject(errWrite);
                }
                else {
                    resolve();
                }
            });
        });
    }
}
exports.IonopiClass = IonopiClass;
