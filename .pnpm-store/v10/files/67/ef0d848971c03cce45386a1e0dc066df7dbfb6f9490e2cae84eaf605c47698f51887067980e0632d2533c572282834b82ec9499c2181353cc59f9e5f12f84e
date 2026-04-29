import type { CaptureLogOptions, LogAttributeValue, LogSeverityLevel, OtlpSeverityText, OtlpAnyValue, OtlpKeyValue, OtlpLogRecord, OtlpLogsPayload, LogSdkContext } from './types';
export declare function getOtlpSeverityText(level: LogSeverityLevel): OtlpSeverityText;
export declare function getOtlpSeverityNumber(level: LogSeverityLevel): number;
export declare function toOtlpAnyValue(value: LogAttributeValue): OtlpAnyValue;
export declare function toOtlpKeyValueList(attrs: Record<string, LogAttributeValue>): OtlpKeyValue[];
export declare function buildOtlpLogRecord(options: CaptureLogOptions, sdkContext: LogSdkContext): OtlpLogRecord;
export declare function buildOtlpLogsPayload(logRecords: OtlpLogRecord[], resourceAttributes: Record<string, LogAttributeValue>): OtlpLogsPayload;
