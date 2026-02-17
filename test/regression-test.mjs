#!/usr/bin/env node
import { apiGet, apiPost, apiDelete, encId, runTest } from './test-utils.mjs';

const DIR = import.meta.dirname;

await runTest('flowchart', DIR, async (ctx) => {
  // Create diagram
  let s = ctx.step('Create flowchart diagram');
  let diagramId;
  try {
    const res = await apiPost('/api/flowchart/diagrams', { name: 'Test Flowchart' });
    diagramId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  // Create nodes
  s = ctx.step('Create terminator (start)');
  let startId;
  try {
    const res = await apiPost('/api/flowchart/nodes', { diagramId, type: 'FCTerminator', name: 'Start', x1: 100, y1: 50, x2: 220, y2: 100 });
    startId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create process');
  let processId;
  try {
    const res = await apiPost('/api/flowchart/nodes', { diagramId, type: 'FCProcess', name: 'Process Data', x1: 100, y1: 150, x2: 220, y2: 210 });
    processId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create decision');
  let decisionId;
  try {
    const res = await apiPost('/api/flowchart/nodes', { diagramId, type: 'FCDecision', name: 'Valid?', x1: 100, y1: 270, x2: 220, y2: 340 });
    decisionId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create terminator (end)');
  let endId;
  try {
    const res = await apiPost('/api/flowchart/nodes', { diagramId, type: 'FCTerminator', name: 'End', x1: 100, y1: 400, x2: 220, y2: 450 });
    endId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  // Create flows
  s = ctx.step('Create flow: Start → Process');
  try {
    await apiPost('/api/flowchart/flows', { diagramId, sourceId: startId, targetId: processId });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create flow: Process → Decision');
  try {
    await apiPost('/api/flowchart/flows', { diagramId, sourceId: processId, targetId: decisionId });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create flow: Decision → End');
  try {
    await apiPost('/api/flowchart/flows', { diagramId, sourceId: decisionId, targetId: endId, name: 'Yes' });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  // Layout + Export
  await ctx.layoutDiagram(diagramId);
  await ctx.exportDiagram(diagramId, 'Export flowchart image');

  // Cleanup
  s = ctx.step('Delete diagram');
  try {
    await apiDelete(`/api/flowchart/diagrams/${encId(diagramId)}`);
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }
});
