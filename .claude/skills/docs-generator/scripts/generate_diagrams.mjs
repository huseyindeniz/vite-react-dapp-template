#!/usr/bin/env node

import path from 'path';
import { analyzeArchitecture } from './analyze_architecture.mjs';
import { getAllFeatures, getCoreFeatures, getDomainFeatures, ensureDocsOutputDir, writeFile } from './utils/fileUtils.mjs';

/**
 * Generate Mermaid diagrams for architecture visualization
 */
export function generateDiagrams() {
  console.log('\n' + '='.repeat(80));
  console.log('DIAGRAM GENERATION');
  console.log('='.repeat(80));

  const outputDir = ensureDocsOutputDir();
  const diagramsDir = path.join(outputDir, 'architecture', 'diagrams');

  console.log(`\n📁 Output: ${diagramsDir}`);

  // Analyze architecture first
  console.log('\n🔍 Analyzing architecture...');
  const architecture = analyzeArchitecture();

  const diagrams = [];

  // 1. Architecture Overview
  console.log('\n📊 Generating architecture overview diagram...');
  const archOverview = generateArchitectureOverview(architecture);
  const archPath = path.join(diagramsDir, 'architecture-overview.mmd');
  writeFile(archPath, archOverview);
  diagrams.push({ name: 'Architecture Overview', path: archPath });

  // 2. Feature Dependencies
  console.log('📊 Generating feature dependencies diagram...');
  const featureDeps = generateFeatureDependencies(architecture);
  const depsPath = path.join(diagramsDir, 'feature-dependencies.mmd');
  writeFile(depsPath, featureDeps);
  diagrams.push({ name: 'Feature Dependencies', path: depsPath });

  // 3. Data Flow (Redux/Saga)
  console.log('📊 Generating data flow diagram...');
  const dataFlow = generateDataFlow();
  const flowPath = path.join(diagramsDir, 'data-flow.mmd');
  writeFile(flowPath, dataFlow);
  diagrams.push({ name: 'Data Flow', path: flowPath });

  // 4. Feature Structure (Model-based)
  console.log('📊 Generating feature structure diagram...');
  const featureStructure = generateFeatureStructure();
  const structPath = path.join(diagramsDir, 'feature-structure.mmd');
  writeFile(structPath, featureStructure);
  diagrams.push({ name: 'Feature Structure', path: structPath });

  // 5. Dependency Injection
  console.log('📊 Generating dependency injection diagram...');
  const diDiagram = generateDependencyInjection();
  const diPath = path.join(diagramsDir, 'dependency-injection.mmd');
  writeFile(diPath, diDiagram);
  diagrams.push({ name: 'Dependency Injection', path: diPath });

  console.log('\n' + '='.repeat(80));
  console.log('DIAGRAMS GENERATED');
  console.log('='.repeat(80));

  console.log(`\n✅ Generated ${diagrams.length} diagrams:`);
  diagrams.forEach(d => console.log(`  - ${d.name}: ${path.basename(d.path)}`));

  return diagrams;
}

/**
 * Generate architecture overview diagram
 */
function generateArchitectureOverview(architecture) {
  const coreFeatures = architecture.features.core;
  const domainFeatures = architecture.features.domain;

  let diagram = `graph TB
    subgraph "Core Features (Infrastructure)"
`;

  coreFeatures.forEach(feature => {
    diagram += `        ${feature}["${feature}"]\n`;
  });

  diagram += `    end

    subgraph "Domain Features (Business Logic)"
`;

  domainFeatures.forEach(feature => {
    diagram += `        ${feature}["${feature}"]\n`;
  });

  diagram += `    end

    subgraph "Composition Root"
        app-config["app/config"]
    end

`;

  // Add dependencies
  architecture.dependencies.domainToCore.forEach(dep => {
    diagram += `    ${dep.from} --> ${dep.to}\n`;
  });

  architecture.dependencies.domainToDomain.forEach(dep => {
    diagram += `    ${dep.from} -.-> ${dep.to}\n`;
  });

  // Composition root connections
  diagram += `    app-config ==> app\n`;
  domainFeatures.forEach(feature => {
    diagram += `    app-config ==> ${feature}\n`;
  });

  diagram += `
    style app-config fill:#ff9,stroke:#333,stroke-width:4px
`;

  return diagram;
}

/**
 * Generate feature dependencies diagram
 */
function generateFeatureDependencies(architecture) {
  const allFeatures = [...architecture.features.core, ...architecture.features.domain];

  let diagram = `graph LR
`;

  // Create nodes
  allFeatures.forEach(feature => {
    const isCore = architecture.features.core.includes(feature);
    const style = isCore ? 'fill:#bbf' : 'fill:#bfb';
    diagram += `    ${feature}["${feature}"]\n`;
    diagram += `    style ${feature} ${style}\n`;
  });

  // Add dependencies
  const allDeps = [
    ...architecture.dependencies.coreToDomain.map(d => ({ ...d, type: 'violation' })),
    ...architecture.dependencies.domainToCore.map(d => ({ ...d, type: 'ok' })),
    ...architecture.dependencies.domainToDomain.map(d => ({ ...d, type: 'cross' })),
    ...architecture.dependencies.coreToCore.map(d => ({ ...d, type: 'internal' }))
  ];

  // Deduplicate dependencies
  const uniqueDeps = new Map();
  allDeps.forEach(dep => {
    const key = `${dep.from}->${dep.to}`;
    if (!uniqueDeps.has(key)) {
      uniqueDeps.set(key, dep);
    }
  });

  uniqueDeps.forEach(dep => {
    const arrow = dep.type === 'violation' ? '==>' : dep.type === 'cross' ? '-.->' : '-->';
    diagram += `    ${dep.from} ${arrow} ${dep.to}\n`;
  });

  return diagram;
}

/**
 * Generate data flow diagram (Redux/Saga)
 */
function generateDataFlow() {
  return `sequenceDiagram
    participant Component
    participant Hook as Feature Hook
    participant Action as Action Creator
    participant Saga as Redux Saga
    participant API as Service API
    participant Slice as Redux Slice
    participant Store as Redux Store

    Component->>Hook: call useFeatureActions()
    Hook->>Action: dispatch action
    Action->>Saga: trigger saga
    Saga->>API: call API method
    API-->>Saga: return result
    Saga->>Slice: dispatch success/failure
    Slice->>Store: update state
    Store-->>Hook: notify state change
    Hook-->>Component: re-render with new state

    Note over Component,Store: Component Abstraction Layer
    Note over Action,Saga: Business Logic Layer
    Note over API: Service Layer
    Note over Slice,Store: State Management Layer
`;
}

/**
 * Generate feature structure diagram
 */
function generateFeatureStructure() {
  return `graph TD
    Feature[Domain Feature]

    Feature --> Models[models/]
    Feature --> Hooks[hooks/]
    Feature --> Components[components/]
    Feature --> SliceFile[slice.ts]
    Feature --> SagasFile[sagas.ts]
    Feature --> Interface[IFeatureApi.ts]

    Models --> Model1[model1/]
    Models --> Model2[model2/]

    Model1 --> M1Interface[IModel1Api.ts]
    Model1 --> M1Actions[actions.ts]
    Model1 --> M1Slice[slice.ts]
    Model1 --> M1Effects[actionEffects/]
    Model1 --> M1Types[types/]

    Hooks --> UseActions[useActions.ts]
    Hooks --> UseState[useFeatureState.ts]

    Components --> Component1[Component1.tsx]
    Components --> Component2[Component2.tsx]

    SliceFile -.-> M1Slice
    SliceFile -.-> Model2

    Interface -.-> M1Interface
    Interface -.-> Model2

    style Feature fill:#bbf,stroke:#333,stroke-width:2px
    style Models fill:#bfb,stroke:#333,stroke-width:2px
    style Hooks fill:#fbf,stroke:#333,stroke-width:2px
    style Components fill:#ffb,stroke:#333,stroke-width:2px
`;
}

/**
 * Generate dependency injection diagram
 */
function generateDependencyInjection() {
  return `graph LR
    subgraph "Feature Layer"
        Feature[Feature]
        Feature --> Interface[IFeatureApi]
        Feature --> ActionEffect[ActionEffect]
    end

    subgraph "Composition Root"
        Config[app/config/services.ts]
    end

    subgraph "Service Layer"
        Service[Service Implementation]
        Service --> ExternalLib[External Library]
    end

    Interface -.->|implements| Service
    Config -->|imports| Service
    Config -->|injects| ActionEffect
    ActionEffect -->|receives| Interface

    style Interface fill:#bbf,stroke:#333,stroke-width:2px
    style Config fill:#ff9,stroke:#333,stroke-width:4px
    style Service fill:#bfb,stroke:#333,stroke-width:2px

    Note1[Feature defines interface]
    Note2[Service implements interface]
    Note3[Config wires everything together]
    Note4[ActionEffect receives injected API]
`;
}

// Run if called directly
const isMainModule = process.argv[1]?.endsWith('generate_diagrams.mjs');

if (isMainModule) {
  generateDiagrams();
}
