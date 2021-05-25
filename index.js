// ReSharper disable InconsistentNaming
// ReSharper disable StringLiteralTypo
function appendChild(parent, child) {
    if (typeof child === "undefined" || child === null) {
        return;
    }
    if (Array.isArray(child)) {
        for (const value of child) {
            appendChild(parent, value);
        }
    }
    else if (typeof child === "string") {
        parent.appendChild(document.createTextNode(child));
    }
    else if (child instanceof Node) {
        parent.appendChild(child);
    }
    else if (typeof child === "function") {
        parent.appendChild(child());
    }
    else if (typeof child === "boolean") {
        // <>{condition && <a>Display when condition is true</a>}</>
        // if condition is false, the child is a boolean, but we don't want to display anything
    }
    else {
        parent.appendChild(document.createTextNode(String(child)));
    }
}
const svgTags = new Set([
    "a", "circle", "clipPath", "defs", "desc", "ellipse", "feBlend", "feColorMatrix", "feComponentTransfer",
    "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA",
    "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset",
    "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "filter", "foreignObject", "g",
    "image", "line", "linearGradient", "marker", "mask", "metadata", "path", "pattern", "polygon", "polyline",
    "radialGradient", "rect", "script", "stop", "style", "svg", "switch", "symbol", "text", "textPath", "title",
    "tspan", "use", "view"
]);
const attributeNamePatches = [
    {
        key: "className",
        newKey: "class"
    },
    {
        tagNames: new Set(["circle", "ellipse", "foreignObject", "image", "line", "path", "polygon", "polyline", "rect", "text", "textPath", "tspan", "use"]),
        key: "vectorEffect",
        newKey: "vector-effect"
    }
];
export function JsxFactory(tagName, attributes, ...children) {
    if (typeof tagName === "function") {
        // we are using 'never' and all the casts here just to comfort the typescript compiler
        // these type information will be omitted in the generated javascript
        return tagName(attributes, children);
    }
    const isSvgTag = svgTags.has(tagName);
    const element = isSvgTag
        ? document.createElementNS("http://www.w3.org/2000/svg", tagName)
        : document.createElement(tagName);
    if (attributes) {
        const setAttribute = (key, value) => {
            for (const p of attributeNamePatches) {
                if (!p.tagNames || p.tagNames.has(tagName)) {
                    if (key === p.key) {
                        key = p.newKey;
                        break;
                    }
                }
            }
            element.setAttribute(key, value);
        };
        for (const key of Object.keys(attributes)) {
            const attributeValue = attributes[key];
            if (key.startsWith("on") && typeof attributeValue === "function") {
                element.addEventListener(key.substr(2, 1).toLowerCase() + key.substring(3), attributeValue);
            }
            else {
                // <input disable />      { disable: true }
                // <input type="text" />  { type: "text"}
                if (typeof attributeValue === "boolean" && attributeValue) {
                    setAttribute(key, "");
                }
                else {
                    setAttribute(key, attributeValue);
                }
            }
        }
    }
    for (const child of children) {
        appendChild(element, child);
    }
    return element;
}
//# sourceMappingURL=index.js.map