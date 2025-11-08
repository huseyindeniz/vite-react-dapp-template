#!/usr/bin/env node

import path from 'path';
import { ensureDocsOutputDir, writeFile } from './utils/fileUtils.mjs';
import { heading, codeBlock, list, bold, cleanMarkdown } from './utils/templateUtils.mjs';

/**
 * Generate user guides
 */
export function generateGuides() {
  console.log('\n' + '='.repeat(80));
  console.log('GUIDE GENERATION');
  console.log('='.repeat(80));

  const outputDir = ensureDocsOutputDir();
  const guidesDir = path.join(outputDir, 'guides');

  const guides = [];

  // 1. Getting Started
  console.log('\n📖 Generating getting-started guide...');
  const gettingStarted = generateGettingStarted();
  const gettingStartedPath = path.join(guidesDir, 'getting-started.md');
  writeFile(gettingStartedPath, cleanMarkdown(gettingStarted));
  guides.push({ name: 'Getting Started', path: gettingStartedPath });

  // 2. Adding New Feature
  console.log('📖 Generating adding-new-feature guide...');
  const addingFeature = generateAddingFeature();
  const addingFeaturePath = path.join(guidesDir, 'adding-new-feature.md');
  writeFile(addingFeaturePath, cleanMarkdown(addingFeature));
  guides.push({ name: 'Adding New Feature', path: addingFeaturePath });

  // 3. Creating New Model
  console.log('📖 Generating creating-new-model guide...');
  const creatingModel = generateCreatingModel();
  const creatingModelPath = path.join(guidesDir, 'creating-new-model.md');
  writeFile(creatingModelPath, cleanMarkdown(creatingModel));
  guides.push({ name: 'Creating New Model', path: creatingModelPath });

  // 4. Testing Guide
  console.log('📖 Generating testing guide...');
  const testingGuide = generateTestingGuide();
  const testingGuidePath = path.join(guidesDir, 'testing-guide.md');
  writeFile(testingGuidePath, cleanMarkdown(testingGuide));
  guides.push({ name: 'Testing Guide', path: testingGuidePath });

  // 5. Architecture Guide
  console.log('📖 Generating architecture guide...');
  const architectureGuide = generateArchitectureGuide();
  const architectureGuidePath = path.join(guidesDir, 'architecture-guide.md');
  writeFile(architectureGuidePath, cleanMarkdown(architectureGuide));
  guides.push({ name: 'Architecture Guide', path: architectureGuidePath });

  // 6. Guides README
  console.log('📖 Generating guides README...');
  const guidesReadme = generateGuidesReadme(guides);
  const guidesReadmePath = path.join(guidesDir, 'README.md');
  writeFile(guidesReadmePath, cleanMarkdown(guidesReadme));

  console.log('\n' + '='.repeat(80));
  console.log('GUIDES GENERATED');
  console.log('='.repeat(80));

  console.log(`\n✅ Generated ${guides.length} guides:`);
  guides.forEach(g => console.log(`  - ${g.name}`));

  return guides;
}

/**
 * Generate Getting Started guide
 */
function generateGettingStarted() {
  return `# Getting Started

Welcome to the React dApp Template! This guide will help you get started with the project.

## Prerequisites

- Node.js 18+ and npm
- Git
- Basic understanding of React, TypeScript, and Redux

## Installation

${codeBlock(`# Clone the repository
git clone <your-repo-url>
cd vite-react-dapp-template

# Install dependencies
npm install

# Start development server
npm run dev`, 'bash')}

## Project Structure

${codeBlock(`src/
├── features/           # Feature modules
│   ├── app/           # Application bootstrap (core)
│   ├── auth/          # Authentication (core)
│   ├── i18n/          # Internationalization (core)
│   ├── router/        # Routing (core)
│   ├── slice-manager/ # Redux lifecycle (core)
│   ├── ui/            # Design system (core)
│   ├── wallet/        # Web3 wallet (domain)
│   ├── oauth/         # OAuth (domain)
│   └── blog-demo/     # Blog example (domain)
├── pages/             # Page components
├── services/          # Service implementations
└── hooks/             # Root-level hooks`, '')}

## Core Concepts

### Feature Categories

${bold('Core Features')} - Infrastructure features that provide foundational functionality:
- app, auth, i18n, router, slice-manager, ui
- These have specialized structures
- Cannot depend on domain features

${bold('Domain Features')} - Business logic features:
- wallet, oauth, blog-demo (examples)
- Follow feature-model architecture
- You'll create your own domain features

### Feature-Model Architecture

Domain features organize code by models:

${codeBlock(`features/wallet/
├── models/           # Business models
│   ├── provider/    # Wallet provider model
│   ├── network/     # Network model
│   └── account/     # Account model
├── hooks/           # Feature hooks
├── components/      # UI components
├── slice.ts         # Root reducer (combineReducers)
└── sagas.ts         # Saga watchers`, '')}

### Business Logic Separation

${bold('CRITICAL:')} Business logic lives ONLY in actionEffects (Redux Saga):

${codeBlock(`models/account/
├── actions.ts           # Action creators (no logic)
├── slice.ts             # Pure state updates
└── actionEffects/       # ALL business logic here
    ├── signIn.ts
    ├── loadAccount.ts
    └── disconnectWallet.ts`, '')}

## Development Workflow

### 1. Start Development Server

${codeBlock(`npm run dev`, 'bash')}

### 2. Run Tests

${codeBlock(`npm run test`, 'bash')}

### 3. Check Code Quality

${codeBlock(`npm run lint       # Must pass with 0 warnings
npm run build      # Must build successfully`, 'bash')}

### 4. Extract Translations

${codeBlock(`npm run extract                # Extract i18n keys
npm run check-translations     # Validate completeness`, 'bash')}

## Development Commands

${codeBlock(`npm run dev                    # Start dev server
npm run build                  # Build for production
npm run test                   # Run tests
npm run lint                   # Lint code
npm run storybook              # Component documentation
npm run extract                # Extract i18n texts
npm run check-translations     # Validate i18n`, 'bash')}

## Next Steps

1. Explore the codebase structure
2. Read the [Architecture Guide](./architecture-guide.md)
3. Learn how to [Add a New Feature](./adding-new-feature.md)
4. Check out example features: wallet, oauth, blog-demo

## Resources

- [Adding New Feature](./adding-new-feature.md)
- [Creating New Model](./creating-new-model.md)
- [Testing Guide](./testing-guide.md)
- [Architecture Guide](./architecture-guide.md)

---

${bold('Ready to build?')} Start by removing example features (blog-demo, etc.) and creating your own domain features!
`;
}

/**
 * Generate Adding New Feature guide
 */
function generateAddingFeature() {
  return `# Adding a New Feature

This guide shows you how to add a new domain feature to the project.

## Step 1: Create Feature Directory

${codeBlock(`mkdir -p src/features/products/models/product`, 'bash')}

## Step 2: Create Model Structure

${codeBlock(`src/features/products/
├── models/
│   └── product/
│       ├── IProductApi.ts        # Interface for services
│       ├── actions.ts             # Action creators
│       ├── slice.ts               # State slice
│       ├── actionEffects/         # Business logic
│       │   ├── loadProducts.ts
│       │   └── createProduct.ts
│       └── types/                 # TypeScript types
│           ├── Product.ts
│           └── ProductState.ts
├── hooks/
│   ├── useActions.ts              # Action dispatchers
│   └── useProducts.ts             # State access
├── components/
│   ├── ProductList.tsx
│   └── ProductCard.tsx
├── IProductsApi.ts                # Root interface
├── slice.ts                       # combineReducers
└── sagas.ts                       # Saga watchers`, '')}

## Step 3: Define Interface

Create \`models/product/IProductApi.ts\`:

${codeBlock(`export interface IProductApi {
  loadProducts(): Promise<Product[]>;
  createProduct(data: CreateProductData): Promise<Product>;
  updateProduct(id: string, data: UpdateProductData): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
}`, 'typescript')}

## Step 4: Create Actions

Create \`models/product/actions.ts\`:

${codeBlock(`import { createAction } from '@reduxjs/toolkit';

export const loadProducts = createAction('products/loadProducts');
export const createProduct = createAction<CreateProductData>('products/createProduct');
export const updateProduct = createAction<{ id: string; data: UpdateProductData }>('products/updateProduct');
export const deleteProduct = createAction<string>('products/deleteProduct');

export const loadProductsSuccess = createAction<Product[]>('products/loadProductsSuccess');
export const loadProductsFailure = createAction<string>('products/loadProductsFailure');`, 'typescript')}

## Step 5: Create Slice

Create \`models/product/slice.ts\`:

${codeBlock(`import { createSlice } from '@reduxjs/toolkit';
import * as actions from './actions';

const initialState: ProductState = {
  items: [],
  loading: false,
  error: null
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(actions.loadProducts, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actions.loadProductsSuccess, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(actions.loadProductsFailure, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const productReducer = productSlice.reducer;`, 'typescript')}

## Step 6: Create Business Logic

Create \`models/product/actionEffects/loadProducts.ts\`:

${codeBlock(`import { put, call } from 'redux-saga/effects';
import * as actions from '../actions';
import { IProductApi } from '../IProductApi';

export function* loadProducts(api: IProductApi) {
  try {
    const products = yield call([api, api.loadProducts]);
    yield put(actions.loadProductsSuccess(products));
  } catch (error) {
    yield put(actions.loadProductsFailure(error.message));
  }
}`, 'typescript')}

## Step 7: Create Root Slice (combineReducers)

Create \`slice.ts\`:

${codeBlock(`import { combineReducers } from '@reduxjs/toolkit';
import { productReducer } from './models/product/slice';

export const productsReducer = combineReducers({
  product: productReducer
});`, 'typescript')}

## Step 8: Create Sagas

Create \`sagas.ts\`:

${codeBlock(`import { all, takeLatest } from 'redux-saga/effects';
import * as actions from './models/product/actions';
import { loadProducts } from './models/product/actionEffects/loadProducts';

export function* productsSaga(api: IProductsApi) {
  yield all([
    takeLatest(actions.loadProducts, loadProducts, api)
  ]);
}`, 'typescript')}

## Step 9: Create Hooks

Create \`hooks/useActions.ts\`:

${codeBlock(`import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import * as actions from '../models/product/actions';

export function useProductActions() {
  const dispatch = useDispatch();

  return useMemo(() => ({
    loadProducts: () => dispatch(actions.loadProducts()),
    createProduct: (data: CreateProductData) => dispatch(actions.createProduct(data))
  }), [dispatch]);
}`, 'typescript')}

## Step 10: Register Feature

In \`src/config/features.ts\`:

${codeBlock(`import { productsReducer } from '@/features/products/slice';
import { productsSaga } from '@/features/products/sagas';

export const features: FeatureConfig[] = [
  // ... existing features
  {
    enabled: true,
    store: {
      stateKey: 'products',
      reducer: productsReducer
    },
    saga: {
      saga: productsSaga,
      dependencies: [productApi]
    }
  }
];`, 'typescript')}

## Step 11: Use in Components

${codeBlock(`import { useProductActions } from '@/features/products/hooks/useActions';
import { useTypedSelector } from '@/hooks/useTypedSelector';

function ProductList() {
  const actions = useProductActions();
  const products = useTypedSelector(state => state.products.product.items);

  useEffect(() => {
    actions.loadProducts();
  }, [actions]);

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}`, 'typescript')}

## Checklist

- [ ] Created feature directory structure
- [ ] Defined interfaces for dependency injection
- [ ] Created actions (no logic)
- [ ] Created slice (pure state updates)
- [ ] Created actionEffects (ALL business logic)
- [ ] Created root slice with combineReducers
- [ ] Created saga watchers
- [ ] Created feature hooks
- [ ] Registered feature in app/config
- [ ] Added tests
- [ ] Ran lint and build

---

${bold('Next:')} Read [Creating New Model](./creating-new-model.md) to add more models to your feature.
`;
}

/**
 * Generate Creating New Model guide
 */
function generateCreatingModel() {
  return `# Creating a New Model

This guide shows how to add a new model to an existing feature.

## When to Create a New Model

Create a new model when you have a distinct entity or domain concept that:
- Has its own state
- Has its own business logic
- Can be reasoned about independently

## Example: Adding "Category" Model to Products Feature

## Step 1: Create Model Directory

${codeBlock(`mkdir -p src/features/products/models/category`, 'bash')}

## Step 2: Model Structure

${codeBlock(`models/category/
├── ICategoryApi.ts         # Interface
├── actions.ts              # Action creators
├── slice.ts                # State slice
├── actionEffects/          # Business logic
│   ├── loadCategories.ts
│   └── createCategory.ts
└── types/                  # Types
    ├── Category.ts
    └── CategoryState.ts`, '')}

## Step 3: Define Interface

${codeBlock(`// models/category/ICategoryApi.ts
export interface ICategoryApi {
  loadCategories(): Promise<Category[]>;
  createCategory(name: string): Promise<Category>;
}`, 'typescript')}

## Step 4: Update Root Interface

${codeBlock(`// IProductsApi.ts
import { IProductApi } from './models/product/IProductApi';
import { ICategoryApi } from './models/category/ICategoryApi';

export interface IProductsApi extends IProductApi, ICategoryApi {}`, 'typescript')}

## Step 5: Create Actions, Slice, ActionEffects

Follow the same pattern as the product model.

## Step 6: Update Root Slice (combineReducers)

${codeBlock(`// slice.ts
import { combineReducers } from '@reduxjs/toolkit';
import { productReducer } from './models/product/slice';
import { categoryReducer } from './models/category/slice';

export const productsReducer = combineReducers({
  product: productReducer,
  category: categoryReducer  // Add new model
});`, 'typescript')}

## Step 7: Update Sagas

${codeBlock(`// sagas.ts
import { all, takeLatest } from 'redux-saga/effects';
import * as productActions from './models/product/actions';
import * as categoryActions from './models/category/actions';
import { loadProducts } from './models/product/actionEffects/loadProducts';
import { loadCategories } from './models/category/actionEffects/loadCategories';

export function* productsSaga(api: IProductsApi) {
  yield all([
    // Product sagas
    takeLatest(productActions.loadProducts, loadProducts, api),

    // Category sagas (NEW)
    takeLatest(categoryActions.loadCategories, loadCategories, api)
  ]);
}`, 'typescript')}

## Step 8: Access State

State is nested by model:

${codeBlock(`// Access product state
const products = useTypedSelector(state => state.products.product.items);

// Access category state
const categories = useTypedSelector(state => state.products.category.items);`, 'typescript')}

## Model Naming Convention

- Model directory: lowercase (e.g., \`account\`, \`network\`)
- Interface: \`I<Model>Api\` (e.g., \`IAccountApi\`)
- Slice name: lowercase (e.g., \`'account'\`)
- Reducer export: \`<model>Reducer\` (e.g., \`accountReducer\`)

## Common Patterns

### Single Model Feature (Example: OAuth)

${codeBlock(`oauth/
└── models/
    └── session/    # Only one model`, '')}

### Multi-Model Feature (Example: Wallet)

${codeBlock(`wallet/
└── models/
    ├── provider/   # Wallet provider
    ├── network/    # Network/chain
    └── account/    # User account`, '')}

---

${bold('Remember:')} Each model has its own directory, even if there's only ONE model!
`;
}

/**
 * Generate Testing Guide
 */
function generateTestingGuide() {
  return `# Testing Guide

This guide covers testing best practices for this project.

## Test Stack

- ${bold('Vitest')} - Test runner
- ${bold('React Testing Library')} - Component testing
- ${bold('Testing Library User Event')} - User interactions
- ${bold('Redux Saga Test Plan')} - Saga testing

## Running Tests

${codeBlock(`# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage`, 'bash')}

## Test Structure

${codeBlock(`src/features/products/
├── models/
│   └── product/
│       ├── slice.test.ts              # Slice tests
│       └── actionEffects/
│           ├── loadProducts.ts
│           └── loadProducts.test.ts   # Business logic tests
└── components/
    ├── ProductCard.tsx
    └── ProductCard.test.tsx           # Component tests`, '')}

## Testing Slices

${codeBlock(`import { productReducer } from './slice';
import * as actions from './actions';

describe('productSlice', () => {
  it('should handle loadProducts', () => {
    const state = productReducer(undefined, actions.loadProducts());

    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should handle loadProductsSuccess', () => {
    const products = [{ id: '1', name: 'Test' }];
    const state = productReducer(undefined, actions.loadProductsSuccess(products));

    expect(state.loading).toBe(false);
    expect(state.items).toEqual(products);
  });
});`, 'typescript')}

## Testing ActionEffects (Sagas)

${codeBlock(`import { expectSaga } from 'redux-saga-test-plan';
import { loadProducts } from './loadProducts';
import * as actions from '../actions';

describe('loadProducts', () => {
  it('should load products successfully', () => {
    const products = [{ id: '1', name: 'Test' }];
    const mockApi = {
      loadProducts: () => Promise.resolve(products)
    };

    return expectSaga(loadProducts, mockApi)
      .put(actions.loadProductsSuccess(products))
      .run();
  });

  it('should handle errors', () => {
    const error = new Error('Failed to load');
    const mockApi = {
      loadProducts: () => Promise.reject(error)
    };

    return expectSaga(loadProducts, mockApi)
      .put(actions.loadProductsFailure('Failed to load'))
      .run();
  });
});`, 'typescript')}

## Testing Components

${codeBlock(`import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  it('should render product name', () => {
    const product = { id: '1', name: 'Test Product', price: 99 };

    render(<ProductCard product={product} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });
});`, 'typescript')}

## Testing Hooks

${codeBlock(`import { renderHook } from '@testing-library/react';
import { useProductActions } from './useActions';

describe('useProductActions', () => {
  it('should return action dispatchers', () => {
    const { result } = renderHook(() => useProductActions());

    expect(result.current.loadProducts).toBeInstanceOf(Function);
    expect(result.current.createProduct).toBeInstanceOf(Function);
  });
});`, 'typescript')}

## Best Practices

1. ${bold('Test business logic, not implementation')}
2. ${bold('Use descriptive test names')}
3. ${bold('One assertion per test (when possible)')}
4. ${bold('Mock external dependencies')}
5. ${bold('Test error cases')}
6. ${bold('Keep tests simple and readable')}

## Coverage Goals

- ${bold('Unit Tests:')} 60%+ coverage
- ${bold('Integration Tests:')} Key user flows
- ${bold('Storybook:')} 40%+ of components

---

${bold('Remember:')} Tests are documentation. Write tests that explain what your code does.
`;
}

/**
 * Generate Architecture Guide
 */
function generateArchitectureGuide() {
  return `# Architecture Guide

This guide explains the architectural patterns used in this template.

## Core Principles

### 1. Feature-Based Organization

Code is organized by features, not by technical layers.

${bold('✅ Good (Feature-based):')}
${codeBlock(`features/
├── wallet/
│   ├── models/
│   ├── components/
│   └── hooks/
└── products/
    ├── models/
    ├── components/
    └── hooks/`, '')}

${bold('❌ Bad (Layer-based):')}
${codeBlock(`src/
├── components/
├── actions/
├── reducers/
└── sagas/`, '')}

### 2. Business Logic Separation

${bold('CRITICAL:')} ALL business logic lives in \`actionEffects/\` (Redux Saga).

${list([
  'actionEffects/ - ALL business logic (API calls, async workflows, error handling)',
  'slice.ts - PURE state updates only (state.field = value)',
  'components/ - PURE presentation (render UI, no logic)'
])}

### 3. Dependency Injection

Features define interfaces, services implement them, composition root wires everything.

${codeBlock(`┌─────────────┐
│   Feature   │ defines
│ (Business)  │────────────┐
└─────────────┘            │
                           ▼
                   ┌───────────────┐
                   │   Interface   │
                   │  (Contract)   │
                   └───────────────┘
                           ▲
                           │ implements
┌─────────────┐            │
│   Service   │────────────┘
│ (Technical) │
└─────────────┘`, '')}

### 4. Hook Abstraction

Components NEVER use Redux directly. They use feature hooks.

${codeBlock(`Component → Feature Hook → Redux

❌ NEVER: Component → useDispatch/useSelector → Redux
✅ ALWAYS: Component → useFeatureActions/useFeature → Redux`, '')}

## Architecture Layers

### Layer 1: Presentation (Components)

${bold('Responsibility:')} Render UI based on state

${codeBlock(`function ProductList() {
  const actions = useProductActions();     // Feature hook
  const products = useProducts();           // Feature hook

  return <div>{products.map(...)}</div>;
}`, 'typescript')}

### Layer 2: State Access (Hooks)

${bold('Responsibility:')} Abstract Redux from components

${codeBlock(`// hooks/useActions.ts
export function useProductActions() {
  const dispatch = useDispatch();
  return useMemo(() => ({
    loadProducts: () => dispatch(actions.loadProducts())
  }), [dispatch]);
}`, 'typescript')}

### Layer 3: Business Logic (ActionEffects)

${bold('Responsibility:')} ALL business logic, async workflows

${codeBlock(`// actionEffects/loadProducts.ts
export function* loadProducts(api: IProductApi) {
  try {
    const products = yield call([api, api.loadProducts]);
    yield put(actions.loadProductsSuccess(products));
  } catch (error) {
    yield put(actions.loadProductsFailure(error.message));
  }
}`, 'typescript')}

### Layer 4: Service (API Implementation)

${bold('Responsibility:')} Implement technical details

${codeBlock(`class ProductService implements IProductApi {
  async loadProducts(): Promise<Product[]> {
    return fetch('/api/products').then(r => r.json());
  }
}`, 'typescript')}

## Feature Categories

### Core Features (Infrastructure)

- app, auth, i18n, router, slice-manager, ui
- Provide foundational functionality
- Have specialized structures
- ${bold('CANNOT')} depend on domain features

### Domain Features (Business Logic)

- wallet, oauth, products, orders, etc.
- Implement business domains
- Follow feature-model architecture
- ${bold('CAN')} depend on core features

## Dependency Rules

${codeBlock(`✅ ALLOWED:
  - Domain → Core
  - Domain → Domain
  - Core → Core

❌ FORBIDDEN:
  - Core → Domain (architecture violation)`, '')}

## Composition Root

\`src/config/\` is the ONLY place where:
- Services are imported
- Features are wired together
- Dependencies are injected

${codeBlock(`// app/config/services.ts
import { ProductService } from '@/services/products';
export const productApi = new ProductService();

// app/config/features.ts
import { productsSaga } from '@/features/products/sagas';
{
  saga: {
    saga: productsSaga,
    dependencies: [productApi]  // Dependency injection
  }
}`, 'typescript')}

## State Shape

State is nested by feature and model:

${codeBlock(`{
  products: {
    product: { items: [], loading: false },
    category: { items: [], loading: false }
  },
  wallet: {
    provider: { ... },
    network: { ... },
    account: { ... }
  }
}`, 'typescript')}

## Data Flow

${codeBlock(`1. Component calls feature hook action
   ↓
2. Action dispatched to Redux
   ↓
3. Saga intercepts action
   ↓
4. ActionEffect runs business logic
   ↓
5. ActionEffect calls injected API
   ↓
6. ActionEffect dispatches success/failure
   ↓
7. Slice updates state (pure)
   ↓
8. Component re-renders with new state`, '')}

---

${bold('Key Takeaway:')} Every layer has ONE responsibility. Business logic ONLY in actionEffects.
`;
}

/**
 * Generate guides README
 */
function generateGuidesReadme(guides) {
  let content = heading(1, 'Guides');

  content += 'Comprehensive guides to help you understand and work with this template.\n\n';

  content += heading(2, 'Available Guides');

  guides.forEach(guide => {
    const filename = path.basename(guide.path);
    content += `- [${guide.name}](./${filename})\n`;
  });

  content += '\n---\n\n*Generated by docs-generator skill*\n';

  return content;
}

// Run if called directly
const isMainModule = process.argv[1]?.endsWith('generate_guides.mjs');

if (isMainModule) {
  generateGuides();
}
