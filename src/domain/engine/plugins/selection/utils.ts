import { type GlobalNode, Node2D } from "atomic-engine-lib";
import type { TAnything } from "@/types";
import { intersectCircle2D, intersectImage2D, intersectLineFlowEffect2D, intersectRectangle2D, intersectSprite2D, intersectText2D } from "./nodes-intersect";

export function isNodeIntersect({
    node,
    intersectionPoint,
    type,
}: {
    node: {
        x: number;
        y: number;
        width: number;
        height: number;
        rotation: number;
    };
    type: string
    intersectionPoint: [number, number];
}) {
    const typeIntersect: Record<string, (...params: TAnything[]) => boolean> = {
        "Rectangle2D": intersectRectangle2D,
        "Circle2D": intersectCircle2D,
        "Text2D": intersectText2D,
        "Image2D": intersectImage2D,
        "Sprite2D": intersectSprite2D,
        "LineFlowEffect2D": intersectLineFlowEffect2D
    }

    const intersectNode = typeIntersect[type]

    if (!intersectNode) return false

    return intersectNode({ node, intersectionPoint })
}

export function intersectWithQuadTree(intersectionPoint: [number, number], validation: "hovered" | "lock"): GlobalNode | undefined {
    const validateTypeIntersect = {
        hovered: (node: GlobalNode) => node.hovered,
        lock: (node: GlobalNode) => !node.lock,
    };

    let selectNode: undefined | GlobalNode;
    let isIntersect = false;

    // @ts-ignore
    const potentialNodes: GlobalNode[] = this.TOP?._quadTree.query({
        x: intersectionPoint[0],
        y: intersectionPoint[1],
        width: 2,
        height: 2,
    }) ?? []

    const validate = validateTypeIntersect[validation];

    for (const node of potentialNodes) {
        if (!node.visible) continue;

        const parentPosition = {
            x: 0,
            y: 0
        }

        if (node.parent && node.parent.NODE_NAME !== "Scene" && node.parent instanceof Node2D) {
            parentPosition.x = node.parent.getBounds().x
            parentPosition.y = node.parent.getBounds().y
        }

        if (
            isNodeIntersect({
                type: node.NODE_NAME,
                node: {
                    width: Math.abs(node.width * node.scale.x),
                    height: Math.abs(node.height * node.scale.y),
                    rotation: node.rotation,
                    x: parentPosition.x + node.position.x - Math.abs(node.origin[0] * node.scale.x),
                    y: parentPosition.y + node.position.y - Math.abs(node.origin[1] * node.scale.y)
                },
                intersectionPoint,
            })
        ) {
            isIntersect = true;
        }

        if (isIntersect && validate(node)) {
            selectNode = node;

            break;
        }
    }

    return selectNode
}

// export function intersect(
//     intersectionPoint: [number, number],
//     validation: "hovered" | "lock",
//     parentTransform: {
//         position: Vector2
//         scale: Vector2
//         rotation: number;
//         alpha: number;
//     } = { position: Vector2.zero(), scale: Vector2.one(), rotation: 0, alpha: 1 },
//     parentRelativePosition: {
//         position: Vector2
//         scale: Vector2
//     } = { position: Vector2.zero(), scale: Vector2.one() },
//     nodes: GlobalNode[] = this.TOP?.$nodes.all ?? []
// ) {
//     const validateTypeIntersect = {
//         hovered: (node: GlobalNode) => node.hovered,
//         lock: (node: GlobalNode) => !node.lock,
//     };

//     let selectNode: undefined | GlobalNode;

//     const information = {
//         parent: {
//             transform: {
//                 alpha: 1,
//                 rotation: 0,
//                 position: Vector2.zero(),
//                 scale: Vector2.one(),
//             },
//             relative: {
//                 position: Vector2.zero(),
//                 scale: Vector2.one(),
//             },
//             alpha: 1,
//             rotation: 0,
//             position: Vector2.zero(),
//             scale: Vector2.one(),
//         },
//         child: {
//             transform: {
//                 alpha: 1,
//                 rotation: 0,
//                 position: Vector2.zero(),
//                 scale: Vector2.one(),
//             },
//             relative: {
//                 position: Vector2.zero(),
//                 scale: Vector2.one(),
//             },
//             alpha: 1,
//             rotation: 0,
//             position: Vector2.zero(),
//             scale: Vector2.one(),
//         },
//     };

//     let isIntersect = false;

//     for (let index = nodes.length - 1; index >= 0; index--) {
//         const node = nodes[index];

//         const validate = validateTypeIntersect[validation];

//         if (!node.visible) continue;

//         const calculate = node.calculate;
//         calculate

//         const accumulativeTransform = RootNode.calculateTransforms(
//             {
//                 position: node.position ?? Vector2.zero(),
//                 scale: node.scale ?? Vector2.one(),
//                 rotation: node.calculate.angle ?? 0,
//                 alpha: node.alpha ?? 1,
//             },
//             parentTransform,
//         );

//         const accumulativeRelativePosition = RootNode.calculateRelativePosition(
//             parentRelativePosition,
//             {
//                 position: node.position ?? Vector2.zero(),
//                 scale: node.scale ?? Vector2.one(),
//             },
//         );

//         // const bounds = node.getBounds()

//         if (
//             node.NODE_NAME === "Rectangle2D"
//             // isNodeIntersect({
//             //     bounds: {
//             //         position: accumulativeRelativePosition.position,
//             //         scale: accumulativeRelativePosition.scale,
//             //         width: node.width,
//             //         height: node.height,
//             //         rotation: accumulativeTransform.rotation,
//             //         origin: calculate.origin,
//             //         type: node.NODE_NAME
//             //     },
//             //     intersectionPoint,
//             // })
//         ) {
//             isIntersect = true;
//         }

//         if (isIntersect && validate(node)) {
//             information.parent = {
//                 alpha: node.parent?.alpha ?? 1,
//                 position: node.parent?.position ?? Vector2.zero(),
//                 rotation: node.parent?.rotation ?? 0,
//                 scale: node.parent?.scale ?? Vector2.one(),
//                 relative: {
//                     position: parentRelativePosition.position,
//                     scale: parentRelativePosition.scale,
//                 },
//                 transform: {
//                     alpha: parentTransform.alpha,
//                     position: parentTransform.position,
//                     rotation: parentTransform.rotation,
//                     scale: parentTransform.scale,
//                 },
//             };

//             information.child = {
//                 alpha: node?.alpha ?? 1,
//                 position: node?.position ?? Vector2.zero(),
//                 rotation: node?.rotation ?? 0,
//                 scale: node?.scale ?? Vector2.one(),
//                 relative: {
//                     position: accumulativeRelativePosition.position,
//                     scale: accumulativeRelativePosition.scale,
//                 },
//                 transform: {
//                     alpha: accumulativeTransform.alpha,
//                     position: accumulativeTransform.position,
//                     rotation: accumulativeTransform.rotation,
//                     scale: accumulativeTransform.scale,
//                 },
//             };

//             selectNode = node;

//             break;
//         }

//         if (node.$nodes.size > 0) {
//             this.intersect(intersectionPoint, validation, accumulativeTransform, accumulativeRelativePosition, node.$nodes.all)
//         }
//     }

//     return {
//         node: selectNode,
//         information,
//     };
// }