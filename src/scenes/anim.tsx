import {Latex, Line, makeScene2D, Rect} from "@motion-canvas/2d";
import {all, chain, createRef, createSignal, easeInOutCubic, easeInOutSine, useScene, waitFor} from "@motion-canvas/core";

export default makeScene2D(function* (view) {
    // Fade-out outro
    const ending = createSignal(0);

    // latex references
    const formula = createRef<Latex>();
    const lA = createRef<Latex>();
    const lB = createRef<Latex>();
    const lC = createRef<Latex>();
    const lOp = createSignal(0);

    // Squares references
    const sqA = createRef<Line>();
    const sqB = createRef<Line>();
    const sqC = createRef<Line>();

    // Triangle references
    const triangle = createRef<Line>();
    const a = 3, b = 4, c = 5, scale = 100;
    const scaleSignal = createSignal(1);
    const draw = createSignal(0);
    const color = '#20b2aa';

    // Adding a Node on view goes here
    view.add(
        <>
            <Line
                position={[-(b*scale/2), (a*scale/2)]}
                ref={triangle}
                points={[
                    [0, 0],
                    [0, -(a*scale)],
                    [(b*scale), 0],
                    [0, 0]
                ]}
                stroke={color}
                lineWidth={5}
                end={draw}
                scale={scaleSignal}
            />
            <Line // Rectangle A
                ref={sqA}
                position={[-440, 150]}
                points={[
                    [0, 0],
                    [0, -(a*scale)],
                    [(a*scale), -(a*scale)],
                    [(a*scale), 0],
                    [0, 0]
                ]}
                scale={scaleSignal}
                fill={'#d53e4f'}
                opacity={0}
            />
            <Line // Rectangle B
                ref={sqB}
                position={[-200, 470]}
                points={[
                    [0, 0],
                    [0, -(b*scale)],
                    [(b*scale), -(b*scale)],
                    [(b*scale), 0],
                    [0, 0]
                ]}
                scale={scaleSignal}
                fill={'#d53e4f'}
                opacity={0}
            />
            <Line // Rectangle C
                ref={sqC}
                position={[-200, -90]}
                points={[
                    [0, 0],
                    [0, -(c*scale)],
                    [(c*scale), -(c*scale)],
                    [(c*scale), 0],
                    [0, 0]
                ]}
                scale={scaleSignal}
                fill={'#d53e4f'}
                rotation={Math.asin(a/c)*180/Math.PI}
                opacity={0}
            />
            <Latex ref={lA} scale={2} position={[-300, 0]} fill={'white'} tex={'a'} opacity={0}/>
            <Latex ref={lB} scale={2} position={[0, 250]} fill={'white'} tex={'b'} opacity={0}/>
            <Latex ref={lC} scale={2} position={[75, -75]} fill={'white'} tex={'c'} opacity={0}/>
            <Latex scale={2} position={[-380, 300]} fill={'white'} tex={'+'} opacity={lOp}/>
            <Latex scale={2} position={[100, 300]} fill={'white'} tex={'='} opacity={lOp}/>
            <Latex
                ref={formula}
                scale={2}
                position={[0, 0]}
                tex={["a^2", "+", "b^2", "=", "c", "^2"]}
                fill={'white'}
                opacity={0}
            />
            <Rect
                width={useScene().getSize().x}
                height={useScene().getSize().y}
                fill={'black'}
                opacity={ending}
            />
        </>
    );

    // Animation goes here
    yield* draw(1, 1, easeInOutCubic); // Draw the shape of the triangle
    yield* all( // Fill the triangle
        triangle().fill(color, 0.8, easeInOutCubic),
        triangle().lineWidth(0, 0.8, easeInOutCubic)
    );

    // Fade in the variables, then show their values, aside from C
    yield* chain(
        lA().opacity(1, 0.5, easeInOutCubic),
        lB().opacity(1, 0.5, easeInOutCubic),
        lC().opacity(1, 0.5, easeInOutCubic),
        lA().tex(`${a}`, 0.8, easeInOutCubic),
        lB().tex(`${b}`, 0.8, easeInOutCubic),
        lC().tex('?', 1, easeInOutCubic),

        waitFor(0.8),
        all( // Fade out the variables so they can appear later
            lA().opacity(0, 0.3, easeInOutCubic),
            lB().opacity(0, 0.3, easeInOutCubic),
            lC().opacity(0, 0.3, easeInOutCubic),
        )
    );

    yield* all( // Assigning the variables again...
        lA().position([-855, -250], 0),
        lB().position([-650, -70], 0),
        lC().position([-580, -350], 0),
        lC().tex('5', 0)
    );

    // Shrink the triangle and fade in the squares
    yield* chain(
        scaleSignal(0.8, 0.5, easeInOutCubic),

        sqA().opacity(1, 0.5, easeInOutCubic),
        sqB().opacity(1, 0.5, easeInOutCubic),
        sqC().opacity(1, 0.5, easeInOutCubic),
        waitFor(0.8)
    );

    // Put the triangle on the edge and the squares in the position of the formula, then fade in the formula
    yield* chain(
        all(
            triangle().position([-800, -160], 0.5, easeInOutCubic),
            sqA().position([-700, 415], 0.5, easeInOutCubic),
            sqB().position([-300, 450], 0.5, easeInOutCubic),
            sqC().rotation(0, 0.5, easeInOutCubic),
            sqC().position([180, 490], 0.5, easeInOutCubic),
        ),
        lOp(1, 0.3, easeInOutCubic),
        waitFor(0.8),

        all(
            sqA().opacity(0, 0.5, easeInOutCubic),
            sqB().opacity(0, 0.5, easeInOutCubic),
            sqC().opacity(0, 0.5, easeInOutCubic),
            lOp(0, 0.5, easeInOutCubic),
            formula().position([0, 170], 0.5, easeInOutCubic),
            formula().opacity(1, 0.5, easeInOutCubic)
        ),
        waitFor(0.3),
        all(
            lA().opacity(1, 0.5, easeInOutCubic),
            lB().opacity(1, 0.5, easeInOutCubic),
        ),
        waitFor(0.5)
    );

    // Now, onto the formulas
    yield* chain(
        formula().tex(["c", "^2", "=", "a^2", "+", "b^2"], 1, easeInOutCubic),
        waitFor(1),
        formula().tex(["c", "^2", "=", "3^2", "+", "4^2"], 1, easeInOutCubic),
        waitFor(1),
        formula().tex(["c", "^2", "=", "9", "+", "16"], 1, easeInOutCubic),
        waitFor(1),
        formula().tex(["c", "^2", "=", "25"], 1, easeInOutCubic),
        waitFor(1),
        formula().tex(["c", "=", "\\sqrt{", "25}"], 1, easeInOutCubic),
        waitFor(1),
        formula().tex(["c", "=", "5"], 1, easeInOutCubic),
        waitFor(1),
        all(
            lC().opacity(1, 0.5),
            lC().position([101, 166], 0).to([-580, -350], 1, easeInOutCubic)
        ),
        waitFor(1)
    );

    // Now, we move the square to its original position(-200, 150)
    yield* chain(
        all(
            formula().opacity(0, 0.5, easeInOutCubic),
            triangle().position([-(b*scale/2), (a*scale/2)], 1, easeInOutCubic),
            scaleSignal(1, 1, easeInOutCubic),
            lA().position([-250, 0], 1, easeInOutCubic),
            lB().position([0, 230], 1, easeInOutCubic),
            lC().position([50, -50], 1, easeInOutCubic),
        ),
        waitFor(1)
    );

    // Fade out
    yield* ending(1, 4, easeInOutSine);
});
