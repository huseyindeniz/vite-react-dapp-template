#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
const OUT = path.join(process.cwd(),'docs','architecture','diagrams');
const META = JSON.parse(fs.readFileSync(path.join(process.cwd(),'docs','architecture','scan.meta.json'),'utf8'));

function write(name, content){
  fs.writeFileSync(path.join(OUT, name), content);
  console.log(`gen_puml: wrote ${name}`);
}

const deps = new Set([...(META.package.deps||[]), ...(META.package.devDeps||[])]);
const topDeps = Array.from(deps).slice(0, 20);

// System overview (generic)
write('system-overview.puml', `@startuml
!theme plain
title System Architecture Overview

package "Frontend" {
  component "App" as App
  component "State" as State
  component "UI" as UI
  component "Routing" as Routing
}

package "API Layer" {
  component "HTTP Client" as Http
  component "Services" as Services
  component "Auth" as Auth
}

package "Backend" {
  component "REST API" as Rest
  component "Business Logic" as BL
  component "Data Access" as DAL
}

database "Database" as DB

App --> State
App --> Routing
UI --> State
App --> Http
Http --> Services
Services --> Auth
Services --> Rest
Rest --> BL
BL --> DAL
DAL --> DB
@enduml
`);

// Component architecture (lightweight)
write('component-architecture.puml', `@startuml
!theme plain
title Component Architecture (summary)

package "App Shell" {
  component "App" as App
  component "Layout" as Layout
  component "Header" as Header
  component "Sidebar" as Sidebar
}

package "Features" {
  component "FeatureA" as FA
  component "FeatureB" as FB
}

package "Shared" {
  component "Button" as Btn
  component "Modal" as Modal
  component "Form" as Form
}

App --> Layout
Layout --> Header
Layout --> Sidebar
Layout --> FA
Layout --> FB
FA --> Btn
FB --> Modal
FA --> Form
@enduml
`);

// Data flow (generic)
write('data-flow.puml', `@startuml
!theme plain
title Data Flow

rectangle "UI" as UI
rectangle "State" as ST
rectangle "API" as API
rectangle "Backend" as BE
database "DB" as DB

UI --> ST : user actions
ST --> API : async calls
API --> BE : HTTP requests
BE --> DB : queries
DB --> BE : results
BE --> API : responses
API --> ST : state updates
ST --> UI : re-render
@enduml
`);

// Dependency snapshot (top packages)
write('dependencies-summary.puml', `@startuml
!theme plain
title Top Dependencies (snapshot)
cloud "NPM Ecosystem" {
${topDeps.map((d,i)=>`  component "${d}" as dep${i}`).join('\n')}
}
@enduml
`);
