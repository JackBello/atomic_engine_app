export const intersectRectangle2D = ({
    node,
    intersectionPoint,
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
}) => {
    const { width, height, x, y } = node

    const mouseX = intersectionPoint[0];
    const mouseY = intersectionPoint[1];

    return (
        mouseX >= x &&
        mouseX <= x + width &&
        mouseY >= y &&
        mouseY <= y + height
    );
}

export const intersectCircle2D = ({
    node,
    intersectionPoint,
}: {
    node: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    type: string
    intersectionPoint: [number, number];
}) => {
    const { x, y, width } = node;
    const [mouseX, mouseY] = intersectionPoint;

    const dx = mouseX - x
    const dy = mouseY - y

    const distance = Math.abs(Math.sqrt(dx ** 2 + dy ** 2))

    return distance <= width / 2;
}

export const intersectText2D = ({
    node,
    intersectionPoint,
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
}) => {
    const { width, height, x, y } = node

    const mouseX = intersectionPoint[0];
    const mouseY = intersectionPoint[1];

    return (
        mouseX >= x &&
        mouseX <= x + width &&
        mouseY >= y &&
        mouseY <= y + height
    );
}

export const intersectImage2D = ({
    node,
    intersectionPoint,
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
}) => {
    const { width, height, x, y } = node

    const mouseX = intersectionPoint[0];
    const mouseY = intersectionPoint[1];

    return (
        mouseX >= x &&
        mouseX <= x + width &&
        mouseY >= y &&
        mouseY <= y + height
    );
}

export const intersectSprite2D = ({
    node,
    intersectionPoint,
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
}) => {
    const { width, height, x, y } = node

    const mouseX = intersectionPoint[0];
    const mouseY = intersectionPoint[1];

    return (
        mouseX >= x &&
        mouseX <= x + width &&
        mouseY >= y &&
        mouseY <= y + height
    );
}

export const intersectLineFlowEffect2D = ({
    node,
    intersectionPoint,
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
}) => {
    const { width, height, x, y } = node

    const mouseX = intersectionPoint[0];
    const mouseY = intersectionPoint[1];

    return (
        mouseX >= x &&
        mouseX <= x + width &&
        mouseY >= y &&
        mouseY <= y + height
    );
}
