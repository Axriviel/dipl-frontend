import React, { useEffect } from 'react';
import { ReactFlow, Node, Edge, MiniMap, Controls, Background, useNodesState, useEdgesState, MarkerType, OnConnect } from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { OnEdgesDelete } from 'react-flow-renderer';

interface LayerParams {
  id: string;
  type: string;
  name: string,
  inputs: string[];
}

interface ModelVisualizerProps {
  layers: LayerParams[];
  onNodeClick: (node: Node) => void; // Nová prop pro obsluhu kliknutí na uzel
  onLayersChange: (updatedLayers: LayerParams[]) => void; // Přidání callbacku pro aktualizaci vrstev
}

const markerEndConfig = {
  type: MarkerType.ArrowClosed,
  width: 20,
  height: 20,
  color: '#FF0072',
};
const edgeType = "default"; //bezier doesnt seem to work although it is in the guide. Default should be bezier anyway

const ModelVisualizer: React.FC<ModelVisualizerProps> = ({ layers, onNodeClick, onLayersChange }) => {
  // Vytvoření uzlů (nodes) pro každou vrstvu
  const initialNodes: Node[] = layers.map((layer, index) => ({
    id: layer.id,
    data: { label: `${layer.type} (${layer.name})` },
    position: { x: 150 * index, y: 100 * index },
  }));

  // Vytvoření propojení mezi uzly (edges)
  const initialEdges: Edge[] = layers.flatMap(layer =>
    layer.inputs.map(inputId => ({
      id: `e${inputId}-${layer.id}`,
      source: inputId,
      target: layer.id,
      // type: 'smoothstep',
      // type: 'bezier',
      type: edgeType,
      markerEnd: markerEndConfig,

    }))
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // useEffect, který sleduje změny v 'layers' a přidává nové uzly a hrany
  useEffect(() => {
    // Vytvoření nových uzlů z aktuálních 'layers'
    const newNodes: Node[] = layers.map((layer, index) => ({
      id: layer.id,
      data: { label: `${layer.type} (${layer.name})` },
      // Výchozí pozice pro nové uzly
      position: { x: 150 * index % 2, y: 100 * index },
    }));

    // Vytvoření nových hran z aktuálních 'layers'
    const newEdges: Edge[] = layers.flatMap(layer =>
      layer.inputs.map(inputId => ({
        id: `e${inputId}-${layer.id}`,
        source: inputId,
        target: layer.id,
        // type: 'smoothstep',
        type: edgeType,
        markerEnd: markerEndConfig,

        //nastavení čáry jako takové
        // style: {
        // strokeWidth: 1,
        // stroke: '#FF0072',
        // },
      }))
    );


    // Aktualizace uzlů – přidá nové uzly a odebere ty, které už neexistují v `layers`
    setNodes(prevNodes => {
      // Získání ID všech existujících uzlů
      const newNodeIds = new Set(newNodes.map(node => node.id));

      // Aktualizace stavu uzlů
      return [
        ...prevNodes.filter(node => newNodeIds.has(node.id)), // zachová pouze uzly, které jsou v `layers`
        ...newNodes.filter(node => !prevNodes.some(prevNode => prevNode.id === node.id)), // přidá nové uzly
      ];
    });

    // Aktualizace hran – přidá nové hrany a odebere ty, které už neexistují v `layers`
    setEdges(prevEdges => {
      // Získání ID všech nových hran
      const newEdgeIds = new Set(newEdges.map(edge => edge.id));

      // Aktualizace stavu hran
      return [
        ...prevEdges.filter(edge => newEdgeIds.has(edge.id)), // zachová pouze existující hrany
        ...newEdges.filter(edge => !prevEdges.some(prevEdge => prevEdge.id === edge.id)), // přidá nové hrany
      ];
    });
  }, [layers]);

  // Handler pro vytvoření nové hrany
  const onConnect: OnConnect = (connection) => {
    // Přidání nové hrany do stavu 'edges'
    setEdges((eds) => [
      ...eds,
      {
        id: `e${connection.source}-${connection.target}`,
        ...connection,
        type: edgeType,
        markerEnd: markerEndConfig,
      },
    ]);

    // Aktualizace 'inputs' cílové vrstvy
    onLayersChange(
      layers.map((layer) => {
        if (layer.id === connection.target) {
          if (!layer.inputs.includes(connection.source!)) {
            return {
              ...layer,
              inputs: [...layer.inputs, connection.source!],
            };
          }
        }
        return layer;
      })
    );
  };

  // Handler pro smazání hrany
  const onEdgesDelete: OnEdgesDelete = (deletedEdges) => {
    deletedEdges.forEach((edge) => {
      const { source, target } = edge;
      // Aktualizace 'inputs' cílové vrstvy
      onLayersChange(
        layers.map((layer) => {
          if (layer.id === target) {
            return {
              ...layer,
              inputs: layer.inputs.filter((inputId) => inputId !== source),
            };
          }
          return layer;
        })
      );
    });

    // Odstranění hran ze stavu 'edges'
    setEdges((eds) => eds.filter((e) => !deletedEdges.find((de) => de.id === e.id)));
  };


  return (
    <div style={{ height: 700 }}>
      <ReactFlow nodes={nodes} edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => onNodeClick(node)}
        onConnect={onConnect}
        onEdgesDelete={onEdgesDelete}
        deleteKeyCode={['Backspace', 'Delete']}
      >
        <MiniMap position='top-right' />
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default ModelVisualizer;
