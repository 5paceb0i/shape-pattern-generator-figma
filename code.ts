// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(400, 300);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.

const readLocalStorage = async () => {
  const pattern = await figma.clientStorage.getAsync("pattern");
  const density = await figma.clientStorage.getAsync("density");
  const opacity = await figma.clientStorage.getAsync("opacity");
  const stroke = await figma.clientStorage.getAsync("stroke");
  figma.ui.postMessage(
    {
      job: "storage",
      pattern: pattern,
      density: density,
      opacity: opacity,
      stroke: stroke,
    },
    { origin: "*" }
  );
};

readLocalStorage();

const colorArray = [
  { r: 0.184, g: 0.502, b: 0.929 },
  { r: 0.608, g: 0.318, b: 0.878 },
  { r: 0.922, g: 0.341, b: 0.341 },
  { r: 0.949, g: 0.6, b: 0.29 },
  { r: 0.153, g: 0.682, b: 0.376 },
  { r: 0.518, g: 0.51, b: 0.906 },
  { r: 0, g: 0.816, b: 0.573 },
  { r: 0.949, g: 0.855, b: 0.02 },
  { r: 0.804, g: 0.137, b: 0.298 },
];

const randomShape = 1 + Math.floor(Math.random() * 6);
let counter = 0;
let lowerScaleFactor = 0.3;
let higherScaleFactor = 0.6;

const overflowFactor = 1.1;

if (figma.currentPage.selection.length > 0) {
  figma.ui.postMessage({ job: "selection", selection: "yes" }, { origin: "*" });
} else {
  figma.ui.postMessage({ job: "selection", selection: "no" }, { origin: "*" });
}

figma.on("selectionchange", () => {
  if (figma.currentPage.selection.length > 0) {
    figma.ui.postMessage(
      { job: "selection", selection: "yes" },
      { origin: "*" }
    );
  } else {
    figma.ui.postMessage(
      { job: "selection", selection: "no" },
      { origin: "*" }
    );
  }
});

figma.ui.onmessage = async (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === "create-rectangles") {
    figma.clientStorage.setAsync("pattern", msg.patternType);
    figma.clientStorage.setAsync("density", msg.count);
    figma.clientStorage.setAsync("opacity", msg.opacitySwitch);
    figma.clientStorage.setAsync("stroke", msg.strokeSwitch);

    const nodes: SceneNode[] = [];
    const selectedFrame = figma.currentPage.selection[0] as FrameNode;
    const frameWidth = selectedFrame.width;
    const frameHeight = selectedFrame.height;
    const shapesArray = [
      createWave,
      createStair,
      createU,
      createFlower,
      createSakurai,
      createStar1,
      createStar2,
      createPill,
      createSemiCircle,
      createTube,
    ];

    const totalShapes = shapesArray.length;

    let randomMode = false;
    let autoLayouted = false;
    let patternLayout = false;

    //opacityHandle
    let randomizeOpacity = msg.opacitySwitch;

    //check for random, border or cover mode
    if (msg.patternType === "random") {
      randomMode = true;
    } else if (msg.patternType === "border") {
      autoLayouted = true;
      lowerScaleFactor = 0.4;
      higherScaleFactor = 0.2;
    } else if (msg.patternType === "cover") {
      patternLayout = true;
      lowerScaleFactor = 0.2;
      higherScaleFactor = 0.4;
    }

    //border functionalities
    if (randomMode) {
      for (let i = 0; i < msg.count; i++) {
        const shapeNode = shapesArray[(randomShape + i) % totalShapes]();

        nodes.push(shapeNode);
        selectedFrame.appendChild(nodes[i]);

        counter++;
      }
    }

    if (autoLayouted) {
      const frame1 = createAutoLayoutFrame("top");
      const frame2 = createAutoLayoutFrame("down");
      const frame3 = createAutoLayoutFrame("left");
      const frame4 = createAutoLayoutFrame("right");

      const landscape = [frame1, frame2, frame3, frame4];
      const portrait = [frame3, frame4, frame1, frame2];
      let populationMode = [];

      //decide population of shapes based on landscape or portrait parent frame
      if (selectedFrame.width >= selectedFrame.height) {
        populationMode = landscape;
      } else {
        populationMode = portrait;
      }

      for (let i = 0; i < msg.count; i++) {
        counter++;
        const shapeNode = shapesArray[(randomShape + i) % totalShapes]();
        if (i % 6 === 0 || i % 6 === 4) {
          populationMode[i % 4].appendChild(shapeNode);
          nodes.push(shapeNode);
        } else if (i % 6 === 1 || i % 6 === 5) {
          populationMode[i % 4].appendChild(shapeNode);
          nodes.push(shapeNode);
        } else if (i % 6 === 2) {
          populationMode[i % 4].appendChild(shapeNode);
          nodes.push(shapeNode);
        } else if (i % 6 === 3) {
          populationMode[i % 4].appendChild(shapeNode);
          nodes.push(shapeNode);
        }
      }

      frame1.x = -((overflowFactor - 1) * selectedFrame.width) / 2;
      frame1.y = -(frame1.height / 5);

      frame2.x = -((overflowFactor - 1) * selectedFrame.width) / 2;
      frame2.y = selectedFrame.height - (frame2.height * 4) / 5;

      frame3.x = -(frame3.width / 5);
      frame3.y = -((overflowFactor - 1) * selectedFrame.height) / 5;

      frame4.x = selectedFrame.width - (frame4.width * 4) / 5;
      frame4.y = -((overflowFactor - 1) * selectedFrame.height) / 5;

      selectedFrame.appendChild(frame1);
      selectedFrame.appendChild(frame2);
      selectedFrame.appendChild(frame3);
      selectedFrame.appendChild(frame4);
    }

    if (patternLayout === true) {
      //patternLayout functionalities
      let randomPatternNumber = 1 + Math.floor(Math.random() * 2);
      const rowItemCount1 = 7;
      const rowItemCount2 = 8;
      const finalPatternFrame = figma.createFrame() as FrameNode;
      finalPatternFrame.layoutMode = "VERTICAL";
      finalPatternFrame.primaryAxisSizingMode = "FIXED";
      finalPatternFrame.primaryAxisAlignItems = "SPACE_BETWEEN";
      finalPatternFrame.counterAxisSizingMode = "AUTO";
      finalPatternFrame.fills = [];
      finalPatternFrame.resize(selectedFrame.width, selectedFrame.height);

      for (let i = 0; i < msg.count; i++) {
        const rowFrame = createPatternLayoutFrame();
        if (randomPatternNumber % 2 == 0) {
          const randomNum = Math.floor(Math.random() * totalShapes);
          for (let i = 0; i < rowItemCount1; i++) {
            counter++;
            const randomShape = shapesArray[(randomNum + i) % totalShapes]();
            rowFrame.appendChild(randomShape);
            nodes.push(randomShape);
          }
          randomPatternNumber = 1;
        } else if (randomPatternNumber % 2 == 1) {
          const randomNum = Math.floor(Math.random() * totalShapes);
          for (let i = 0; i < rowItemCount2; i++) {
            counter++;
            const randomShape = shapesArray[(randomNum + i) % totalShapes]();
            rowFrame.appendChild(randomShape);
            nodes.push(randomShape);
          }
          randomPatternNumber = 0;
        }
        finalPatternFrame.appendChild(rowFrame);
      }
      selectedFrame.appendChild(finalPatternFrame);
    }

    if (randomizeOpacity) {
      for (let i in nodes) {
        (nodes[i] as VectorNode).opacity = 0.4 + Math.random() * 0.6;
      }
    }

    if (msg.strokeSwitch) {
      for (let i in nodes) {
        (nodes[i] as VectorNode).strokes = [
          {
            type: "SOLID",
            visible: true,
            opacity: 1,
            blendMode: "NORMAL",
            color: {
              r: 0.06666667014360428,
              g: 0.06666667014360428,
              b: 0.06666667014360428,
            },
          },
        ];

        (nodes[i] as VectorNode).strokeWeight = 3;
      }
    }

    //figma.currentPage.selection = nodes;
    //figma.viewport.scrollAndZoomIntoView(nodes);
    figma.notify("✨ Shapes generated successfully ✨");
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};

function createWave() {
  var vector_2_85 = figma.createVector();
  const selectedFrame = figma.currentPage.selection[0] as FrameNode;

  //--------------enter size variables here
  vector_2_85.resize(267.0, 18.0);
  vector_2_85.name = "zig-zag";

  //--------------color variables here
  vector_2_85.strokes = [
    {
      type: "SOLID",
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
      color: colorArray[(randomShape + counter) % 8],
    },
  ];
  vector_2_85.strokeWeight = 3;
  vector_2_85.strokeCap = "ROUND";
  vector_2_85.strokeMiterLimit = 10;
  vector_2_85.relativeTransform = [
    [1, 0, -926],
    [0, 1, -825],
  ];

  //--------------position & rotation variables here
  vector_2_85.x = Math.random() * selectedFrame.width + 10;
  vector_2_85.y = Math.random() * selectedFrame.height + 10;
  vector_2_85.vectorNetwork = {
    regions: [
      {
        windingRule: "NONZERO",
        loops: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
        fills: [],
        fillStyleId: "",
      },
    ],
    segments: [
      {
        start: 0,
        end: 1,
        tangentStart: { x: 13.354700088500977, y: 0 },
        tangentEnd: { x: -13.354700088500977, y: 0 },
      },
      {
        start: 1,
        end: 2,
        tangentStart: { x: 13.354700088500977, y: 0 },
        tangentEnd: { x: -13.354700088500977, y: 0 },
      },
      {
        start: 2,
        end: 3,
        tangentStart: { x: 13.354700088500977, y: 0 },
        tangentEnd: { x: -13.323399543762207, y: 0 },
      },
      {
        start: 3,
        end: 4,
        tangentStart: { x: 13.35509967803955, y: 0 },
        tangentEnd: { x: -13.322999954223633, y: 0 },
      },
      {
        start: 4,
        end: 5,
        tangentStart: { x: 13.354999542236328, y: 0 },
        tangentEnd: { x: -13.322999954223633, y: 0 },
      },
      {
        start: 5,
        end: 6,
        tangentStart: { x: 13.354999542236328, y: 0 },
        tangentEnd: { x: -13.354000091552734, y: 0 },
      },
      {
        start: 6,
        end: 7,
        tangentStart: { x: 13.354999542236328, y: 0 },
        tangentEnd: { x: -13.354999542236328, y: 0 },
      },
      {
        start: 7,
        end: 8,
        tangentStart: { x: 13.354000091552734, y: 0 },
        tangentEnd: { x: -13.354999542236328, y: 0 },
      },
      {
        start: 8,
        end: 9,
        tangentStart: { x: 13.354999542236328, y: 0 },
        tangentEnd: { x: -13.354999542236328, y: 0 },
      },
      {
        start: 9,
        end: 10,
        tangentStart: { x: 13.354000091552734, y: 0 },
        tangentEnd: { x: -13.354999542236328, y: 0 },
      },
    ],
    vertices: [
      {
        x: 0,
        y: 0,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 26.709400177001953,
        y: 18,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 53.418800354003906,
        y: 0,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 80.0969009399414,
        y: 18,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 106.7750015258789,
        y: 0,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 133.4530029296875,
        y: 18,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 160.16200256347656,
        y: 0,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 186.8719940185547,
        y: 18,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 213.58099365234375,
        y: 0,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 240.29098510742188,
        y: 18,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 267,
        y: 0,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
    ],
  };
  vector_2_85.vectorPaths = [
    {
      windingRule: "NONZERO",
      data: "M 0 0 C 13.354700088500977 0 13.354700088500977 18 26.709400177001953 18 C 40.06410026550293 18 40.06410026550293 0 53.418800354003906 0 C 66.77350044250488 0 66.7735013961792 18 80.0969009399414 18 C 93.45200061798096 18 93.45200157165527 0 106.7750015258789 0 C 120.13000106811523 0 120.13000297546387 18 133.4530029296875 18 C 146.80800247192383 18 146.80800247192383 0 160.16200256347656 0 C 173.5170021057129 0 173.51699447631836 18 186.8719940185547 18 C 200.22599411010742 18 200.22599411010742 0 213.58099365234375 0 C 226.93599319458008 0 226.93598556518555 18 240.29098510742188 18 C 253.6449851989746 18 253.64500045776367 0 267 0",
    },
  ];
  vector_2_85.rescale(lowerScaleFactor + Math.random() * higherScaleFactor);
  vector_2_85.rotation = Math.random() * 270;
  return vector_2_85;
}

function createStair() {
  var vector_2_86 = figma.createVector();
  const selectedFrame = figma.currentPage.selection[0] as FrameNode;

  vector_2_86.resize(200.0, 200.0);
  vector_2_86.name = "stair";
  vector_2_86.fills = [
    {
      type: "SOLID",
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
      color: colorArray[(randomShape + counter) % 8],
    },
  ];
  vector_2_86.strokes = [];
  vector_2_86.strokeAlign = "INSIDE";
  vector_2_86.relativeTransform = [
    [1, 0, -859],
    [0, 1, -634],
  ];
  vector_2_86.x = Math.random() * selectedFrame.width + 10;
  vector_2_86.y = Math.random() * selectedFrame.height + 10;
  vector_2_86.exportSettings = [
    {
      format: "PNG",
      suffix: "",
      contentsOnly: true,
      constraint: { type: "SCALE", value: 1 },
    },
  ];
  vector_2_86.vectorNetwork = {
    regions: [
      {
        windingRule: "NONZERO",
        loops: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
        fills: [
          {
            type: "SOLID",
            visible: true,
            opacity: 1,
            blendMode: "NORMAL",
            color: {
              r: 0.15294118225574493,
              g: 0.6823529601097107,
              b: 0.3764705955982208,
            },
          },
        ],
        fillStyleId: "",
      },
    ],
    segments: [
      {
        start: 0,
        end: 1,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 1,
        end: 2,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 2,
        end: 3,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 3,
        end: 4,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 4,
        end: 5,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 5,
        end: 6,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 6,
        end: 7,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 7,
        end: 8,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 8,
        end: 9,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 9,
        end: 0,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
    ],
    vertices: [
      {
        x: 50,
        y: 0,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 0,
        y: 0,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 0,
        y: 200,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 200,
        y: 200,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 200,
        y: 150,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 150,
        y: 150,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 150,
        y: 100,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 100,
        y: 100,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 100,
        y: 50,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 50,
        y: 50,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
    ],
  };
  vector_2_86.vectorPaths = [
    {
      windingRule: "NONZERO",
      data: "M 50 0 L 0 0 L 0 200 L 200 200 L 200 150 L 150 150 L 150 100 L 100 100 L 100 50 L 50 50 L 50 0 Z",
    },
  ];
  vector_2_86.rescale(lowerScaleFactor + Math.random() * higherScaleFactor);
  vector_2_86.rotation = Math.random() * 360;
  return vector_2_86;
}

function createU() {
  var vector_2_87 = figma.createVector();
  const selectedFrame = figma.currentPage.selection[0] as FrameNode;

  vector_2_87.resize(187.0, 196.0);
  vector_2_87.name = "UTube";
  vector_2_87.fills = [
    {
      type: "SOLID",
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
      color: colorArray[(randomShape + counter) % 8],
    },
  ];
  vector_2_87.strokes = [];
  vector_2_87.strokeAlign = "INSIDE";
  vector_2_87.relativeTransform = [
    [1, 0, -829],
    [0, 1, -355],
  ];
  vector_2_87.x = Math.random() * selectedFrame.width + 10;
  vector_2_87.y = Math.random() * selectedFrame.height + 10;
  vector_2_87.vectorNetwork = {
    regions: [
      {
        windingRule: "NONZERO",
        loops: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
        fills: [
          {
            type: "SOLID",
            visible: true,
            opacity: 1,
            blendMode: "NORMAL",
            color: {
              r: 0.6078431606292725,
              g: 0.3176470696926117,
              b: 0.8784313797950745,
            },
          },
        ],
        fillStyleId: "",
      },
    ],
    segments: [
      {
        start: 0,
        end: 1,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 1,
        end: 2,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 2,
        end: 3,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 3,
        end: 4,
        tangentStart: { x: 16.868999481201172, y: 0 },
        tangentEnd: { x: 0, y: -16.691999435424805 },
      },
      {
        start: 4,
        end: 5,
        tangentStart: { x: 0, y: 16.68899917602539 },
        tangentEnd: { x: 16.868999481201172, y: 0 },
      },
      {
        start: 5,
        end: 6,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 6,
        end: 7,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 7,
        end: 8,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 8,
        end: 9,
        tangentStart: { x: 54.345001220703125, y: 0 },
        tangentEnd: { x: 0, y: 54.071998596191406 },
      },
      {
        start: 9,
        end: 0,
        tangentStart: { x: 0, y: -54.07210159301758 },
        tangentEnd: { x: 54.345001220703125, y: 0 },
      },
    ],
    vertices: [
      {
        x: 88.40199279785156,
        y: 0,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 0,
        y: 0,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 0,
        y: 67.66899871826172,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 88.40199279785156,
        y: 67.66899871826172,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 118.95700073242188,
        y: 98,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 88.40199279785156,
        y: 128.33099365234375,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 0,
        y: 128.33099365234375,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 0,
        y: 196,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 88.40199279785156,
        y: 196,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 187,
        y: 98,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
    ],
  };
  vector_2_87.vectorPaths = [
    {
      windingRule: "NONZERO",
      data: "M 88.40199279785156 0 L 0 0 L 0 67.66899871826172 L 88.40199279785156 67.66899871826172 C 105.27099227905273 67.66899871826172 118.95700073242188 81.3080005645752 118.95700073242188 98 C 118.95700073242188 114.68899917602539 105.27099227905273 128.33099365234375 88.40199279785156 128.33099365234375 L 0 128.33099365234375 L 0 196 L 88.40199279785156 196 C 142.7469940185547 196 187 152.0719985961914 187 98 C 187 43.92789840698242 142.7469940185547 0 88.40199279785156 0 Z",
    },
  ];
  vector_2_87.rescale(lowerScaleFactor + Math.random() * higherScaleFactor);
  vector_2_87.rotation = Math.random() * 360;
  return vector_2_87;
}

function createFlower() {
  const selectedFrame = figma.currentPage.selection[0] as FrameNode;

  var vector_74_247 = figma.createVector();

  vector_74_247.resize(200.0, 200.0);
  vector_74_247.name = "Periwinkle";
  vector_74_247.fills = [
    {
      type: "SOLID",
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
      color: colorArray[(randomShape + counter) % 8],
    },
  ];
  vector_74_247.strokes = [];
  vector_74_247.strokeWeight = 6.267963409423828;
  vector_74_247.strokeAlign = "INSIDE";
  vector_74_247.relativeTransform = [
    [1, 0, 6263],
    [0, 1, 2456],
  ];
  vector_74_247.x = Math.random() * selectedFrame.width + 10;
  vector_74_247.y = Math.random() * selectedFrame.height + 10;
  vector_74_247.cornerRadius = 169.23501586914062;
  vector_74_247.vectorNetwork = {
    regions: [
      {
        windingRule: "NONZERO",
        loops: [[7, 6, 5, 4, 3, 2, 1, 0]],
        fills: [
          {
            type: "SOLID",
            visible: true,
            opacity: 1,
            blendMode: "NORMAL",
            color: {
              r: 0.9215686321258545,
              g: 0.34117648005485535,
              b: 0.34117648005485535,
            },
          },
        ],
        fillStyleId: "",
      },
    ],
    segments: [
      {
        start: 0,
        end: 1,
        tangentStart: { x: 16.19430957992207, y: -2.4372875114157133 },
        tangentEnd: { x: -2.4372875114157133, y: 16.19430957992207 },
      },
      {
        start: 2,
        end: 0,
        tangentStart: { x: -42.34578430658754, y: -6.373155657668831 },
        tangentEnd: { x: -42.34578430658754, y: 6.373155657668831 },
      },
      {
        start: 3,
        end: 2,
        tangentStart: { x: -2.4372875114157133, y: -16.19430957992207 },
        tangentEnd: { x: 16.19430957992207, y: 2.4372875114157133 },
      },
      {
        start: 4,
        end: 3,
        tangentStart: { x: -6.373155657668831, y: 42.34578430658754 },
        tangentEnd: { x: 6.373155657668831, y: 42.34578430658754 },
      },
      {
        start: 5,
        end: 4,
        tangentStart: { x: -16.19430957992207, y: 2.4372875114157133 },
        tangentEnd: { x: 2.4372875114157133, y: -16.19430957992207 },
      },
      {
        start: 6,
        end: 5,
        tangentStart: { x: 42.34578430658754, y: 6.373155657668831 },
        tangentEnd: { x: 42.34578430658754, y: -6.373155657668831 },
      },
      {
        start: 7,
        end: 6,
        tangentStart: { x: 2.4372875114157133, y: 16.19430957992207 },
        tangentEnd: { x: -16.19430957992207, y: -2.4372875114157133 },
      },
      {
        start: 7,
        end: 1,
        tangentStart: { x: -6.373155657668831, y: -42.34578430658754 },
        tangentEnd: { x: 6.373155657668831, y: -42.34578430658754 },
      },
    ],
    vertices: [
      {
        x: 31.759342713137453,
        y: 63.10312894857558,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 169.23501586914062,
        handleMirroring: "NONE",
      },
      {
        x: 63.10312894857558,
        y: 31.759333746743856,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 169.23501586914062,
        handleMirroring: "NONE",
      },
      {
        x: 31.759333746743856,
        y: 136.89686507382868,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 169.23501586914062,
        handleMirroring: "NONE",
      },
      {
        x: 63.10312894857558,
        y: 168.2406513092668,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 169.23501586914062,
        handleMirroring: "NONE",
      },
      {
        x: 136.89686507382868,
        y: 168.24066326445828,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 169.23501586914062,
        handleMirroring: "NONE",
      },
      {
        x: 168.2406513092668,
        y: 136.89687702902015,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 169.23501586914062,
        handleMirroring: "NONE",
      },
      {
        x: 168.24066326445828,
        y: 63.10312894857558,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 169.23501586914062,
        handleMirroring: "NONE",
      },
      {
        x: 136.89687702902015,
        y: 31.759342713137453,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 169.23501586914062,
        handleMirroring: "NONE",
      },
    ],
  };
  vector_74_247.vectorPaths = [
    {
      windingRule: "NONZERO",
      data: "M 63.10312894857558 31.759333746743856 C 69.4762846062444 -10.586450559843684 130.52372137135131 -10.586441593450086 136.89687702902015 31.759342713137453 C 139.33416454043586 47.95365229305952 152.0463536845362 60.66584143715987 168.24066326445828 63.10312894857558 C 210.58644757104582 69.4762846062444 210.58643561585436 130.52372137135131 168.2406513092668 136.89687702902015 C 152.04634172934473 139.33416454043586 139.3341525852444 152.0463536845362 136.89686507382868 168.24066326445828 C 130.52370941615985 210.58644757104582 69.4762846062444 210.58643561585436 63.10312894857558 168.2406513092668 C 60.66584143715987 152.04634172934473 47.953643326665926 139.3341525852444 31.759333746743856 136.89686507382868 C -10.586450559843684 130.52370941615985 -10.586441593450086 69.4762846062444 31.759342713137453 63.10312894857558 C 47.95365229305952 60.66584143715987 60.66584143715987 47.953643326665926 63.10312894857558 31.759333746743856 Z",
    },
  ];

  vector_74_247.rescale(lowerScaleFactor + Math.random() * higherScaleFactor);
  vector_74_247.rotation = Math.random() * 45;
  return vector_74_247;
}

function createSakurai() {
  const selectedFrame = figma.currentPage.selection[0] as FrameNode;

  var vector_73_148 = figma.createVector();

  vector_73_148.resize(174.0, 168.0904541016);
  vector_73_148.name = "Periwinkle";
  vector_73_148.fills = [
    {
      type: "SOLID",
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
      color: colorArray[(randomShape + counter) % 8],
    },
  ];
  vector_73_148.strokes = [];
  vector_73_148.strokeWeight = 5.366353511810303;
  vector_73_148.strokeAlign = "INSIDE";
  vector_73_148.relativeTransform = [
    [1, 0, 4570],
    [0, 1, 2860.2717285156],
  ];
  vector_73_148.x = Math.random() * selectedFrame.width + 10;
  vector_73_148.y = Math.random() * selectedFrame.height + 10;
  vector_73_148.vectorNetwork = {
    regions: [
      {
        windingRule: "EVENODD",
        loops: [
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          [10, 11, 12, 13],
        ],
        fills: [
          {
            type: "SOLID",
            visible: true,
            opacity: 1,
            blendMode: "NORMAL",
            color: {
              r: 0.18431372940540314,
              g: 0.501960813999176,
              b: 0.929411768913269,
            },
          },
        ],
        fillStyleId: "",
      },
    ],
    segments: [
      {
        start: 0,
        end: 1,
        tangentStart: { x: 3.8557155837245083, y: -30.151127775241402 },
        tangentEnd: { x: -3.8557258192317656, y: -30.151130334117997 },
      },
      {
        start: 2,
        end: 0,
        tangentStart: { x: 14.651888104022873, y: 2.7718365412757744 },
        tangentEnd: { x: -1.8915115055925282, y: 14.791317478201904 },
      },
      {
        start: 3,
        end: 2,
        tangentStart: { x: -27.48394907752785, y: -12.98422603208212 },
        tangentEnd: { x: -29.866915905190027, y: -5.650206791851688 },
      },
      {
        start: 4,
        end: 3,
        tangentStart: { x: 7.163854559089055, y: -13.078223804940942 },
        tangentEnd: { x: 13.482871628620973, y: 6.369698918589294 },
      },
      {
        start: 5,
        end: 4,
        tangentStart: { x: -20.841739469163066, y: 22.126442153121587 },
        tangentEnd: { x: -14.603049381145938, y: 26.659123563806812 },
      },
      {
        start: 6,
        end: 5,
        tangentStart: { x: -10.224381260645075, y: -10.854621456496245 },
        tangentEnd: { x: 10.224381260645075, y: -10.854631692002627 },
      },
      {
        start: 7,
        end: 6,
        tangentStart: { x: 14.603049381145938, y: 26.659113328300432 },
        tangentEnd: { x: 20.841744586916693, y: 22.126442153121587 },
      },
      {
        start: 8,
        end: 7,
        tangentStart: { x: -13.482875466936195, y: 6.369698918589294 },
        tangentEnd: { x: -7.16385200021224, y: -13.078223804940942 },
      },
      {
        start: 9,
        end: 8,
        tangentStart: { x: 29.86692358182047, y: -5.650204232975093 },
        tangentEnd: { x: 27.48395419528148, y: -12.98422603208212 },
      },
      {
        start: 1,
        end: 9,
        tangentStart: { x: 1.8915012700852714, y: 14.791317478201904 },
        tangentEnd: { x: -14.651882986269245, y: 2.7718365412757744 },
      },
      {
        start: 10,
        end: 11,
        tangentStart: { x: 6.580858298731224e-16, y: 11.855019379257232 },
        tangentEnd: { x: 11.855020392777591, y: -6.580857736114405e-16 },
      },
      {
        start: 12,
        end: 10,
        tangentStart: { x: 11.855020392777591, y: -6.580857736114405e-16 },
        tangentEnd: { x: -6.580858298731224e-16, y: -11.855019379257232 },
      },
      {
        start: 13,
        end: 12,
        tangentStart: { x: -6.580858298731224e-16, y: -11.855019379257232 },
        tangentEnd: { x: -11.855020392777591, y: 6.580857736114405e-16 },
      },
      {
        start: 11,
        end: 13,
        tangentStart: { x: -11.855020392777591, y: 6.580857736114405e-16 },
        tangentEnd: { x: 6.580858298731224e-16, y: 11.855019379257232 },
      },
    ],
    vertices: [
      {
        x: 61.310708940645,
        y: 22.613350309465094,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 112.689291059355,
        y: 22.613345191711904,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 30.807344076459007,
        y: 44.775335258498075,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 14.930484537736845,
        y: 93.63926401228684,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 26.58173005484938,
        y: 129.49811188974022,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 68.14787937348814,
        y: 159.69769711107045,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 105.85211550875825,
        y: 159.69769711107045,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 147.418264827397,
        y: 129.49811188974022,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 159.06951674170156,
        y: 93.63926401228684,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 143.19264824691055,
        y: 44.775335258498075,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 108.46457520350718,
        y: 90.04507618176444,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 86.99916068840493,
        y: 111.51048886172565,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 86.99916068840493,
        y: 68.57966861955643,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 65.53374105554904,
        y: 90.04507618176444,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
    ],
  };
  vector_73_148.vectorPaths = [
    {
      windingRule: "EVENODD",
      data: "M 112.689291059355 22.613345191711904 C 108.83356524012324 -7.5377851424060935 65.1664245243695 -7.537777465776308 61.310708940645 22.613350309465094 C 59.419197435052475 37.404667787666995 45.45923218048188 47.54717179977385 30.807344076459007 44.775335258498075 C 0.9404281712689802 39.12512846664639 -12.553464539791005 80.65503798020472 14.930484537736845 93.63926401228684 C 28.41335616635782 100.00896293087614 33.74558461393843 116.41988808479927 26.58173005484938 129.49811188974022 C 11.978680673703442 156.15723545354703 47.30613990432507 181.82413926419204 68.14787937348814 159.69769711107045 C 78.37226063413321 148.84306541906784 95.62773424811317 148.84307565457422 105.85211550875825 159.69769711107045 C 126.69386009567494 181.82413926419204 162.02131420854295 156.15722521804065 147.418264827397 129.49811188974022 C 140.25441282718475 116.41988808479927 145.58664127476536 100.00896293087614 159.06951674170156 93.63926401228684 C 186.55347093698305 80.65503798020472 173.059571828731 39.12513102552298 143.19264824691055 44.775335258498075 C 128.5407652606413 47.54717179977385 114.58079232944027 37.404662669913805 112.689291059355 22.613345191711904 Z M 86.99916068840493 111.51048886172565 C 98.85418108118252 111.51048886172565 108.46457520350718 101.90009556102167 108.46457520350718 90.04507618176444 C 108.46457520350718 78.19005680250721 98.85418108118252 68.57966861955643 86.99916068840493 68.57966861955643 C 75.14414029562734 68.57966861955643 65.53374105554904 78.19005680250721 65.53374105554904 90.04507618176444 C 65.53374105554904 101.90009556102167 75.14414029562734 111.51048886172565 86.99916068840493 111.51048886172565 Z",
    },
  ];

  vector_73_148.rescale(lowerScaleFactor + Math.random() * higherScaleFactor);
  vector_73_148.rotation = Math.random() * 45;
  return vector_73_148;
}

function createStar1() {
  var vector_2_88 = figma.createVector();
  const selectedFrame = figma.currentPage.selection[0] as FrameNode;

  vector_2_88.resize(268.0000305176, 268.0000305176);
  vector_2_88.name = "Star";
  vector_2_88.fills = [
    {
      type: "SOLID",
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
      color: colorArray[(randomShape + counter) % 8],
    },
  ];
  vector_2_88.strokes = [];
  vector_2_88.strokeAlign = "INSIDE";
  vector_2_88.relativeTransform = [
    [1, 0, -893],
    [0, 1, 538],
  ];
  vector_2_88.x = Math.random() * selectedFrame.width + 10;
  vector_2_88.y = Math.random() * selectedFrame.height + 10;
  vector_2_88.vectorNetwork = {
    regions: [
      {
        windingRule: "NONZERO",
        loops: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]],
        fills: [
          {
            type: "SOLID",
            visible: true,
            opacity: 1,
            blendMode: "NORMAL",
            color: {
              r: 0.9490196108818054,
              g: 0.6000000238418579,
              b: 0.29019609093666077,
            },
          },
        ],
        fillStyleId: "",
      },
    ],
    segments: [
      {
        start: 0,
        end: 1,
        tangentStart: { x: 0.503000020980835, y: -4.235499858856201 },
        tangentEnd: { x: -0.503000020980835, y: -4.235499858856201 },
      },
      {
        start: 1,
        end: 2,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 2,
        end: 3,
        tangentStart: { x: 5.443999767303467, y: 45.88140106201172 },
        tangentEnd: { x: -45.88100051879883, y: -5.443999767303467 },
      },
      {
        start: 3,
        end: 4,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 4,
        end: 5,
        tangentStart: { x: 4.236000061035156, y: 0.503000020980835 },
        tangentEnd: { x: 4.236000061035156, y: -0.503000020980835 },
      },
      {
        start: 5,
        end: 6,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 6,
        end: 7,
        tangentStart: { x: -45.88100051879883, y: 5.443999767303467 },
        tangentEnd: { x: 5.443999767303467, y: -45.88100051879883 },
      },
      {
        start: 7,
        end: 8,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 8,
        end: 9,
        tangentStart: { x: -0.503000020980835, y: 4.236000061035156 },
        tangentEnd: { x: 0.503000020980835, y: 4.236000061035156 },
      },
      {
        start: 9,
        end: 10,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 10,
        end: 11,
        tangentStart: { x: -5.443999767303467, y: -45.88100051879883 },
        tangentEnd: { x: 45.88140106201172, y: 5.443999767303467 },
      },
      {
        start: 11,
        end: 12,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 12,
        end: 13,
        tangentStart: { x: -4.235499858856201, y: -0.503000020980835 },
        tangentEnd: { x: -4.235499858856201, y: 0.503000020980835 },
      },
      {
        start: 13,
        end: 14,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 14,
        end: 15,
        tangentStart: { x: 45.88140106201172, y: -5.443999767303467 },
        tangentEnd: { x: -5.443999767303467, y: 45.88140106201172 },
      },
      {
        start: 15,
        end: 0,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
    ],
    vertices: [
      {
        x: 130.4240264892578,
        y: 3.1766247749328613,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 137.57603454589844,
        y: 3.1766247749328613,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 141.7920379638672,
        y: 38.70862579345703,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 229.29103088378906,
        y: 126.20801544189453,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 264.8230285644531,
        y: 130.4240264892578,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 264.8230285644531,
        y: 137.57603454589844,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 229.29103088378906,
        y: 141.7920379638672,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 141.7920379638672,
        y: 229.29103088378906,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 137.57603454589844,
        y: 264.8230285644531,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 130.4240264892578,
        y: 264.8230285644531,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 126.20801544189453,
        y: 229.29103088378906,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 38.70862579345703,
        y: 141.7920379638672,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 3.1766247749328613,
        y: 137.57603454589844,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 3.1766247749328613,
        y: 130.4240264892578,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 38.70862579345703,
        y: 126.20801544189453,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 126.20801544189453,
        y: 38.70862579345703,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
    ],
  };
  vector_2_88.vectorPaths = [
    {
      windingRule: "NONZERO",
      data: "M 130.4240264892578 3.1766247749328613 C 130.92702651023865 -1.0588750839233398 137.0730345249176 -1.0588750839233398 137.57603454589844 3.1766247749328613 L 141.7920379638672 38.70862579345703 C 147.23603773117065 84.59002685546875 183.41003036499023 120.76401567459106 229.29103088378906 126.20801544189453 L 264.8230285644531 130.4240264892578 C 269.0590286254883 130.92702651023865 269.0590286254883 137.0730345249176 264.8230285644531 137.57603454589844 L 229.29103088378906 141.7920379638672 C 183.41003036499023 147.23603773117065 147.23603773117065 183.41003036499023 141.7920379638672 229.29103088378906 L 137.57603454589844 264.8230285644531 C 137.0730345249176 269.0590286254883 130.92702651023865 269.0590286254883 130.4240264892578 264.8230285644531 L 126.20801544189453 229.29103088378906 C 120.76401567459106 183.41003036499023 84.59002685546875 147.23603773117065 38.70862579345703 141.7920379638672 L 3.1766247749328613 137.57603454589844 C -1.0588750839233398 137.0730345249176 -1.0588750839233398 130.92702651023865 3.1766247749328613 130.4240264892578 L 38.70862579345703 126.20801544189453 C 84.59002685546875 120.76401567459106 120.76401567459106 84.59002685546875 126.20801544189453 38.70862579345703 L 130.4240264892578 3.1766247749328613 Z",
    },
  ];
  vector_2_88.rescale(lowerScaleFactor + Math.random() * higherScaleFactor);
  vector_2_88.rotation = Math.random() * 360;
  return vector_2_88;
}

function createSun() {
  var vector_2_89 = figma.createVector();
  const selectedFrame = figma.currentPage.selection[0] as FrameNode;

  vector_2_89.resize(248.0, 248.0);
  vector_2_89.name = "Sun";
  vector_2_89.fills = [
    {
      type: "SOLID",
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
      color: colorArray[(randomShape + counter) % 8],
    },
  ];
  vector_2_89.strokes = [
    {
      type: "SOLID",
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
      color: colorArray[(randomShape + counter) % 8],
    },
  ];
  vector_2_89.strokeWeight = 4;
  vector_2_89.relativeTransform = [
    [1, 0, -863],
    [0, 1, 903],
  ];
  vector_2_89.x = Math.random() * selectedFrame.width + 10;
  vector_2_89.y = Math.random() * selectedFrame.height + 10;
  vector_2_89.vectorNetwork = {
    regions: [
      {
        windingRule: "NONZERO",
        loops: [
          [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
          ],
        ],
        fills: [
          {
            type: "SOLID",
            visible: true,
            opacity: 1,
            blendMode: "NORMAL",
            color: {
              r: 0.9411764740943909,
              g: 0.7647058963775635,
              b: 0.8235294222831726,
            },
          },
        ],
        fillStyleId: "",
      },
    ],
    segments: [
      {
        start: 0,
        end: 1,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 1,
        end: 2,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 2,
        end: 3,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 3,
        end: 4,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 4,
        end: 5,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 5,
        end: 6,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 6,
        end: 7,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 7,
        end: 8,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 8,
        end: 9,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 9,
        end: 10,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 10,
        end: 11,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 11,
        end: 12,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 12,
        end: 13,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 13,
        end: 14,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 14,
        end: 15,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 15,
        end: 16,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 16,
        end: 17,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 17,
        end: 18,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 18,
        end: 19,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 19,
        end: 20,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 20,
        end: 21,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 21,
        end: 22,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 22,
        end: 23,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 23,
        end: 24,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 24,
        end: 25,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 25,
        end: 26,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 26,
        end: 27,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 27,
        end: 28,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 28,
        end: 29,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 29,
        end: 30,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 30,
        end: 31,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 31,
        end: 0,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
    ],
    vertices: [
      {
        x: 124,
        y: 0,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 124.02400207519531,
        y: 123.87800598144531,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 171.4530029296875,
        y: 9.438899993896484,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 124.06900024414062,
        y: 123.89700317382812,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 211.68099975585938,
        y: 36.31880187988281,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 124.10299682617188,
        y: 123.93099975585938,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 238.56100463867188,
        y: 76.5469970703125,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 124.12199401855469,
        y: 123.97599792480469,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 248,
        y: 124,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 124.12199401855469,
        y: 124.02400207519531,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 238.56100463867188,
        y: 171.4530029296875,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 124.10299682617188,
        y: 124.06900024414062,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 211.68099975585938,
        y: 211.68099975585938,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 124.06900024414062,
        y: 124.10299682617188,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 171.4530029296875,
        y: 238.56100463867188,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 124.02400207519531,
        y: 124.12199401855469,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 124,
        y: 248,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 123.97599792480469,
        y: 124.12199401855469,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 76.5469970703125,
        y: 238.56100463867188,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 123.93099975585938,
        y: 124.10299682617188,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 36.31880187988281,
        y: 211.68099975585938,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 123.89700317382812,
        y: 124.06900024414062,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 9.438899993896484,
        y: 171.4530029296875,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 123.87800598144531,
        y: 124.02400207519531,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 0,
        y: 124,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 123.87800598144531,
        y: 123.97599792480469,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 9.438899993896484,
        y: 76.5469970703125,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 123.89700317382812,
        y: 123.93099975585938,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 36.31880187988281,
        y: 36.31880187988281,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 123.93099975585938,
        y: 123.89700317382812,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 76.5469970703125,
        y: 9.438899993896484,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 123.97599792480469,
        y: 123.87800598144531,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
    ],
  };
  vector_2_89.vectorPaths = [
    {
      windingRule: "NONZERO",
      data: "M 124 0 L 124.02400207519531 123.87800598144531 L 171.4530029296875 9.438899993896484 L 124.06900024414062 123.89700317382812 L 211.68099975585938 36.31880187988281 L 124.10299682617188 123.93099975585938 L 238.56100463867188 76.5469970703125 L 124.12199401855469 123.97599792480469 L 248 124 L 124.12199401855469 124.02400207519531 L 238.56100463867188 171.4530029296875 L 124.10299682617188 124.06900024414062 L 211.68099975585938 211.68099975585938 L 124.06900024414062 124.10299682617188 L 171.4530029296875 238.56100463867188 L 124.02400207519531 124.12199401855469 L 124 248 L 123.97599792480469 124.12199401855469 L 76.5469970703125 238.56100463867188 L 123.93099975585938 124.10299682617188 L 36.31880187988281 211.68099975585938 L 123.89700317382812 124.06900024414062 L 9.438899993896484 171.4530029296875 L 123.87800598144531 124.02400207519531 L 0 124 L 123.87800598144531 123.97599792480469 L 9.438899993896484 76.5469970703125 L 123.89700317382812 123.93099975585938 L 36.31880187988281 36.31880187988281 L 123.93099975585938 123.89700317382812 L 76.5469970703125 9.438899993896484 L 123.97599792480469 123.87800598144531 L 124 0 Z",
    },
  ];
  vector_2_89.rescale(lowerScaleFactor + Math.random() * higherScaleFactor);
  vector_2_89.rotation = Math.random() * 360;
  return vector_2_89;
}

function createSpring() {
  var vector_2_84 = figma.createVector();
  const selectedFrame = figma.currentPage.selection[0] as FrameNode;

  vector_2_84.resize(119.0, 254.0);
  vector_2_84.name = "Spring";
  vector_2_84.strokes = [
    {
      type: "SOLID",
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
      color: colorArray[(randomShape + counter) % 8],
    },
  ];
  vector_2_84.strokeWeight = 3;
  vector_2_84.strokeCap = "ROUND";
  vector_2_84.relativeTransform = [
    [1, 0, -795],
    [0, 1, 1291],
  ];
  vector_2_84.x = Math.random() * selectedFrame.width + 10;
  vector_2_84.y = Math.random() * selectedFrame.height + 10;
  vector_2_84.vectorNetwork = {
    regions: [
      {
        windingRule: "NONZERO",
        loops: [
          [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23, 24, 25,
          ],
        ],
        fills: [],
        fillStyleId: "",
      },
    ],
    segments: [
      {
        start: 0,
        end: 1,
        tangentStart: { x: -42.11800003051758, y: 0 },
        tangentEnd: { x: 0, y: -15.682900428771973 },
      },
      {
        start: 1,
        end: 2,
        tangentStart: { x: 0, y: 15.682900428771973 },
        tangentEnd: { x: -42.11800003051758, y: 0 },
      },
      {
        start: 2,
        end: 3,
        tangentStart: { x: 23.604000091552734, y: 0 },
        tangentEnd: { x: 0, y: 6.638800144195557 },
      },
      {
        start: 3,
        end: 4,
        tangentStart: { x: 0, y: -6.638800144195557 },
        tangentEnd: { x: 23.604000091552734, y: 0 },
      },
      {
        start: 4,
        end: 5,
        tangentStart: { x: -42.11800003051758, y: 0 },
        tangentEnd: { x: 0, y: -15.682900428771973 },
      },
      {
        start: 5,
        end: 6,
        tangentStart: { x: 0, y: 15.682999610900879 },
        tangentEnd: { x: -42.11800003051758, y: 0 },
      },
      {
        start: 6,
        end: 7,
        tangentStart: { x: 23.604000091552734, y: 0 },
        tangentEnd: { x: 0, y: 6.638999938964844 },
      },
      {
        start: 7,
        end: 8,
        tangentStart: { x: 0, y: -6.638800144195557 },
        tangentEnd: { x: 23.604000091552734, y: 0 },
      },
      {
        start: 8,
        end: 9,
        tangentStart: { x: -42.11800003051758, y: 0 },
        tangentEnd: { x: 0, y: -15.779000282287598 },
      },
      {
        start: 9,
        end: 10,
        tangentStart: { x: 0, y: 15.779000282287598 },
        tangentEnd: { x: -42.11800003051758, y: 0 },
      },
      {
        start: 10,
        end: 11,
        tangentStart: { x: 23.604000091552734, y: 0 },
        tangentEnd: { x: 0, y: 6.638999938964844 },
      },
      {
        start: 11,
        end: 12,
        tangentStart: { x: 0, y: -6.638999938964844 },
        tangentEnd: { x: 23.604000091552734, y: 0 },
      },
      {
        start: 12,
        end: 13,
        tangentStart: { x: -42.11800003051758, y: 0 },
        tangentEnd: { x: 0, y: -15.682999610900879 },
      },
      {
        start: 13,
        end: 14,
        tangentStart: { x: 0, y: 15.682999610900879 },
        tangentEnd: { x: -42.11800003051758, y: 0 },
      },
      {
        start: 14,
        end: 15,
        tangentStart: { x: 23.604000091552734, y: 0 },
        tangentEnd: { x: 0, y: 6.638999938964844 },
      },
      {
        start: 15,
        end: 16,
        tangentStart: { x: 0, y: -6.638999938964844 },
        tangentEnd: { x: 23.604000091552734, y: 0 },
      },
      {
        start: 16,
        end: 17,
        tangentStart: { x: -42.11800003051758, y: 0 },
        tangentEnd: { x: 0, y: -15.682999610900879 },
      },
      {
        start: 17,
        end: 18,
        tangentStart: { x: 0, y: 15.682999610900879 },
        tangentEnd: { x: -42.11800003051758, y: 0 },
      },
      {
        start: 18,
        end: 19,
        tangentStart: { x: 23.604000091552734, y: 0 },
        tangentEnd: { x: 0, y: 6.638000011444092 },
      },
      {
        start: 19,
        end: 20,
        tangentStart: { x: 0, y: -6.638999938964844 },
        tangentEnd: { x: 23.604000091552734, y: 0 },
      },
      {
        start: 20,
        end: 21,
        tangentStart: { x: -42.11800003051758, y: 0 },
        tangentEnd: { x: 0, y: -15.682000160217285 },
      },
      {
        start: 21,
        end: 22,
        tangentStart: { x: 0, y: 15.682999610900879 },
        tangentEnd: { x: -42.11800003051758, y: 0 },
      },
      {
        start: 22,
        end: 23,
        tangentStart: { x: 23.604000091552734, y: 0 },
        tangentEnd: { x: 0, y: 6.638999938964844 },
      },
      {
        start: 23,
        end: 24,
        tangentStart: { x: 0, y: -6.638000011444092 },
        tangentEnd: { x: 23.604000091552734, y: 0 },
      },
      {
        start: 24,
        end: 25,
        tangentStart: { x: -42.11800003051758, y: 0 },
        tangentEnd: { x: 0, y: -15.779000282287598 },
      },
      {
        start: 25,
        end: 26,
        tangentStart: { x: 0, y: 15.779000282287598 },
        tangentEnd: { x: -42.11800003051758, y: 0 },
      },
    ],
    vertices: [
      {
        x: 76.26100158691406,
        y: 0,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 0,
        y: 28.396400451660156,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 76.26100158691406,
        y: 56.79290008544922,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 119,
        y: 44.772300720214844,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 76.26100158691406,
        y: 32.75170135498047,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 0,
        y: 61.148101806640625,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 76.26100158691406,
        y: 89.54499816894531,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 119,
        y: 77.52400207519531,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 76.26100158691406,
        y: 65.50340270996094,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 0,
        y: 94.0739974975586,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 76.26100158691406,
        y: 122.64500427246094,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 119,
        y: 110.62399291992188,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 76.26100158691406,
        y: 98.60399627685547,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 0,
        y: 127,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 76.26100158691406,
        y: 155.39599609375,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 119,
        y: 143.37600708007812,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 76.26100158691406,
        y: 131.35499572753906,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 0,
        y: 159.7519989013672,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 76.26100158691406,
        y: 188.1479949951172,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 119,
        y: 176.1280059814453,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 76.26100158691406,
        y: 164.10699462890625,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 0,
        y: 192.5030059814453,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 76.26100158691406,
        y: 220.89999389648438,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 119,
        y: 208.87899780273438,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 76.26100158691406,
        y: 196.85899353027344,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 0,
        y: 225.4290008544922,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 76.26100158691406,
        y: 254,
        strokeCap: "ROUND",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
    ],
  };
  vector_2_84.vectorPaths = [
    {
      windingRule: "NONZERO",
      data: "M 76.26100158691406 0 C 34.143001556396484 0 0 12.713500022888184 0 28.396400451660156 C 0 44.07930088043213 34.143001556396484 56.79290008544922 76.26100158691406 56.79290008544922 C 99.8650016784668 56.79290008544922 119 51.4111008644104 119 44.772300720214844 C 119 38.13350057601929 99.8650016784668 32.75170135498047 76.26100158691406 32.75170135498047 C 34.143001556396484 32.75170135498047 0 45.46520137786865 0 61.148101806640625 C 0 76.8311014175415 34.143001556396484 89.54499816894531 76.26100158691406 89.54499816894531 C 99.8650016784668 89.54499816894531 119 84.16300201416016 119 77.52400207519531 C 119 70.88520193099976 99.8650016784668 65.50340270996094 76.26100158691406 65.50340270996094 C 34.143001556396484 65.50340270996094 0 78.294997215271 0 94.0739974975586 C 0 109.85299777984619 34.143001556396484 122.64500427246094 76.26100158691406 122.64500427246094 C 99.8650016784668 122.64500427246094 119 117.26299285888672 119 110.62399291992188 C 119 103.98499298095703 99.8650016784668 98.60399627685547 76.26100158691406 98.60399627685547 C 34.143001556396484 98.60399627685547 0 111.31700038909912 0 127 C 0 142.68299961090088 34.143001556396484 155.39599609375 76.26100158691406 155.39599609375 C 99.8650016784668 155.39599609375 119 150.01500701904297 119 143.37600708007812 C 119 136.73700714111328 99.8650016784668 131.35499572753906 76.26100158691406 131.35499572753906 C 34.143001556396484 131.35499572753906 0 144.0689992904663 0 159.7519989013672 C 0 175.43499851226807 34.143001556396484 188.1479949951172 76.26100158691406 188.1479949951172 C 99.8650016784668 188.1479949951172 119 182.7660059928894 119 176.1280059814453 C 119 169.48900604248047 99.8650016784668 164.10699462890625 76.26100158691406 164.10699462890625 C 34.143001556396484 164.10699462890625 0 176.82100582122803 0 192.5030059814453 C 0 208.1860055923462 34.143001556396484 220.89999389648438 76.26100158691406 220.89999389648438 C 99.8650016784668 220.89999389648438 119 215.51799774169922 119 208.87899780273438 C 119 202.24099779129028 99.8650016784668 196.85899353027344 76.26100158691406 196.85899353027344 C 34.143001556396484 196.85899353027344 0 209.6500005722046 0 225.4290008544922 C 0 241.20800113677979 34.143001556396484 254 76.26100158691406 254",
    },
  ];
  vector_2_84.rescale(lowerScaleFactor + Math.random() * higherScaleFactor);
  vector_2_84.rotation = Math.random() * 360;
  return vector_2_84;
}

function createStar2() {
  var vector_2_82 = figma.createVector();
  const selectedFrame = figma.currentPage.selection[0] as FrameNode;

  vector_2_82.resize(218.0, 218.0);
  vector_2_82.name = "Star2";
  vector_2_82.fills = [
    {
      type: "SOLID",
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
      color: colorArray[(randomShape + counter) % 8],
    },
  ];
  vector_2_82.strokes = [];
  vector_2_82.strokeAlign = "INSIDE";
  vector_2_82.relativeTransform = [
    [1, 0, -843],
    [0, 1, 1642],
  ];
  vector_2_82.x = Math.random() * selectedFrame.width + 10;
  vector_2_82.y = Math.random() * selectedFrame.height + 10;
  vector_2_82.vectorNetwork = {
    regions: [
      {
        windingRule: "EVENODD",
        loops: [[0, 1, 2, 3]],
        fills: [
          {
            type: "SOLID",
            visible: true,
            opacity: 1,
            blendMode: "NORMAL",
            color: {
              r: 0.30980393290519714,
              g: 0.30980393290519714,
              b: 0.30980393290519714,
            },
          },
        ],
        fillStyleId: "",
      },
    ],
    segments: [
      {
        start: 0,
        end: 1,
        tangentStart: { x: -0.21799999475479126, y: -60.125 },
        tangentEnd: { x: 60.064998626708984, y: 0 },
      },
      {
        start: 1,
        end: 2,
        tangentStart: { x: 60.19900131225586, y: 0 },
        tangentEnd: { x: 0, y: 60.310001373291016 },
      },
      {
        start: 2,
        end: 3,
        tangentStart: { x: 0.21699999272823334, y: 60.125 },
        tangentEnd: { x: -60.064998626708984, y: 0 },
      },
      {
        start: 3,
        end: 0,
        tangentStart: { x: -60.20000076293945, y: 0 },
        tangentEnd: { x: 0, y: -60.310001373291016 },
      },
    ],
    vertices: [
      {
        x: 109,
        y: 218,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 0,
        y: 109.20199584960938,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 109,
        y: 0,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 218,
        y: 108.79800415039062,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
    ],
  };
  vector_2_82.vectorPaths = [
    {
      windingRule: "EVENODD",
      data: "M 109 218 C 108.78200000524521 157.875 60.064998626708984 109.20199584960938 0 109.20199584960938 C 60.19900131225586 109.20199584960938 109 60.310001373291016 109 0 C 109.21699999272823 60.125 157.93500137329102 108.79800415039062 218 108.79800415039062 C 157.79999923706055 108.79800415039062 109 157.68999862670898 109 218 Z",
    },
  ];
  vector_2_82.rescale(lowerScaleFactor + Math.random() * higherScaleFactor);
  vector_2_82.rotation = Math.random() * 360;
  return vector_2_82;
}

function createPill() {
  var rectangle_15_2418 = figma.createRectangle();
  const selectedFrame = figma.currentPage.selection[0] as FrameNode;

  rectangle_15_2418.resize(244.0, 93.0);
  rectangle_15_2418.name = "Pill";
  rectangle_15_2418.fills = [
    {
      type: "SOLID",
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
      color: colorArray[(randomShape + counter) % 8],
    },
  ];
  rectangle_15_2418.relativeTransform = [
    [1, 0, 4535],
    [0, 1, 2728],
  ];
  rectangle_15_2418.x = Math.random() * selectedFrame.width + 10;
  rectangle_15_2418.y = Math.random() * selectedFrame.height + 10;
  rectangle_15_2418.cornerRadius = 142;
  rectangle_15_2418.strokeTopWeight = 1;
  rectangle_15_2418.strokeBottomWeight = 1;
  rectangle_15_2418.strokeLeftWeight = 1;
  rectangle_15_2418.strokeRightWeight = 1;
  rectangle_15_2418.rescale(
    lowerScaleFactor + Math.random() * higherScaleFactor
  );
  rectangle_15_2418.rotation = Math.random() * 360;
  return rectangle_15_2418;
}

function createSemiCircle() {
  var vector_68_3 = figma.createVector();
  const selectedFrame = figma.currentPage.selection[0] as FrameNode;

  vector_68_3.resize(200.0, 100.0);
  vector_68_3.name = "Semicircle";
  vector_68_3.fills = [
    {
      type: "SOLID",
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
      color: colorArray[(randomShape + counter) % 8],
    },
  ];
  vector_68_3.strokes = [];
  vector_68_3.strokeWeight = 1.9999998807907104;
  vector_68_3.strokeAlign = "INSIDE";
  vector_68_3.relativeTransform = [
    [1, 0, 4302],
    [0, 1, 2971],
  ];
  vector_68_3.x = Math.random() * selectedFrame.width + 10;
  vector_68_3.y = Math.random() * selectedFrame.height + 10;
  vector_68_3.vectorNetwork = {
    regions: [
      {
        windingRule: "NONZERO",
        loops: [[0, 1, 2, 3, 4]],
        fills: [
          {
            type: "SOLID",
            visible: true,
            opacity: 1,
            blendMode: "NORMAL",
            color: {
              r: 0.8509804010391235,
              g: 0.8509804010391235,
              b: 0.8509804010391235,
            },
          },
        ],
        fillStyleId: "",
      },
    ],
    segments: [
      {
        start: 0,
        end: 1,
        tangentStart: { x: -2.842170943040401e-14, y: 26.521648406982422 },
        tangentEnd: { x: 18.75363540649414, y: -18.753637313842773 },
      },
      {
        start: 1,
        end: 2,
        tangentStart: { x: -18.75363540649414, y: 18.753637313842773 },
        tangentEnd: { x: 26.521648406982422, y: -0.000002002328756134375 },
      },
      {
        start: 2,
        end: 3,
        tangentStart: { x: -26.521648406982422, y: 0.000002002328756134375 },
        tangentEnd: { x: 18.753639221191406, y: 18.75363540649414 },
      },
      {
        start: 3,
        end: 4,
        tangentStart: { x: -18.753639221191406, y: -18.75363540649414 },
        tangentEnd: { x: 0.00000400465751226875, y: 26.521648406982422 },
      },
      {
        start: 4,
        end: 0,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
    ],
    vertices: [
      {
        x: 200,
        y: 0,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 170.71067810058594,
        y: 70.71067810058594,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 100.00000762939453,
        y: 100,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 29.289329528808594,
        y: 70.71068572998047,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 0,
        y: 0.000015099580195965245,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
    ],
  };
  vector_68_3.vectorPaths = [
    {
      windingRule: "NONZERO",
      data: "M 200 0 C 199.99999999999997 26.521648406982422 189.46431350708008 51.957040786743164 170.71067810058594 70.71067810058594 C 151.9570426940918 89.46431541442871 126.52165603637695 99.99999799767124 100.00000762939453 100 C 73.47835922241211 100.00000200232876 48.04296875 89.46432113647461 29.289329528808594 70.71068572998047 C 10.535690307617188 51.95705032348633 0.00000400465751226875 26.521663506562618 0 0.000015099580195965245 L 200 0 Z",
    },
  ];

  vector_68_3.rescale(lowerScaleFactor + Math.random() * higherScaleFactor);
  vector_68_3.rotation = Math.random() * 360;
  return vector_68_3;
}

function createTube() {
  const selectedFrame = figma.currentPage.selection[0] as FrameNode;

  var vector_71_21 = figma.createVector();
  vector_71_21.resize(398.0, 199.0000152588);
  vector_71_21.name = "Tube";
  vector_71_21.fills = [
    {
      type: "SOLID",
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
      color: colorArray[(randomShape + counter) % 8],
    },
  ];
  vector_71_21.strokes = [];
  vector_71_21.strokeAlign = "INSIDE";
  vector_71_21.relativeTransform = [
    [1, 0, 4418],
    [0, 1, 3370],
  ];
  vector_71_21.x = Math.random() * selectedFrame.width + 10;
  vector_71_21.y = Math.random() * selectedFrame.height + 10;
  vector_71_21.vectorNetwork = {
    regions: [
      {
        windingRule: "NONZERO",
        loops: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]],
        fills: [
          {
            type: "SOLID",
            visible: true,
            opacity: 1,
            blendMode: "NORMAL",
            color: {
              r: 0.6078431606292725,
              g: 0.3176470696926117,
              b: 0.8784313797950745,
            },
          },
        ],
        fillStyleId: "",
      },
    ],
    segments: [
      {
        start: 0,
        end: 1,
        tangentStart: { x: 0, y: 26.133052825927734 },
        tangentEnd: { x: 10.000686645507812, y: -24.1437931060791 },
      },
      {
        start: 1,
        end: 2,
        tangentStart: { x: -10.000686645507812, y: 24.1437931060791 },
        tangentEnd: { x: 18.478858947753906, y: -18.478858947753906 },
      },
      {
        start: 2,
        end: 3,
        tangentStart: { x: -18.478858947753906, y: 18.478858947753906 },
        tangentEnd: { x: 24.1437931060791, y: -10.000685691833496 },
      },
      {
        start: 3,
        end: 4,
        tangentStart: { x: -24.1437931060791, y: 10.000685691833496 },
        tangentEnd: { x: 26.133052825927734, y: 0.0000011423120440667844 },
      },
      {
        start: 4,
        end: 5,
        tangentStart: { x: -26.133052825927734, y: -0.0000011423120440667844 },
        tangentEnd: { x: 24.1437931060791, y: 10.000687599182129 },
      },
      {
        start: 5,
        end: 6,
        tangentStart: { x: -24.1437931060791, y: -10.000687599182129 },
        tangentEnd: { x: 18.478857040405273, y: 18.47886085510254 },
      },
      {
        start: 6,
        end: 7,
        tangentStart: { x: -18.478857040405273, y: -18.47886085510254 },
        tangentEnd: { x: 10.00068473815918, y: 24.1437931060791 },
      },
      {
        start: 7,
        end: 8,
        tangentStart: { x: -10.00068473815918, y: -24.1437931060791 },
        tangentEnd: { x: -0.000002284624088133569, y: 26.133052825927734 },
      },
      {
        start: 8,
        end: 9,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 9,
        end: 10,
        tangentStart: { x: -0.0000015341616972364136, y: 17.548763275146484 },
        tangentEnd: { x: -6.7156195640563965, y: -16.21294403076172 },
      },
      {
        start: 10,
        end: 11,
        tangentStart: { x: 6.7156195640563965, y: 16.21294403076172 },
        tangentEnd: { x: -12.408848762512207, y: -12.40885066986084 },
      },
      {
        start: 11,
        end: 12,
        tangentStart: { x: 12.408848762512207, y: 12.40885066986084 },
        tangentEnd: { x: -16.212942123413086, y: -6.7156219482421875 },
      },
      {
        start: 12,
        end: 13,
        tangentStart: { x: 16.212942123413086, y: 6.7156219482421875 },
        tangentEnd: { x: -17.548763275146484, y: -7.670807917747879e-7 },
      },
      {
        start: 13,
        end: 14,
        tangentStart: { x: 17.548763275146484, y: 7.670809054616257e-7 },
        tangentEnd: { x: -16.21294403076172, y: 6.715620517730713 },
      },
      {
        start: 14,
        end: 15,
        tangentStart: { x: 16.21294403076172, y: -6.715620517730713 },
        tangentEnd: { x: -12.408849716186523, y: 12.408848762512207 },
      },
      {
        start: 15,
        end: 16,
        tangentStart: { x: 12.408849716186523, y: -12.408848762512207 },
        tangentEnd: { x: -6.715620994567871, y: 16.212942123413086 },
      },
      {
        start: 16,
        end: 17,
        tangentStart: { x: 6.715620994567871, y: -16.212942123413086 },
        tangentEnd: { x: 0, y: 17.548763275146484 },
      },
      {
        start: 17,
        end: 0,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
    ],
    vertices: [
      {
        x: 398,
        y: 0.000017397132978658192,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 382.8520202636719,
        y: 76.15402221679688,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 339.7142333984375,
        y: 140.71426391601562,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 275.15399169921875,
        y: 183.85205078125,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 198.99998474121094,
        y: 199.00001525878906,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 122.84598541259766,
        y: 183.85203552246094,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 58.28573989868164,
        y: 140.71426391601562,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 15.147967338562012,
        y: 76.15400695800781,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 9.094947017729282e-13,
        y: 0,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 65.36831665039062,
        y: 0.000005714680355595192,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 75.54042053222656,
        y: 51.13863754272461,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 104.50812530517578,
        y: 94.49188232421875,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 147.86135864257812,
        y: 123.4595947265625,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 199,
        y: 133.63169860839844,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 250.1386260986328,
        y: 123.4595947265625,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 293.49188232421875,
        y: 94.49188995361328,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 322.4595642089844,
        y: 51.138648986816406,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 332.6316833496094,
        y: 0.000017397132978658192,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
    ],
  };
  vector_71_21.vectorPaths = [
    {
      windingRule: "NONZERO",
      data: "M 398 0.000017397132978658192 C 398 26.133070223060713 392.8527069091797 52.01022911071777 382.8520202636719 76.15402221679688 C 372.85133361816406 100.29781532287598 358.1930923461914 122.23540496826172 339.7142333984375 140.71426391601562 C 321.2353744506836 159.19312286376953 299.29778480529785 173.8513650894165 275.15399169921875 183.85205078125 C 251.01019859313965 193.8527364730835 225.13303756713867 199.0000164011011 198.99998474121094 199.00001525878906 C 172.8669319152832 199.00001411647702 146.98977851867676 193.85272312164307 122.84598541259766 183.85203552246094 C 98.70219230651855 173.8513479232788 76.76459693908691 159.19312477111816 58.28573989868164 140.71426391601562 C 39.80688285827637 122.23540306091309 25.14865207672119 100.29780006408691 15.147967338562012 76.15400695800781 C 5.147282600402832 52.01021385192871 -0.000002284623178638867 26.133052825927734 9.094947017729282e-13 0 L 65.36831665039062 0.000005714680355595192 C 65.36831511622893 17.54876898982684 68.82480096817017 34.92569351196289 75.54042053222656 51.13863754272461 C 82.25604009628296 67.35158157348633 92.09927654266357 82.08303165435791 104.50812530517578 94.49188232421875 C 116.91697406768799 106.90073299407959 131.64841651916504 116.74397277832031 147.86135864257812 123.4595947265625 C 164.0743007659912 130.1752166748047 181.45123672485352 133.63169784131765 199 133.63169860839844 C 216.54876327514648 133.63169937547934 233.9256820678711 130.1752152442932 250.1386260986328 123.4595947265625 C 266.35157012939453 116.74397420883179 281.0830326080322 106.90073871612549 293.49188232421875 94.49188995361328 C 305.9007320404053 82.08304119110107 315.7439432144165 67.35159111022949 322.4595642089844 51.138648986816406 C 329.17518520355225 34.92570686340332 332.6316833496094 17.548780672279463 332.6316833496094 0.000017397132978658192 L 398 0.000017397132978658192 Z",
    },
  ];

  vector_71_21.rescale(lowerScaleFactor + Math.random() * higherScaleFactor);
  vector_71_21.rotation = Math.random() * 360;
  return vector_71_21;
}

function createAutoLayoutFrame(position: string) {
  let tempFrame = figma.createFrame() as FrameNode;
  const selectedFrame = figma.currentPage.selection[0] as FrameNode;
  if (position === "top") {
    tempFrame.resize(selectedFrame.width * overflowFactor, 277.084777832);
    tempFrame.counterAxisSizingMode = "AUTO";
    tempFrame.name = "Top";
    tempFrame.relativeTransform = [
      [1, 0, 17],
      [0, 1, -106],
    ];
    tempFrame.x = 17;
    tempFrame.y = -106;
    tempFrame.fills = [];
    tempFrame.primaryAxisAlignItems = "SPACE_BETWEEN";
    tempFrame.counterAxisAlignItems = "CENTER";
    tempFrame.primaryAxisSizingMode = "FIXED";
    tempFrame.strokeTopWeight = 1;
    tempFrame.strokeBottomWeight = 1;
    tempFrame.strokeLeftWeight = 1;
    tempFrame.strokeRightWeight = 1;
    tempFrame.clipsContent = false;
    tempFrame.expanded = false;
    tempFrame.layoutMode = "HORIZONTAL";
    tempFrame.counterAxisSizingMode = "AUTO";
    tempFrame.itemSpacing = 283;
  } else if (position === "down") {
    tempFrame.resize(selectedFrame.width * overflowFactor, 558.1932983398);
    tempFrame.counterAxisSizingMode = "AUTO";
    tempFrame.name = "Down";
    tempFrame.relativeTransform = [
      [1, 0, -113],
      [0, 1, 775],
    ];
    tempFrame.x = -113;
    tempFrame.y = 775;
    tempFrame.fills = [];
    tempFrame.primaryAxisAlignItems = "SPACE_BETWEEN";
    tempFrame.counterAxisAlignItems = "CENTER";
    tempFrame.primaryAxisSizingMode = "FIXED";
    tempFrame.strokeTopWeight = 1;
    tempFrame.strokeBottomWeight = 1;
    tempFrame.strokeLeftWeight = 1;
    tempFrame.strokeRightWeight = 1;
    tempFrame.clipsContent = false;
    tempFrame.layoutMode = "HORIZONTAL";
    tempFrame.counterAxisSizingMode = "AUTO";
  } else if (position === "left") {
    tempFrame.resize(505.5918579102, selectedFrame.height * overflowFactor);
    tempFrame.counterAxisSizingMode = "AUTO";
    tempFrame.name = "Left";
    tempFrame.relativeTransform = [
      [1, 0, -205],
      [0, 1, -248],
    ];
    tempFrame.x = -205;
    tempFrame.y = -248;
    tempFrame.fills = [];
    tempFrame.primaryAxisAlignItems = "SPACE_BETWEEN";
    tempFrame.counterAxisAlignItems = "CENTER";
    tempFrame.primaryAxisSizingMode = "FIXED";
    tempFrame.strokeTopWeight = 1;
    tempFrame.strokeBottomWeight = 1;
    tempFrame.strokeLeftWeight = 1;
    tempFrame.strokeRightWeight = 1;
    tempFrame.clipsContent = false;
    tempFrame.layoutMode = "VERTICAL";
    tempFrame.counterAxisSizingMode = "AUTO";
  } else if (position === "right") {
    tempFrame.resize(359.4046936035, selectedFrame.height * overflowFactor);
    tempFrame.counterAxisSizingMode = "AUTO";
    tempFrame.name = "Right";
    tempFrame.relativeTransform = [
      [1, 0, 1707],
      [0, 1, -301],
    ];
    tempFrame.x = 1707;
    tempFrame.y = -301;
    tempFrame.fills = [];
    tempFrame.primaryAxisAlignItems = "SPACE_BETWEEN";
    tempFrame.counterAxisAlignItems = "CENTER";
    tempFrame.primaryAxisSizingMode = "FIXED";
    tempFrame.strokeTopWeight = 1;
    tempFrame.strokeBottomWeight = 1;
    tempFrame.strokeLeftWeight = 1;
    tempFrame.strokeRightWeight = 1;
    tempFrame.clipsContent = false;
    tempFrame.constraints = { horizontal: "MAX", vertical: "MIN" };
    tempFrame.layoutMode = "VERTICAL";
    tempFrame.counterAxisSizingMode = "AUTO";
    tempFrame.itemSpacing = 14;
  }
  return tempFrame;
}

function createPatternLayoutFrame() {
  let tempFrame = figma.createFrame() as FrameNode;
  const selectedFrame = figma.currentPage.selection[0] as FrameNode;
  tempFrame.resize(selectedFrame.width, 277.084777832);
  tempFrame.counterAxisSizingMode = "AUTO";
  tempFrame.name = "Frame 26";
  tempFrame.relativeTransform = [
    [1, 0, 17],
    [0, 1, -106],
  ];
  tempFrame.x = 17;
  tempFrame.y = -106;
  tempFrame.fills = [];
  tempFrame.primaryAxisAlignItems = "SPACE_BETWEEN";
  tempFrame.counterAxisAlignItems = "CENTER";
  tempFrame.primaryAxisSizingMode = "FIXED";
  tempFrame.strokeTopWeight = 1;
  tempFrame.strokeBottomWeight = 1;
  tempFrame.strokeLeftWeight = 1;
  tempFrame.strokeRightWeight = 1;
  tempFrame.clipsContent = false;
  tempFrame.expanded = false;
  tempFrame.layoutMode = "HORIZONTAL";
  tempFrame.counterAxisSizingMode = "AUTO";
  tempFrame.itemSpacing = 283;
  return tempFrame;
}
