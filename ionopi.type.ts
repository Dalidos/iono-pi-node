import {LedBlinkModel} from "./ionopi.interface";

export type IonopiDeviceType = "analog_in" | "digital_in" | "open_coll" | "relay" | "led" | "wiegand";
export type AiIdType = 1 | 2 | 3 | 4;
export type AiOptionType = "mv" | "raw";
export type DiIdType = 1 | 2 | 3 | 4 | 5 | 6;
export type OcIdType = 1 | 2 | 3;
export type OcValueType = 0 | 1 | "F" | true | false;
export type RelayIdType = 1 | 2 | 3 | 4;
export type RelayValueType = 0 | 1 | "F" | true | false;
export type LedValueType = 0 | 1 | "F" | LedBlinkModel | true | false;
export type LedOptionType = "blink";
export type WiegandIdType = 1 | 2 | 3 | 4;
export type WiegandOptionType = "enabled" | "data" | "pulse_width_max" | "pulse_width_min" | "pulse_itvl_max" | "pulse_itvl_min";
export type DeviceOptionsType = AiOptionType | LedOptionType | WiegandOptionType;
