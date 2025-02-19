import { Line, makeScene2D, Node } from "@motion-canvas/2d";
import { all, chain, createRef, createSignal, easeInOutCubic, waitFor } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
    const triangle = createRef<Line>();
    const a = 3, b = 4, c = 5, scale = 100;
    const scaleSignal = createSignal(1);
    const draw = createSignal(0);
    const color = 'lightseagreen';

    view.add(
        <Line
            position={[-(c*scale/2), (a*scale/2)]}
            ref={triangle}
            points={[
                [0, 0],
                [0, -(a*scale)],
                [(c*scale), 0],
                [0, 0]
            ]}
            stroke={color}
            lineWidth={5}
            end={draw}
            scale={scaleSignal}
        />
    );

    //yield* draw(0.22, 0.66, easeInOutCubic).to(0.64, 0.66, easeInOutCubic).to(1, 0.68, easeInOutCubic);
    yield* draw(1, 1, easeInOutCubic);
    yield* all(
        triangle().fill(color, 0.8, easeInOutCubic),
        triangle().lineWidth(0, 0.8, easeInOutCubic)
    );
    yield* waitFor(1);
    yield* chain(
        all(
            triangle().fill('#20b2aa00', 0.8, easeInOutCubic),
            triangle().lineWidth(5, 0.8, easeInOutCubic)
        ),
        draw(0, 1, easeInOutCubic)
        //draw(0.64, 0.66, easeInOutCubic).to(0.22, 0.66, easeInOutCubic).to(0, 0.68, easeInOutCubic)
    );
});