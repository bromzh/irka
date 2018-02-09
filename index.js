var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
/// <reference types="pixi.js" />
System.register("irka/multystyle-text", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var INTERACTION_EVENTS, MultiStyleText;
    return {
        setters: [],
        execute: function () {
            INTERACTION_EVENTS = [
                "pointerover",
                "pointerenter",
                "pointerdown",
                "pointermove",
                "pointerup",
                "pointercancel",
                "pointerout",
                "pointerleave",
                "gotpointercapture",
                "lostpointercapture",
                "mouseover",
                "mouseenter",
                "mousedown",
                "mousemove",
                "mouseup",
                "mousecancel",
                "mouseout",
                "mouseleave",
                "touchover",
                "touchenter",
                "touchdown",
                "touchmove",
                "touchup",
                "touchcancel",
                "touchout",
                "touchleave"
            ];
            MultiStyleText = /** @class */ (function (_super) {
                __extends(MultiStyleText, _super);
                function MultiStyleText(text, styles) {
                    var _this = _super.call(this, text) || this;
                    _this.styles = styles;
                    INTERACTION_EVENTS.forEach(function (event) {
                        _this.on(event, function (e) { return _this.handleInteraction(e); });
                    });
                    return _this;
                }
                MultiStyleText.prototype.handleInteraction = function (e) {
                    var ev = e;
                    var localPoint = e.data.getLocalPosition(this);
                    var targetTag = this.hitboxes.reduce(function (prev, hitbox) { return prev !== undefined ? prev : (hitbox.hitbox.contains(localPoint.x, localPoint.y) ? hitbox : undefined); }, undefined);
                    ev.targetTag = targetTag === undefined ? undefined : targetTag.tag;
                };
                Object.defineProperty(MultiStyleText.prototype, "styles", {
                    set: function (styles) {
                        this.textStyles = {};
                        this.textStyles["default"] = this.assign({}, MultiStyleText.DEFAULT_TAG_STYLE);
                        for (var style in styles) {
                            if (style === "default") {
                                this.assign(this.textStyles["default"], styles[style]);
                            }
                            else {
                                this.textStyles[style] = this.assign({}, styles[style]);
                            }
                        }
                        this._style = new PIXI.TextStyle(this.textStyles["default"]);
                        this.dirty = true;
                    },
                    enumerable: true,
                    configurable: true
                });
                MultiStyleText.prototype.setTagStyle = function (tag, style) {
                    if (tag in this.textStyles) {
                        this.assign(this.textStyles[tag], style);
                    }
                    else {
                        this.textStyles[tag] = this.assign({}, style);
                    }
                    this._style = new PIXI.TextStyle(this.textStyles["default"]);
                    this.dirty = true;
                };
                MultiStyleText.prototype.deleteTagStyle = function (tag) {
                    if (tag === "default") {
                        this.textStyles["default"] = this.assign({}, MultiStyleText.DEFAULT_TAG_STYLE);
                    }
                    else {
                        delete this.textStyles[tag];
                    }
                    this._style = new PIXI.TextStyle(this.textStyles["default"]);
                    this.dirty = true;
                };
                MultiStyleText.prototype.getTagRegex = function (captureName, captureMatch) {
                    var tagAlternation = Object.keys(this.textStyles).join("|");
                    if (captureName) {
                        tagAlternation = "(" + tagAlternation + ")";
                    }
                    else {
                        tagAlternation = "(?:" + tagAlternation + ")";
                    }
                    var reStr = "<" + tagAlternation + "(?:\\s+[A-Za-z0-9_\\-]+=(?:\"(?:[^\"]+|\\\\\")*\"|'(?:[^']+|\\\\')*'))*\\s*>|</" + tagAlternation + "\\s*>";
                    if (captureMatch) {
                        reStr = "(" + reStr + ")";
                    }
                    return new RegExp(reStr, "g");
                };
                MultiStyleText.prototype.getPropertyRegex = function () {
                    return new RegExp("([A-Za-z0-9_\\-]+)=(?:\"((?:[^\"]+|\\\\\")*)\"|'((?:[^']+|\\\\')*)')", "g");
                };
                MultiStyleText.prototype._getTextDataPerLine = function (lines) {
                    var outputTextData = [];
                    var re = this.getTagRegex(true, false);
                    var styleStack = [this.assign({}, this.textStyles["default"])];
                    var tagStack = [{ name: "default", properties: {} }];
                    // determine the group of word for each line
                    for (var i = 0; i < lines.length; i++) {
                        var lineTextData = [];
                        // find tags inside the string
                        var matches = [];
                        var matchArray = void 0;
                        while (matchArray = re.exec(lines[i])) {
                            matches.push(matchArray);
                        }
                        // if there is no match, we still need to add the line with the default style
                        if (matches.length === 0) {
                            lineTextData.push(this.createTextData(lines[i], styleStack[styleStack.length - 1], tagStack[tagStack.length - 1]));
                        }
                        else {
                            // We got a match! add the text with the needed style
                            var currentSearchIdx = 0;
                            for (var j = 0; j < matches.length; j++) {
                                // if index > 0, it means we have characters before the match,
                                // so we need to add it with the default style
                                if (matches[j].index > currentSearchIdx) {
                                    lineTextData.push(this.createTextData(lines[i].substring(currentSearchIdx, matches[j].index), styleStack[styleStack.length - 1], tagStack[tagStack.length - 1]));
                                }
                                if (matches[j][0][1] === "/") {
                                    if (styleStack.length > 1) {
                                        styleStack.pop();
                                        tagStack.pop();
                                    }
                                }
                                else {
                                    styleStack.push(this.assign({}, styleStack[styleStack.length - 1], this.textStyles[matches[j][1]]));
                                    var properties = {};
                                    var propertyRegex = this.getPropertyRegex();
                                    var propertyMatch = void 0;
                                    while (propertyMatch = propertyRegex.exec(matches[j][0])) {
                                        properties[propertyMatch[1]] = propertyMatch[2] || propertyMatch[3];
                                    }
                                    tagStack.push({ name: matches[j][1], properties: properties });
                                }
                                // update the current search index
                                currentSearchIdx = matches[j].index + matches[j][0].length;
                            }
                            // is there any character left?
                            if (currentSearchIdx < lines[i].length) {
                                lineTextData.push(this.createTextData(lines[i].substring(currentSearchIdx), styleStack[styleStack.length - 1], tagStack[tagStack.length - 1]));
                            }
                        }
                        outputTextData.push(lineTextData);
                    }
                    return outputTextData;
                };
                MultiStyleText.prototype.getFontString = function (style) {
                    return new PIXI.TextStyle(style).toFontString();
                };
                MultiStyleText.prototype.createTextData = function (text, style, tag) {
                    return {
                        text: text,
                        style: style,
                        width: 0,
                        height: 0,
                        fontProperties: undefined,
                        tag: tag
                    };
                };
                MultiStyleText.prototype.getDropShadowPadding = function () {
                    var _this = this;
                    var maxDistance = 0;
                    var maxBlur = 0;
                    Object.keys(this.textStyles).forEach(function (styleKey) {
                        var _a = _this.textStyles[styleKey], dropShadowDistance = _a.dropShadowDistance, dropShadowBlur = _a.dropShadowBlur;
                        maxDistance = Math.max(maxDistance, dropShadowDistance || 0);
                        maxBlur = Math.max(maxBlur, dropShadowBlur || 0);
                    });
                    return maxDistance + maxBlur;
                };
                MultiStyleText.prototype.updateText = function () {
                    var _this = this;
                    if (!this.dirty) {
                        return;
                    }
                    this.hitboxes = [];
                    this.texture.baseTexture.resolution = this.resolution;
                    var textStyles = this.textStyles;
                    var outputText = this.text;
                    if (this._style.wordWrap) {
                        outputText = this.wordWrap(this.text);
                    }
                    // split text into lines
                    var lines = outputText.split(/(?:\r\n|\r|\n)/);
                    // get the text data with specific styles
                    var outputTextData = this._getTextDataPerLine(lines);
                    // calculate text width and height
                    var lineWidths = [];
                    var lineYMins = [];
                    var lineYMaxs = [];
                    var baselines = [];
                    var maxLineWidth = 0;
                    for (var i = 0; i < lines.length; i++) {
                        var lineWidth = 0;
                        var lineYMin = 0;
                        var lineYMax = 0;
                        var baseline = 0;
                        for (var j = 0; j < outputTextData[i].length; j++) {
                            var sty = outputTextData[i][j].style;
                            this.context.font = this.getFontString(sty);
                            // save the width
                            outputTextData[i][j].width = this.context.measureText(outputTextData[i][j].text).width;
                            if (outputTextData[i][j].text.length === 0) {
                                outputTextData[i][j].width += (outputTextData[i][j].text.length - 1) * sty.letterSpacing;
                                if (j > 0) {
                                    lineWidth += sty.letterSpacing / 2; // spacing before first character
                                }
                                if (j < outputTextData[i].length - 1) {
                                    lineWidth += sty.letterSpacing / 2; // spacing after last character
                                }
                            }
                            lineWidth += outputTextData[i][j].width;
                            // save the font properties
                            outputTextData[i][j].fontProperties = PIXI.TextMetrics.measureFont(this.context.font);
                            // save the height
                            outputTextData[i][j].height =
                                outputTextData[i][j].fontProperties.fontSize + outputTextData[i][j].style.strokeThickness;
                            if (typeof sty.valign === "number") {
                                lineYMin = Math.min(lineYMin, sty.valign - outputTextData[i][j].fontProperties.descent);
                                lineYMax = Math.max(lineYMax, sty.valign + outputTextData[i][j].fontProperties.ascent);
                            }
                            else {
                                lineYMin = Math.min(lineYMin, -outputTextData[i][j].fontProperties.descent);
                                lineYMax = Math.max(lineYMax, outputTextData[i][j].fontProperties.ascent);
                            }
                        }
                        lineWidths[i] = lineWidth;
                        lineYMins[i] = lineYMin;
                        lineYMaxs[i] = lineYMax;
                        maxLineWidth = Math.max(maxLineWidth, lineWidth);
                    }
                    // transform styles in array
                    var stylesArray = Object.keys(textStyles).map(function (key) { return textStyles[key]; });
                    var maxStrokeThickness = stylesArray.reduce(function (prev, cur) { return Math.max(prev, cur.strokeThickness || 0); }, 0);
                    var dropShadowPadding = this.getDropShadowPadding();
                    var totalHeight = lineYMaxs.reduce(function (prev, cur) { return prev + cur; }, 0) - lineYMins.reduce(function (prev, cur) { return prev + cur; }, 0);
                    // define the right width and height
                    var width = maxLineWidth + maxStrokeThickness + 2 * dropShadowPadding;
                    var height = totalHeight + 2 * dropShadowPadding;
                    this.canvas.width = (width + this.context.lineWidth) * this.resolution;
                    this.canvas.height = height * this.resolution;
                    this.context.scale(this.resolution, this.resolution);
                    this.context.textBaseline = "alphabetic";
                    this.context.lineJoin = "round";
                    var basePositionY = dropShadowPadding;
                    var drawingData = [];
                    // Compute the drawing data
                    for (var i = 0; i < outputTextData.length; i++) {
                        var line = outputTextData[i];
                        var linePositionX = void 0;
                        switch (this._style.align) {
                            case "left":
                                linePositionX = dropShadowPadding;
                                break;
                            case "center":
                                linePositionX = dropShadowPadding + (maxLineWidth - lineWidths[i]) / 2;
                                break;
                            case "right":
                                linePositionX = dropShadowPadding + maxLineWidth - lineWidths[i];
                                break;
                        }
                        for (var j = 0; j < line.length; j++) {
                            var _a = line[j], style = _a.style, text = _a.text, fontProperties = _a.fontProperties, width_1 = _a.width, height_1 = _a.height, tag = _a.tag;
                            linePositionX += maxStrokeThickness / 2;
                            var linePositionY = maxStrokeThickness / 2 + basePositionY + fontProperties.ascent;
                            switch (style.valign) {
                                case "top":
                                    // no need to do anything
                                    break;
                                case "baseline":
                                    linePositionY += lineYMaxs[i] - fontProperties.ascent;
                                    break;
                                case "middle":
                                    linePositionY += (lineYMaxs[i] - lineYMins[i] - fontProperties.ascent - fontProperties.descent) / 2;
                                    break;
                                case "bottom":
                                    linePositionY += lineYMaxs[i] - lineYMins[i] - fontProperties.ascent - fontProperties.descent;
                                    break;
                                default:
                                    // A number - offset from baseline, positive is higher
                                    linePositionY += lineYMaxs[i] - fontProperties.ascent - style.valign;
                                    break;
                            }
                            if (style.letterSpacing === 0) {
                                drawingData.push({
                                    text: text,
                                    style: style,
                                    x: linePositionX,
                                    y: linePositionY,
                                    width: width_1,
                                    ascent: fontProperties.ascent,
                                    descent: fontProperties.descent,
                                    tag: tag
                                });
                                linePositionX += line[j].width;
                            }
                            else {
                                this.context.font = this.getFontString(line[j].style);
                                for (var k = 0; k < text.length; k++) {
                                    if (k > 0 || j > 0) {
                                        linePositionX += style.letterSpacing / 2;
                                    }
                                    drawingData.push({
                                        text: text.charAt(k),
                                        style: style,
                                        x: linePositionX,
                                        y: linePositionY,
                                        width: width_1,
                                        ascent: fontProperties.ascent,
                                        descent: fontProperties.descent,
                                        tag: tag
                                    });
                                    linePositionX += this.context.measureText(text.charAt(k)).width;
                                    if (k < text.length - 1 || j < line.length - 1) {
                                        linePositionX += style.letterSpacing / 2;
                                    }
                                }
                            }
                            linePositionX -= maxStrokeThickness / 2;
                        }
                        basePositionY += lineYMaxs[i] - lineYMins[i];
                    }
                    this.context.save();
                    // First pass: draw the shadows only
                    drawingData.forEach(function (_a) {
                        var style = _a.style, text = _a.text, x = _a.x, y = _a.y;
                        if (!style.dropShadow) {
                            return; // This text doesn't have a shadow
                        }
                        _this.context.font = _this.getFontString(style);
                        var dropFillStyle = style.dropShadowColor;
                        if (typeof dropFillStyle === "number") {
                            dropFillStyle = PIXI.utils.hex2string(dropFillStyle);
                        }
                        _this.context.shadowColor = dropFillStyle;
                        _this.context.shadowBlur = style.dropShadowBlur;
                        _this.context.shadowOffsetX = Math.cos(style.dropShadowAngle) * style.dropShadowDistance * _this.resolution;
                        _this.context.shadowOffsetY = Math.sin(style.dropShadowAngle) * style.dropShadowDistance * _this.resolution;
                        _this.context.fillText(text, x, y);
                    });
                    this.context.restore();
                    // Second pass: draw strokes and fills
                    drawingData.forEach(function (_a) {
                        var style = _a.style, text = _a.text, x = _a.x, y = _a.y, width = _a.width, ascent = _a.ascent, descent = _a.descent, tag = _a.tag;
                        _this.context.font = _this.getFontString(style);
                        var strokeStyle = style.stroke;
                        if (typeof strokeStyle === "number") {
                            strokeStyle = PIXI.utils.hex2string(strokeStyle);
                        }
                        _this.context.strokeStyle = strokeStyle;
                        _this.context.lineWidth = style.strokeThickness;
                        // set canvas text styles
                        var fillStyle = style.fill;
                        if (typeof fillStyle === "number") {
                            fillStyle = PIXI.utils.hex2string(fillStyle);
                        }
                        else if (Array.isArray(fillStyle)) {
                            for (var i = 0; i < fillStyle.length; i++) {
                                var fill = fillStyle[i];
                                if (typeof fill === "number") {
                                    fillStyle[i] = PIXI.utils.hex2string(fill);
                                }
                            }
                        }
                        _this.context.fillStyle = _this._generateFillStyle(new PIXI.TextStyle(style), [text]);
                        // Typecast required for proper typechecking
                        if (style.stroke && style.strokeThickness) {
                            _this.context.strokeText(text, x, y);
                        }
                        if (style.fill) {
                            _this.context.fillText(text, x, y);
                        }
                        var offset = -_this._style.padding - _this.getDropShadowPadding();
                        _this.hitboxes.push({
                            tag: tag,
                            hitbox: new PIXI.Rectangle(x + offset, y - ascent + offset, width, ascent + descent)
                        });
                        var debugSpan = style.debug === undefined
                            ? MultiStyleText.debugOptions.spans.enabled
                            : style.debug;
                        if (debugSpan) {
                            _this.context.lineWidth = 1;
                            if (MultiStyleText.debugOptions.spans.bounding) {
                                _this.context.fillStyle = MultiStyleText.debugOptions.spans.bounding;
                                _this.context.strokeStyle = MultiStyleText.debugOptions.spans.bounding;
                                _this.context.beginPath();
                                _this.context.rect(x, y - ascent, width, ascent + descent);
                                _this.context.fill();
                                _this.context.stroke();
                                _this.context.stroke(); // yes, twice
                            }
                            if (MultiStyleText.debugOptions.spans.baseline) {
                                _this.context.strokeStyle = MultiStyleText.debugOptions.spans.baseline;
                                _this.context.beginPath();
                                _this.context.moveTo(x, y);
                                _this.context.lineTo(x + width, y);
                                _this.context.closePath();
                                _this.context.stroke();
                            }
                            if (MultiStyleText.debugOptions.spans.top) {
                                _this.context.strokeStyle = MultiStyleText.debugOptions.spans.top;
                                _this.context.beginPath();
                                _this.context.moveTo(x, y - ascent);
                                _this.context.lineTo(x + width, y - ascent);
                                _this.context.closePath();
                                _this.context.stroke();
                            }
                            if (MultiStyleText.debugOptions.spans.bottom) {
                                _this.context.strokeStyle = MultiStyleText.debugOptions.spans.bottom;
                                _this.context.beginPath();
                                _this.context.moveTo(x, y + descent);
                                _this.context.lineTo(x + width, y + descent);
                                _this.context.closePath();
                                _this.context.stroke();
                            }
                            if (MultiStyleText.debugOptions.spans.text) {
                                _this.context.fillStyle = "#ffffff";
                                _this.context.strokeStyle = "#000000";
                                _this.context.lineWidth = 2;
                                _this.context.font = "8px monospace";
                                _this.context.strokeText(tag.name, x, y - ascent + 8);
                                _this.context.fillText(tag.name, x, y - ascent + 8);
                                _this.context.strokeText(width.toFixed(2) + "x" + (ascent + descent).toFixed(2), x, y - ascent + 16);
                                _this.context.fillText(width.toFixed(2) + "x" + (ascent + descent).toFixed(2), x, y - ascent + 16);
                            }
                        }
                    });
                    if (MultiStyleText.debugOptions.objects.enabled) {
                        if (MultiStyleText.debugOptions.objects.bounding) {
                            this.context.fillStyle = MultiStyleText.debugOptions.objects.bounding;
                            this.context.beginPath();
                            this.context.rect(0, 0, width, height);
                            this.context.fill();
                        }
                        if (MultiStyleText.debugOptions.objects.text) {
                            this.context.fillStyle = "#ffffff";
                            this.context.strokeStyle = "#000000";
                            this.context.lineWidth = 2;
                            this.context.font = "8px monospace";
                            this.context.strokeText(width.toFixed(2) + "x" + height.toFixed(2), 0, 8, width);
                            this.context.fillText(width.toFixed(2) + "x" + height.toFixed(2), 0, 8, width);
                        }
                    }
                    this.updateTexture();
                };
                MultiStyleText.prototype.wordWrap = function (text) {
                    // Greedy wrapping algorithm that will wrap words as the line grows longer than its horizontal bounds.
                    var result = "";
                    var re = this.getTagRegex(true, true);
                    var lines = text.split("\n");
                    var wordWrapWidth = this._style.wordWrapWidth;
                    var styleStack = [this.assign({}, this.textStyles["default"])];
                    this.context.font = this.getFontString(this.textStyles["default"]);
                    for (var i = 0; i < lines.length; i++) {
                        var spaceLeft = wordWrapWidth;
                        var tagSplit = lines[i].split(re);
                        var firstWordOfLine = true;
                        for (var j = 0; j < tagSplit.length; j++) {
                            if (re.test(tagSplit[j])) {
                                result += tagSplit[j];
                                if (tagSplit[j][1] === "/") {
                                    j += 2;
                                    styleStack.pop();
                                }
                                else {
                                    j++;
                                    styleStack.push(this.assign({}, styleStack[styleStack.length - 1], this.textStyles[tagSplit[j]]));
                                    j++;
                                }
                                this.context.font = this.getFontString(styleStack[styleStack.length - 1]);
                            }
                            else {
                                var words = tagSplit[j].split(" ");
                                for (var k = 0; k < words.length; k++) {
                                    var wordWidth = this.context.measureText(words[k]).width;
                                    if (this._style.breakWords && wordWidth > spaceLeft) {
                                        // Part should be split in the middle
                                        var characters = words[k].split('');
                                        if (k > 0) {
                                            result += " ";
                                            spaceLeft -= this.context.measureText(" ").width;
                                        }
                                        for (var c = 0; c < characters.length; c++) {
                                            var characterWidth = this.context.measureText(characters[c]).width;
                                            if (characterWidth > spaceLeft) {
                                                result += "\n" + characters[c];
                                                spaceLeft = wordWrapWidth - characterWidth;
                                            }
                                            else {
                                                result += characters[c];
                                                spaceLeft -= characterWidth;
                                            }
                                        }
                                    }
                                    else if (this._style.breakWords) {
                                        result += words[k];
                                        spaceLeft -= wordWidth;
                                    }
                                    else {
                                        var paddedWordWidth = wordWidth + (k > 0 ? this.context.measureText(" ").width : 0);
                                        if (paddedWordWidth > spaceLeft) {
                                            // Skip printing the newline if it's the first word of the line that is
                                            // greater than the word wrap width.
                                            if (!firstWordOfLine) {
                                                result += "\n";
                                            }
                                            result += words[k];
                                            spaceLeft = wordWrapWidth - wordWidth;
                                        }
                                        else {
                                            spaceLeft -= paddedWordWidth;
                                            if (k > 0) {
                                                result += " ";
                                            }
                                            result += words[k];
                                        }
                                    }
                                    firstWordOfLine = false;
                                }
                            }
                        }
                        if (i < lines.length - 1) {
                            result += '\n';
                        }
                    }
                    return result;
                };
                MultiStyleText.prototype.updateTexture = function () {
                    var texture = this._texture;
                    var dropShadowPadding = this.getDropShadowPadding();
                    texture.baseTexture.hasLoaded = true;
                    texture.baseTexture.resolution = this.resolution;
                    texture.baseTexture.realWidth = this.canvas.width;
                    texture.baseTexture.realHeight = this.canvas.height;
                    texture.baseTexture.width = this.canvas.width / this.resolution;
                    texture.baseTexture.height = this.canvas.height / this.resolution;
                    texture.trim.width = texture.frame.width = this.canvas.width / this.resolution;
                    texture.trim.height = texture.frame.height = this.canvas.height / this.resolution;
                    texture.trim.x = -this._style.padding - dropShadowPadding;
                    texture.trim.y = -this._style.padding - dropShadowPadding;
                    texture.orig.width = texture.frame.width - (this._style.padding + dropShadowPadding) * 2;
                    texture.orig.height = texture.frame.height - (this._style.padding + dropShadowPadding) * 2;
                    // call sprite onTextureUpdate to update scale if _width or _height were set
                    this._onTextureUpdate();
                    texture.baseTexture.emit('update', texture.baseTexture);
                    this.dirty = false;
                };
                // Lazy fill for Object.assign
                MultiStyleText.prototype.assign = function (destination) {
                    var sources = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        sources[_i - 1] = arguments[_i];
                    }
                    for (var _a = 0, sources_1 = sources; _a < sources_1.length; _a++) {
                        var source = sources_1[_a];
                        for (var key in source) {
                            destination[key] = source[key];
                        }
                    }
                    return destination;
                };
                MultiStyleText.DEFAULT_TAG_STYLE = {
                    align: "left",
                    breakWords: false,
                    // debug intentionally not included
                    dropShadow: false,
                    dropShadowAngle: Math.PI / 6,
                    dropShadowBlur: 0,
                    dropShadowColor: "#000000",
                    dropShadowDistance: 5,
                    fill: "black",
                    fillGradientType: PIXI.TEXT_GRADIENT.LINEAR_VERTICAL,
                    fontFamily: "Arial",
                    fontSize: 26,
                    fontStyle: "normal",
                    fontVariant: "normal",
                    fontWeight: "normal",
                    letterSpacing: 0,
                    lineHeight: 0,
                    lineJoin: "miter",
                    miterLimit: 10,
                    padding: 0,
                    stroke: "black",
                    strokeThickness: 0,
                    textBaseline: "alphabetic",
                    valign: "baseline",
                    wordWrap: false,
                    wordWrapWidth: 100
                };
                MultiStyleText.debugOptions = {
                    spans: {
                        enabled: false,
                        baseline: "#44BB44",
                        top: "#BB4444",
                        bottom: "#4444BB",
                        bounding: "rgba(255, 255, 255, 0.1)",
                        text: true
                    },
                    objects: {
                        enabled: false,
                        bounding: "rgba(255, 255, 255, 0.05)",
                        text: true
                    }
                };
                return MultiStyleText;
            }(PIXI.Text));
            exports_1("default", MultiStyleText);
        }
    };
});
System.register("irka/utils", ["pixi.js"], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    function makeTextBox(text) {
        var container = new pixi_js_1.Container();
        var rectangle = new pixi_js_1.Graphics();
        // Draw shadow
        rectangle.lineStyle(0, 0x0AB4B4);
        rectangle.beginFill(0x0AB4B4);
        rectangle.drawRect(4, 4, text.width + 4, text.height + 4);
        rectangle.endFill();
        // Draw box
        rectangle.lineStyle(4, 0xffffff);
        rectangle.beginFill(0xffffff);
        rectangle.drawRect(0, 0, text.width, text.height);
        rectangle.endFill();
        container.addChild(rectangle);
        container.addChild(text);
        return container;
    }
    exports_2("makeTextBox", makeTextBox);
    var pixi_js_1, colorMatrixDark, darkFilter, defaultTextStyle, smallTextStyle, centeredText, smallCenteredText, mstStyles;
    return {
        setters: [
            function (pixi_js_1_1) {
                pixi_js_1 = pixi_js_1_1;
            }
        ],
        execute: function () {
            colorMatrixDark = [
                1.1285582396593525, -0.3967382283601348, -0.03992559172921793, 0, 0,
                -0.16404339962244616, 1.0835251566291304, -0.05498805115633132, -0.3, -0.1,
                -0.16786010706155763, -0.5603416277695248, 1.6014850761964943, -0.3, 0.1,
                0, 0, 0, 1, 0
            ];
            exports_2("darkFilter", darkFilter = new pixi_js_1.filters.ColorMatrixFilter());
            darkFilter.matrix = colorMatrixDark;
            exports_2("defaultTextStyle", defaultTextStyle = {
                fontFamily: 'DPix',
                fontSize: '14px',
            });
            exports_2("smallTextStyle", smallTextStyle = {
                fontSize: '10px',
            });
            exports_2("centeredText", centeredText = {
                align: 'center',
            });
            exports_2("smallCenteredText", smallCenteredText = __assign({}, defaultTextStyle, smallTextStyle, centeredText));
            exports_2("mstStyles", mstStyles = {
                'default': defaultTextStyle,
                'sub': {
                    fontSize: '10px',
                    textBaseline: 'bottom',
                    valign: -4
                },
                'md': {
                    fontSize: '13px',
                },
                'sm': {
                    fontSize: '9px',
                },
                'center': {
                    align: 'center',
                }
            });
        }
    };
});
System.register("irka/states/menu", ["pixi.js", "irka/utils"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    function makeQuizButton() {
        var quiz = new pixi_js_2.Container();
        var quizArea = new pixi_js_2.Sprite(pixi_js_2.utils.TextureCache['menu/mm_02.png']);
        var text = utils_1.makeTextBox(new pixi_js_2.Text('Начать\nхимический\nтест', utils_1.smallCenteredText));
        text.visible = false;
        quiz.addChild(quizArea);
        quiz.buttonMode = true;
        quiz.interactive = true;
        text.x = quizArea.width / 2 - text.width / 2 - 25;
        text.y = quizArea.height / 2 - text.height / 2;
        quiz.addChild(text);
        var onPointerOver = function () {
            quizArea.filters = [utils_1.darkFilter];
            text.visible = true;
        };
        var onPointerOut = function () {
            quizArea.filters = [];
            text.visible = false;
        };
        var onPointerDown = function () {
            quizArea.filters = [];
            text.visible = false;
            quiz.emit('startQuiz');
        };
        quiz.on('pointerover', onPointerOver);
        quiz.on('pointerout', onPointerOut);
        quiz.on('pointerdown', onPointerDown);
        return quiz;
    }
    function makeMenu(app) {
        var menuContainer = new pixi_js_2.Container();
        var bgTexture = pixi_js_2.utils.TextureCache['menu/mm_bgr.png'];
        var bg = new pixi_js_2.Sprite(bgTexture);
        bg.x = 0;
        bg.y = 0;
        var quiz = makeQuizButton();
        quiz.x = 256;
        quiz.y = 256;
        quiz.on('startQuiz', function () {
            app.stage.emit('startQuiz');
        });
        menuContainer.addChild(bg);
        menuContainer.addChild(quiz);
        return menuContainer;
    }
    exports_3("makeMenu", makeMenu);
    var pixi_js_2, utils_1;
    return {
        setters: [
            function (pixi_js_2_1) {
                pixi_js_2 = pixi_js_2_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("irka/questions", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var Q1, Q2, Q3, QUESTIONS;
    return {
        setters: [],
        execute: function () {
            Q1 = {
                texts: [
                    "<sm>\u0412\u044B\u0434\u0430\u043D\u043D\u0443\u044E \u0441\u043E\u043B\u044C \u2014 \u0431\u0435\u043B\u044B\u0439,\n\u043D\u0435\u0440\u0430\u0441\u0442\u0432\u043E\u0440\u0438\u043C\u044B\u0439 \u0432 \u0432\u043E\u0434\u0435 \u043F\u043E\u0440\u043E\u0448\u043E\u043A \u0441\n\u0437\u0435\u043B\u0435\u043D\u043E\u0432\u0430\u0442\u044B\u043C \u043E\u0442\u0442\u0435\u043D\u043A\u043E\u043C \u2014 \u043F\u043E\u0434\u0432\u0435\u0440\u0433\u0430\u0435\u0442\u0441\u044F \n\u0442\u0435\u0440\u043C\u0438\u0447\u0435\u0441\u043A\u043E\u043C\u0443 \u0440\u0430\u0437\u043B\u043E\u0436\u0435\u043D\u0438\u044E, \u0432 \n\u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0435 \u043A\u043E\u0442\u043E\u0440\u043E\u0433\u043E \u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043B\u043E\u0441\u044C \n\u0434\u0432\u0430 \u043E\u043A\u0441\u0438\u0434\u0430. \u041E\u0434\u0438\u043D \u0438\u0437 \u043D\u0438\u0445\u00A0\u2014 \u0433\u0430\u0437 \n\u0431\u0435\u0437 \u0446\u0432\u0435\u0442\u0430 \u0438 \u0437\u0430\u043F\u0430\u0445\u0430, \u0438\u0433\u0440\u0430\u044E\u0449\u0438\u0439\n\u0432\u0430\u0436\u043D\u0443\u044E \u0440\u043E\u043B\u044C \u0432 \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u0435 \u0444\u043E\u0442\u043E\u0441\u0438\u043D\u0442\u0435\u0437\u0430. \n\u0414\u0440\u0443\u0433\u043E\u0439 \u2014 \u043F\u043E\u0440\u043E\u0448\u043E\u043A \u0447\u0451\u0440\u043D\u043E\u0433\u043E \u0446\u0432\u0435\u0442\u0430.</sm>",
                    "<sm>\u041A \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043D\u043E\u043C\u0443 \u043E\u043A\u0441\u0438\u0434\u0443 \n\u0447\u0451\u0440\u043D\u043E\u0433\u043E \u0446\u0432\u0435\u0442\u0430 \u0434\u043E\u0431\u0430\u0432\u0438\u043B\u0438 \u0440\u0430\u0437\u0431\u0430\u0432\u043B\u0435\u043D\u043D\u0443\u044E\n\u0441\u0435\u0440\u043D\u0443\u044E \u043A\u0438\u0441\u043B\u043E\u0442\u0443, \u0438 \u043F\u043E\u0441\u043B\u0435 \u043D\u0430\u0433\u0440\u0435\u0432\u0430\u043D\u0438\u044F\n\u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043B\u0441\u044F \u043F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u044B\u0439 \u0440\u0430\u0441\u0442\u0432\u043E\u0440 \n\u0433\u043E\u043B\u0443\u0431\u043E\u0433\u043E \u0446\u0432\u0435\u0442\u0430.</sm>",
                    "<sm>\u041F\u0440\u0438 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0438 \u0432 \u044D\u0442\u043E\u0442 \u0440\u0430\u0441\u0442\u0432\u043E\u0440 \n\u043B\u0435\u0442\u0443\u0447\u0435\u0439 \u0441\u043E\u043B\u0438 \u0430\u043C\u043C\u043E\u043D\u0438\u044F \u0432\u044B\u0434\u0435\u043B\u0438\u043B\u0441\u044F \n\u043E\u0441\u0430\u0434\u043E\u043A \u0447\u0451\u0440\u043D\u043E\u0433\u043E \u0446\u0432\u0435\u0442\u0430 \u0438 \u0440\u0430\u0441\u0442\u0432\u043E\u0440\u0451\u043D\u043D\u0430\u044F \n\u0441\u043E\u043B\u044C, \u043F\u0440\u0438\u043C\u0435\u043D\u044F\u044E\u0449\u0430\u044F\u0441\u044F \u043A\u0430\u043A \n\u0430\u0437\u043E\u0442\u043D\u043E-\u0441\u0435\u0440\u043D\u043E\u0435 \u0443\u0434\u043E\u0431\u0440\u0435\u043D\u0438\u0435.</sm>",
                    "<md>\u0410 \u0442\u0435\u043F\u0435\u0440\u044C \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0432\u044B\u0431\u0440\u0430\u0442\u044C\n\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E\u0435 \u0443\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u0435 \u0434\u043B\u044F \n\u043F\u0435\u0440\u0432\u043E\u0439 \u0440\u0435\u0430\u043A\u0446\u0438\u0438.</md>"
                ],
                answers: [
                    "<md>CuSO<sub>4</sub> + (NH<sub>4</sub>)<sub>2</sub>S \u2192 CuS\u2193 + (NH<sub>4</sub>)<sub>2</sub>SO<sub>4</sub></md>",
                    "Ni(NO<sub>3</sub>)<sub>2</sub> \u2192 Ni(NO<sub>2</sub>)<sub>2</sub> + O<sub>2</sub>\u2191",
                    "CuCO<sub>3</sub> \u2192 CO<sub>2</sub>\u2191 + CuO",
                    "2Cu(NO<sub>3</sub>)<sub>2</sub> \u2192 2CuO + 4NO<sub>2</sub> + O<sub>2</sub>\u2191",
                ],
                rightAnswer: 2,
            };
            Q2 = {
                texts: [
                    "<md>\u0425\u043E\u0440\u043E\u0448\u043E.\n\u0427\u0442\u043E \u043D\u0430\u0441\u0447\u0451\u0442 \u0432\u044B\u0431\u043E\u0440\u0430 \n\u0432\u0435\u0440\u043D\u043E\u0433\u043E \u0443\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u044F \u0434\u043B\u044F\n\u0440\u0435\u0430\u043A\u0446\u0438\u0438 \u043D\u043E\u043C\u0435\u0440 \u0434\u0432\u0430?</md>",
                    "<sm>\u0412\u044B\u0434\u0430\u043D\u043D\u0443\u044E \u0441\u043E\u043B\u044C \u2014 \u0431\u0435\u043B\u044B\u0439,\n\u043D\u0435\u0440\u0430\u0441\u0442\u0432\u043E\u0440\u0438\u043C\u044B\u0439 \u0432 \u0432\u043E\u0434\u0435 \u043F\u043E\u0440\u043E\u0448\u043E\u043A \u0441\n\u0437\u0435\u043B\u0435\u043D\u043E\u0432\u0430\u0442\u044B\u043C \u043E\u0442\u0442\u0435\u043D\u043A\u043E\u043C \u2014 \u043F\u043E\u0434\u0432\u0435\u0440\u0433\u0430\u0435\u0442\u0441\u044F\n\u0442\u0435\u0440\u043C\u0438\u0447\u0435\u0441\u043A\u043E\u043C\u0443 \u0440\u0430\u0437\u043B\u043E\u0436\u0435\u043D\u0438\u044E, \u0432\n\u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0435 \u043A\u043E\u0442\u043E\u0440\u043E\u0433\u043E \u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043B\u043E\u0441\u044C\n\u0434\u0432\u0430 \u043E\u043A\u0441\u0438\u0434\u0430. \u041E\u0434\u0438\u043D \u0438\u0437 \u043D\u0438\u0445\u00A0\u2014 \u0433\u0430\u0437\n\u0431\u0435\u0437 \u0446\u0432\u0435\u0442\u0430 \u0438 \u0437\u0430\u043F\u0430\u0445\u0430, \u0438\u0433\u0440\u0430\u044E\u0449\u0438\u0439\n\u0432\u0430\u0436\u043D\u0443\u044E \u0440\u043E\u043B\u044C \u0432 \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u0435 \u0444\u043E\u0442\u043E\u0441\u0438\u043D\u0442\u0435\u0437\u0430.\n\u0414\u0440\u0443\u0433\u043E\u0439 \u2014 \u043F\u043E\u0440\u043E\u0448\u043E\u043A \u0447\u0451\u0440\u043D\u043E\u0433\u043E \u0446\u0432\u0435\u0442\u0430.</sm>",
                    "<sm>\u041A \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043D\u043E\u043C\u0443 \u043E\u043A\u0441\u0438\u0434\u0443 \n\u0447\u0451\u0440\u043D\u043E\u0433\u043E \u0446\u0432\u0435\u0442\u0430 \u0434\u043E\u0431\u0430\u0432\u0438\u043B\u0438 \u0440\u0430\u0437\u0431\u0430\u0432\u043B\u0435\u043D\u043D\u0443\u044E\n\u0441\u0435\u0440\u043D\u0443\u044E \u043A\u0438\u0441\u043B\u043E\u0442\u0443, \u0438 \u043F\u043E\u0441\u043B\u0435 \u043D\u0430\u0433\u0440\u0435\u0432\u0430\u043D\u0438\u044F\n \u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043B\u0441\u044F \u043F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u044B\u0439 \u0440\u0430\u0441\u0442\u0432\u043E\u0440 \n \u0433\u043E\u043B\u0443\u0431\u043E\u0433\u043E \u0446\u0432\u0435\u0442\u0430.</sm>",
                    "<sm>\u041F\u0440\u0438 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0438 \u0432 \u044D\u0442\u043E\u0442 \u0440\u0430\u0441\u0442\u0432\u043E\u0440 \n\u043B\u0435\u0442\u0443\u0447\u0435\u0439 \u0441\u043E\u043B\u0438 \u0430\u043C\u043C\u043E\u043D\u0438\u044F \u0432\u044B\u0434\u0435\u043B\u0438\u043B\u0441\u044F \n\u043E\u0441\u0430\u0434\u043E\u043A \u0447\u0451\u0440\u043D\u043E\u0433\u043E \u0446\u0432\u0435\u0442\u0430 \u0438 \u0440\u0430\u0441\u0442\u0432\u043E\u0440\u0451\u043D\u043D\u0430\u044F \n\u0441\u043E\u043B\u044C, \u043F\u0440\u0438\u043C\u0435\u043D\u044F\u044E\u0449\u0430\u044F\u0441\u044F \u043A\u0430\u043A \n\u0430\u0437\u043E\u0442\u043D\u043E-\u0441\u0435\u0440\u043D\u043E\u0435 \u0443\u0434\u043E\u0431\u0440\u0435\u043D\u0438\u0435.</sm>",
                ],
                answers: [
                    "CuO + H<sub>2</sub>SO<sub>4</sub> \u2192 CuSO<sub>4</sub> + H<sub>2</sub>O",
                    "Ni + 2H<sub>2</sub>SO<sub>4</sub> \u2192 NiSO<sub>4</sub> + SO<sub>2</sub> + 2H<sub>2</sub>O",
                    "2Cu + 4HCl + O<sub>2</sub> \u2192 2CuCl<sub>2</sub> + 2H<sub>2</sub>O",
                    "Cu(OH)<sub>2</sub> + 2NaOH \u2192 Na<sub>2</sub>[Cu(OH)<sub>4</sub>]",
                ],
                rightAnswer: 0,
            };
            Q3 = {
                texts: [
                    "<md>\u0422\u0430\u043A, \u0430 \u0442\u0435\u043F\u0435\u0440\u044C \u0434\u043B\u044F \n\u0442\u0440\u0435\u0442\u044C\u0435\u0439 \u0440\u0435\u0430\u043A\u0446\u0438\u0438!</md>",
                    "<sm>\u0412\u044B\u0434\u0430\u043D\u043D\u0443\u044E \u0441\u043E\u043B\u044C \u2014 \u0431\u0435\u043B\u044B\u0439,\n\u043D\u0435\u0440\u0430\u0441\u0442\u0432\u043E\u0440\u0438\u043C\u044B\u0439 \u0432 \u0432\u043E\u0434\u0435 \u043F\u043E\u0440\u043E\u0448\u043E\u043A \u0441\n\u0437\u0435\u043B\u0435\u043D\u043E\u0432\u0430\u0442\u044B\u043C \u043E\u0442\u0442\u0435\u043D\u043A\u043E\u043C \u2014 \u043F\u043E\u0434\u0432\u0435\u0440\u0433\u0430\u0435\u0442\u0441\u044F\n\u0442\u0435\u0440\u043C\u0438\u0447\u0435\u0441\u043A\u043E\u043C\u0443 \u0440\u0430\u0437\u043B\u043E\u0436\u0435\u043D\u0438\u044E, \u0432\n\u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0435 \u043A\u043E\u0442\u043E\u0440\u043E\u0433\u043E \u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043B\u043E\u0441\u044C\n\u0434\u0432\u0430 \u043E\u043A\u0441\u0438\u0434\u0430. \u041E\u0434\u0438\u043D \u0438\u0437 \u043D\u0438\u0445\u00A0\u2014 \u0433\u0430\u0437\n\u0431\u0435\u0437 \u0446\u0432\u0435\u0442\u0430 \u0438 \u0437\u0430\u043F\u0430\u0445\u0430, \u0438\u0433\u0440\u0430\u044E\u0449\u0438\u0439\n\u0432\u0430\u0436\u043D\u0443\u044E \u0440\u043E\u043B\u044C \u0432 \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u0435 \u0444\u043E\u0442\u043E\u0441\u0438\u043D\u0442\u0435\u0437\u0430.\n\u0414\u0440\u0443\u0433\u043E\u0439 \u2014 \u043F\u043E\u0440\u043E\u0448\u043E\u043A \u0447\u0451\u0440\u043D\u043E\u0433\u043E \u0446\u0432\u0435\u0442\u0430.</sm>",
                    "<sm>\u041A \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043D\u043E\u043C\u0443 \u043E\u043A\u0441\u0438\u0434\u0443 \n\u0447\u0451\u0440\u043D\u043E\u0433\u043E \u0446\u0432\u0435\u0442\u0430 \u0434\u043E\u0431\u0430\u0432\u0438\u043B\u0438 \u0440\u0430\u0437\u0431\u0430\u0432\u043B\u0435\u043D\u043D\u0443\u044E\n\u0441\u0435\u0440\u043D\u0443\u044E \u043A\u0438\u0441\u043B\u043E\u0442\u0443, \u0438 \u043F\u043E\u0441\u043B\u0435 \u043D\u0430\u0433\u0440\u0435\u0432\u0430\u043D\u0438\u044F\n \u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043B\u0441\u044F \u043F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u044B\u0439 \u0440\u0430\u0441\u0442\u0432\u043E\u0440 \n \u0433\u043E\u043B\u0443\u0431\u043E\u0433\u043E \u0446\u0432\u0435\u0442\u0430.</sm>",
                    "<sm>\u041F\u0440\u0438 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0438 \u0432 \u044D\u0442\u043E\u0442 \u0440\u0430\u0441\u0442\u0432\u043E\u0440 \n\u043B\u0435\u0442\u0443\u0447\u0435\u0439 \u0441\u043E\u043B\u0438 \u0430\u043C\u043C\u043E\u043D\u0438\u044F \u0432\u044B\u0434\u0435\u043B\u0438\u043B\u0441\u044F \n\u043E\u0441\u0430\u0434\u043E\u043A \u0447\u0451\u0440\u043D\u043E\u0433\u043E \u0446\u0432\u0435\u0442\u0430 \u0438 \u0440\u0430\u0441\u0442\u0432\u043E\u0440\u0451\u043D\u043D\u0430\u044F \n\u0441\u043E\u043B\u044C, \u043F\u0440\u0438\u043C\u0435\u043D\u044F\u044E\u0449\u0430\u044F\u0441\u044F \u043A\u0430\u043A \n\u0430\u0437\u043E\u0442\u043D\u043E-\u0441\u0435\u0440\u043D\u043E\u0435 \u0443\u0434\u043E\u0431\u0440\u0435\u043D\u0438\u0435.</sm>",
                ],
                answers: [
                    "CuSO<sub>4</sub> + BaCl<sub>2</sub> \u2192 CuCl<sub>2</sub> + BaSO<sub>4</sub>",
                    "CuSO<sub>4</sub> + Zn \u2192 Cu\u2193 + ZnSO<sub>4</sub>",
                    "CuO + H<sub>2</sub>SO<sub>4</sub> \u2192 CuSO<sub>4</sub> + H<sub>2</sub>O",
                    "CuSO<sub>4</sub> + (NH<sub>4</sub>)<sub>2</sub>S \u2192 CuS\u2193 +(NH<sub>4</sub>)<sub>2</sub>SO<sub>4</sub> ",
                ],
                rightAnswer: 3,
            };
            exports_4("QUESTIONS", QUESTIONS = [Q1, Q2, Q3]);
        }
    };
});
System.register("irka/states/quiz", ["pixi.js", "irka/multystyle-text", "irka/utils", "irka/questions"], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    function makeQuiz(app) {
        var quiz = new QuizUi(app);
        quiz.loadQuestions(questions_1.QUESTIONS);
        return quiz.container;
    }
    exports_5("makeQuiz", makeQuiz);
    var pixi_js_3, multystyle_text_1, utils_2, questions_1, W, H, P, RA, DA, UA, IrkaDialogBox, AnswerButton, QuizUi;
    return {
        setters: [
            function (pixi_js_3_1) {
                pixi_js_3 = pixi_js_3_1;
            },
            function (multystyle_text_1_1) {
                multystyle_text_1 = multystyle_text_1_1;
            },
            function (utils_2_1) {
                utils_2 = utils_2_1;
            },
            function (questions_1_1) {
                questions_1 = questions_1_1;
            }
        ],
        execute: function () {
            W = 352;
            H = 80;
            P = 5;
            RA = '→';
            DA = '↓';
            UA = '↑';
            IrkaDialogBox = /** @class */ (function () {
                function IrkaDialogBox(texts) {
                    if (texts === void 0) { texts = []; }
                    var _this = this;
                    this.texts = texts;
                    this.container = new pixi_js_3.Container();
                    var rect = new pixi_js_3.Graphics();
                    rect.beginFill(0xffffff);
                    rect.drawRect(0, 0, 250, 250);
                    rect.endFill();
                    this.container.addChild(rect);
                    this.currentText = new multystyle_text_1.default(texts[0], utils_2.mstStyles);
                    this.currentText.x = 5;
                    this.currentText.y = 5;
                    this.currentIdx = 0;
                    this.container.interactive = true;
                    this.container.buttonMode = true;
                    this.container.addChild(this.currentText);
                    this.container.on('pointerdown', function () { return _this.showNextMessage(); });
                }
                IrkaDialogBox.prototype.loadTexts = function (texts) {
                    this.texts = texts;
                    this.currentText.text = texts[0];
                    this.currentIdx = 0;
                };
                IrkaDialogBox.prototype.showText = function (text) {
                    this.currentText.text = text;
                };
                IrkaDialogBox.prototype.showNextMessage = function () {
                    this.currentIdx++;
                    if (this.currentIdx < this.texts.length) {
                        this.showText(this.texts[this.currentIdx]);
                    }
                    else {
                        this.retry();
                    }
                };
                IrkaDialogBox.prototype.retry = function () {
                    this.currentIdx = -1;
                    this.showNextMessage();
                };
                return IrkaDialogBox;
            }());
            AnswerButton = /** @class */ (function () {
                function AnswerButton(text) {
                    if (text === void 0) { text = ''; }
                    this.container = new pixi_js_3.Container();
                    this.msText = new multystyle_text_1.default('', utils_2.mstStyles);
                    this.initUi();
                    this.setText(text);
                }
                AnswerButton.prototype.setText = function (text) {
                    // console.log('set text')
                    this.msText.text = text;
                    this.msText.x = W / 2 - this.msText.width / 2;
                    this.msText.y = H / 2 - this.msText.height / 2;
                };
                AnswerButton.prototype.initUi = function () {
                    this.container.interactive = true;
                    this.container.buttonMode = true;
                    this.container.height = W;
                    this.container.width = H;
                    var defaultButton = new pixi_js_3.Graphics();
                    defaultButton.lineStyle(1, 0x0AB4B4);
                    defaultButton.beginFill(0xffffff);
                    defaultButton.drawRect(0, 0, W, H);
                    defaultButton.endFill();
                    var selectedButton = new pixi_js_3.Graphics();
                    selectedButton.lineStyle(1, 0x0AB4B4);
                    selectedButton.beginFill(0x54D1E4);
                    selectedButton.drawRect(0, 0, W, H);
                    selectedButton.endFill();
                    selectedButton.visible = false;
                    this.container.addChild(defaultButton);
                    this.container.addChild(selectedButton);
                    this.container.addChild(this.msText);
                    this.container.on('pointerover', function () {
                        defaultButton.visible = false;
                        selectedButton.visible = true;
                    });
                    this.container.on('pointerout', function () {
                        selectedButton.visible = false;
                        defaultButton.visible = true;
                    });
                };
                return AnswerButton;
            }());
            // function makeAnswerButtons(texts: string[]): Container {
            //     function makeButton(text: string): Container {
            //         const btn = new Container();
            //         btn.interactive = true;
            //         btn.buttonMode = true;
            //         btn.height = W;
            //         btn.width = H;
            //
            //         const defaultButton = new Graphics();
            //         defaultButton.lineStyle(1, 0x0AB4B4);
            //         defaultButton.beginFill(0xffffff);
            //         defaultButton.drawRect(0, 0, W, H);
            //         defaultButton.endFill();
            //
            //         const selectedButton = new Graphics();
            //         selectedButton.lineStyle(1, 0x0AB4B4);
            //         selectedButton.beginFill(0x54D1E4);
            //         selectedButton.drawRect(0, 0, W, H);
            //         selectedButton.endFill();
            //         selectedButton.visible = false;
            //
            //         const msText = new MultiStyleText(text, mstStyles);
            //         msText.x = W / 2 - msText.width / 2;
            //         msText.y = H / 2 - msText.height / 2;
            //
            //         btn.addChild(defaultButton);
            //         btn.addChild(selectedButton);
            //         btn.addChild(msText);
            //
            //         btn.on('pointerover', () => {
            //             defaultButton.visible = false;
            //             selectedButton.visible = true;
            //         });
            //         btn.on('pointerout', () => {
            //             selectedButton.visible = false;
            //             defaultButton.visible = true;
            //         });
            //
            //         return btn;
            //     }
            //
            //     const buttons = new Container();
            //
            //     const bg = new Graphics();
            //     bg.beginFill(0x98ECFF);
            //     bg.drawRect(0, 0, W + P * 2, P + texts.length * (H + P));
            //     bg.endFill();
            //
            //     buttons.addChild(bg);
            //
            //     for (let i = 0; i < texts.length; ++i) {
            //         let btn = makeButton(texts[i]);
            //         btn.x = P;
            //         btn.y = P + i * (H + P);
            //         buttons.addChild(btn);
            //     }
            //     return buttons;
            // }
            //
            // function makeInterfaceButtons(): Container {
            //     const buttons = new Container();
            //
            //     function makeInterfaceButton(texture: string, x: number, y: number): Container {
            //         const btn = new Sprite(utils.TextureCache[texture]);
            //         btn.interactive = true;
            //         btn.buttonMode = true;
            //         btn.x = x;
            //         btn.y = y;
            //         buttons.addChild(btn);
            //         return btn;
            //     }
            //
            //     const exitButton = makeInterfaceButton('interface/interface_exit.png', 36, 36);
            //     const retryButton = makeInterfaceButton('interface/interface_retry.png', 0, 0);
            //     const explainButton = makeInterfaceButton('interface/interface_explain.png', 36, 0);
            //     const howtoButton = makeInterfaceButton('interface/interface_howto.png', 0, 36);
            //
            //     exitButton.on('pointerdown', () => buttons.emit('quizExit'));
            //     retryButton.on('pointerdown', () => buttons.emit('quizRetry'));
            //     explainButton.on('pointerdown', () => buttons.emit('quizExplain'));
            //     howtoButton.on('pointerdown', () => buttons.emit('quizHowto'));
            //
            //     return buttons;
            // }
            //
            //
            //
            // function makeQuizUi(questions: Question[]): Container {
            //     const ui = new Container();
            //
            //     function makeQuestionUi(question: Question): Container {
            //         const questionUi = new Container();
            //
            //         const answers = makeAnswerButtons(question.answers);
            //         answers.y = 81;
            //         questionUi.addChild(answers);
            //
            //         const dialog = new IrkaDialogBox(question.texts);
            //         dialog.container.x = 370;
            //         dialog.container.y = 10;
            //         questionUi.addChild(dialog.container);
            //
            //         questionUi.visible = false;
            //         ui.addChild(questionUi);
            //         return questionUi;
            //     }
            //
            //     const interfaceButtons = makeInterfaceButtons();
            //     interfaceButtons.x = 370;
            //     interfaceButtons.y = 270;
            //     ui.addChild(interfaceButtons);
            //
            //     interfaceButtons.on('quizExit', () => ui.emit('quizExit'));
            //
            //     const qs = questions.map(makeQuestionUi);
            //     qs[0].visible = true;
            //
            //     return ui;
            // }
            QuizUi = /** @class */ (function () {
                function QuizUi(app) {
                    this.app = app;
                    this.container = new pixi_js_3.Container();
                    this.interfaceButtons = new pixi_js_3.Container();
                    this.dialog = new IrkaDialogBox();
                    this.answerButtons = new pixi_js_3.Container();
                    this.buttons = [];
                    this.initUi();
                }
                QuizUi.prototype.loadQuestions = function (questions) {
                    this.questions = questions;
                    this.currentQuestionIdx = 0;
                    this.loadQuestion(questions[0]);
                };
                QuizUi.prototype.initUi = function () {
                    var _this = this;
                    var bg = new pixi_js_3.Sprite(new pixi_js_3.Texture(pixi_js_3.utils.TextureCache['lvl/test_bgr.png']));
                    this.container.addChild(bg);
                    this.irkaNarr = pixi_js_3.utils.TextureCache['lvl/irka_narrative/1 - irka_narr.png'];
                    this.irkaGlad = pixi_js_3.utils.TextureCache['lvl/glad_irka/4 - irka_glad.png'];
                    this.irkaSad = pixi_js_3.utils.TextureCache['lvl/sad_irka/4 - irka_sad.png'];
                    this.irka = new pixi_js_3.Sprite(this.irkaNarr);
                    // this.irka.texture = this.irkaNarr;
                    this.interfaceButtons.x = 370;
                    this.interfaceButtons.y = 270;
                    this.dialog.container.x = 370;
                    this.dialog.container.y = 10;
                    this.irka.x = 420;
                    this.irka.y = 280;
                    var makeInterfaceButton = function (texture, x, y) {
                        var btn = new pixi_js_3.Sprite(pixi_js_3.utils.TextureCache[texture]);
                        btn.interactive = true;
                        btn.buttonMode = true;
                        btn.x = x;
                        btn.y = y;
                        _this.interfaceButtons.addChild(btn);
                        return btn;
                    };
                    var exitButton = makeInterfaceButton('interface/interface_exit.png', 36, 36);
                    var retryButton = makeInterfaceButton('interface/interface_retry.png', 0, 0);
                    var explainButton = makeInterfaceButton('interface/interface_explain.png', 36, 0);
                    var howtoButton = makeInterfaceButton('interface/interface_howto.png', 0, 36);
                    exitButton.on('pointerdown', function () { return _this.onExit(); });
                    retryButton.on('pointerdown', function () { return _this.retry(); });
                    // explainButton.on('pointerdown', () => buttons.emit('quizExplain'));
                    // howtoButton.on('pointerdown', () => buttons.emit('quizHowto'));
                    this.container.addChild(this.irka);
                    this.container.addChild(this.interfaceButtons);
                    this.container.addChild(this.dialog.container);
                    this.makeAnswersButtons();
                    this.container.addChild(this.answerButtons);
                };
                QuizUi.prototype.onExit = function () {
                    this.reset();
                    this.app.stage.emit('quizExit');
                };
                QuizUi.prototype.retry = function () {
                    this.dialog.retry();
                };
                QuizUi.prototype.answer = function (n) {
                    var _this = this;
                    if (this.currentQuestion.rightAnswer === n) {
                        this.irka.texture = this.irkaGlad;
                        this.dialog.showText('Правильно!\nКакой ты молодец');
                        this.buttons.forEach(function (b) { return b.container.interactive = false; });
                        this.container.interactive = true;
                        this.container.once('pointerdown', function () {
                            _this.irka.texture = _this.irkaNarr;
                            _this.container.interactive = false;
                            _this.buttons.forEach(function (b) { return b.container.interactive = true; });
                            _this.loadNextQuestion();
                        });
                    }
                    else {
                        this.irka.texture = this.irkaSad;
                        this.dialog.showText('Ты уверен?\nМне кажется, тут\nкакая-то ошибка');
                        this.buttons.forEach(function (b) { return b.container.interactive = false; });
                        this.container.interactive = true;
                        this.container.once('pointerdown', function () {
                            _this.irka.texture = _this.irkaNarr;
                            _this.buttons.forEach(function (b) { return b.container.interactive = true; });
                            _this.dialog.retry();
                            _this.container.interactive = false;
                        });
                    }
                };
                QuizUi.prototype.loadNextQuestion = function () {
                    var _this = this;
                    this.currentQuestionIdx++;
                    if (this.currentQuestionIdx < this.questions.length) {
                        this.loadQuestion(this.questions[this.currentQuestionIdx]);
                    }
                    else {
                        this.dialog.showText('Ты ответил на все\nвопросы');
                        this.container.interactive = true;
                        this.container.once('pointerdown', function () {
                            _this.reset();
                            _this.container.interactive = false;
                        });
                    }
                };
                QuizUi.prototype.loadQuestion = function (question) {
                    this.currentQuestion = question;
                    this.dialog.loadTexts(question.texts);
                    for (var i = 0; i < 4; ++i) {
                        this.buttons[i].setText(question.answers[i]);
                    }
                };
                QuizUi.prototype.reset = function () {
                    this.irka.texture = this.irkaNarr;
                    this.currentQuestionIdx = -1;
                    this.loadQuestion(this.questions[0]);
                };
                QuizUi.prototype.makeAnswersButtons = function () {
                    // this.buttons = new Container();
                    var _this = this;
                    var bg = new pixi_js_3.Graphics();
                    bg.beginFill(0x98ECFF);
                    bg.drawRect(0, 0, W + P * 2, P + 4 * (H + P));
                    bg.endFill();
                    this.answerButtons.addChild(bg);
                    this.answerButtons.y = 81;
                    var _loop_1 = function (i) {
                        var btn = new AnswerButton('');
                        btn.container.x = P;
                        btn.container.y = P + i * (H + P);
                        btn.container.on('pointerdown', function () { return _this.answer(i); });
                        this_1.buttons.push(btn);
                        this_1.answerButtons.addChild(btn.container);
                    };
                    var this_1 = this;
                    for (var i = 0; i < 4; ++i) {
                        _loop_1(i);
                    }
                };
                return QuizUi;
            }());
        }
    };
});
System.register("irka/game", ["pixi.js", "irka/states/menu", "irka/states/quiz"], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    function setupRenderer(app) {
        app.renderer.view.style.display = "block";
        app.renderer.autoResize = true;
        app.renderer.resize(640, 640);
    }
    function loaderHandler(loader, resource) {
        console.log("progress: " + loader.progress + "%");
    }
    function setup(app) {
        var menu = menu_1.makeMenu(app);
        var quiz = quiz_1.makeQuiz(app);
        quiz.visible = false;
        app.stage.on('startQuiz', function () {
            menu.visible = false;
            quiz.visible = true;
        });
        app.stage.on('quizExit', function () {
            quiz.visible = false;
            menu.visible = true;
        });
        app.stage.addChild(menu);
        app.stage.addChild(quiz);
    }
    function init() {
        var app = new pixi_js_4.Application({
            antialias: true,
            transparent: false,
            resolution: 1,
        });
        setupRenderer(app);
        pixi_js_4.loader.add('res/irka.json')
            .on('progress', loaderHandler)
            .load(function () { return setup(app); });
        return app;
    }
    exports_6("init", init);
    var pixi_js_4, menu_1, quiz_1;
    return {
        setters: [
            function (pixi_js_4_1) {
                pixi_js_4 = pixi_js_4_1;
            },
            function (menu_1_1) {
                menu_1 = menu_1_1;
            },
            function (quiz_1_1) {
                quiz_1 = quiz_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("index", ["irka/game"], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var game_1, app;
    return {
        setters: [
            function (game_1_1) {
                game_1 = game_1_1;
            }
        ],
        execute: function () {
            app = game_1.init();
            console.log(app);
            document.body.appendChild(app.view);
        }
    };
});
//# sourceMappingURL=index.js.map