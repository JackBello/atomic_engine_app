import { Vector2, type GlobalNode } from "atomic-engine-lib";

export const moveNodeByMouse = (
    node: GlobalNode,
    mouseCoords: Vector2,
    startCoords: Vector2
) => {
    const delta = Vector2.subtract(mouseCoords, startCoords)

    node.position.add(delta)

}

export const moveNodeByMouseNormal = (
    node: GlobalNode,
    mouseCoords: Vector2,
    startCoords: Vector2,
    relativeChildPosition: {
        position: Vector2;
        scale: Vector2;
    },
    relativeParentPosition: {
        position: Vector2;
        scale: Vector2;
    },
) => {
    const delta = Vector2.subtract(mouseCoords, startCoords)

    relativeChildPosition.position.add(delta)

    const vec2 = Vector2.zero()

    vec2.x = (relativeChildPosition.position.x -
        relativeParentPosition.position.x) /
        relativeParentPosition.scale.x
    vec2.y = (relativeChildPosition.position.y -
        relativeParentPosition.position.y) /
        relativeParentPosition.scale.y

    node.position = vec2
};

export const moveNodeByKeyboard = (
    node: GlobalNode,
    direction: string,
) => {
    if (direction === "ArrowUp") node.position.y -= 4;
    if (direction === "ArrowDown") node.position.y += 4;
    if (direction === "ArrowLeft") node.position.x -= 4;
    if (direction === "ArrowRight") node.position.x += 4;
};
