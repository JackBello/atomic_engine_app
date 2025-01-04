import { type EngineCore, _Frame, GetHidden } from "atomic-engine-lib";
import { moveNodeByKeyboard } from "./functions";
import type SelectionPlugin from "./plugin";

export const handleMouseDown = (event: MouseEvent, app: EngineCore) => {
    if (event.button !== 0) return;

    const _ = (app.plugin("selection") as SelectionPlugin)[GetHidden];

    const [x, y] = app.canvas.getPosition();

    const mouseCoords = [event.clientX - x, event.clientY - y] as [number, number]

    const node = app.ROOT.intersectWithQuadTree(mouseCoords, "lock")

    if (node) {
        // controlEdition.set({
        // 	x: select.x,
        // 	y: select.y,
        // 	width: select.width,
        // 	height: select.height,
        // 	scaleX: select.scaleX,
        // 	scaleY: select.scaleY,
        // 	padding: config.control.padding,
        // 	border: config.control.border,
        // 	borderWidth: config.control.borderWidth,
        // 	borderColor: config.control.borderColor,
        // 	cornerSize: config.control.cornerSize,
        // 	cornerColor: config.control.cornerColor,
        // 	cornerBorder: config.control.cornerBorder,
        // 	cornerColorBorder: config.control.cornerColorBorder,
        // 	showCorner: config.control.showCorner,
        // });

        _.isDragging = true;
        _.node = node;
        _.offset = [mouseCoords[0] - _.node.position.x, mouseCoords[1] - _.node.position.y]

        if (_.events['select:node'])
            _.events['select:node'](_.node)
    } else {
        _.node = undefined;
        _.isDragging = false;

        if (_.events['select:node'])
            _.events['select:node'](null)
    }
};

export const handleMouseUp = (event: MouseEvent, app: EngineCore) => {
    if (event.button !== 0) return;

    const _ = (app.plugin("selection") as SelectionPlugin)[GetHidden];

    const [x, y] = app.canvas.getPosition();

    const mouseCoords = [event.clientX - x, event.clientY - y]

    _.isDragging = false;

    if (_.node)
        _.offset = [mouseCoords[0] - _.node.position.x, mouseCoords[1] - _.node.position.y]

    // selection.set({
    // 	background: "",
    // 	radius: 0,
    // 	border: false,
    // 	borderColor: "",
    // 	borderWidth: 0,
    // 	width: 0,
    // 	height: 0,
    // 	x: 0,
    // 	y: 0,
    // 	startX: 0,
    // 	startY: 0,
    // 	endX: mouseCoords.x - panAndZoomConfig.pan.x,
    // 	endY: mouseCoords.y - panAndZoomConfig.pan.y,
    // });

};

export const handleMouseMove = async (event: MouseEvent, app: EngineCore) => {
    const [x, y] = app.canvas.getPosition();

    const mouseCoords = [event.clientX - x, event.clientY - y] as [number, number]

    const _ = (app.plugin("selection") as SelectionPlugin)[GetHidden];

    const hover: Record<string, string> = {
        "undefined": "default",
        "default": "move"
    }

    if (!_.isDragging) {
        const node = app.ROOT.intersectWithQuadTree(mouseCoords, "hovered");

        if (_.events['hover:node'])
            _.events['hover:node'](node)

        app.canvas.setCursor(hover[node?.cursor] ?? node.cursor)
    }

    if (_.isDragging && _.node) {
        _.node.position.x = mouseCoords[0] - _.offset[0]
        _.node.position.y = mouseCoords[1] - _.offset[1]
    }
};

export const handleKeyDown = (event: KeyboardEvent, app: EngineCore) => {
    const _ = (app.plugin("selection") as SelectionPlugin)[GetHidden];

    if (!_.node) return;

    const isEdition = app.global("mode") === "edition";

    if (isEdition)
        moveNodeByKeyboard(
            _.node,
            event.key,
        );
};
