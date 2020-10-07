import * as fs from "fs";
import {
    AiIdType, AiOptionType, DeviceOptionsType,
    DiIdType,
    IonopiDeviceType,
    LedValueType, OcIdType,
    OcValueType,
    RelayIdType,
    RelayValueType,
    WiegandIdType, WiegandOptionType
} from "./ionopi.type";

/**
 * Iono Pi Node Typescript module
 * Version: 1.0
 */
export class Ionopi {

    private readonly sysPath: string = "/sys/class/ionopi/";
    private readonly deviceFilenameDefault = {
        analog_in: "ai",
        digital_in: "di",
        open_coll: "oc",
        relay: "o",
        led: "status",
        wiegand: "w"
    };
    private readonly deviceOptionsDefault = {
        analog_in: "_mv",
        digital_in: "",
        open_coll: "",
        relay: "",
        led: "",
        wiegand: "_enabled"
    };

    constructor() {
    }

    /**
     * Reads the value of the analog input.
     * @param id [ 1 | 2 | 3 | 4 ] - id of the analog input
     * @param option: ["mv"(default) | "raw"]
     */
    public ai(id: AiIdType, option: AiOptionType = "mv"): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this.read("analog_in", id, option)
                .then((content) => { resolve(Number(content)); })
                .catch((errRead) => { reject(errRead); });

        });
    }

    /**
     * Reads the value of the digital input.
     * @param id [ 1 | 2 | 3 | 4 | 5 | 6 ] - id of the digital input
     */
    public di(id: DiIdType): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.read("digital_in", id)
                .then((content) => { resolve(content === "1"); })
                .catch((errRead) => { reject(errRead); });
        });
    }

    /**
     * Reads the state of the digital output. If a value is entered as a parameter, this sets the value of the digital output.
     * @param id [ 1 | 2 | 3 ] - id of the relay
     * @param value [ 0 | 1 | 'F' | true | false ] - <optional> If entered, sets it to the digital output ('F'= toggles the state).
     */
    public oc(id: OcIdType, value?: OcValueType) {
        return new Promise<boolean>((resolve, reject) => {
            if (value || value === 0 || value === false) {
                this.write(value, "open_coll", id)
                    .then(() => {
                        this.read("open_coll", id)
                            .then((content) => { resolve(content === "1"); })
                            .catch((errRead) => { reject(errRead); });
                    })
                    .catch((errorWrite) => { reject(errorWrite); });
            } else {
                this.read("open_coll", id)
                    .then((content) => { resolve(content === "1"); })
                    .catch((errRead) => { reject(errRead); });
            }
        });
    }

    /**
     * Reads the state of the relay. If a value is entered as a parameter, this sets the value of the relay.
     * @param id [ 1 | 2 | 3 | 4 ] - id of the relay
     * @param value [ 0 | 1 | 'F' | true | false ] - <optional> If entered, sets it to the relay ('F'= toggles the state).
     */
    public relay(id: RelayIdType, value?: RelayValueType): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (value || value === 0 || value === false) {
                this.write(value, "relay", id)
                    .then(() => {
                        this.read("relay", id)
                            .then((content) => { resolve(content === "1"); })
                            .catch((errRead) => { reject(errRead); });
                    })
                    .catch((errorWrite) => { reject(errorWrite); });

            } else {
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
     * @param value [ 0 | 1 | 'F' | blinkProperties | true | false ] - <optional> If entered, sets it to the LED ('F'= toggles the state).
     */
    public led(value?: LedValueType) {
        return new Promise<boolean>((resolve, reject) => {
            if ((value || value === 0 || value === false) && value !== undefined) {
                // if value is 0, 1 or 'F'
                if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
                    // -- write
                    this.write(value, "led")
                        .then(() => {
                            this.read("led")
                                .then((content) => { resolve(content === "1"); })
                                .catch((errRead) => { reject(errRead); });
                        })
                        .catch((errorWrite) => { reject(errorWrite); });
                } else { // if value has blink properties
                    // -- default value
                    let timeout = value.tOn;
                    let data: string = value.tOn.toString();
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
            } else {
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
     * @param option
     */
    public wiegand(id: WiegandIdType, option: WiegandOptionType = "enabled"): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.read("wiegand", id, option)
                .then((content) => { resolve(content); })
                .catch((errRead) => { reject(errRead); });
        });
    }

    /**
     * This method is not yet operational.
     */
    public oneWire(): void {
        console.log("This method is not yet operational.");
        return;
    }

    // PRIVATE =================================================

    /**
     * Reads the system file of the device
     * @param device
     * @param id
     * @param option
     * @private
     */
    private read(device: IonopiDeviceType, id?: number, option?: DeviceOptionsType): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const filename = this.defineFilename(device, id, option);
            fs.readFile(`${this.sysPath}${device}/${filename}`, "utf8", (errRead, contents) => {
                if (errRead) {
                    reject(errRead);
                } else {
                    if (contents) {
                        resolve(contents.trim());
                    }
                }
            });
        });
    }

    /**
     * Writes to the system file of the device
     * @param data
     * @param device
     * @param id
     * @param option
     * @private
     */
    private write(data: any, device: IonopiDeviceType, id?: number, option?: DeviceOptionsType): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const filename = this.defineFilename(device, id, option);
            fs.writeFile(`${this.sysPath}${device}/${filename}`, data, "utf8", (errWrite) => {
                if (errWrite) {
                    reject(errWrite);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Define the filename for reading or writing.
     * @param device: ["analog_in" | "digital_in" | "open_coll" | "relay" | "led" | "wiegand"]
     * @param id: number
     * @param option: **For analog_in:** ["mv"_(default)_ | "raw"]. **For led:** ["blink"]. **For wiegand:** ["enabled"_(default)_ | "data" | "pulse_width_max" | "pulse_width_min" | "pulse_itvl_max" | "pulse_itvl_min"]
     * @private
     */
    private defineFilename(device: IonopiDeviceType, id?: number, option?: DeviceOptionsType) {
        let filename = this.deviceFilenameDefault[device];
        let extendFn: string;
        if (option) {
            extendFn = "_" + option;
            if (option === "blink") {
                filename = "blink";
                extendFn = "";
            }
        } else {
            extendFn = this.deviceOptionsDefault[device] ? this.deviceOptionsDefault[device] : "";
        }
        return `${filename}${id ? id : ""}${extendFn ? extendFn : ""}`;
    }

}
