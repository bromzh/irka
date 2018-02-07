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
                'sup': {
                    fontSize: '10px',
                    textBaseline: 'bottom',
                    valign: -4
                },
                'sm': {
                    fontSize: '10px',
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
        text.alpha = 0;
        quiz.addChild(quizArea);
        quiz.buttonMode = true;
        quiz.interactive = true;
        text.x = quizArea.width / 2 - text.width / 2 - 25;
        text.y = quizArea.height / 2 - text.height / 2;
        quiz.addChild(text);
        var onPointerOver = function () {
            quizArea.filters = [utils_1.darkFilter];
            text.alpha = 1;
        };
        var onPointerOut = function () {
            quizArea.filters = [];
            text.alpha = 0;
        };
        var onPointerDown = function () {
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
System.register("irka/states/quiz", ["pixi.js"], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    function makeQuizUi() {
        var s = new pixi_js_3.Container();
        return s;
    }
    function makeQuiz(app) {
        var quizCoontainer = new pixi_js_3.Container();
        var bg = new pixi_js_3.Sprite(new pixi_js_3.Texture(pixi_js_3.utils.TextureCache['lvl/test_bgr.png']));
        quizCoontainer.addChild(bg);
        return quizCoontainer;
    }
    exports_4("makeQuiz", makeQuiz);
    var pixi_js_3, Quiz;
    return {
        setters: [
            function (pixi_js_3_1) {
                pixi_js_3 = pixi_js_3_1;
            }
        ],
        execute: function () {
            Quiz = /** @class */ (function () {
                function Quiz() {
                }
                return Quiz;
            }());
        }
    };
});
System.register("irka/game", ["pixi.js", "irka/states/menu", "irka/states/quiz"], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
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
    exports_5("init", init);
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
System.register("index", ["irka/game"], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
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
