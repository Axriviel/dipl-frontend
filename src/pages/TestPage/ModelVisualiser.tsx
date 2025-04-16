import { Background, Controls, Edge, MarkerType, MiniMap, Node, OnConnect, OnEdgesDelete, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react';
import React, { useEffect } from 'react';

import '@xyflow/react/dist/style.css';

interface LayerParams {
  id: string;
  type: string;
  name: string,
  inputs: string[];
}

interface ModelVisualizerProps {
  layers: LayerParams[];
  onNodeClick: (node: Node) => void;
  onLayersChange: (updatedLayers: LayerParams[]) => void;
}

const markerEndConfig = {
  type: MarkerType.ArrowClosed,
  width: 20,
  height: 20,
  color: '#FF0072',
};
const edgeType = "default"; //bezier doesnt seem to work although it is in the guide. Default should be bezier anyway

const ModelVisualizer: React.FC<ModelVisualizerProps> = ({ layers, onNodeClick, onLayersChange }) => {
  // create nodes for each layer
  const initialNodes: Node[] = layers.map((layer, index) => ({
    id: layer.id,
    data: { label: `${layer.type} (${layer.name})` },
    position: { x: 150 * index, y: 100 * index },
  }));

  // create edges
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

  useEffect(() => {
    const newNodes: Node[] = layers.map((layer, index) => ({
      id: layer.id,
      data: { label: `${layer.type} (${layer.name})` },
      position: { x: 150 * index % 2, y: 100 * index },
    }));

    // create new edges from 'layers'
    const newEdges: Edge[] = layers.flatMap(layer =>
      layer.inputs.map(inputId => ({
        id: `e${inputId}-${layer.id}`,
        source: inputId,
        target: layer.id,
        // type: 'smoothstep',
        type: edgeType,
        markerEnd: markerEndConfig,

        //set line itself
        // style: {
        // strokeWidth: 1,
        // stroke: '#FF0072',
        // },
      }))
    );


    setNodes(prevNodes => {
      const newNodeIds = new Set(newNodes.map(node => node.id));

      return [
        // keep layers that were not updated
        ...prevNodes.map(prevNode => {
          const correspondingNewNode = newNodes.find(n => n.id === prevNode.id);
          if (correspondingNewNode) {
            if (prevNode.data.label !== correspondingNewNode.data.label) {
              return {
                ...prevNode,
                data: { ...prevNode.data, label: correspondingNewNode.data.label },
              };
            }
            return prevNode;
          }
          return prevNode;
        }).filter(node => newNodeIds.has(node.id)), //remove no longer existing nodes

        // add new nodes
        ...newNodes.filter(node => !prevNodes.some(prevNode => prevNode.id === node.id)),
      ];
    });


    // update edges
    setEdges(prevEdges => {
      const newEdgeIds = new Set(newEdges.map(edge => edge.id));

      return [
        ...prevEdges.filter(edge => newEdgeIds.has(edge.id)), // keep existing ones
        ...newEdges.filter(edge => !prevEdges.some(prevEdge => prevEdge.id === edge.id)), // add new edges
      ];
    });
  }, [layers]);

  // create new connection
  const onConnect: OnConnect = (connection) => {
    setEdges((eds) => [
      ...eds,
      {
        id: `e${connection.source}-${connection.target}`,
        ...connection,
        type: edgeType,
        markerEnd: markerEndConfig,
      },
    ]);

    // update inputs
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

  // delete edge
  const onEdgesDelete: OnEdgesDelete = (deletedEdges) => {
    deletedEdges.forEach((edge) => {
      const { source, target } = edge;
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
      // fitView={true}
      // fitViewOptions={{minZoom: 1.2, maxZoom: 1.2}}
      >
        <MiniMap className={"mini-map"} position='top-right' />
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default ModelVisualizer;
