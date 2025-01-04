import { QuadTreeNode, type Scene, type EngineCore } from "atomic-engine-lib";
import { handleKeyDown, handleMouseDown, handleMouseMove, handleMouseUp } from "./events";

export default function installEmits(app: EngineCore) {
    app.emit("app/mouse:down", handleMouseDown);

    app.emit("app/mouse:up", handleMouseUp);

    app.emit("app/mouse:move", handleMouseMove);

    app.emit("app/key:down", handleKeyDown);

    app.animation.emit("animation:loop", () => {
        if (app.scenes.currentScene) {
            app.scenes.currentScene._loadNodesIntoQuadTree()
        }
    })

    app.scenes.emit("scenes:add", (scene: Scene) => {
        scene._quadTree = new QuadTreeNode({
            x: 0,
            y: 0,
            height: app.canvas.size.height,
            width: app.canvas.size.width
        })

        scene._loadNodesIntoQuadTree = function () {
            this._quadTree.clear()

            const stack = [...this.$nodes.all];

            while (stack.length) {
                const node = stack.pop();

                if (!node) continue

                this._quadTree.insert(node);

                stack.push(...node.$nodes.all);
            }
        }
    })
}