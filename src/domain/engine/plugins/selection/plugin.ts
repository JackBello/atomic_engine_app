import { Plugin, Selection2D, GetHidden } from "atomic-engine-lib";

import type { TAnything } from "@/types";
import installEmits from "./emits";
import { intersectWithQuadTree } from "./utils";

export default class SelectionPlugin extends Plugin {
    protected NAME = "selection";

    install(options: TAnything): void {
        installEmits(this.$app)

        // this.$app.ROOT.defineAction("intersect", intersect)

        this.$app.ROOT.defineAction("intersectWithQuadTree", intersectWithQuadTree)

        const selection = new Selection2D("selection-editor", {
            width: 0,
            height: 0,
        });

        selection.setIntersectionNode((node) => {
            const nodeX = (node.x - (node.width * node.scaleX) / 2)
            const nodeY = (node.y - (node.height * node.scaleY) / 2)

            const rotatedNodeX =
                nodeX * Math.cos((-node.rotation * Math.PI) / 180) -
                nodeY * Math.sin((-node.rotation * Math.PI) / 180);
            const rotatedNodeY =
                nodeX * Math.sin((-node.rotation * Math.PI) / 180) +
                nodeY * Math.cos((-node.rotation * Math.PI) / 180);

            const startX = Math.min(selection.startX, selection.endX)
            const endX = Math.max(selection.startX, selection.endX)
            const startY = Math.min(selection.startY, selection.endY)
            const endY = Math.max(selection.startY, selection.endY)

            const nodeWidth = (node.width * node.scaleX);
            const nodeHeight = (node.height * node.scaleY);

            return (
                rotatedNodeX >= startX - nodeWidth &&
                rotatedNodeX <= endX &&
                rotatedNodeY >= startY - nodeHeight &&
                rotatedNodeY <= endY
            );
        });

        this.OPTIONS = options;

        this.HIDDEN = {
            node: undefined,
            parent: undefined,
            child: undefined,
            offset: [0, 0],
            isDragging: false,
            nodes: {
                selection,
            },
            events: {}
        };

        this.CONFIGS = {
            selection: {
                active: false,
                radius: 1,
                background: "rgba(52, 131, 235, 0.3)",
                borderColor: "rgba(52, 131, 235, 0.8)",
                borderWidth: 2,
                border: true,
            },
            control: {
                active: false,
                padding: 10,
                border: true,
                borderWidth: 1,
                borderColor: "rgb(16 130 212)",
                cornerSize: 6,
                cornerColor: "rgb(16 130 212)",
                cornerBorder: false,
                cornerColorBorder: "blue",
                showCorner: true,
            },
        };
    }

    inject(): Record<string, (...params: TAnything[]) => void | Promise<void>> {
        return {
            emit: (event: string, callback: (...params: TAnything[]) => void) => {
                const _ = (this.$app.plugin("selection") as SelectionPlugin)[GetHidden];

                _.events[event] = callback
            }
        }
    }
}
