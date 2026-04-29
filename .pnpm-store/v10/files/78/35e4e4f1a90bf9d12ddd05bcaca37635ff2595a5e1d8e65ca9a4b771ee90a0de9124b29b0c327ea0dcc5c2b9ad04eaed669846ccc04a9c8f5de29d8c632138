"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOtlpSeverityText = getOtlpSeverityText;
exports.getOtlpSeverityNumber = getOtlpSeverityNumber;
exports.toOtlpAnyValue = toOtlpAnyValue;
exports.toOtlpKeyValueList = toOtlpKeyValueList;
exports.buildOtlpLogRecord = buildOtlpLogRecord;
exports.buildOtlpLogsPayload = buildOtlpLogsPayload;
var core_1 = require("@posthog/core");
var config_1 = __importDefault(require("./config"));
// ============================================================================
// Severity mapping
// ============================================================================
var OTLP_SEVERITY_MAP = {
    trace: { text: 'TRACE', number: 1 },
    debug: { text: 'DEBUG', number: 5 },
    info: { text: 'INFO', number: 9 },
    warn: { text: 'WARN', number: 13 },
    error: { text: 'ERROR', number: 17 },
    fatal: { text: 'FATAL', number: 21 },
};
var DEFAULT_OTLP_SEVERITY = OTLP_SEVERITY_MAP.info;
function getOtlpSeverityText(level) {
    return (OTLP_SEVERITY_MAP[level] || DEFAULT_OTLP_SEVERITY).text;
}
function getOtlpSeverityNumber(level) {
    return (OTLP_SEVERITY_MAP[level] || DEFAULT_OTLP_SEVERITY).number;
}
// ============================================================================
// OTLP AnyValue conversion
// ============================================================================
function toOtlpAnyValue(value) {
    if ((0, core_1.isBoolean)(value)) {
        return { boolValue: value };
    }
    if ((0, core_1.isNumber)(value)) {
        if (Number.isInteger(value)) {
            return { intValue: value };
        }
        return { doubleValue: value };
    }
    if (typeof value === 'string') {
        return { stringValue: value };
    }
    if ((0, core_1.isArray)(value)) {
        return { arrayValue: { values: value.map(function (v) { return toOtlpAnyValue(v); }) } };
    }
    // Objects fall back to JSON — OTLP supports kvlistValue but our encoder stays flat for simplicity
    try {
        return { stringValue: JSON.stringify(value) };
    }
    catch (_a) {
        return { stringValue: String(value) };
    }
}
function toOtlpKeyValueList(attrs) {
    var result = [];
    for (var key in attrs) {
        var value = attrs[key];
        if ((0, core_1.isNull)(value) || (0, core_1.isUndefined)(value)) {
            continue;
        }
        result.push({ key: key, value: toOtlpAnyValue(value) });
    }
    return result;
}
// ============================================================================
// OTLP LogRecord construction
// ============================================================================
function timestampToUnixNano() {
    // OTLP expects nanoseconds as a string (uint64 doesn't fit in JS number)
    // Date.now() * 1_000_000 exceeds Number.MAX_SAFE_INTEGER, so we concat instead of multiply
    return String(Date.now()) + '000000';
}
function buildOtlpLogRecord(options, sdkContext) {
    var level = options.level || 'info';
    var _a = OTLP_SEVERITY_MAP[level] || DEFAULT_OTLP_SEVERITY, severityText = _a.text, severityNumber = _a.number;
    var now = timestampToUnixNano();
    // Build attributes: auto-populated + user-provided (user wins on conflicts)
    var autoAttributes = {};
    if (sdkContext.distinctId) {
        autoAttributes.posthogDistinctId = sdkContext.distinctId;
    }
    if (sdkContext.sessionId) {
        autoAttributes.sessionId = sdkContext.sessionId;
    }
    if (sdkContext.currentUrl) {
        autoAttributes['url.full'] = sdkContext.currentUrl;
    }
    if (sdkContext.activeFeatureFlags && sdkContext.activeFeatureFlags.length > 0) {
        autoAttributes.feature_flags = sdkContext.activeFeatureFlags;
    }
    var mergedAttributes = __assign(__assign({}, autoAttributes), (options.attributes || {}));
    var record = {
        timeUnixNano: now,
        observedTimeUnixNano: now,
        severityNumber: severityNumber,
        severityText: severityText,
        body: { stringValue: options.body },
        attributes: toOtlpKeyValueList(mergedAttributes),
    };
    if (options.trace_id) {
        record.traceId = options.trace_id;
    }
    if (options.span_id) {
        record.spanId = options.span_id;
    }
    if (!(0, core_1.isUndefined)(options.trace_flags)) {
        record.flags = options.trace_flags;
    }
    return record;
}
// ============================================================================
// OTLP envelope construction
// ============================================================================
function buildOtlpLogsPayload(logRecords, resourceAttributes) {
    return {
        resourceLogs: [
            {
                resource: {
                    attributes: toOtlpKeyValueList(resourceAttributes),
                },
                scopeLogs: [
                    {
                        scope: { name: config_1.default.LIB_NAME },
                        logRecords: logRecords,
                    },
                ],
            },
        ],
    };
}
//# sourceMappingURL=logs-utils.js.map