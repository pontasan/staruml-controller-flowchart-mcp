import { createServer, flowchartTools } from "staruml-controller-mcp-core"

export function createFlowchartServer() {
    return createServer("staruml-controller-flowchart", "1.0.0", flowchartTools)
}
