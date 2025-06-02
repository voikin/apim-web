import ReactFlow, {
  Background,
  Controls,
  type Node,
  type Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import type {
  v1APIGraph as APIGraph,
  v1PathSegment as PathSegment,
  sharedv1Operation,
} from "@/api/profile-store";

const nodeWidth = 180;
const nodeHeight = 60;

export function ApiGraphView({ graph }: { graph: APIGraph }) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "LR" });

  const getSegmentId = (s: PathSegment) =>
    s.param?.id ?? s.static?.id ?? "unknown";

  const getSegmentName = (s: PathSegment) =>
    s.param?.name ? `{${s.param?.name}}` : s.static?.name ?? "unknown";

  const methodsBySegment = new Map<string, string[]>();

  graph.operations?.forEach((op) => {
    const segId = op.pathSegmentId;
    if (!segId || !op.method) return;
    if (!methodsBySegment.has(segId)) {
      methodsBySegment.set(segId, []);
    }
    methodsBySegment.get(segId)!.push(op.method);
  });

  graph.segments?.forEach((segment) => {
    const id = getSegmentId(segment);
    if (id) {
      g.setNode(id, { width: nodeWidth, height: nodeHeight });
    }
  });

  graph.edges?.forEach((edge) => {
    if (edge.from && edge.to) g.setEdge(edge.from, edge.to);
  });

  dagre.layout(g);

  const nodes: Node[] = graph.segments
    ?.map((segment) => {
      const id = getSegmentId(segment);
      const name = getSegmentName(segment);
      const layout = id ? g.node(id) : null;
      if (!id || !layout) return null;

      const methods = methodsBySegment.get(id) ?? [];
      const label = (
        <div className="text-xs leading-tight">
          <div className="font-medium">{name}</div>
          {methods.map((m, idx) => (
            <div key={`${m}-${idx}`}>{m}</div>
          ))}
        </div>
      );

      return {
        id,
        data: { label },
        position: {
          x: layout.x - nodeWidth / 2,
          y: layout.y - nodeHeight / 2,
        },
      };
    })
    .filter(Boolean) as Node[];

  const validSegmentIds = new Set(nodes.map((n) => n.id));
  const edges: Edge[] =
    graph.edges
      ?.filter(
        (edge) =>
          validSegmentIds.has(edge.from!) && validSegmentIds.has(edge.to!)
      )
      .map((edge) => ({
        id: `${edge.from}-${edge.to}`,
        source: edge.from!,
        target: edge.to!,
      })) ?? [];

  const operationById = new Map<string, sharedv1Operation>();

  graph.operations?.forEach((op) => {
    if (op.id) {
      operationById.set(op.id, op);
    }
  });

  const transitionEdges: Edge[] = graph.transitions
    ?.map((tr, idx) => {
      const fromOp = operationById.get(tr.from!);
      const toOp = operationById.get(tr.to!);

      if (
        !fromOp?.pathSegmentId ||
        !toOp?.pathSegmentId ||
        !validSegmentIds.has(fromOp.pathSegmentId) ||
        !validSegmentIds.has(toOp.pathSegmentId)
      ) {
        return null;
      }

      return {
        id: `transition-${idx}`,
        source: fromOp.pathSegmentId,
        target: toOp.pathSegmentId,
        style: { strokeDasharray: "5,5" },
        type: "smoothstep",
        animated: true,
      };
    })
    .filter(Boolean) as Edge[];

  return (
    <div className="h-[400px] border rounded">
      <ReactFlow
        nodes={nodes}
        edges={[...edges, ...transitionEdges]}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        zoomOnScroll
        panOnScroll
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
