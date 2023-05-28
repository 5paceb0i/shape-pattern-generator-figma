// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.

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

if (figma.currentPage.selection.length > 0) {
  figma.ui.postMessage({ selection: "yes" }, { origin: "*" });
} else {
  figma.ui.postMessage({ selection: "no" }, { origin: "*" });
}

figma.on("selectionchange", () => {
  if (figma.currentPage.selection.length > 0) {
    figma.ui.postMessage({ selection: "yes" }, { origin: "*" });
  } else {
    figma.ui.postMessage({ selection: "no" }, { origin: "*" });
  }
});

figma.ui.onmessage = (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === "create-rectangles") {
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
      createSun,
      createSpring,
      createStar2,
    ];

    //shapes at the edge of frame
    const atEdges = true;
    const lowerLimitW = selectedFrame.width * 0.02;
    const higherLimitW = selectedFrame.width * 0.98;
    const lowerLimitH = selectedFrame.height * 0.02;
    const higherLimitH = selectedFrame.height * 0.98;

    for (let i = 0; i < msg.count; i++) {
      //const rect = figma.createRectangle();
      //figma.currentPage.appendChild(rect);
      //nodes.push(rect);
      const shapeNode = shapesArray[(randomShape + i) % 9]();
      if (atEdges) {
        if (i % 4 == 0) {
          shapeNode.x = shapeNode.width * 0.4 + Math.random() * lowerLimitW;
        } else if (i % 4 == 1) {
          shapeNode.x =
            higherLimitW +
            Math.random() *
              (selectedFrame.width - shapeNode.width * 0.4 - higherLimitW);
        } else if (i % 4 == 2) {
          shapeNode.y =
            higherLimitH +
            Math.random() *
              (selectedFrame.height - shapeNode.height * 0.4 - higherLimitH);
        } else if (i % 4 == 3) {
          shapeNode.y = shapeNode.height * 0.4 + Math.random() * lowerLimitH;
        }
        shapeNode.opacity = 0.4 + Math.random() * 0.6;
      }
      nodes.push(shapeNode);
      counter++;
      //shapesArray[1]();
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
  selectedFrame.appendChild(vector_2_85);

  //--------------enter size variables here
  vector_2_85.resize(267.0, 18.0);
  vector_2_85.name = "Waves";

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
  vector_2_85.rescale(0.5 + Math.random() * 1.1);
  vector_2_85.rotation = Math.random() * 360;
  return vector_2_85;
}

function createStair() {
  var vector_2_86 = figma.createVector();
  const selectedFrame = figma.currentPage.selection[0] as FrameNode;
  selectedFrame.appendChild(vector_2_86);
  vector_2_86.resize(200.0, 200.0);
  vector_2_86.name = "Stairs 2";
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
  vector_2_86.rescale(0.5 + Math.random() * 1.1);
  vector_2_86.rotation = Math.random() * 360;
  return vector_2_86;
}

function createU() {
  var vector_2_87 = figma.createVector();
  const selectedFrame = figma.currentPage.selection[0] as FrameNode;
  selectedFrame.appendChild(vector_2_87);
  vector_2_87.resize(187.0, 196.0);
  vector_2_87.name = "Magnet";
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
  vector_2_87.rescale(0.5 + Math.random() * 1.1);
  vector_2_87.rotation = Math.random() * 360;
  return vector_2_87;
}

function createFlower() {
  var vector_2_81 = figma.createVector();
  const selectedFrame = figma.currentPage.selection[0] as FrameNode;
  selectedFrame.appendChild(vector_2_81);
  vector_2_81.resize(211.9999084473, 234.9999084473);
  vector_2_81.name = "Flower";
  vector_2_81.fills = [
    {
      type: "SOLID",
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
      color: colorArray[(randomShape + counter) % 8],
    },
  ];
  vector_2_81.strokes = [];
  vector_2_81.strokeAlign = "INSIDE";
  vector_2_81.relativeTransform = [
    [1, 0, -842],
    [0, 1, -80],
  ];
  vector_2_81.x = Math.random() * selectedFrame.width + 10;
  vector_2_81.y = Math.random() * selectedFrame.height + 10;
  vector_2_81.vectorNetwork = {
    regions: [
      {
        windingRule: "EVENODD",
        loops: [
          [0, 1, 2, 3, 4, 5],
          [6, 7, 8, 9],
        ],
        fills: [
          {
            type: "SOLID",
            visible: true,
            opacity: 1,
            blendMode: "NORMAL",
            color:
              colorArray[
                (Math.floor(Math.random() * 9) + randomShape) %
                  colorArray.length
              ],
          },
        ],
        fillStyleId: "",
      },
    ],
    segments: [
      {
        start: 0,
        end: 1,
        tangentStart: { x: 61.332000732421875, y: -71.19519805908203 },
        tangentEnd: { x: 91.62799835205078, y: -17.05699920654297 },
      },
      {
        start: 1,
        end: 2,
        tangentStart: { x: 91.62799835205078, y: 17.798999786376953 },
        tangentEnd: { x: 60.59299850463867, y: 71.19599914550781 },
      },
      {
        start: 2,
        end: 3,
        tangentStart: { x: 31.03499984741211, y: 88.99400329589844 },
        tangentEnd: { x: -31.035600662231445, y: 88.25299835205078 },
      },
      {
        start: 3,
        end: 4,
        tangentStart: { x: -61.332000732421875, y: 71.19599914550781 },
        tangentEnd: { x: -91.62816619873047, y: 17.798999786376953 },
      },
      {
        start: 4,
        end: 5,
        tangentStart: { x: -92.36710357666016, y: -17.05699920654297 },
        tangentEnd: { x: -61.332000732421875, y: -70.45359802246094 },
      },
      {
        start: 5,
        end: 0,
        tangentStart: { x: -31.774499893188477, y: -88.25238800048828 },
        tangentEnd: { x: 31.03499984741211, y: -88.25238800048828 },
      },
      {
        start: 6,
        end: 7,
        tangentStart: { x: 7.389999866485596, y: 0 },
        tangentEnd: { x: 0, y: -7.415999889373779 },
      },
      {
        start: 7,
        end: 8,
        tangentStart: { x: 0, y: 7.415999889373779 },
        tangentEnd: { x: 7.389999866485596, y: 0 },
      },
      {
        start: 8,
        end: 9,
        tangentStart: { x: -7.388999938964844, y: 0 },
        tangentEnd: { x: 0, y: 7.415999889373779 },
      },
      {
        start: 9,
        end: 6,
        tangentStart: { x: 0, y: -7.415999889373779 },
        tangentEnd: { x: -7.388999938964844, y: 0 },
      },
    ],
    vertices: [
      {
        x: 135.35098266601562,
        y: 66.18929290771484,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 164.90798950195312,
        y: 117.3609848022461,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 135.35098266601562,
        y: 168.531982421875,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 76.97499084472656,
        y: 168.531982421875,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 47.41728973388672,
        y: 117.3609848022461,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 76.97499084472656,
        y: 66.18929290771484,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 105.7929916381836,
        y: 104.0119857788086,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 119.8329849243164,
        y: 117.3609848022461,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 105.7929916381836,
        y: 131.4519805908203,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 92.49199676513672,
        y: 117.3609848022461,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
    ],
  };
  vector_2_81.vectorPaths = [
    {
      windingRule: "EVENODD",
      data: "M 135.35098266601562 66.18929290771484 C 196.6829833984375 -5.0059051513671875 256.5359878540039 100.30398559570312 164.90798950195312 117.3609848022461 C 256.5359878540039 135.15998458862305 195.9439811706543 239.7279815673828 135.35098266601562 168.531982421875 C 166.38598251342773 257.52598571777344 45.93939018249512 256.7849807739258 76.97499084472656 168.531982421875 C 15.642990112304688 239.7279815673828 -44.21087646484375 135.15998458862305 47.41728973388672 117.3609848022461 C -44.94981384277344 100.30398559570312 15.642990112304688 -4.264305114746094 76.97499084472656 66.18929290771484 C 45.200490951538086 -22.063095092773438 166.38598251342773 -22.063095092773438 135.35098266601562 66.18929290771484 Z M 105.7929916381836 104.0119857788086 C 113.18299150466919 104.0119857788086 119.8329849243164 109.94498491287231 119.8329849243164 117.3609848022461 C 119.8329849243164 124.77698469161987 113.18299150466919 131.4519805908203 105.7929916381836 131.4519805908203 C 98.40399169921875 131.4519805908203 92.49199676513672 124.77698469161987 92.49199676513672 117.3609848022461 C 92.49199676513672 109.94498491287231 98.40399169921875 104.0119857788086 105.7929916381836 104.0119857788086 Z",
    },
  ];
  vector_2_81.rescale(0.5 + Math.random() * 1.1);
  vector_2_81.rotation = Math.random() * 360;
  return vector_2_81;
}

function createSakurai() {
  var vector_2_83 = figma.createVector();
  const selectedFrame = figma.currentPage.selection[0] as FrameNode;
  selectedFrame.appendChild(vector_2_83);
  vector_2_83.resize(232.9995880127, 225.0001220703);
  vector_2_83.name = "Asterisk 1";
  vector_2_83.fills = [
    {
      type: "SOLID",
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
      color: colorArray[(randomShape + counter) % 8],
    },
  ];
  vector_2_83.strokes = [];
  vector_2_83.strokeAlign = "INSIDE";
  vector_2_83.relativeTransform = [
    [1, 0, -863],
    [0, 1, 234],
  ];
  vector_2_83.x = Math.random() * selectedFrame.width + 10;
  vector_2_83.y = Math.random() * selectedFrame.height + 10;
  vector_2_83.vectorNetwork = {
    regions: [
      {
        windingRule: "NONZERO",
        loops: [
          [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
          ],
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
        tangentStart: { x: 6.020100116729736, y: 4.372000217437744 },
        tangentEnd: { x: -6.938300132751465, y: 0 },
      },
      {
        start: 1,
        end: 2,
        tangentStart: { x: 10.441800117492676, y: 0 },
        tangentEnd: { x: -6.631999969482422, y: 8.982999801635742 },
      },
      {
        start: 2,
        end: 3,
        tangentStart: { x: 0.01899999938905239, y: -0.01899999938905239 },
        tangentEnd: { x: -0.017000000923871994, y: 0.020999999716877937 },
      },
      {
        start: 3,
        end: 4,
        tangentStart: { x: 0.01600000075995922, y: -0.020999999716877937 },
        tangentEnd: { x: -0.014999999664723873, y: 0.020999999716877937 },
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
        tangentStart: { x: 0.01600000075995922, y: -0.02199999988079071 },
        tangentEnd: { x: -0.014999999664723873, y: 0.020999999716877937 },
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
        tangentStart: { x: 0.023000000044703484, y: 0.03500000014901161 },
        tangentEnd: { x: -0.023000000044703484, y: -0.029999999329447746 },
      },
      {
        start: 9,
        end: 10,
        tangentStart: { x: 0.010999999940395355, y: 0.014000000432133675 },
        tangentEnd: { x: -0.010999999940395355, y: -0.01600000075995922 },
      },
      {
        start: 10,
        end: 11,
        tangentStart: { x: 11.053999900817871, y: 15.055999755859375 },
        tangentEnd: { x: -15.118000030517578, y: 10.989999771118164 },
      },
      {
        start: 11,
        end: 12,
        tangentStart: { x: 15.135000228881836, y: -10.98900032043457 },
        tangentEnd: { x: 10.918000221252441, y: 15.173999786376953 },
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
        tangentStart: { x: -0.019999999552965164, y: -0.03200000151991844 },
        tangentEnd: { x: 0.02500000037252903, y: 0.02500000037252903 },
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
        tangentStart: { x: 17.82200050354004, y: -5.801000118255615 },
        tangentEnd: { x: 5.798999786376953, y: 17.82900047302246 },
      },
      {
        start: 17,
        end: 18,
        tangentStart: { x: -5.797999858856201, y: -17.827999114990234 },
        tangentEnd: { x: 17.839000701904297, y: -5.78410005569458 },
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
        tangentStart: { x: -0.017999999225139618, y: -18.746999740600586 },
        tangentEnd: { x: 18.739999771118164, y: 0 },
      },
      {
        start: 21,
        end: 22,
        tangentStart: { x: -18.739999771118164, y: 0 },
        tangentEnd: { x: 0.017000000923871994, y: -18.763999938964844 },
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
        tangentStart: { x: -0.014999999664723873, y: 0 },
        tangentEnd: { x: 0.018400000408291817, y: 0.005200000014156103 },
      },
      {
        start: 25,
        end: 26,
        tangentStart: { x: -0.023900000378489494, y: -0.006399999838322401 },
        tangentEnd: { x: 0.019099999219179153, y: 0.009499999694526196 },
      },
      {
        start: 26,
        end: 27,
        tangentStart: { x: -17.804899215698242, y: -5.71589994430542 },
        tangentEnd: { x: 5.781899929046631, y: -17.795000076293945 },
      },
      {
        start: 27,
        end: 28,
        tangentStart: { x: -5.7820000648498535, y: 17.79400062561035 },
        tangentEnd: { x: -17.736799240112305, y: -5.8520002365112305 },
      },
      {
        start: 28,
        end: 29,
        tangentStart: { x: 0.01640000008046627, y: 0.004999999888241291 },
        tangentEnd: { x: -0.014100000262260437, y: -0.006000000052154064 },
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
        end: 32,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 32,
        end: 33,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 33,
        end: 34,
        tangentStart: { x: -0.008500000461935997, y: 0.017000000923871994 },
        tangentEnd: { x: 0.01269999984651804, y: -0.017000000923871994 },
      },
      {
        start: 34,
        end: 35,
        tangentStart: { x: -0.012900000438094139, y: 0.017000000923871994 },
        tangentEnd: { x: 0.008500000461935997, y: -0.017000000923871994 },
      },
      {
        start: 35,
        end: 0,
        tangentStart: { x: -10.934800148010254, y: 15.173999786376953 },
        tangentEnd: { x: -15.135000228881836, y: -10.98900032043457 },
      },
    ],
    vertices: [
      {
        x: 45.52646255493164,
        y: 218.49798583984375,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 65.47415924072266,
        y: 224.98001098632812,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 92.85295867919922,
        y: 211.2169952392578,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 92.9069595336914,
        y: 211.15699768066406,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 92.95396423339844,
        y: 211.093994140625,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 92.97695922851562,
        y: 211.06100463867188,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 93.02296447753906,
        y: 210.99600219726562,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 116.49095916748047,
        y: 178.72500610351562,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 139.95896911621094,
        y: 210.99600219726562,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 140.0289764404297,
        y: 211.08799743652344,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 140.06097412109375,
        y: 211.1320037841797,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 187.4729766845703,
        y: 218.5150146484375,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 195.073974609375,
        y: 171.10400390625,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 195.0499725341797,
        y: 171.0659942626953,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 194.9889678955078,
        y: 170.98500061035156,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 171.5719757080078,
        y: 138.6959991455078,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 209.511962890625,
        y: 126.34599304199219,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 231.3299560546875,
        y: 83.47599792480469,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 188.47596740722656,
        y: 61.633399963378906,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 150.53697204589844,
        y: 73.93299865722656,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 150.5199737548828,
        y: 34.00640106201172,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 116.5079574584961,
        y: 0,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 82.49696350097656,
        y: 34.023399353027344,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 82.46295928955078,
        y: 73.91600036621094,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 44.52326583862305,
        y: 61.616302490234375,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 44.4715690612793,
        y: 61.60780334472656,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 44.4040641784668,
        y: 61.582298278808594,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 1.6688648462295532,
        y: 83.45999908447266,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 23.35106658935547,
        y: 126.27799987792969,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 23.39626693725586,
        y: 126.29499816894531,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 23.45876693725586,
        y: 126.31900024414062,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 23.487266540527344,
        y: 126.32899475097656,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 61.40976333618164,
        y: 138.6790008544922,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 37.992862701416016,
        y: 170.96800231933594,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 37.95906448364258,
        y: 171.0189971923828,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
      {
        x: 37.92506790161133,
        y: 171.07000732421875,
        strokeCap: "NONE",
        strokeJoin: "MITER",
        cornerRadius: 0,
        handleMirroring: "NONE",
      },
    ],
  };
  vector_2_83.vectorPaths = [
    {
      windingRule: "NONZERO",
      data: "M 45.52646255493164 218.49798583984375 C 51.54656267166138 222.8699860572815 58.53585910797119 224.98001098632812 65.47415924072266 224.98001098632812 C 75.91595935821533 224.98001098632812 86.2209587097168 220.19999504089355 92.85295867919922 211.2169952392578 C 92.87195867858827 211.19799523986876 92.88995953276753 211.17799768038094 92.9069595336914 211.15699768066406 C 92.92295953445137 211.13599768094718 92.93896423373371 211.11499414034188 92.95396423339844 211.093994140625 L 92.97695922851562 211.06100463867188 C 92.99295922927558 211.03900463879108 93.00796447787434 211.0170021969825 93.02296447753906 210.99600219726562 L 116.49095916748047 178.72500610351562 L 139.95896911621094 210.99600219726562 C 139.98196911625564 211.03100219741464 140.00597644038498 211.057997437194 140.0289764404297 211.08799743652344 C 140.03997644037008 211.10199743695557 140.04997412115335 211.11600378341973 140.06097412109375 211.1320037841797 C 151.11497402191162 226.18800354003906 172.35497665405273 229.50501441955566 187.4729766845703 218.5150146484375 C 202.60797691345215 207.52601432800293 205.99197483062744 186.27800369262695 195.073974609375 171.10400390625 L 195.0499725341797 171.0659942626953 C 195.02997253462672 171.0339942611754 195.01396789588034 171.0100006107241 194.9889678955078 170.98500061035156 L 171.5719757080078 138.6959991455078 L 209.511962890625 126.34599304199219 C 227.33396339416504 120.54499292373657 237.12895584106445 101.30499839782715 231.3299560546875 83.47599792480469 C 225.5319561958313 65.64799880981445 206.31496810913086 55.849299907684326 188.47596740722656 61.633399963378906 L 150.53697204589844 73.93299865722656 L 150.5199737548828 34.00640106201172 C 150.50197375565767 15.259401321411133 135.24795722961426 0 116.5079574584961 0 C 97.76795768737793 0 82.51396350190043 15.2593994140625 82.49696350097656 34.023399353027344 L 82.46295928955078 73.91600036621094 L 44.52326583862305 61.616302490234375 C 44.50826583895832 61.616302490234375 44.48996906168759 61.61300334474072 44.4715690612793 61.60780334472656 C 44.44766906090081 61.60140334488824 44.423164177685976 61.59179827850312 44.4040641784668 61.582298278808594 C 26.599164962768555 55.866398334503174 7.450764775276184 65.66499900817871 1.6688648462295532 83.45999908447266 C -4.1131352186203 101.25399971008301 5.614267349243164 120.42599964141846 23.35106658935547 126.27799987792969 C 23.367466589435935 126.28299987781793 23.3821669369936 126.28899816889316 23.39626693725586 126.29499816894531 L 23.45876693725586 126.31900024414062 L 23.487266540527344 126.32899475097656 L 61.40976333618164 138.6790008544922 L 37.992862701416016 170.96800231933594 C 37.98436270095408 170.9850023202598 37.971764483489096 171.00199719145894 37.95906448364258 171.0189971923828 C 37.946164483204484 171.03599719330668 37.933567902073264 171.05300732329488 37.92506790161133 171.07000732421875 C 26.990267753601074 186.2440071105957 30.391462326049805 207.50898551940918 45.52646255493164 218.49798583984375 Z",
    },
  ];
  vector_2_83.rescale(0.5 + Math.random() * 1.1);
  vector_2_83.rotation = Math.random() * 360;
  return vector_2_83;
}

function createStar1() {
  var vector_2_88 = figma.createVector();
  const selectedFrame = figma.currentPage.selection[0] as FrameNode;
  selectedFrame.appendChild(vector_2_88);
  vector_2_88.resize(268.0000305176, 268.0000305176);
  vector_2_88.name = "Soft Star";
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
  vector_2_88.rescale(0.5 + Math.random() * 1.1);
  vector_2_88.rotation = Math.random() * 360;
  return vector_2_88;
}

function createSun() {
  var vector_2_89 = figma.createVector();
  const selectedFrame = figma.currentPage.selection[0] as FrameNode;
  selectedFrame.appendChild(vector_2_89);
  vector_2_89.resize(248.0, 248.0);
  vector_2_89.name = "Dawn";
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
  vector_2_89.rescale(0.5 + Math.random() * 1.1);
  vector_2_89.rotation = Math.random() * 360;
  return vector_2_89;
}

function createSpring() {
  var vector_2_84 = figma.createVector();
  const selectedFrame = figma.currentPage.selection[0] as FrameNode;
  selectedFrame.appendChild(vector_2_84);
  vector_2_84.resize(119.0, 254.0);
  vector_2_84.name = "Spiral 3";
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
  vector_2_84.rescale(0.5 + Math.random() * 1.1);
  vector_2_84.rotation = Math.random() * 360;
  return vector_2_84;
}

function createStar2() {
  var vector_2_82 = figma.createVector();
  const selectedFrame = figma.currentPage.selection[0] as FrameNode;
  selectedFrame.appendChild(vector_2_82);
  vector_2_82.resize(218.0, 218.0);
  vector_2_82.name = "Portal";
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
  vector_2_82.rescale(0.5 + Math.random() * 1.1);
  vector_2_82.rotation = Math.random() * 360;
  return vector_2_82;
}
