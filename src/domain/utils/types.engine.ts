export default `
export { }

declare global {
const $Animation: unique symbol;

const $Canvas: unique symbol;

const $ConstructorNodes: unique symbol;

const $ConstructorScript: unique symbol;

const $Resource: unique symbol;

const $Scenes: unique symbol;

abstract class AbstractCanvas {
    abstract readonly type: TCanvasType;
    abstract readonly canvas: HTMLCanvasElement;
    protected abstract _size: ISizeCanvas;
    abstract load(): OffscreenCanvas;
    protected abstract init(): void;
}

abstract class AbstractNode {
    [key: string | symbol]: TAnything;
    private static CONTEXT;
    private static APP;
    static [$ConstructorNodes]: ConstructorNodes;
    [$ConstructorScript]: ConstructorScript;
    get [GetApp](): EngineCore | GameCore;
    static [SetApp](app: EngineCore | GameCore): void;
    protected readonly utils: {
        omitKeys(object: TAnything, keysOmit: string[], keysAdd?: string[]): Record<string, any>;
        infoText: (text: string, font: string) => TextMetrics;
        hasApp: () => boolean;
    };
}

const AccessorJoyPads: unique symbol;

class AnimationService {
    private $app;
    protected _stats: TAnything;
    protected _loop: number;
    protected _events: EventObserver;
    protected _status: {
        pause: boolean;
        playing: boolean;
    };
    get isPlaying(): boolean;
    get isPause(): boolean;
    constructor(app: EngineCore | GameCore);
    protected loop: () => void;
    play(): this;
    pause(): this;
    emit(name: TEventAnimation, callback: TFunction): this;
    analytics(): void;
    [DispatchEvent](name: TEventAnimation, ...args: TAnything[]): void;
}

class AreaComponent extends ComponentNode {
    protected _name: string;
    protected _description: string;
    bodyEnteringArea(node: GlobalNode): void;
    bodyLeavingArea(node: GlobalNode): void;
}

type AudioFormat = "mp3" | "waw";

const CallbackUpdateVector: unique symbol;

const _Camera: unique symbol;

class CameraComponent extends ComponentNode {
    protected _name: string;
    protected _description: string;
    get scale(): Vector2;
    get position(): Vector2;
    init(): void;
    reset(): void;
    process(): void;
    [NodeDestroy](): void;
}

class CameraController {
    protected $app: EngineCore | GameCore;
    protected cameras: Set<CameraComponent>;
    protected context: CanvasRenderingContext2D;
    constructor(app: EngineCore | GameCore);
    setContext(context: CanvasRenderingContext2D): void;
    addCamera(camera: CameraComponent): void;
    removeCamera(camera: CameraComponent): void;
    clearCameras(): void;
    render(scene: () => void): void;
}

abstract class CanvasNode<T extends TCanvasNodeOptions["global/abstract/canvas-node"] = TCanvasNodeOptions["global/abstract/canvas-node"]> extends GlobalNode<T> {
    [NodePropType]: TCanvasNodes;
    readonly NODE_NAME: TTypeNodes;
    constructor(slug: string, options?: Partial<TCanvasNodeOptions["global/abstract/canvas-node"]>);
    get visible(): boolean;
    get selectable(): boolean;
    get hovered(): boolean;
    get lock(): boolean;
    get cursor(): TCursorOptions;
    get alpha(): number;
    set visible(value: boolean);
    set selectable(value: boolean);
    set hovered(value: boolean);
    set lock(value: boolean);
    set cursor(value: TCursorOptions);
    set alpha(value: number);
}

class CanvasService {
    private $app;
    protected _canvas: Map<TCanvasType, AbstractCanvas>;
    protected _main?: HTMLElement;
    protected _event?: HTMLDivElement;
    get main(): HTMLElement;
    get instance(): HTMLCanvasElement;
    get size(): {
        width: number;
        height: number;
    };
    constructor(app: EngineCore | GameCore);
    protected initLayerCanvas(selector: string | undefined, width: number, height: number): void;
    protected initLayerEvent(width: number, height: number): void;
    makeContext(context: TContextName | "bitmaprenderer"): RenderingContext | null;
    setSize(width: number, height: number, ignoreInstance?: boolean): void;
    setCursor(cursor?: string): void;
    getPosition(): number[];
    defineEvent(type: string, listener: TFunction, options?: TAnything): void;
}

class CharacterBodyComponent extends ComponentNode {
    protected _name: string;
    protected _description: string;
    init(): void;
    set floor(value: boolean);
}

class Circle2D<T extends TCanvasNodeOptions["2D/circle"] = TCanvasNodeOptions["2D/circle"]> extends Node2D<T> {
    [NodePropType]: TCanvasNodes;
    readonly NODE_NAME: TTypeNodes;
    get fill(): string;
    get radius(): number;
    get stroke(): string | undefined;
    get lineWidth(): number;
    get startAngle(): number;
    get endAngle(): number;
    get counterclockwise(): boolean;
    get width(): number;
    get height(): number;
    set fill(value: string);
    set radius(value: number);
    set stroke(value: string | undefined);
    set lineWidth(value: number);
    set startAngle(value: number);
    set endAngle(value: number);
    set counterclockwise(value: boolean);
    constructor(slug: string, options?: Partial<Omit<TCanvasNodeOptions["2D/circle"], "width" | "height">>);
    protected processOrigin(): void;
    protected processCircle(changeInit?: boolean): void;
    clone(): Circle2D;
    reset(property?: keyof TCanvasNodeOptions["2D/circle"]): void;
    toObject(): T;
    set(property: keyof TCanvasNodeOptions["2D/circle"], value: TAnything): void;
    set(properties: Partial<TCanvasNodeOptions["2D/circle"]>): void;
    static import(data: string, format?: "JSON" | "YAML"): Circle2D;
    static make(structure: TExportNode<TAnything>): Circle2D;
}

const _Collision: unique symbol;

class CollisionComponent extends ComponentNode {
    protected _name: string;
    protected _description: string;
    protected _collider: GlobalNode | null;
    protected _touch: {
        top: boolean;
        bottom: boolean;
        left: boolean;
        right: boolean;
    };
    get debug(): boolean;
    get disabled(): boolean;
    get fill(): string;
    set debug(value: boolean);
    set fill(value: string);
    set disabled(value: boolean);
    protected static typeCollisions: Record<TCollisionShape, (firstCollision: CollisionShapeComponent, secondCollision: CollisionShapeComponent) => boolean>;
    protected static typeTouchCollisions: Record<TCollisionShape, (firstCollision: CollisionShapeComponent, secondCollision: CollisionShapeComponent) => {
        top: boolean;
        bottom: boolean;
        left: boolean;
        right: boolean;
    }>;
    protected static resolveArea({ firstNode, secondNode, }: {
        firstNode: GlobalNode;
        secondNode: GlobalNode;
    }, mode: "entering" | "leaving"): void;
    protected static resolveCharacterBody({ firstNode, secondNode, }: {
        firstNode: GlobalNode;
        secondNode: GlobalNode;
    }): void;
    static isColliding(firstCollision: CollisionShapeComponent, secondCollision: CollisionShapeComponent): boolean;
    static isTouch(firstCollision: CollisionShapeComponent, secondCollision: CollisionShapeComponent): {
        top: boolean;
        bottom: boolean;
        left: boolean;
        right: boolean;
    };
    static removeCollider(firstCollision: CollisionShapeComponent, secondCollision: CollisionShapeComponent): void;
    static resolveCollision(firstCollision: CollisionShapeComponent, secondCollision: CollisionShapeComponent): void;
    setTouchCollider(touch: {
        top: boolean;
        bottom: boolean;
        left: boolean;
        right: boolean;
    }): void;
    setCollider(node: GlobalNode | null): void;
}

class CollisionController {
    protected $app: EngineCore | GameCore;
    protected quadTree: QuadTreeNode;
    constructor(app: EngineCore | GameCore);
    addCollision(node: GlobalNode): void;
    removeCollision(node: GlobalNode): void;
    clearCollisions(): void;
    [ExecuteProcess](): void;
}

class CollisionShapeComponent extends CollisionComponent {
    protected _name: string;
    protected _description: string;
    get width(): number;
    get height(): number;
    get shape(): string;
    get position(): Vector2;
    get scale(): Vector2;
    get rotation(): number;
    set width(value: number);
    set height(value: number);
    set shape(value: string);
    set position(value: Vector2);
    set scale(value: Vector2);
    set rotation(value: number);
    init(): void;
}

class ComponentNode {
    protected $node: GlobalNode;
    protected $app: EngineCore | GameCore;
    protected _name: string;
    protected _description: string;
    protected _options: Record<string, TAnything>;
    get NODE(): GlobalNode<IControlEditor>;
    get name(): string;
    get description(): string;
    constructor($node: GlobalNode);
    init(): void;
    process(): void;
    reset(): void;
    [NodeDestroy](): void;
}

class ConstructorNodes {
    private static nodesTypes;
    private static reserveNodes;
    static addNode(name: string, construct: TClass<GlobalNode>): void;
    static addNodes(nodes: Record<string, TClass<GlobalNode>>): void;
    static getNode(name: string): TClass<GlobalNode<IControlEditor>> | undefined;
    static getNodes(): {
        [k: string]: TClass<GlobalNode<IControlEditor>>;
    };
    static hasNode(name: string): boolean;
    static deleteNode(name: string): void;
    static defineProperty(name: string, property: string | symbol, value?: TAnything, options?: {
        writable: boolean;
        enumerable: boolean;
        configurable: boolean;
    }): boolean;
    makeNode(node: TExportNode<TAnything>): GlobalNode;
    makeNodes(nodes: TExportNode<TAnything>[], parent?: GlobalNode): GlobalNode[];
}

class ConstructorScript {
    private $node;
    private $app;
    private $script;
    protected _helpers: Map<any, any>;
    protected _restring: string;
    protected CLASS: {
        getMethodsFromClass: (instance: GlobalNode, filters?: string[]) => Record<string, TFunction>;
        getPropsFromClass: (instance: GlobalNode, filters?: string[]) => Record<string, any>;
    };
    protected REGEXP: {
        getNameFromClassIntoCode(code: string): string | null;
        getExpressionIntoCode(code: string): string;
    };
    protected getCode(): Promise<string>;
    protected getExec(code: string): Promise<{
        __FUNC__: Record<string, TFunction>;
        __VARS__: Record<string, TAnything>;
    }>;
    executeScript(node: GlobalNode, app: EngineCore | GameCore, script: string | URL): Promise<{
        __FUNC__: Record<string, TFunction>;
        __VARS__: Record<string, TAnything>;
    }>;
    [NodeDestroy](): void;
}

class ControlEdition2D<T extends TCanvasNodeOptions["2D/control-edition"] = TCanvasNodeOptions["2D/control-edition"]> extends Node2D<T> {
    [NodePropType]: TCanvasNodes;
    readonly NODE_NAME: TTypeNodes;
    get padding(): number | [number, number] | [number, number, number, number];
    get cornerSize(): number;
    get cornerColor(): string;
    get cornerBorder(): boolean;
    get cornerColorBorder(): string;
    get showCorner(): boolean | {
        "top-left": boolean;
        "top-center": boolean;
        "top-right": boolean;
        "middle-left": boolean;
        "middle-center": boolean;
        "middle-right": boolean;
        "bottom-left": boolean;
        "bottom-center": boolean;
        "bottom-right": boolean;
    };
    get fill(): string;
    get stroke(): string | undefined;
    get lineWidth(): number;
    get rounded(): number | [number, number] | {
        topLeft: number;
        topRight: number;
        bottomLeft: number;
        bottomRight: number;
    };
    get width(): number;
    get height(): number;
    set padding(value: number | [number, number] | [number, number, number, number]);
    set cornerSize(value: number);
    set cornerColor(value: string);
    set cornerBorder(value: boolean);
    set cornerColorBorder(value: string);
    set showCorner(value: boolean | {
        "top-left": boolean;
        "top-center": boolean;
        "top-right": boolean;
        "middle-left": boolean;
        "middle-center": boolean;
        "middle-right": boolean;
        "bottom-left": boolean;
        "bottom-center": boolean;
        "bottom-right": boolean;
    });
    set fill(value: string);
    set stroke(value: string | undefined);
    set lineWidth(value: number);
    set rounded(value: number | [number, number] | {
        topLeft: number;
        topRight: number;
        bottomLeft: number;
        bottomRight: number;
    });
    set width(value: number);
    set height(value: number);
    constructor(slug: string, options?: Partial<TCanvasNodeOptions["2D/control-edition"]>);
    clone(): ControlEdition2D;
    reset(property?: keyof TCanvasNodeOptions["2D/control-edition"]): void;
    toObject(): T;
    set(property: keyof TCanvasNodeOptions["2D/control-edition"], value: TAnything): void;
    set(properties: Partial<TCanvasNodeOptions["2D/control-edition"]>): void;
    static import(data: string, format?: "JSON" | "YAML"): ControlEdition2D;
    static make(structure: TExportNode<TAnything>): ControlEdition2D;
}

const DispatchEvent: unique symbol;

const DispatchScript: unique symbol;

const _Distribution: unique symbol;

class DistributionController {
    private $app;
    constructor(app: EngineCore);
    import(data: string, format?: TSerialize): void;
    export(mode: "editor" | "game", format?: TSerialize): string;
    [ExportData](mode: "editor" | "game"): {
        options: IOptionsGameCore;
        scenes: TExportNode<any>[];
        version: string;
    } | {
        options: IOptionsEngineCore;
        scenes: TExportNode<any>[];
        version: string;
    };
}

class EngineCore {
    [key: string]: TAnything;
    readonly VERSION = "1.0.0";
    protected _options: IOptionsEngineCore;
    protected _plugins: Map<string, Plugin_2>;
    protected _global: Map<string, TAnything>;
    protected _events: EventObserver;
    readonly mode: TMode;
    [_ROOT_]: RootNode;
    [$Animation]: AnimationService;
    [$Canvas]: CanvasService;
    [$Scenes]: ScenesService;
    [_Frame]: FrameController;
    [_Render]: RenderController;
    [_Input]: InputController;
    [_Events]: EventController;
    [_Window]: WindowController;
    [_Script]: ScriptController;
    [_Camera]: CameraController;
    [_Collision]: CollisionController;
    [_Distribution]: DistributionController;
    get control(): {
        preview: {
            play: () => Promise<void>;
            stop: () => void;
            pause: () => void;
        };
        game: {
            play: () => void;
            stop: () => void;
        };
    };
    get ROOT(): RootNode;
    get animation(): AnimationService;
    get canvas(): CanvasService;
    get scenes(): ScenesService;
    get input(): InputController;
    get size(): {
        width: number;
        height: number;
    };
    get viewport(): {
        width: number;
        height: number;
    };
    constructor(options?: Partial<IOptionsEngineCore>);
    protected init(): void;
    setSize(width: number, height: number): this;
    setSelector(selector: string): this;
    use(plugin: TClass<Plugin_2>, options?: Record<string, TAnything>): this;
    emit(name: TEventApp, callback: TFunction): this;
    plugin(name: string): Plugin_2 | undefined;
    global(name: string): any;
    helpers(): {
        Root: RootNode;
        Scenes: ScenesService;
        Canvas: CanvasService;
        Animation: AnimationService;
    };
    export(mode?: "editor" | "game", format?: "JSON" | "YAML"): string;
    import(data: string, format?: "JSON" | "YAML"): this;
    [GetOptions](): IOptionsEngineCore;
    [SetGlobal](name: string, value: TAnything): void;
    [SetOptions](options?: Partial<IOptionsEngineCore>): void;
    [DispatchEvent](event: TEventApp, ...args: TAnything[]): void;
}

class EventController {
    private $app;
    constructor(app: EngineCore | GameCore);
    protected touchstart: (event: TouchEvent) => void;
    protected touchmove: (event: TouchEvent) => void;
    protected touchend: (event: TouchEvent) => void;
    protected mousedown: (event: MouseEvent) => void;
    protected mouseup: (event: MouseEvent) => void;
    protected mousemove: (event: MouseEvent) => void;
    protected mouseenter: (event: MouseEvent) => void;
    protected mouseleave: (event: MouseEvent) => void;
    protected wheel: (event: WheelEvent) => void;
    protected keydown: (event: KeyboardEvent) => void;
    protected keyup: (event: KeyboardEvent) => void;
    protected keypress: (event: KeyboardEvent) => void;
    protected gamepad: (event: GamepadEvent) => void;
    protected resize: () => void;
    protected init(): void;
}

class EventObserver {
    protected _eventListeners: Record<string, TFunction[]>;
    protected getEventListeners(event: string): TFunction[];
    addEventListener(event: string, callback: TFunction): void;
    removeEventListener(event: string, callback: TFunction): void;
    hasEventListener(event: string): boolean;
    clearListeners(): void;
    emitEvent(event: string, ...args: TAnything[]): void;
    emitEventWithBind(event: string, bind: TAnything, ...args: TAnything[]): void;
}

const _Events: unique symbol;

const ExecuteProcess: unique symbol;

const ExportData: unique symbol;

const _Frame: unique symbol;

class FrameController {
    private $app;
    private PHYSICS_DELTA_TIME;
    private RENDER_DELTA_TIME;
    protected _control: {
        lastTime: number;
        elapseTime: number;
        frame: number;
        physicsAccumulatedTime: number;
        renderAccumulatedTime: number;
    };
    get FRAME(): number;
    get DELTA(): number;
    get ELAPSE_TIME(): number;
    set physicsFrame(value: number);
    set renderFrame(value: number);
    constructor(app: EngineCore | GameCore);
    protected processLogic(deltaTime: number): void;
    protected processRender(): void;
    controlFrame(currentTime: number): void;
}

class GameCore {
    [key: string]: TAnything;
    readonly VERSION = "1.0.0";
    protected _options: IOptionsGameCore;
    protected _global: Map<string, TAnything>;
    protected _events: EventObserver;
    readonly mode: TMode;
    [_ROOT_]: RootNode;
    [$Animation]: AnimationService;
    [$Canvas]: CanvasService;
    [$Scenes]: ScenesService;
    [_Frame]: FrameController;
    [_Render]: RenderController;
    [_Input]: InputController;
    [_Events]: EventController;
    [_Script]: ScriptController;
    [_Camera]: CameraController;
    [_Collision]: CollisionController;
    get ROOT(): RootNode;
    get animation(): AnimationService;
    get canvas(): CanvasService;
    get scenes(): ScenesService;
    get viewport(): {
        width: number;
        height: number;
    };
    resize(): this;
    setSize(width: number, height: number): this;
    global(name: string): any;
    emit(name: TEventApp, callback: TFunction): this;
    load(text: string, format?: TSerialize): Promise<void>;
    [GetOptions](): IOptionsGameCore;
    [SetGlobal](name: string, value: TAnything): void;
    [SetOptions](options?: Partial<IOptionsGameCore>): void;
    [DispatchEvent](event: TEventApp, ...args: TAnything[]): void;
}

const GetApp: unique symbol;

const GetHidden: unique symbol;

const GetIdJoyPad: unique symbol;

const GetOptions: unique symbol;

class GlobalNode<T extends TCanvasNodeOptions["global/node"] = TCanvasNodeOptions["global/node"]> extends AbstractNode implements IGlobalNode, IControlEditor, IControlNode, IControlHierarchy {
    protected _omit: string[];
    protected _options: T;
    protected _initial: T;
    protected _parent: undefined | GlobalNode;
    protected _events: EventObserver;
    protected _index: number;
    protected _slug: string;
    protected _id: string;
    [NodePropType]: TCanvasNodes;
    readonly NODE_NAME: TTypeNodes;
    readonly $attributes: HandlerAttribute;
    readonly $components: HandlerComponent;
    readonly $functions: HandlerFunction;
    readonly $metaKeys: HandlerMetaKey;
    readonly $nodes: HandlerNode;
    readonly $script: HandlerScript;
    get ROOT(): RootNode;
    get parent(): GlobalNode | undefined;
    get first(): GlobalNode | undefined;
    get last(): GlobalNode | undefined;
    get nextSibling(): GlobalNode | undefined;
    get previousSibling(): GlobalNode | undefined;
    get index(): number;
    get path(): string;
    get slug(): string;
    get id(): string;
    get title(): string;
    get description(): string;
    set slug(value: string);
    set title(value: string);
    set description(value: string);
    constructor(slug: string, options?: Partial<TCanvasNodeOptions["global/node"]>);
    clone(): GlobalNode;
    emit(event: TEventNode, callback: TFunction): void;
    reset(property?: keyof TCanvasNodeOptions["global/node"]): void;
    toObject(): T;
    destroy(): void;
    set(property: keyof TCanvasNodeOptions["global/node"], value: TAnything): void;
    set(properties: Partial<TCanvasNodeOptions["global/node"]>): void;
    export(format?: TSerialize): string;
    static import(data: string, format?: TSerialize): GlobalNode;
    static make(structure: TExportNode<TAnything>): GlobalNode;
    static [NodeFunctionMake](structure: TExportNode<TAnything>): GlobalNode<IControlEditor>;
    static [NodeFunctionImport](data: string, format: TSerialize): GlobalNode<IControlEditor>;
    [NodeFunctionReset](property?: TAnything): void;
    [NodeFunctionSet](property: TAnything, value: TAnything): void;
    [NodeFunctionSet](properties: TAnything): void;
    [NodeFunctionClone](): GlobalNode<IControlEditor>;
    [NodeSetParent](parent: GlobalNode | undefined): void;
    [NodeSetIndex](index: number): void;
    [NodeSetId](id: string): void;
    [DispatchEvent](event: string, ...args: TAnything[]): void;
    [ExportData](childNode?: boolean): TExportNode<TAnything>;
}

const HandleEventInput: unique symbol;

class HandlerAttribute implements IHandleAttribute {
    private $node;
    private $app;
    [NodePropHandlerAttributes]: Map<string, TAttribute>;
    constructor($node: GlobalNode);
    toEntries(): TAttributeTuple[];
    getAll(): TAttribute[];
    get(name: string): TAttribute | undefined;
    add(name: string, options: TAttribute): void;
    has(name: string): boolean;
    delete(name: string): boolean;
    clear(): void;
    [NodeSetHandlerAttributes](attributes: TAttributeTuple[]): void;
    [NodeDestroy](): void;
}

class HandlerComponent implements IHandleComponent {
    private $node;
    private $app;
    [NodePropHandlerComponents]: Map<string, ComponentNode>;
    constructor($node: GlobalNode);
    toEntries(): TComponentTuple[];
    getAll(): ComponentNode[];
    resetAll(): void;
    get(name: string): ComponentNode | undefined;
    add(component: TClass<ComponentNode>): void;
    has(name: string): boolean;
    delete(name: string): boolean;
    reset(name: string): void;
    clear(): void;
    [NodeSetHandlerComponents](components: TComponentTuple[]): void;
    [NodeDestroy](): void;
}

class HandlerFunction implements IHandleFunction {
    private $node;
    private $app;
    [NodePropHandlerFunctions]: Map<string, TFunction>;
    constructor($node: GlobalNode);
    toEntries(): TFunctionTuple[];
    gelAll(): TFunction[];
    get(name: string): TFunction | undefined;
    add(name: string, func: TFunction): void;
    has(name: string): boolean;
    delete(name: string): boolean;
    execute(name: string, ...args: TAnything[]): void;
    clear(): void;
    [NodeSetHandlerFunctions](functions: TFunctionTuple[]): void;
    [NodeDestroy](): void;
}

class HandlerMetaKey implements IHandleMetaKey {
    private $node;
    private $app;
    [NodePropHandlerMetaKeys]: Map<string, TMetaKey>;
    constructor($node: GlobalNode);
    toEntries(): TMetaKeyTuple[];
    getAll(): TMetaKey[];
    get(name: string): TMetaKey | undefined;
    add(name: string, options: TMetaKey): void;
    has(name: string): boolean;
    delete(name: string): boolean;
    clear(): void;
    [NodeSetHandlerMetaKeys](metaKeys: TMetaKeyTuple[]): void;
    [NodeDestroy](): void;
}

class HandlerNode implements IHandleNode {
    private $node;
    private $app;
    [NodePropHandlerNodes]: GlobalNode[];
    get all(): GlobalNode[];
    get size(): number;
    constructor($node: GlobalNode);
    private _updateNodes_;
    get(index: number): GlobalNode | undefined;
    add(...nodes: GlobalNode[]): void;
    has(index: number): boolean;
    delete(index: number): boolean;
    clear(): boolean;
    replace(index: number, node: GlobalNode): boolean;
    search(slug: string): GlobalNode | undefined;
    move(from: number, to: number): boolean;
    traverse(callback: (node: GlobalNode) => void): void;
    [NodeSetHandlerNodes](nodes: GlobalNode[]): void;
    [NodeDestroy](): void;
}

class HandlerScript {
    private $node;
    private $app;
    protected _script: string | URL | null;
    get source(): string | URL | null;
    modeExecute: "auto" | "none";
    compilation: "class" | "functions";
    constructor($node: GlobalNode);
    protected deleteScriptFromQueue(): void;
    protected deleteScriptFromController(): void;
    protected addScriptToQueue(): void;
    removeScript(): void;
    defineScript(script: string | URL): void;
    executeScript(): Promise<void>;
    [DispatchScript](script: string | URL | null): Promise<void>;
    [NodeDestroy](): void;
}

interface ICalculate {
    origin: [number, number];
    angle: number;
}

interface ICircle2D {
    radius: number;
    startAngle: number;
    endAngle: number;
    counterclockwise: boolean;
}

interface IControlCanvas {
    visible: boolean;
    selectable: boolean;
    lock: boolean;
    cursor: TCursorOptions;
    hovered: boolean;
    alpha: number;
}

interface IControlEdition2D {
    padding: number | [number, number] | [number, number, number, number];
    cornerSize: number;
    cornerColor: string;
    cornerBorder: boolean;
    cornerColorBorder: string;
    showCorner: {
        "top-left": boolean;
        "top-center": boolean;
        "top-right": boolean;
        "middle-left": boolean;
        "middle-center": boolean;
        "middle-right": boolean;
        "bottom-left": boolean;
        "bottom-center": boolean;
        "bottom-right": boolean;
    } | boolean;
}

interface IControlEditor {
    title: string;
    description: string;
}

interface IControlHierarchy {
    get parent(): GlobalNode | undefined;
    get first(): GlobalNode | undefined;
    get last(): GlobalNode | undefined;
    get nextSibling(): GlobalNode | undefined;
    get previousSibling(): GlobalNode | undefined;
}

interface IControlNode {
    readonly $attributes: HandlerAttribute;
    readonly $components: HandlerComponent;
    readonly $functions: HandlerFunction;
    readonly $metaKeys: HandlerMetaKey;
    readonly $nodes: HandlerNode;
    readonly $script: HandlerScript;
}

interface IControlNode2D {
    setOrigin(origin: TTypeOrigin): void;
    setScale(scale: number): void;
    scaleToWidth(width: number): void;
    scaleToHeight(height: number): void;
    setSkew(skew: number): void;
}

interface ICoords2D {
    position: TVec2 | Vector2;
}

interface IDraw2D {
    fill: string;
    stroke?: string;
    lineWidth: number;
}

interface IGlobalNode {
    get index(): number;
    get path(): string;
    get id(): string;
    get slug(): string;
    set slug(slug: string);
}

interface IHandleAttribute {
    [NodePropHandlerAttributes]: Map<string, TAttribute>;
    toEntries(): TAttributeTuple[];
    getAll(): TAttribute[];
    get(name: string): TAttribute | undefined;
    add(name: string, options: TAttribute): void;
    has(name: string): boolean;
    delete(name: string): boolean;
    clear(): void;
    [NodeSetHandlerAttributes](attributes: TAttributeTuple[]): void;
}

interface IHandleComponent {
    [NodePropHandlerComponents]: Map<string, ComponentNode>;
    toEntries(): TComponentTuple[];
    getAll(): ComponentNode[];
    resetAll(): void;
    get(name: string): ComponentNode | undefined;
    add(component: TClass<ComponentNode>): void;
    has(name: string): boolean;
    delete(name: string): boolean;
    reset(name: string): void;
    clear(): void;
    [NodeSetHandlerComponents](attributes: TComponentTuple[]): void;
}

interface IHandleCoords2D {
    center(): void;
    centerX(): void;
    centerY(): void;
}

interface IHandleFunction {
    [NodePropHandlerFunctions]: Map<string, TFunction>;
    toEntries(): TFunctionTuple[];
    gelAll(): TFunction[];
    get(name: string): TFunction | undefined;
    add(name: string, func: TFunction): void;
    has(name: string): boolean;
    delete(name: string): boolean;
    execute(name: string, ...args: TAnything[]): void;
    clear(): void;
    [NodeSetHandlerFunctions](functions: TFunctionTuple[]): void;
}

interface IHandleMetaKey {
    [NodePropHandlerMetaKeys]: Map<string, TMetaKey>;
    toEntries(): TMetaKeyTuple[];
    getAll(): TMetaKey[];
    get(name: string): TMetaKey | undefined;
    add(name: string, options: TMetaKey): void;
    has(name: string): boolean;
    delete(name: string): boolean;
    clear(): void;
    [NodeSetHandlerMetaKeys](metaKeys: TMetaKeyTuple[]): void;
}

interface IHandleNode {
    [NodePropHandlerNodes]: GlobalNode[];
    get all(): GlobalNode[];
    get size(): number;
    get(index: number): GlobalNode | undefined;
    add(...nodes: GlobalNode[]): void;
    has(index: number): boolean;
    delete(index: number): boolean;
    clear(): boolean;
    replace(index: number, node: GlobalNode): boolean;
    search(slug: string): GlobalNode | undefined;
    move(from: number, to: number): boolean;
    traverse(callback: (node: GlobalNode) => void): void;
    [NodeSetHandlerNodes](nodes: GlobalNode[]): void;
}

interface ILineFlowEffect2D {
    cellSize: number;
    spacing: number;
    radius: number;
}

type ImageFormat = "png" | "jpg" | "svg" | "avif" | "webp" | "gif";

interface INode2D {
    flipX: boolean;
    flipY: boolean;
    originX: TTypeOriginX | number;
    originY: TTypeOriginY | number;
    rotation: number;
}

const _Input: unique symbol;

class InputController {
    private $app;
    private _joyPads;
    private _mouse;
    private _mouseCoords;
    private _touch;
    private _keyboard;
    private _actions;
    constructor(app: EngineCore | GameCore);
    get [AccessorJoyPads](): {
        isConnected: (id: number) => boolean;
        connect: (id: number) => void;
        disconnected: (id: number) => boolean;
    };
    [ExecuteProcess](): void;
    [HandleEventInput](event: MouseEvent | WheelEvent | TouchEvent | KeyboardEvent): void;
    protected parseCodeKeyboard(code: string): string;
    protected handleJoyPads(): void;
    protected handleMouse(event: MouseEvent): void;
    protected handleKeyboard(event: KeyboardEvent): void;
    protected handleActions(action: {
        name: string;
        input: TInput | TInput[];
        press: number;
    }): void;
    protected validateAction(name: string, input: TInput): boolean;
    mainJoyPad(): JoyPad | undefined;
    defineAction(name: string, input: TInput | TInput[]): void;
    isActionPressed(name: string): boolean;
    hasKeyPressed(key: string): boolean;
    hasMousePressed(button: "left" | "wheel" | "right"): boolean;
    hasJoyPadButtonPressed(joyPad: \`joyPad-\${number}\`, name: TJoyPadActions): boolean;
    getJoyPadAxis(joyPad: \`joyPad-\${number}\`, name: "left" | "right"): {
        x: number;
        y: number;
    } | undefined;
    getJoyPad(joyPad: \`joyPad-\${number}\`): JoyPad | undefined;
    getMouseCoord(): {
        x: number;
        y: number;
    };
    isMouseMove(): boolean;
}

interface IOptionsEngineCore extends ISize2D {
    background: string;
    context: TContextName;
    selector?: string;
    dimension: TDimension;
    game: IOptionsGame;
    physics_frame: number;
    render_frame: number;
    analytics: boolean;
}

interface IOptionsGame {
    background: string;
    full_size?: boolean;
    full_screen?: boolean;
    x: number;
    y: number;
    center?: boolean;
    title?: string;
    icon?: string | URL | null;
    resizable?: boolean;
    viewport: ISize2D;
    scene?: string;
}

interface IOptionsGameCore extends IOptionsGame {
    context: TContextName;
    selector: string;
    physics_frame: number;
    render_frame: number;
    dimension: TDimension;
}

interface IRectangle2D {
    rounded: number | [number, number] | {
        topLeft: number;
        topRight: number;
        bottomLeft: number;
        bottomRight: number;
    };
}

interface IScale2D {
    scale: TVec2 | Vector2;
}

interface ISelection2D {
    endX: number;
    endY: number;
    startX: number;
    startY: number;
    shape: "rectangle" | "circle" | "triangle" | "polygon";
}

interface ISize2D {
    width: number;
    height: number;
}

interface ISizeCanvas {
    width: number;
    height: number;
}

interface ISkew2D {
    skew: TVec2 | Vector2;
}

interface ISourceNode<T extends SourceType> {
    type: T;
    format: MapFormatSource[T];
    source: string | URL;
    origin: "same-origin" | "anonymous" | "cross-origin";
}

interface IText2D {
    text: string;
    fontSize: \`\${string}\${TSize}\`;
    fontFamily: string;
    fontStretch: "normal" | "ultra-condensed" | "extra-condensed" | "condensed" | "semi-condensed" | "semi-expanded" | "expanded" | "extra-expanded" | "ultra-expanded" | TTypeGlobalFont | \`\${ string }% \`;
    fontStyle: "normal" | "italic" | "oblique" | \`oblique \${string}deg\` | TTypeGlobalFont;
    fontWeight: "normal" | "bold" | "lighter" | "bolder" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | number | TTypeGlobalFont;
    fontVariant: string;
    lineHeight: \`\${string}\${TSize}\` | "normal" | TTypeGlobalFont;
    textAlign: "left" | "right" | "center";
    textBaseline: "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom";
    textDirection: "ltr" | "rtl" | "inherit";
    wordSpacing: \`\${string}\${TSize}\`;
    letterSpacing: \`\${string}\${TSize}\`;
}

class JoyPad {
    protected _id: number;
    protected _ref: Gamepad;
    protected _sticks: {
        left: number[];
        right: number[];
    };
    protected _buttons: Record<TJoyPadActions, number>;
    get [GetIdJoyPad](): number;
    constructor(id: number);
    startVibration(effect: GamepadHapticEffectType, params?: GamepadEffectParameters): Promise<void>;
    stopVibration(): Promise<void>;
    pressed(name: TJoyPadActions): number;
    watch(): string | undefined;
    axis(name: "left" | "right"): {
        x: number;
        y: number;
    };
    [UpdateJoyPad](): void;
}

class LineFlowEffect2D<T extends TCanvasNodeOptions["2D/line-flow-effect"] = TCanvasNodeOptions["2D/line-flow-effect"]> extends Node2D<T> {
    [NodePropType]: TCanvasNodes;
    readonly NODE_NAME: TTypeNodes;
    get cellSize(): number;
    get lineWidth(): number;
    get spacing(): number;
    get fill(): string;
    get radius(): number;
    get width(): number;
    get height(): number;
    set cellSize(value: number);
    set lineWidth(value: number);
    set spacing(value: number);
    set fill(value: string);
    set radius(value: number);
    set width(value: number);
    set height(value: number);
    constructor(slug: string, options?: Partial<TCanvasNodeOptions["2D/line-flow-effect"]>);
    clone(): LineFlowEffect2D;
    reset(property?: keyof TCanvasNodeOptions["2D/line-flow-effect"]): void;
    toObject(): T;
    set(property: keyof TCanvasNodeOptions["2D/line-flow-effect"], value: TAnything): void;
    set(properties: Partial<TCanvasNodeOptions["2D/line-flow-effect"]>): void;
    static import(data: string, format?: "JSON" | "YAML"): LineFlowEffect2D;
    static make(structure: TExportNode<TAnything>): LineFlowEffect2D;
}

type MapFormatSource = {
    "image": ImageFormat;
    "audio": AudioFormat;
    "video": VideoFormat;
};

class Matrix2D {
    protected _array: Float32Array;
    constructor(a?: number, b?: number, c?: number, d?: number, e?: number, f?: number);
    translate(x: number, y: number): this;
    rotate(angle: number): this;
    scale(x: number, y: number): this;
    multiply(matrix: Matrix2D): this;
    getTransform(): Float32Array<ArrayBufferLike>;
    setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;
    static fromTransform2D(transform: Transform2D): Matrix2D;
}

class Node2D<T extends TCanvasNodeOptions["2D/node"] = TCanvasNodeOptions["2D/node"]> extends CanvasNode<T> implements IControlNode2D, IHandleCoords2D {
    [NodePropType]: TCanvasNodes;
    protected _calculate: ICalculate;
    readonly NODE_NAME: TTypeNodes;
    get position(): Vector2;
    get scale(): Vector2;
    get skew(): Vector2;
    get flipX(): boolean;
    get flipY(): boolean;
    get originX(): TTypeOriginX | number;
    get originY(): TTypeOriginY | number;
    get rotation(): number;
    get calculate(): ICalculate;
    get width(): number;
    get height(): number;
    set position(value: Vector2 | TVec2);
    set scale(value: Vector2 | TVec2);
    set skew(value: Vector2 | TVec2);
    set flipX(value: boolean);
    set flipY(value: boolean);
    set originX(value: TTypeOriginX | number);
    set originY(value: TTypeOriginY | number);
    set rotation(value: number);
    constructor(slug: string, options?: Partial<TCanvasNodeOptions["2D/node"]>);
    protected processVector(): void;
    protected processOrigin(): void;
    protected processRotation(): void;
    setOrigin(origin: TTypeOrigin | number): void;
    setScale(scale: number): void;
    scaleToWidth(width: number): void;
    scaleToHeight(height: number): void;
    setSkew(skew: number): void;
    center(): void;
    centerX(): void;
    centerY(): void;
    getBounds(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    clone(): Node2D;
    emit(event: TEventNode | TEventNode2D, callback: TFunction): void;
    reset(property?: keyof TCanvasNodeOptions["2D/node"]): void;
    toObject(): T;
    set(property: keyof TCanvasNodeOptions["2D/node"], value: TAnything): void;
    set(properties: Partial<TCanvasNodeOptions["2D/node"]>): void;
    export(format?: TSerialize): string;
    static import(data: string, format?: "JSON" | "YAML"): Node2D;
    static make(structure: TExportNode<TAnything>): Node2D;
    [ExportData](childNode?: boolean): TExportNode<TAnything>;
}

const NodeDestroy: unique symbol;

const NodeFunctionClone: unique symbol;

const NodeFunctionImport: unique symbol;

const NodeFunctionMake: unique symbol;

const NodeFunctionReset: unique symbol;

const NodeFunctionSet: unique symbol;

const NodePropHandlerAttributes: unique symbol;

const NodePropHandlerComponents: unique symbol;

const NodePropHandlerFunctions: unique symbol;

const NodePropHandlerMetaKeys: unique symbol;

const NodePropHandlerNodes: unique symbol;

const NodePropType: unique symbol;

const NodeSetHandlerAttributes: unique symbol;

const NodeSetHandlerComponents: unique symbol;

const NodeSetHandlerFunctions: unique symbol;

const NodeSetHandlerMetaKeys: unique symbol;

const NodeSetHandlerNodes: unique symbol;

const NodeSetId: unique symbol;

const NodeSetIndex: unique symbol;

const NodeSetParent: unique symbol;

class OperationNode<T = TAnything, C = CanvasRenderingContext2D> {
    [key: string]: TAnything;
    protected $app: EngineCore | GameCore;
    protected _options: T;
    protected _events: EventObserver;
    protected _index: number;
    protected _slug: string;
    protected _id: string;
    constructor(app: EngineCore | GameCore, slug: string);
    init(): void;
    execute(context: C): void;
    [NodeFunctionReset](property?: TAnything): void;
    [NodeFunctionSet](property: TAnything, value: TAnything): void;
    [NodeFunctionSet](properties: TAnything): void;
}

class Plugin_2 {
    protected $app: EngineCore;
    protected NAME: string;
    protected HIDDEN: Record<string, TAnything>;
    protected OPTIONS: Record<string, TAnything>;
    protected CONFIGS: Record<string, TAnything>;
    protected HELPERS: Record<string, TFunction>;
    protected NODES: Map<string, TClass<GlobalNode>>;
    get name(): string;
    get configs(): Record<string, any>;
    get helpers(): Record<string, TFunction>;
    get nodes(): TClass<GlobalNode<IControlEditor>>[];
    constructor(app: EngineCore);
    install(options: TAnything): void;
    operations(): {
        after: OperationNode[];
        before: OperationNode[];
    };
    inject(): Record<string, TFunction>;
    get [GetHidden](): Record<string, any>;
}
{ Plugin_2 as Plugin }

class ProximityManagerNode {
    private area;
    private nodes;
    constructor(proximityArea: {
        x: number;
        y: number;
        width: number;
        height: number;
    });
    setProximityArea(area: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): void;
    addNode(node: GlobalNode): void;
    updateNodesStatus(): void;
    updateNodeStatus(node: GlobalNode): void;
    getActiveNodes(): GlobalNode<IControlEditor>[];
}

class QuadTreeNode {
    private map;
    private bounds;
    private capacity;
    private nodes;
    private divisions;
    constructor(bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    }, capacity?: number);
    clear(): void;
    remove(target: GlobalNode): boolean;
    insert(node: GlobalNode): boolean;
    retrieve(area: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): GlobalNode<IControlEditor>[];
    query(range: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): GlobalNode[];
    private getDivision;
    private getDivisions;
    private subdivide;
    private intersects;
}

class Rectangle2D<T extends TCanvasNodeOptions["2D/rectangle"] = TCanvasNodeOptions["2D/rectangle"]> extends Node2D<T> {
    [NodePropType]: TCanvasNodes;
    readonly NODE_NAME: TTypeNodes;
    get fill(): string;
    get rounded(): number | [number, number] | {
        topLeft: number;
        topRight: number;
        bottomLeft: number;
        bottomRight: number;
    };
    get stroke(): string | undefined;
    get lineWidth(): number;
    get width(): number;
    get height(): number;
    set fill(value: string);
    set rounded(value: number | [number, number] | {
        topLeft: number;
        topRight: number;
        bottomLeft: number;
        bottomRight: number;
    });
    set stroke(value: string | undefined);
    set lineWidth(value: number);
    set width(value: number);
    set height(value: number);
    constructor(slug: string, options?: Partial<TCanvasNodeOptions["2D/rectangle"]>);
    clone(): Rectangle2D;
    reset(property?: keyof TCanvasNodeOptions["2D/rectangle"]): void;
    toObject(): T;
    set(property: keyof TCanvasNodeOptions["2D/rectangle"], value: TAnything): void;
    set(properties: Partial<TCanvasNodeOptions["2D/rectangle"]>): void;
    static import(data: string, format?: "JSON" | "YAML"): Rectangle2D;
    static make(structure: TExportNode<TAnything>): Rectangle2D;
}

const ReloadApp: unique symbol;

const _Render: unique symbol;

class RenderController {
    private $app;
    private $context;
    protected _options: {
        mode?: TMode;
        dimension?: TDimension;
        context?: TContextName;
    };
    protected _canvas?: OffscreenCanvas;
    protected _drawer?: TContextObject[TContextName];
    protected _operations: {
        before: Map<string, OperationNode<any, CanvasRenderingContext2D>>;
        after: Map<string, OperationNode<any, CanvasRenderingContext2D>>;
    };
    draw: boolean;
    scaleViewport: number;
    get operations(): {
        get: (type: "after" | "before", name: string) => OperationNode<any, CanvasRenderingContext2D> | undefined;
        exist: (type: "after" | "before", name: string) => boolean;
        add: (type: "after" | "before", operation: OperationNode) => void;
        delete: (type: "after" | "before", name: string) => void;
        update: (type: "after" | "before", name: string, options: Record<string, TAnything>) => void;
        clear: (type: "after" | "before") => void;
    };
    constructor(app: EngineCore | GameCore);
    load({ context, mode, dimension, }: {
        context: TContextName;
        mode: TMode;
        dimension: TDimension;
    }): void;
    init(width: number, height: number): void;
    setSize(width: number, height: number): void;
    [ExecuteProcess](): void;
}

class RigidBodyComponent extends ComponentNode {
    protected _name: string;
    protected _description: string;
    applyForce(force: Vector2): void;
    applyGravity(): void;
    applyMovement(): void;
    init(): void;
}

const _ROOT_: unique symbol;

class RootNode {
    [key: string]: TAnything;
    private $app;
    get TOP(): Scene | undefined;
    constructor(app: EngineCore | GameCore);
    private _nodes_;
    private _updateNodes_;
    defineAction(name: string, func: (...args: TAnything[]) => TAnything): void;
    /**
     * coord (x & y) is accumulate
     * extend
     *
     * parent x & y, parent scaleX & Y
     * child x & y, child scaleX & Y
     *
     * cX = pX + (pSX * cX)
     * pSX = pSX * cSX
     */
    static calculateRelativePosition(parent: {
        position: Vector2;
        scale: Vector2;
    }, child: {
        position: Vector2;
        scale: Vector2;
    }): {
        position: Vector2;
        scale: Vector2;
    };
    static calculateTransforms(child: {
        position: Vector2;
        scale: Vector2;
        rotation: number;
        alpha: number;
    }, parent: {
        position: Vector2;
        scale: Vector2;
        rotation: number;
        alpha: number;
    }): {
        position: Vector2;
        scale: Vector2;
        rotation: number;
        alpha: number;
    };
    static invertTransform(position: Vector2, scale: Vector2, rotation: number): {
        position: Vector2;
        scale: Vector2;
        rotation: number;
    };
    traverse(callback: (node: GlobalNode) => void): void;
    replaceNode(from: string | number, value: GlobalNode, mode?: TMode_2): boolean;
    replaceNodeByPath(from: string, value: GlobalNode, mode?: TMode_2): boolean;
    moveNodeByPath(from: {
        search: string;
        mode: TMode_2;
    }, to: {
        search: string;
        mode: TMode_2;
    }, insert?: "after" | "before"): boolean;
    moveNode(from: {
        search: string | number;
        mode: TMode_2;
    }, to: {
        search: string | number;
        mode: TMode_2;
    }, insert?: "after" | "before"): boolean;
    clearNodesByPath(path: string, mode?: TMode_2): boolean;
    protected clearNodesByPathId(path: string): boolean;
    protected clearNodesByPathSlug(path: string): boolean;
    protected clearNodesByPathIndex(path: string): boolean;
    clearNodes(location: string | number, mode?: TMode_2): boolean;
    protected clearNodesById(location: string): boolean;
    protected clearNodesBySlug(location: string): boolean;
    protected clearNodesByIndex(location: number): boolean;
    getNodesByPath(path: string, mode?: TMode_2): GlobalNode<IControlEditor>[] | undefined;
    protected getNodesByPathId(path: string): GlobalNode<IControlEditor>[] | undefined;
    protected getNodesByPathSlug(path: string): GlobalNode<IControlEditor>[] | undefined;
    protected getNodesByPathIndex(path: string): GlobalNode<IControlEditor>[] | undefined;
    getNodes(location: string | number, mode?: TMode_2): GlobalNode<IControlEditor>[] | undefined;
    protected getNodesById(location: string): GlobalNode<IControlEditor>[] | undefined;
    protected getNodesBySlug(location: string): GlobalNode<IControlEditor>[] | undefined;
    protected getNodesByIndex(location: number): GlobalNode<IControlEditor>[] | undefined;
    deleteNodeByPath(path: string, mode?: TMode_2): boolean;
    deleteNode(location: string | number, mode?: TMode_2): boolean;
    protected deleteNodeById(location: string): boolean;
    protected deleteNodeBySlug(location: string): boolean;
    protected deleteNodeByIndex(location: number): boolean;
    addNodeByPath(path: string, value: GlobalNode, mode?: TMode_2, insert?: "after" | "before"): boolean;
    protected addNodeByPathId(path: string, value: GlobalNode, insert: "after" | "before"): boolean;
    protected addNodeByPathSlug(path: string, value: GlobalNode, insert: "after" | "before"): boolean;
    protected addNodeByPathIndex(path: string, value: GlobalNode, insert: "after" | "before"): boolean;
    addNode(location: string, value: GlobalNode, mode: TMode_2, insert?: "after" | "before"): boolean;
    protected addNodeById(location: string, value: GlobalNode, insert: "after" | "before"): boolean;
    protected addNodeBySlug(location: string, value: GlobalNode, insert: "after" | "before"): boolean;
    protected addNodeByIndex(location: number, value: GlobalNode, insert: "after" | "before"): boolean;
    searchNodeByPath(from: string, search: {
        value: string;
        mode: TMode_2;
    }, mode?: TMode_2): GlobalNode<IControlEditor> | undefined;
    protected searchNodeByPathId(from: string, search: {
        value: string;
        mode: TMode_2;
    }): GlobalNode<IControlEditor> | undefined;
    protected searchNodeByPathSlug(from: string, search: {
        value: string;
        mode: TMode_2;
    }): GlobalNode<IControlEditor> | undefined;
    protected searchNodeByPathIndex(from: string, search: {
        value: string | number;
        mode: TMode_2;
    }): GlobalNode<IControlEditor> | undefined;
    searchNode(from: string | number, search: {
        value: string | number;
        mode: TMode_2;
    }, mode?: TMode_2): GlobalNode<IControlEditor> | undefined;
    protected searchNodeById(from: string, search: {
        value: string | number;
        mode: TMode_2;
    }): GlobalNode<IControlEditor> | undefined;
    protected searchNodeBySlug(from: string, search: {
        value: string | number;
        mode: TMode_2;
    }): GlobalNode<IControlEditor> | undefined;
    protected searchNodeByIndex(from: number, search: {
        value: string | number;
        mode: TMode_2;
    }): GlobalNode<IControlEditor> | undefined;
    getNodeByPath(path: string, mode?: TMode_2): GlobalNode | undefined;
    protected getNodeByPathId(path: string): GlobalNode | undefined;
    protected getNodeByPathSlug(path: string): GlobalNode | undefined;
    protected getNodeByPathIndex(path: string): GlobalNode | undefined;
    getNode(location: string | number, mode?: TMode_2): GlobalNode | undefined;
    protected getNodeById(location: string): GlobalNode | undefined;
    protected getNodeBySlug(location: string): GlobalNode | undefined;
    protected getNodeByIndex(location: number): GlobalNode | undefined;
    hasNodeByPath(path: string, mode?: TMode_2): boolean;
    protected hasNodeByPathId(path: string): boolean;
    protected hasNodeByPathSlug(path: string): boolean;
    protected hasNodeByPathIndex(path: string): boolean;
    hasNode(location: string | number, mode?: TMode_2): boolean;
    protected hasNodeById(location: string): boolean;
    protected hasNodeBySlug(location: string): boolean;
    protected hasNodeByIndex(location: number): boolean;
    getParentNodeByPath(path: string, mode?: TMode_2): GlobalNode | undefined;
    protected getParentNodeByPathId(path: string): GlobalNode<IControlEditor> | undefined;
    protected getParentNodeByPathSlug(path: string): GlobalNode<IControlEditor> | undefined;
    protected getParentNodeByPathIndex(path: string): GlobalNode<IControlEditor> | undefined;
    getParentNode(location: string | number, mode?: TMode_2): GlobalNode | undefined;
    protected getParentNodeById(location: string): GlobalNode<IControlEditor> | undefined;
    protected getParentNodeBySlug(location: string): GlobalNode<IControlEditor> | undefined;
    protected getParentNodeByIndex(location: number): GlobalNode<IControlEditor> | undefined;
    getPreviousSiblingNodeByPath(path: string, mode?: TMode_2): GlobalNode<IControlEditor> | undefined;
    protected getPreviousSiblingNodeByPathId(path: string): GlobalNode<IControlEditor> | undefined;
    protected getPreviousSiblingNodeByPathSlug(path: string): GlobalNode<IControlEditor> | undefined;
    protected getPreviousSiblingNodeByPathIndex(path: string): GlobalNode<IControlEditor> | undefined;
    getPreviousSiblingNode(location: string | number, mode?: TMode_2): GlobalNode<IControlEditor> | undefined;
    protected getPreviousSiblingNodeById(location: string): GlobalNode<IControlEditor> | undefined;
    protected getPreviousSiblingNodeBySlug(location: string): GlobalNode<IControlEditor> | undefined;
    protected getPreviousSiblingNodeByIndex(location: number): GlobalNode<IControlEditor> | undefined;
    getNextSiblingNodeByPath(path: string, mode?: TMode_2): GlobalNode<IControlEditor> | undefined;
    protected getNextSiblingNodeByPathId(path: string): GlobalNode<IControlEditor> | undefined;
    protected getNextSiblingNodeByPathSlug(path: string): GlobalNode<IControlEditor> | undefined;
    protected getNextSiblingNodeByPathIndex(path: string): GlobalNode<IControlEditor> | undefined;
    getNextSiblingNode(location: string | number, mode?: TMode_2): GlobalNode<IControlEditor> | undefined;
    protected getNextSiblingNodeById(location: string): GlobalNode<IControlEditor> | undefined;
    protected getNextSiblingNodeBySlug(location: string): GlobalNode<IControlEditor> | undefined;
    protected getNextSiblingNodeByIndex(location: number): GlobalNode<IControlEditor> | undefined;
    getFirstChildNodeByPath(path: string, mode?: TMode_2): GlobalNode<IControlEditor> | undefined;
    protected getFirstChildNodeByPathId(path: string): GlobalNode<IControlEditor> | undefined;
    protected getFirstChildNodeByPathSlug(path: string): GlobalNode<IControlEditor> | undefined;
    protected getFirstChildNodeByPathIndex(path: string): GlobalNode<IControlEditor> | undefined;
    getFirstChildNode(location: string | number, mode?: TMode_2): GlobalNode<IControlEditor> | undefined;
    protected getFirstChildNodeById(location: string): GlobalNode<IControlEditor> | undefined;
    protected getFirstChildNodeBySlug(location: string): GlobalNode<IControlEditor> | undefined;
    protected getFirstChildNodeByIndex(location: number): GlobalNode<IControlEditor> | undefined;
    getLastChildNodeByPath(path: string, mode?: TMode_2): GlobalNode<IControlEditor> | undefined;
    protected getLastChildNodeByPathId(path: string): GlobalNode<IControlEditor> | undefined;
    protected getLastChildNodeByPathSlug(path: string): GlobalNode<IControlEditor> | undefined;
    protected getLastChildNodeByPathIndex(path: string): GlobalNode<IControlEditor> | undefined;
    getLastChildNode(location: string | number, mode?: TMode_2): GlobalNode<IControlEditor> | undefined;
    protected getLastChildNodeById(location: string): GlobalNode<IControlEditor> | undefined;
    protected getLastChildNodeBySlug(location: string): GlobalNode<IControlEditor> | undefined;
    protected getLastChildNodeByIndex(location: number): GlobalNode<IControlEditor> | undefined;
}

class Scene extends GlobalNode {
    [NodePropType]: TCanvasNodes;
    [ScriptsNodeFromScene]: Set<GlobalNode>;
    readonly NODE_NAME: TTypeNodes;
    constructor(slug: string, options?: Partial<TCanvasNodeOptions["global/scene"]>);
    clone(): Scene;
    emit(event: TEventNode | TEventScene, callback: TFunction): void;
    reset(property?: keyof TCanvasNodeOptions["global/scene"]): void;
    toObject(): TCanvasNodeOptions["global/scene"];
    set(property: keyof TCanvasNodeOptions["global/scene"], value: TAnything): void;
    set(properties: Partial<TCanvasNodeOptions["global/scene"]>): void;
    static import(data: string, format?: TSerialize): Scene;
    static make(structure: TExportNode<TAnything>): Scene;
}

class ScenesService {
    private $app;
    protected _scenes: Map<string, Scene>;
    protected _scene?: Scene;
    protected _events: EventObserver;
    constructor(app: EngineCore | GameCore);
    get currentScene(): Scene | undefined;
    get scenes(): Scene[];
    get(slug: string): Scene | undefined;
    add(...scenes: Scene[]): void;
    delete(slug: string): void;
    change(slug: string): void;
    load(): Promise<void>;
    refresh(): Promise<void>;
    reset(node?: Scene | GlobalNode): void;
    export(format?: TSerialize): string;
    import(data: string, format?: TSerialize): void;
    emit(name: TEventScenes, callback: TFunction): void;
    [DispatchEvent](name: TEventScenes, ...args: TAnything[]): void;
    [ExportData](): TExportNode<any>[];
    [ReloadApp](): void;
}

const _Script: unique symbol;

class ScriptController {
    private $app;
    protected _events: EventObserver;
    protected _helpers: Map<any, any>;
    protected _scripts: Set<GlobalNode<IControlEditor>>;
    constructor(app: EngineCore | GameCore);
    addScript(node: GlobalNode): void;
    removeScript(node: GlobalNode): void;
    existScript(node: GlobalNode): boolean;
    clearScripts(): void;
    getHelpersScript(): Record<string, TAnything>;
    setHelperScript(name: string, helper: TAnything): void;
    initHelpersScript(): void;
    ready(): void;
    [ExecuteProcess](delta: number): void;
    protected executeFunctionReady(): void;
    protected executeFunctionsScript(delta: number): void;
    protected handlerComponents(node: GlobalNode): void;
    [DispatchScript](): Promise<void>;
}

const ScriptsNodeFromScene: unique symbol;

class Selection2D<T extends TCanvasNodeOptions["2D/selection"] = TCanvasNodeOptions["2D/selection"]> extends Node2D<T> {
    [NodePropType]: TCanvasNodes;
    protected _selectedNodes: Set<Node2D>;
    protected _intersectionNode: (node: Node2D) => boolean;
    readonly NODE_NAME: TTypeNodes;
    get endX(): number;
    get endY(): number;
    get startX(): number;
    get startY(): number;
    get shape(): "rectangle" | "circle" | "triangle" | "polygon";
    get fill(): string;
    get stroke(): string | undefined;
    get lineWidth(): number;
    get rounded(): number | [number, number] | {
        topLeft: number;
        topRight: number;
        bottomLeft: number;
        bottomRight: number;
    };
    get width(): number;
    get height(): number;
    set endX(value: number);
    set endY(value: number);
    set startX(value: number);
    set startY(value: number);
    set shape(value: "rectangle" | "circle" | "triangle" | "polygon");
    set fill(value: string);
    set stroke(value: string | undefined);
    set lineWidth(value: number);
    set rounded(value: number | [number, number] | {
        topLeft: number;
        topRight: number;
        bottomLeft: number;
        bottomRight: number;
    });
    set width(value: number);
    set height(value: number);
    constructor(slug: string, options?: Partial<TCanvasNodeOptions["2D/selection"]>);
    setIntersectionNode(func: (node: Node2D) => boolean): void;
    select(nodes: Node2D[]): void;
    clone(): Selection2D;
    emit(event: TEventNode | TEventNode2D | TEventSelection, callback: TFunction): void;
    reset(property?: keyof TCanvasNodeOptions["2D/selection"]): void;
    toObject(): T;
    set(property: keyof TCanvasNodeOptions["2D/selection"], value: TAnything): void;
    set(properties: Partial<TCanvasNodeOptions["2D/selection"]>): void;
    static import(data: string, format?: "JSON" | "YAML"): Selection2D;
    static make(structure: TExportNode<TAnything>): Selection2D;
}

const SetApp: unique symbol;

const SetGlobal: unique symbol;

const SetOptions: unique symbol;

type SourceType = "image" | "audio" | "video";

class StaticBodyComponent extends ComponentNode {
    protected _name: string;
    protected _description: string;
}

type TAnything = any;

type TAttribute = {
    value: TAnything;
    group: string;
    type: "string" | "int" | "float" | "boolean" | "set" | "map" | "object" | "list";
    input: "text" | "number" | "slider" | "checkbox" | "radio" | "file" | "color" | "date" | "time" | "date-time";
    options: TAnything;
};

type TAttributeTuple = [string, TAttribute];

type TCanvasNode2D = "2D/node" | "2D/rectangle" | "2D/circle" | "2D/text" | "2D/selection" | "2D/line-flow-effect" | "2D/control-edition" | "2D/image";

type TCanvasNode3D = "3D/cube";

type TCanvasNodeOptions = {
    "canvas:save": undefined;
    "canvas:restore": undefined;
    "canvas:clear": {
        width?: number;
        height?: number;
    };
    "canvas:translate": {
        x: number;
        y: number;
    };
    "canvas:scale": {
        x: number;
        y: number;
    };
    "canvas:rotation": number;
    "global/node": IControlEditor;
    "global/scene": IControlEditor;
    "global/abstract/canvas-node": IControlCanvas & IControlEditor;
    "2D/node": IControlEditor & IControlCanvas & ICoords2D & IScale2D & ISkew2D & ISize2D & INode2D;
    "2D/rectangle": IControlEditor & IControlCanvas & ICoords2D & IScale2D & ISkew2D & ISize2D & INode2D & IRectangle2D & IDraw2D;
    "2D/circle": IControlEditor & IControlCanvas & ICoords2D & IScale2D & ISkew2D & ISize2D & INode2D & ICircle2D & IDraw2D;
    "2D/text": IControlEditor & IControlCanvas & ICoords2D & IScale2D & ISkew2D & ISize2D & INode2D & IDraw2D & IText2D;
    "2D/line-flow-effect": IControlEditor & IControlCanvas & ICoords2D & IScale2D & ISkew2D & ISize2D & Pick<IDraw2D, "fill" | "lineWidth"> & INode2D & ILineFlowEffect2D;
    "2D/selection": IControlEditor & IControlCanvas & ICoords2D & IScale2D & ISkew2D & ISize2D & INode2D & IDraw2D & ISelection2D & IRectangle2D;
    "2D/control-edition": IControlEditor & IControlCanvas & ICoords2D & IScale2D & ISkew2D & ISize2D & INode2D & IDraw2D & IControlEdition2D & IRectangle2D;
    "2D/image": IControlEditor & IControlCanvas & ICoords2D & IScale2D & ISkew2D & ISize2D & INode2D & ISourceNode<"image">;
};

type TCanvasNodePrimitive = "global/node" | "global/scene" | "global/abstract/canvas-node";

type TCanvasNodes = TCanvasNodePrimitive | TCanvasNode3D | TCanvasNode2D;

type TCanvasType = "editor" | "game";

type TClass<C = TAnything, P = TAnything> = new (...params: P[]) => C;

type TCollisionShape = "rectangle-rectangle" | "circle-circle" | "rectangle-circle" | "circle-rectangle";

type TComponentTuple = [string, ComponentNode];

type TContextName = "2d" | "web-gl" | "web-gl2" | "web-gpu";

type TContextObject = {
    "2d": CanvasRenderingContext2D;
    "web-gl": WebGLRenderingContext;
    "web-gl2": WebGL2RenderingContext;
    "web-gpu": GPUCanvasContext;
};

type TCursorOptions = "auto" | "default" | "pointer" | "grabbing" | "grab" | "progress" | "help" | "wait" | "cell" | "crosshair" | "text" | "vertical-text" | "alias" | "copy" | "move" | "no-drop" | "not-allowed" | "all-scroll" | "col-resize" | "e-resize" | "ew-resize" | "n-resize" | "ne-resize" | "nesw-resize" | "ns-resize" | "nw-resize" | "nwse-resize" | "row-resize" | "s-resize" | "se-resize" | "sw-resize" | "w-resize" | "none";

type TDimension = "2D" | "3D";

type TEventAnimation = "animation:play" | "animation:pause" | "animation:loop";

type TEventApp = "app/mouse:down" | "app/mouse:up" | "app/mouse:move" | "app/mouse:leave" | "app/mouse:enter" | "app/mouse:wheel" | "app/key:down" | "app/key:up" | "app/key:press" | "app/drag" | "app/drag:start" | "app/drag:end" | "app/drag:leave" | "app/drag:enter" | "app/drag:over" | "app/drop" | "app/touch:start" | "app/touch:move" | "app/touch:end" | "app/joyPad:connected" | "app/joyPad:disconnected";

type TEventNode = "node:change_script" | "node:change_properties" | "node:ready" | "node:destroy" | "node:renamed" | "node:three_nodes_open" | "node:three_nodes_close" | "node:three_nodes_remove_child" | "node:three_nodes_add_child" | "node:three_nodes_clear";

type TEventNode2D = "node/2D:modified" | "node/2D:moving" | "node/2D:rotated" | "node/2D:locked" | "node/2D:visible" | "node/2D:scaling" | "node/2D:select" | "node/2D:unselect" | "node/2D:hover";

type TEventScene = "scene:preload" | "scene:ready" | "scene:finish" | "scene:remove_node" | "scene:add_node" | "scene:move_node" | "scene:replace_node" | "scene:clear_nodes";

type TEventScenes = "scenes:add" | "scenes:delete" | "scenes:change" | "scenes:export" | "scenes:import" | "scenes:load";

type TEventSelection = "selection:start" | "selection:end" | "selection:moving" | "selection:nodes";

type TExportNode<O> = {
    id: string;
    slug: string;
    attributes: TAttributeTuple[];
    metaKeys: TMetaKeyTuple[];
    type: TTypeNodes | TTypeNode2D | TTypeNode3D;
    script: string | URL | null;
    nodes: TExportNode<TAnything>[];
    path: string;
    index: number;
    options: O;
};

class Text2D<T extends TCanvasNodeOptions["2D/text"] = TCanvasNodeOptions["2D/text"]> extends Node2D<T> {
    [NodePropType]: TCanvasNodes;
    readonly NODE_NAME: TTypeNodes;
    get stroke(): string | undefined;
    get lineWidth(): number;
    get fill(): string;
    get text(): string;
    get fontSize(): \`\${ string }px\` | \`\${ string }em\` | \`\${ string }pc\` | \`\${ string }cm\` | \`\${ string }rem\` | \`\${ string }pt\` | \`\${ string }inch\` | \`\${ string }%\`;
    get fontFamily(): string;
    get fontStretch(): \`\${ string }%\` | "normal" | "ultra-condensed" | "extra-condensed" | "condensed" | "semi-condensed" | "semi-expanded" | "expanded" | "extra-expanded" | "ultra-expanded" | TTypeGlobalFont;
    get fontStyle(): "normal" | TTypeGlobalFont | "italic" | "oblique" | \`oblique\${ string }deg\`;
    get fontWeight(): number | "normal" | TTypeGlobalFont | "bold" | "lighter" | "bolder";
    get fontVariant(): string;
    get lineHeight(): \`\${ string }px\` | \`\${ string }em\` | \`\${ string }pc\` | \`\${ string }cm\` | \`\${ string }rem\` | \`\${ string }pt\` | \`\${ string }inch\` | \`\${ string }%\` | "normal" | TTypeGlobalFont;
    get textAlign(): "center" | "left" | "right";
    get textBaseline(): "top" | "bottom" | "hanging" | "middle" | "alphabetic" | "ideographic";
    get textDirection(): "inherit" | "ltr" | "rtl";
    get wordSpacing(): \`\${ string }px\` | \`\${ string }em\` | \`\${ string }pc\` | \`\${ string }cm\` | \`\${ string }rem\` | \`\${ string }pt\` | \`\${ string }inch\` | \`\${ string }%\`;
    get letterSpacing(): \`\${ string }px\` | \`\${ string }em\` | \`\${ string }pc\` | \`\${ string }cm\` | \`\${ string }rem\` | \`\${ string }pt\` | \`\${ string }inch\` | \`\${ string }%\`;
    get font(): string;
    get width(): number;
    get height(): number;
    set stroke(value: string | undefined);
    set lineWidth(value: number);
    set fill(value: string);
    set text(value: string);
    set fontSize(value: \`\${ string }px\` | \`\${ string }em\` | \`\${ string }pc\` | \`\${ string }cm\` | \`\${ string }rem\` | \`\${ string }pt\` | \`\${ string }inch\` | \`\${ string }%\`;
    set fontFamily(value: string);
    set fontStretch(value: \`\${ string }%\` | "normal" | "ultra-condensed" | "extra-condensed" | "condensed" | "semi-condensed" | "semi-expanded" | "expanded" | "extra-expanded" | "ultra-expanded" | TTypeGlobalFont);
    set fontStyle(value: "normal" | TTypeGlobalFont | "italic" | "oblique" | \`oblique \${ string }deg\`);
    set fontWeight(value: number | "normal" | TTypeGlobalFont | "bold" | "lighter" | "bolder");
    set fontVariant(value: string);
    set lineHeight(value: \`\${ string }px\` | \`\${ string }em\` | \`\${ string }pc\` | \`\${ string }cm\` | \`\${ string }rem\` | \`\${ string }pt\` | \`\${ string }inch\` | \`\${ string }%\` | "normal" | TTypeGlobalFont);
    set textAlign(value: "center" | "left" | "right");
    set textBaseline(value: "top" | "bottom" | "hanging" | "middle" | "alphabetic" | "ideographic");
    set textDirection(value: "inherit" | "ltr" | "rtl");
    set wordSpacing(value: \`\${ string }px\` | \`\${ string }em\` | \`\${ string }pc\` | \`\${ string }cm\` | \`\${ string }rem\` | \`\${ string }pt\` | \`\${ string }inch\` | \`\${ string }%\`;
    set letterSpacing(value: \`\${ string }px\` | \`\${ string }em\` | \`\${ string }pc\` | \`\${ string }cm\` | \`\${ string }rem\` | \`\${ string }pt\` | \`\${ string }inch\` | \`\${ string }%\`;
    constructor(slug: string, options?: Partial<Omit<TCanvasNodeOptions["2D/text"], "width" | "height">>);
    protected processText(changeInit?: boolean): void;
    clone(): Text2D;
    reset(property?: keyof TCanvasNodeOptions["2D/text"]): void;
    toObject(): T;
    set(property: keyof TCanvasNodeOptions["2D/text"], value: TAnything): void;
    set(properties: Partial<TCanvasNodeOptions["2D/text"]>): void;
    static import(data: string, format?: "JSON" | "YAML"): Text2D;
    static make(structure: TExportNode<TAnything>): Text2D;
}

type TFunction<T = void, P = TAnything> = (...params: P[]) => T | Promise<T>;

type TFunctionTuple = [string, TFunction];

type TInput = TInputKeyboard | TInputMouse | TInputJoyPad;

type TInputJoyPad = \`joyPad/\${ TJoyPadActions }\`;

type TInputKeyboard = \`keyboard/\${ TKeyboardActions }\`;

type TInputMouse = \`mouse/\${ TMouseActions }\`;

type TJoyPadActions = "power" | "select" | "start" | "buttonA" | "buttonX" | "buttonB" | "buttonY" | "crossUp" | "crossDown" | "crossLeft" | "crossRight" | "L1" | "L2" | "L3" | "R1" | "R2" | "R3";

type TKeyboardActions = "cancel" | "backspace" | "tab" | "clear" | "enter" | "shiftRight" | "shiftLeft" | "controlRight" | "controlLeft" | "altRight" | "altLeft" | "pause" | "capsLock" | "escape" | "space" | "arrowLeft" | "arrowRight" | "arrowUp" | "arrowDown" | "keyQ" | "keyW" | "keyE" | "keyR" | "keyT" | "keyY" | "keyU" | "keyI" | "keyO" | "keyP" | "keyA" | "keyS" | "keyD" | "keyF" | "keyG" | "keyH" | "keyJ" | "keyK" | "keyL" | "keyÑ" | "keyZ" | "keyX" | "keyC" | "keyV" | "keyB" | "keyN" | "keyM";

type TMetaKey = {
    value: TAnything;
    type: "string" | "int" | "float" | "boolean" | "set" | "map" | "object" | "list";
};

type TMetaKeyTuple = [string, TMetaKey];

type TMode = "game" | "editor";

type TMode_2 = "id" | "index" | "slug";

type TMouseActions = "left" | "right";

class Transform2D {
    position: Vector2;
    rotation: number;
    scale: Vector2;
    skew: number;
    constructor(position?: Vector2, rotation?: number, scale?: Vector2, skew?: number);
    applyTranslate(vector: Vector2): void;
    applyRotate(angle: number): void;
    applyScale(vector: Vector2): void;
    applyTransform(vector: Vector2): Vector2;
}

class Transform3D {
    position: Vector3;
    rotation: Vector3;
    scale: Vector3;
    constructor(position?: Vector3, rotation?: Vector3, scale?: Vector3);
    translate(vector: Vector3): void;
    rotate(vector: Vector3): void;
    resize(scalar: number): void;
    applyTransform(vector: Vector3): Vector3;
}

type TSerialize = "JSON" | "YAML" | "TOML" | "INI";

type TSize = "px" | "em" | "pc" | "cm" | "rem" | "pt" | "inch" | "%";

type TTypeGlobalFont = "inherit" | "initial" | "revert" | "revert-layer" | "unset";

type TTypeNode2D = "Node2D" | "Rectangle2D" | "Circle2D" | "Text2D" | "LineFlowEffect2D" | "Selection2D" | "ControlEdition2D" | "Collision2D" | "CollisionShape2D" | "Image2D";

type TTypeNode3D = "Cube3D" | "Sphere3D";

type TTypeNodeGlobal = "Scene" | "GlobalNode" | "CanvasNode";

type TTypeNodes = TTypeNodeGlobal | TTypeNode2D | TTypeNode3D;

type TTypeOrigin = "center" | "top-left" | "top-center" | "top-right" | "center-left" | "center-center" | "center-right" | "bottom-left" | "bottom-center" | "bottom-right";

type TTypeOriginX = "center" | "left" | "right";

type TTypeOriginY = "center" | "top" | "bottom";

type TVec2 = \`Vec2(\${ number }, \${ number })\`;

const UpdateJoyPad: unique symbol;

class Vector2 {
    protected static _callback: () => void;
    protected _array: Float32Array;
    get x(): number;
    get y(): number;
    get r(): number;
    get g(): number;
    set x(value: number);
    set y(value: number);
    set r(value: number);
    set g(value: number);
    get magnitude(): number;
    get normalized(): number;
    get sqrMagnitude(): number;
    constructor(x: number, y: number);
    static [CallbackUpdateVector](callback: () => void): void;
    set(x: number, y: number): void;
    add(vector: Readonly<Vector2>): this;
    subtract(vector: Readonly<Vector2>): this;
    multiply(vector: Readonly<Vector2>): this;
    divide(vector: Readonly<Vector2>): this;
    scale(scala: number): this;
    negate(): this;
    invert(): this;
    abs(): Vector2;
    equals(vector: Readonly<Vector2>): boolean;
    dot(vector: Readonly<Vector2>): number;
    length(): number;
    normalize(): Vector2;
    toString(): string;
    export(): string;
    clone(): Vector2;
    static subtract(a: Readonly<Vector2>, b: Readonly<Vector2>): Vector2;
    static add(a: Readonly<Vector2>, b: Readonly<Vector2>): Vector2;
    static multiply(a: Readonly<Vector2>, b: Readonly<Vector2>): Vector2;
    static divide(a: Readonly<Vector2>, b: Readonly<Vector2>): Vector2;
    static zero(): Vector2;
    static one(): Vector2;
    static up(): Vector2;
    static down(): Vector2;
    static right(): Vector2;
    static left(): Vector2;
    static positiveInfinity(): Vector2;
    static negativeInfinity(): Vector2;
    static import(vector: TVec2): Vector2;
}

class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    add(vector: Vector3): Vector3;
    subtract(vector: Vector3): Vector3;
    multiply(scalar: number): Vector3;
    dot(vector: Vector3): number;
    cross(vector: Vector3): Vector3;
    length(): number;
    normalize(): Vector3;
}

class Vector4 {
    x: number;
    y: number;
    z: number;
    w: number;
    constructor(x?: number, y?: number, z?: number, w?: number);
    add(vector: Vector4): Vector4;
    subtract(vector: Vector4): Vector4;
    multiply(scalar: number): Vector4;
    dot(vector: Vector4): number;
    length(): number;
    normalize(): Vector4;
}

type VideoFormat = "mp4" | "avi" | "mkv";

const _Window: unique symbol;

class WindowController {
    private $app;
    protected _window: Window | null;
    constructor(app: EngineCore | GameCore);
    protected makeConfigWindow(game: IOptionsGame): string;
    protected makeCanvas(game: IOptionsGame): string;
    createWindow(): void;
    closeWindow(): void;
}

const _Worker: unique symbol;
}
`

