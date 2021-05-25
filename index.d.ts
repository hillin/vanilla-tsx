declare type AttributeValue = number | string | Date | boolean;
export interface Attributes {
    [key: string]: AttributeValue;
}
export declare type CustomElementHandler<T extends Node> = (attributes: Attributes | undefined | null, contents: string[] | unknown) => T;
export declare type Child = string | Node | Function | boolean | unknown | undefined | null;
export declare function JsxFactory<T extends Node>(tagName: CustomElementHandler<T>, attributes: Attributes | undefined | null, ...children: string[]): unknown;
export declare function JsxFactory<SVGTagName extends keyof SVGElementTagNameMap>(tagName: SVGTagName, attributes: Attributes | undefined | null, ...children: Child[]): unknown;
export {};
