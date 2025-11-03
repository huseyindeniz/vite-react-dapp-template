#!/usr/bin/env node

import path from 'path';
import { execSync } from 'child_process';
import { analyzeArchitecture } from './analyze_architecture.mjs';
import { ensureDocsOutputDir, writeFile } from './utils/fileUtils.mjs';

/**
 * Generate PlantUML diagrams for architecture visualization and render to PNG
 */
export function generateDiagrams() {
  console.log('\n' + '='.repeat(80));
  console.log('DIAGRAM GENERATION (PlantUML)');
  console.log('='.repeat(80));

  const outputDir = ensureDocsOutputDir();
  const diagramsDir = path.join(outputDir, 'architecture', 'diagrams');

  console.log(`\n📁 Output: ${diagramsDir}`);

  // Analyze architecture first
  console.log('\n🔍 Analyzing architecture...');
  const architecture = analyzeArchitecture();

  const diagrams = [];

  // 1. System Overview
  console.log('\n📊 Generating system overview diagram...');
  const systemOverview = generateSystemOverview(architecture);
  const systemPath = writeDiagram(diagramsDir, 'system-overview', systemOverview);
  diagrams.push({ name: 'System Overview', path: systemPath });

  // 2. Feature Architecture
  console.log('📊 Generating feature architecture diagram...');
  const featureArch = generateFeatureArchitecture(architecture);
  const featurePath = writeDiagram(diagramsDir, 'feature-architecture', featureArch);
  diagrams.push({ name: 'Feature Architecture', path: featurePath });

  // 3. Data Flow (Redux/Saga)
  console.log('📊 Generating data flow diagram...');
  const dataFlow = generateDataFlow();
  const flowPath = writeDiagram(diagramsDir, 'data-flow', dataFlow);
  diagrams.push({ name: 'Data Flow', path: flowPath });

  // 4. Redux Architecture
  console.log('📊 Generating Redux architecture diagram...');
  const reduxArch = generateReduxArchitecture();
  const reduxPath = writeDiagram(diagramsDir, 'redux-architecture', reduxArch);
  diagrams.push({ name: 'Redux Architecture', path: reduxPath });

  // 5. Component Hierarchy
  console.log('📊 Generating component hierarchy diagram...');
  const compHierarchy = generateComponentHierarchy();
  const compPath = writeDiagram(diagramsDir, 'component-hierarchy', compHierarchy);
  diagrams.push({ name: 'Component Hierarchy', path: compPath });

  // Render all diagrams to PNG
  console.log('\n🎨 Rendering diagrams to PNG...');
  renderDiagramsToPNG(diagramsDir, diagrams);

  console.log('\n' + '='.repeat(80));
  console.log('DIAGRAMS GENERATED');
  console.log('='.repeat(80));

  console.log(`\n✅ Generated ${diagrams.length} diagrams:`);
  diagrams.forEach(d => {
    const baseName = path.basename(d.path, '.puml');
    console.log(`  - ${d.name}: ${baseName}.puml -> ${baseName}.png`);
  });

  return diagrams;
}

/**
 * Write diagram file and return path
 */
function writeDiagram(dir, name, content) {
  const filepath = path.join(dir, `${name}.puml`);
  writeFile(filepath, content);
  return filepath;
}

/**
 * Render all PlantUML diagrams to PNG
 */
function renderDiagramsToPNG(diagramsDir, diagrams) {
  try {
    // Render all puml files in the directory
    execSync(`plantuml "${diagramsDir}/*.puml"`, {
      encoding: 'utf-8',
      stdio: 'inherit'
    });
    console.log('  ✅ All diagrams rendered to PNG');
  } catch (error) {
    console.error('  ❌ Failed to render some diagrams:', error.message);
  }
}

/**
 * Generate system overview diagram
 */
function generateSystemOverview(architecture) {
  const coreFeatures = architecture.features.core;
  const domainFeatures = architecture.features.domain;

  return `@startuml system-overview
!theme plain
title Vite React dApp Template - System Architecture Overview

package "Frontend Application" {
  package "Presentation Layer" {
    component [React App] as ReactApp
    component [Mantine UI] as MantineUI
    component [Layout Components] as Layout
    component [Feature Components] as FeatureComponents
  }

  package "Business Logic Layer" {
    component [Redux Store] as ReduxStore
    component [Redux Saga] as ReduxSaga
    component [Slice Lifecycle Manager] as SliceManager
  }

  package "Service Layer" {
    component [Ethers.js Service] as EthersService
    component [API Services] as APIServices
    component [i18n Service] as i18nService
  }

  package "Infrastructure Layer" {
    component [Vite Build System] as Vite
    component [TypeScript] as TypeScript
    component [Testing Framework] as Testing
  }
}

package "External Services" {
  component [Web3 Wallets] as Web3Wallets
  component [Blockchain Networks] as BlockchainNetworks
  component [REST APIs] as RestAPIs
}

' Connections within Frontend
ReactApp --> MantineUI
ReactApp --> Layout
Layout --> FeatureComponents
FeatureComponents --> ReduxStore
ReduxStore --> ReduxSaga
ReduxSaga --> SliceManager
ReduxSaga --> EthersService
ReduxSaga --> APIServices
ReactApp --> i18nService

' External connections
EthersService --> Web3Wallets
EthersService --> BlockchainNetworks
APIServices --> RestAPIs

' Infrastructure
Vite --> ReactApp
TypeScript --> ReactApp
Testing --> FeatureComponents

@enduml`;
}

/**
 * Generate feature architecture diagram
 */
function generateFeatureArchitecture(architecture) {
  const coreFeatures = architecture.features.core.join('\\n  - ');
  const domainFeatures = architecture.features.domain.join('\\n  - ');

  return `@startuml feature-architecture
!theme plain
title Feature-Based Architecture

package "Core Features (Infrastructure)" #LightBlue {
  [${architecture.features.core.join(']\\n  [')}]
}

package "Domain Features (Business Logic)" #LightGreen {
  [${architecture.features.domain.join(']\\n  [')}]
}

package "Composition Root" #LightYellow {
  component [app/config] as Config
}

' Domain features depend on core features (allowed)
${architecture.dependencies.domainToCore.map(d => `[${d.from}] ..> [${d.to}]`).join('\n')}

' Domain to domain dependencies
${architecture.dependencies.domainToDomain.map(d => `[${d.from}] --> [${d.to}]`).join('\n')}

' Composition root wires everything
${architecture.features.domain.map(f => `Config ==> [${f}]`).join('\n')}

note right of Config
  Composition root handles
  dependency injection
end note

@enduml`;
}

/**
 * Generate data flow diagram
 */
function generateDataFlow() {
  return `@startuml data-flow
!theme plain
title Data Flow - Redux Saga Pattern

participant "Component" as Comp
participant "Feature Hook" as Hook
participant "Action Creator" as Action
participant "Redux Saga" as Saga
participant "ActionEffect" as Effect
participant "Service API" as API
participant "Redux Slice" as Slice
participant "Redux Store" as Store

Comp -> Hook: call useFeatureActions()
Hook -> Action: dispatch action
Action -> Saga: trigger saga watcher
Saga -> Effect: call actionEffect(api)
Effect -> API: api.method()
API --> Effect: return result
Effect -> Slice: dispatch success/failure
Slice -> Store: update state
Store --> Hook: state change notification
Hook --> Comp: re-render with new data

note over Comp, Hook
  **Component Abstraction**
  No direct Redux usage
end note

note over Action, Effect
  **Business Logic Layer**
  All logic in actionEffects/
end note

note over API
  **Service Layer**
  Injected dependencies
end note

note over Slice, Store
  **State Management**
  Pure state mutations only
end note

@enduml`;
}

/**
 * Generate Redux architecture diagram
 */
function generateReduxArchitecture() {
  return `@startuml redux-architecture
!theme plain
title Redux + Saga Architecture Pattern

package "Feature: wallet" {
  package "models/" {
    package "provider/" {
      component [IProviderApi] as ProviderAPI
      component [actions.ts] as ProviderActions
      component [slice.ts] as ProviderSlice
      component [actionEffects/] as ProviderEffects
    }

    package "network/" {
      component [INetworkApi] as NetworkAPI
      component [actions.ts] as NetworkActions
      component [slice.ts] as NetworkSlice
      component [actionEffects/] as NetworkEffects
    }

    package "account/" {
      component [IAccountApi] as AccountAPI
      component [actions.ts] as AccountActions
      component [slice.ts] as AccountSlice
      component [actionEffects/] as AccountEffects
    }
  }

  component [IWalletApi] as WalletAPI
  component [slice.ts] as WalletSlice
  component [sagas.ts] as WalletSagas

  package "hooks/" {
    component [useWalletActions] as UseActions
    component [useWallet] as UseWallet
  }
}

' Root feature composition
WalletAPI ..> ProviderAPI
WalletAPI ..> NetworkAPI
WalletAPI ..> AccountAPI

WalletSlice ..> ProviderSlice
WalletSlice ..> NetworkSlice
WalletSlice ..> AccountSlice

WalletSagas --> ProviderEffects
WalletSagas --> NetworkEffects
WalletSagas --> AccountEffects

' Service injection
ProviderEffects --> ProviderAPI : receives
NetworkEffects --> NetworkAPI : receives
AccountEffects --> AccountAPI : receives

' Component layer
UseActions --> ProviderActions
UseActions --> NetworkActions
UseActions --> AccountActions

UseWallet --> WalletSlice : selects state

note right of WalletAPI
  Interface combines all
  model interfaces
end note

note right of WalletSlice
  combineReducers from
  all model slices
end note

note right of ProviderEffects
  Business logic with
  injected dependencies
end note

@enduml`;
}

/**
 * Generate component hierarchy diagram
 */
function generateComponentHierarchy() {
  return `@startuml component-hierarchy
!theme plain
title Component Hierarchy Pattern

package "Feature Component" {
  component [FeatureComponent] as Feature

  package "Hooks Layer" {
    component [useFeatureActions()] as UseActions
    component [useFeature()] as UseState
  }

  package "Redux Layer" {
    component [Redux Store] as Store
    component [Feature Slice] as Slice
    component [Sagas] as Sagas
  }

  package "Service Layer" {
    component [Service API] as API
    component [External Service] as External
  }
}

' Component uses hooks
Feature --> UseActions : dispatches actions
Feature --> UseState : reads state

' Hooks connect to Redux
UseActions --> Slice : dispatch
UseState --> Store : useTypedSelector

' Redux orchestration
Slice --> Store : state updates
Sagas --> API : business logic
API --> External : implementation

note right of Feature
  ✅ Component is pure presentation
  ❌ No useDispatch, no useSelector
  ✅ Uses feature hooks only
end note

note right of UseActions
  Feature-specific hook
  Returns memoized actions
end note

note right of Sagas
  All business logic
  lives here
end note

note right of API
  Dependency injection
  pattern applied
end note

@enduml`;
}

// Run if called directly
const isMainModule = process.argv[1]?.endsWith('generate_diagrams_plantuml.mjs');

if (isMainModule) {
  generateDiagrams();
}
