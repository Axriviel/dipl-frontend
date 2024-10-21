// import React from 'react';
// import ReactFlow, { Background, Controls, MiniMap, Node, Edge } from 'react-flow-renderer';

// interface LayerParams {
//   id: string;
//   type: string;
//   name: string,
//   inputs: string[];
// }

// interface ModelVisualizerProps {
//   layers: LayerParams[];
// }

// const ModelVisualizer: React.FC<ModelVisualizerProps> = ({ layers }) => {
//   // Vytvoření uzlů (nodes) pro každou vrstvu
//   const nodes: Node[] = layers.map((layer, index) => ({
//     id: layer.id,
//     data: { label: `${layer.type} (${layer.name})` },
//     position: { x: 150 * index, y: 100 * index },
//   }));

//   // Vytvoření propojení mezi uzly (edges)
//   const edges: Edge[] = layers.flatMap(layer =>
//     layer.inputs.map(inputId => ({
//       id: `e${inputId}-${layer.id}`,  
//       source: inputId,
//       target: layer.id,
//       type: 'smoothstep',
//     }))
//   );

//   return (
//     <div style={{ height: 500 }}>
//       <ReactFlow nodes={nodes} edges={edges}>
//         <MiniMap />
//         <Controls />
//         <Background />
//       </ReactFlow>
//     </div>
//   );
// };

// export default ModelVisualizer;
