// ReSharper disable InconsistentNaming
// ReSharper disable StringLiteralTypo

type AttributeValue = number | string | Date | boolean;

export interface Attributes {
    [key: string]: AttributeValue;
}

export type CustomElementHandler<T extends Node> = (attributes: Attributes | undefined | null, contents: string[] | unknown) => T;

export type Child = string | Node | Function | boolean | unknown | undefined | null;

function appendChild(parent: Node, child: Child | Child[]) {
    if (typeof child === "undefined" || child === null) {
        return;
    }

    if (Array.isArray(child)) {
        for (const value of child) {
            appendChild(parent, value);
        }
    } else if (typeof child === "string") {
        parent.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
        parent.appendChild(child);
    } else if (typeof child === "function") {
        parent.appendChild((child as Function)());
    } else if (typeof child === "boolean") {
        // <>{condition && <a>Display when condition is true</a>}</>
        // if condition is false, the child is a boolean, but we don't want to display anything
    } else {
        parent.appendChild(document.createTextNode(String(child)));
    }
}


const svgTags = new Set<string>([
    "a", "circle", "clipPath", "defs", "desc", "ellipse", "feBlend", "feColorMatrix", "feComponentTransfer",
    "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA",
    "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset",
    "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "filter", "foreignObject", "g",
    "image", "line", "linearGradient", "marker", "mask", "metadata", "path", "pattern", "polygon", "polyline",
    "radialGradient", "rect", "script", "stop", "style", "svg", "switch", "symbol", "text", "textPath", "title",
    "tspan", "use", "view"
]);

interface AttributeNamePatch {
    readonly tagNames?: Set<string>;
    readonly key: string;
    readonly newKey: string;
}

const attributeNamePatches: AttributeNamePatch[] = [
    {
        key: "className",
        newKey: "class"
    },
    {
        tagNames: new Set<string>(["circle", "ellipse", "foreignObject", "image", "line", "path", "polygon", "polyline", "rect", "text", "textPath", "tspan", "use"]),
        key: "vectorEffect",
        newKey: "vector-effect"
    }
];

export function JsxFactory<T extends Node>(
    tagName: CustomElementHandler<T>,
    attributes: Attributes | undefined | null,
    ...children: string[]
): unknown;

export function JsxFactory<SVGTagName extends keyof SVGElementTagNameMap>(
    tagName: SVGTagName,
    attributes: Attributes | undefined | null,
    ...children: Child[]
): unknown;

export function JsxFactory<HTMLTagName extends keyof HTMLElementTagNameMap>(
    tagName: HTMLTagName,
    attributes: Attributes | undefined | null,
    ...children: Child[]
): unknown {

    if (typeof tagName === "function") {
        // we are using 'never' and all the casts here just to comfort the typescript compiler
        // these type information will be omitted in the generated javascript
        return (tagName as unknown as CustomElementHandler<never>)(attributes, children);
    }

    const isSvgTag = svgTags.has(tagName);
    const element: Element = isSvgTag
        ? document.createElementNS("http://www.w3.org/2000/svg", tagName)
        : document.createElement(tagName);

    if (attributes) {

        const setAttribute = (key: string, value: string) => {
            for (const p of attributeNamePatches) {
                if (!p.tagNames || p.tagNames.has(tagName)) {
                    if (key === p.key) {
                        key = p.newKey;
                        break;
                    }
                }
            }

            element.setAttribute(key, value);
        }

        for (const key of Object.keys(attributes)) {
            const attributeValue = attributes[key];

            if (key.startsWith("on") && typeof attributeValue === "function") {
                element.addEventListener(
                    key.substr(2, 1).toLowerCase() + key.substring(3),
                    attributeValue as unknown as EventListenerOrEventListenerObject);
            } else {
                // <input disable />      { disable: true }
                // <input type="text" />  { type: "text"}
                if (typeof attributeValue === "boolean" && attributeValue) {
                    setAttribute(key, "");
                } else {
                    setAttribute(key, attributeValue as string);
                }
            }
        }
    }

    for (const child of children) {
        appendChild(element, child);
    }

    return element;
}