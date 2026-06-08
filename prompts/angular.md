### Install Example Copy File Builder

Source: https://angular.dev/tools/cli/cli-builder

Install the custom `@example/copy-file` builder from npm to make it available in your Angular project.

```bash
npm install @example/copy-file
```

--------------------------------

### inject() - Usage and Injection Contexts

Source: https://angular.dev/api/core/inject

Comprehensive guide on valid injection contexts and usage patterns for the inject function, including examples of valid and invalid usage.

```APIDOC
## inject() - Usage and Injection Contexts

### Valid Injection Contexts
The `inject()` function can only be called within an injection context:

1. **Constructor body** of a class being instantiated by the DI system (@Injectable or @Component)
2. **Field initializer** of an @Injectable or @Component class
3. **Factory function** specified for `useFactory` of a Provider or @Injectable
4. **Factory function** specified for an InjectionToken
5. **Stackframe of a function call** in a DI context

### Valid Usage Example - Field Initializer
```typescript
@Injectable({providedIn: 'root'})
export class Car {
  radio: Radio|undefined;
  // OK: field initializer
  spareTyre = inject(Tyre);

  constructor() {
    // OK: constructor body
    this.radio = inject(Radio);
  }
}
```

### Valid Usage Example - Provider Factory
```typescript
providers: [
  {provide: Car, useFactory: () => {
    // OK: a class factory
    const engine = inject(Engine);
    return new Car(engine);
  }}
]
```

### Invalid Usage Example - Lifecycle Hook
```typescript
@Component({ ... })
export class CarComponent {
  ngOnInit() {
    // ERROR: too late, the component instance was already created
    const engine = inject(Engine);
    engine.start();
  }
}
```

### Error Conditions
Calls to `inject()` outside of the class creation context will result in an error. Most notably:
- Calls after a class instance was created
- Calls in methods (including lifecycle hooks like ngOnInit, ngAfterViewInit, etc.)
- Calls in event handlers or asynchronous callbacks
```

--------------------------------

### Basic Preloading Configuration Example

Source: https://angular.dev/api/router/withPreloading

This example demonstrates how to integrate `withPreloading` with `provideRouter` to apply a preloading strategy like `PreloadAllModules` during application bootstrapping.

```typescript
const appRoutes: Routes = [];
bootstrapApplication(AppComponent,
  {
    providers: [
      provideRouter(appRoutes, withPreloading(PreloadAllModules))
    ]
  }
);
```

--------------------------------

### Setup Tests with beforeEach and ComponentFixture (TypeScript)

Source: https://angular.dev/assets/context/llms-full.txt

Refactor test setup into a `beforeEach` block to avoid duplication. This example initializes `ComponentFixture` and the component instance, awaiting initial rendering.

```ts
describe('Banner (with beforeEach)', () => {
  let component: Banner;
  let fixture: ComponentFixture<Banner>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Banner);
    component = fixture.componentInstance;

    await fixture.whenStable(); // necessary to wait for the initial rendering
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
```

--------------------------------

### Initial `app.ts` setup for Angular signals tutorial

Source: https://angular.dev/tutorials/signals/3-deriving-state-with-linked-signals

Initial component setup demonstrating basic signal usage, with placeholders for `linkedSignal` import and notification toggle button.

```typescript
import {Component, signal, computed, ChangeDetectionStrategy} from '@angular/core';
  

// TODO: Import linkedSignal from @angular/core
  

@Component({
selector: 'app-root',
template: `
<div class="user-profile">
<h1>User Dashboard</h1>
<div class="status-indicator" [class]="userStatus()">
<span class="status-dot"></span>
Status: {{ userStatus() }}
</div>
  

<div class="status-info">
<div class="notifications">
<strong>Notifications:</strong>
@if (notificationsEnabled()) {
Enabled
} @else {
Disabled
}
<!-- TODO: Add button to toggle notifications -->
</div>
<div class="message"><strong>Message:</strong> {{ statusMessage() }}</div>`
```

--------------------------------

### Expect and flush a single GET request

Source: https://angular.dev/assets/context/llms-full.txt

This example demonstrates how to expect a specific GET request, assert its properties, flush a mock response, and verify the service's handling of the response.

```ts
TestBed.configureTestingModule({
  providers: [ConfigService, provideHttpClientTesting()],
});

const httpTesting = TestBed.inject(HttpTestingController);

// Load `ConfigService` and request the current configuration.
const service = TestBed.inject(ConfigService);
const config$ = service.getConfig<Config>();

// `firstValueFrom` subscribes to the `Observable`, which makes the HTTP request,
// and creates a `Promise` of the response.
const configPromise = firstValueFrom(config$);

// At this point, the request is pending, and we can assert it was made
// via the `HttpTestingController`:
const req = httpTesting.expectOne('/api/config', 'Request to load the configuration');

// We can assert various properties of the request if desired.
expect(req.request.method).toBe('GET');

// Flushing the request causes it to complete, delivering the result.
req.flush(DEFAULT_CONFIG);

// We can then assert that the response was successfully delivered by the `ConfigService`:
expect(await configPromise).toEqual(DEFAULT_CONFIG);

// Finally, we can assert that no other requests were made.
httpTesting.verify();
```

--------------------------------

### Minimal Component Test File Setup

Source: https://angular.dev/assets/context/llms-full.txt

A simplified version of the CLI-generated test file, focusing on the essential setup to create and verify the component instance.

```ts
describe('Banner (minimal)', () => {
  it('should create', () => {
    const fixture = TestBed.createComponent(Banner);
    const component = fixture.componentInstance;
    expect(component).toBeDefined();
  });
});
```

--------------------------------

### Install Angular CLI globally with sudo for Unix-like systems

Source: https://angular.dev/tools/cli/setup-local

On some Unix-like setups, if global script installation fails due to permission errors, use 'sudo' to execute the npm install command as the root user. Understand the implications of running commands as root.

```npm
sudo npm install -g @angular/cli
```

--------------------------------

### NgSwitch Container Setup

Source: https://angular.dev/api/common/NgSwitch

Basic setup showing how to define a container element with the [ngSwitch] directive and specify the switch expression to match against.

```HTML
<container-element [ngSwitch]="switch_expression">
</container-element>
```

--------------------------------

### Install Tailwind CSS and dependencies with npm

Source: https://angular.dev/guide/tailwind

Install Tailwind CSS, the PostCSS plugin, and PostCSS itself as dependencies for manual setup.

```bash
npm install tailwindcss @tailwindcss/postcss postcss
```

--------------------------------

### httpClient.request('GET', url, options)

Source: https://angular.dev/api/common/http/HttpClient

Performs a generic HTTP GET request. This example demonstrates searching for heroes by name using query parameters.

```APIDOC
## httpClient.request('GET', url, options)

### Description
Performs a generic HTTP GET request. This example demonstrates searching for heroes by name using query parameters.

### Method
GET

### Endpoint
{baseUrl}

### Parameters
#### Query Parameters
- **name** (string) - Required - The search term for the hero's name.

#### Request Body
(Not applicable for GET requests)

### Request Example
(Not applicable for GET requests with query parameters)

### Response
#### Success Response (200)
- **[array of Hero objects]** (Hero[]) - An array of hero objects matching the search term.

#### Response Example
```json
[
  {"id": 10, "name": "Magneta"},
  {"id": 11, "name": "RubberMan"}
]
```
```

--------------------------------

### started

Source: https://angular.dev/api/cdk/drag-drop/DragRef

Emits when the user starts dragging the item.

```APIDOC
## Event: started

### Description
Emits when the user starts dragging the item.

### Type
`any`
```

--------------------------------

### Initialize and build schematics project

Source: https://angular.dev/tools/cli/schematics-authoring

Navigate to the collection folder, install dependencies, and run the build script to prepare the schematic.

```bash
cd hello-world
npm install
npm run build
code .
```

--------------------------------

### Basic Router Setup with provideRouter

Source: https://angular.dev/api/router/provideRouter

Illustrates the minimal setup for enabling router functionality in an Angular application by providing an empty routes array to `provideRouter` during application bootstrapping.

```typescript
const appRoutes: Routes = [];
bootstrapApplication(AppComponent, {
  providers: [provideRouter(appRoutes)]
});
```

--------------------------------

### setUpPreloading

Source: https://angular.dev/api/router/RouterPreloader

Sets up the preloading mechanism, enabling the `RouterPreloader` to start listening for navigation events and preloading configurations.

```APIDOC
## Method: setUpPreloading

### Description
Sets up the preloading mechanism, enabling the `RouterPreloader` to start listening for navigation events and preloading configurations.

### Signature
```typescript
setUpPreloading(): void;
```

### Returns
`void`
```

--------------------------------

### Start the Angular development server

Source: https://angular.dev/assets/context/llms-full.txt

Run the `npm start` command within your project directory to launch the local development server and serve your Angular application.

```shell
npm start
```

--------------------------------

### Install JSON Server globally

Source: https://angular.dev/tutorials/first-app/14-http

Installs the `json-server` package globally using npm, making the command-line tool available for creating mock REST APIs.

```bash
npm install -g json-server
```

--------------------------------

### Install Browser Preview Provider for Vitest

Source: https://angular.dev/guide/testing

Install the `@vitest/browser-preview` package, designed for WebContainer environments like StackBlitz, to run Vitest tests in a preview browser.

```bash
npm install --save-dev @vitest/browser-preview
```

--------------------------------

### Configure TestBed with provideHttpClientTesting for basic setup

Source: https://angular.dev/assets/context/llms-full.txt

Use this snippet to set up `TestBed` for `HttpClient` testing, providing `HttpTestingController` for interacting with the test backend.

```ts
TestBed.configureTestingModule({
  providers: [
    // ... other test providers
    provideHttpClientTesting(),
  ],
});

const httpTesting = TestBed.inject(HttpTestingController);
```

--------------------------------

### Example HTML5 pushState URL

Source: https://angular.dev/assets/context/llms-full.txt

This is an example of a 'natural' URL style using PathLocationStrategy, which does not require a hash.

```text
localhost:3002/crisis-center
```

--------------------------------

### Install dependencies with npm

Source: https://angular.dev/tutorials/first-app/01-hello-world

Run this command in the project directory to install all required Node.js packages before building and serving the Angular app.

```bash
npm install
```

--------------------------------

### Create new Angular project for manual setup

Source: https://angular.dev/guide/tailwind

Initialize a new Angular project and navigate to its directory before proceeding with manual Tailwind CSS configuration.

```bash
ng new my-project
cd my-project
```

--------------------------------

### Automated Autocompletion Setup Prompt

Source: https://angular.dev/cli/completion

Shows the interactive prompt for enabling autocompletion automatically and the command to source the script manually after setup.

```bash
$ ng serve
? Would you like to enable autocompletion? This will set up your terminal so pressing TAB while typing Angular CLI commands will show possible options and autocomplete arguments. (Enabling autocompletion will modify configuration files in your home directory.) Yes
Appended `source <(ng completion script)` to `/home/my-username/.bashrc`. Restart your terminal or run:

source <(ng completion script)

to autocomplete `ng` commands.

# Serve output...
```

--------------------------------

### Install Vitest browser preview provider

Source: https://angular.dev/assets/context/llms-full.txt

Install the `@vitest/browser-preview` provider, designed for WebContainer environments. This provider is not intended for CI/CD use.

```shell
// npm
npm install --save-dev @vitest/browser-preview
```

```shell
// yarn
yarn add --dev @vitest/browser-preview
```

```shell
// pnpm
pnpm add -D @vitest/browser-preview
```

```shell
// bun
bun add --dev @vitest/browser-preview
```

--------------------------------

### Create a Customizable Setup Function for Angular Tests

Source: https://angular.dev/guide/testing/components-basics

Define a reusable setup function to configure TestBed and create a component fixture, allowing for parameter-based customization.

```typescript
function setup(providers?: StaticProviders[]): ComponentFixture<Banner> {
  TestBed.configureTestingModule({providers});
  return TestBed.createComponent(Banner);
}
```

--------------------------------

### Correctly Using isStable Before Starting Recurrent Tasks (RxJS)

Source: https://angular.dev/api/core/ApplicationRef

This example demonstrates how to wait for the application to be stable using `first(stable => stable)` before starting a recurrent task, ensuring 'App is stable now' is logged.

```typescript
constructor(appRef: ApplicationRef) {
  appRef.isStable.pipe(
    first(stable => stable),
    tap(stable => console.log('App is stable now')),
    switchMap(() => interval(1000))
  ).subscribe(counter => console.log(counter));
}
```

--------------------------------

### Comprehensive Harness Loading Example in TypeScript

Source: https://angular.dev/assets/context/llms-full.txt

This example demonstrates loading harnesses for components within a fixture using `TestbedHarnessEnvironment.loader()`, for components outside the fixture using `documentRootLoader()`, and directly for the fixture's root component using `harnessForFixture()`.

```ts
let fixture: ComponentFixture<MyDialogButton>;
let loader: HarnessLoader;
let rootLoader: HarnessLoader;

beforeEach(() => {
  fixture = TestBed.createComponent(MyDialogButton);
  loader = TestbedHarnessEnvironment.loader(fixture);
  rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
});

it('loads harnesses', async () => {
  // Load a harness for the bootstrapped component with `harnessForFixture`
  dialogButtonHarness = await TestbedHarnessEnvironment.harnessForFixture(
    fixture,
    MyDialogButtonHarness,
  );

  // The button element is inside the fixture's root element, so we use `loader`.
  const buttonHarness = await loader.getHarness(MyButtonHarness);

  // Click the button to open the dialog
  await buttonHarness.click();

  // The dialog is appended to `document.body`, outside of the fixture's root element,
  // so we use `rootLoader` in this case.
  const dialogHarness = await rootLoader.getHarness(MyDialogHarness);

  // ... make some assertions
});
```

--------------------------------

### Example hash URL style

Source: https://angular.dev/assets/context/llms-full.txt

This is an example of a hash-based URL style using HashLocationStrategy, compatible with older browsers.

```text
localhost:3002/src/#/crisis-center
```

--------------------------------

### Install library with npm and types package

Source: https://angular.dev/tools/libraries/using-libraries

Install a library and its corresponding @types package when typings are not included. Use npm install for the library and npm install --save-dev for the types package.

```bash
npm install d3 --save
npm install @types/d3 --save-dev
```

--------------------------------

### Global Setup Files Configuration

Source: https://angular.dev/cli/test

Specifies paths to global setup files that are executed before test files. The application's polyfills and Angular TestBed are always initialized before these files run.

```APIDOC
## Global Setup Files

### Description
A list of paths to global setup files that are executed before the test files. The application's polyfills and the Angular TestBed are always initialized before these files.

### Configuration Property
`setupFiles`

### Value Type
`array`

### Usage
Define an array of file paths relative to the workspace root that should be executed as global setup before any test files run.
```

--------------------------------

### Configure APP_INITIALIZER in NgModule (Promise)

Source: https://angular.dev/api/core/APP_INITIALIZER

This example shows how to configure `APP_INITIALIZER` in an NgModule-based application with an initialization function that returns a Promise, ensuring data is loaded before the app starts.

```typescript
 function initializeApp(): Promise<any> {
   const http = inject(HttpClient);
   return firstValueFrom(
     http
       .get("https://someUrl.com/api/user")
       .pipe(tap(user => { ... }))
   );
 }

 @NgModule({
  imports: [BrowserModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [{
    provide: APP_INITIALIZER,
    useValue: initializeApp,
    multi: true,
   }]
  })
 export class AppModule {}
```

--------------------------------

### navigate

Source: https://angular.dev/api/router/Router

Navigate based on the provided array of commands and a starting point. If no starting route is provided, the navigation is absolute.

```APIDOC
## navigate

### Description
Navigate based on the provided array of commands and a starting point. If no starting route is provided, the navigation is absolute.

### Signature
`navigate(commands: readonly any[], extras?: NavigationExtras) : Promise<boolean>`

### Parameters
- **commands** (`readonly any[]`) - An array of URL fragments with which to construct the target URL. If the path is static, can be the literal URL string. For a dynamic path, pass an array of path segments, followed by the parameters for each segment. The fragments are applied to the current URL or the one provided in the `relativeTo` property of the options object, if supplied.
- **extras** (`NavigationExtras`) - An options object that determines how the URL should be constructed or interpreted.

### Returns
(`Promise<boolean>`) - A Promise that resolves to `true` when navigation succeeds, or `false` when navigation fails. The Promise is rejected when an error occurs if `resolveNavigationPromiseOnError` is not `true`.

### Usage Notes
The following calls request navigation to a dynamic route path relative to the current URL.
```
router.navigate(['team', 33, 'user', 11], {relativeTo: route});

// Navigate without updating the URL, overriding the default behavior
router.navigate(['team', 33, 'user', 11], {relativeTo: route, skipLocationChange: true});
```
```

--------------------------------

### Basic Angular 'Hello, World!' Application (main.ts)

Source: https://angular.dev/playground

This snippet demonstrates the minimal setup for an Angular application, defining a root component and bootstrapping it for display in the browser.

```typescript
import {Component} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser;
  

@Component({
selector: 'app-root',
template: ` Hello world! `,
})
export class Playground {}
  

bootstrapApplication(Playground);
```

--------------------------------

### Basic ngCombobox Implementation

Source: https://angular.dev/api/aria/combobox/Combobox

This example demonstrates how to set up a basic combobox using `ngCombobox`, `ngComboboxInput`, and `ngComboboxPopupContainer` with an `ngListbox` for options.

```html
<div ngCombobox filterMode="highlight">
  <input
    ngComboboxInput
    placeholder="Search for a state..."
    [(value)]="searchString"
  />

  <ng-template ngComboboxPopupContainer>
    <div ngListbox [(value)]="selectedValue">
      @for (option of filteredOptions(); track option) {
        <div ngOption [value]="option" [label]="option">
          <span>{{option}}</span>
        </div>
      }
    </div>
  </ng-template>
</div>
```

--------------------------------

### Initial App Component Setup for Signal Forms

Source: https://angular.dev/tutorials/signal-forms/3-add-validation

Defines the `App` component with `LoginData` interface and initializes `loginModel` using Angular Signals, showing the starting point for form integration.

```typescript
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
// TODO: Import required and email validators
import {form, FormField} from '@angular/forms/signals';
  
interface LoginData {
email: string;
password: string;
rememberMe: boolean;
}
  
@Component({
selector: 'app-root',
templateUrl: './app.html',
styleUrl: './app.css',
imports: [FormField],
changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
loginModel = signal<LoginData>({
email: '',
password: '',
rememberMe: false,
});
  
// TODO: Add schema function as second parameter to form()
// TODO: Add required() and email() validators for email field

```

--------------------------------

### Install Bootstrap 4 and Dependencies

Source: https://angular.dev/tools/libraries/using-libraries

Install jQuery, Popper.js, and Bootstrap 4 using npm to add them to your project.

```bash
npm install jquery --save
  npm install popper.js --save
  npm install bootstrap --save
```

--------------------------------

### Example README.md Content for Angular Package

Source: https://angular.dev/tools/libraries/angular-package-format

An example of `README.md` content for an Angular package, typically used for display on npm and GitHub.

```markdown
Angular &equals;&equals;&equals;&equals;&equals;&equals;&equals; The sources for this package are in
the main [Angular](https://github.com/angular/angular) repo.Please file issues and pull requests
against that repo. License: MIT
```

--------------------------------

### getRootHarnessLoader

Source: https://angular.dev/api/cdk/testing/ContentContainerComponentHarness

Gets the root harness loader from which to start searching for content contained by this harness.

```APIDOC
## getRootHarnessLoader

### Description
Gets the root harness loader from which to start searching for content contained by this harness.

### Response
#### Success Response
- **Return Type**: Promise<HarnessLoader>
```

--------------------------------

### Example Karma Test Runner Console Output

Source: https://angular.dev/guide/testing/karma

This output shows the typical console log when the Karma test runner starts, launches Chrome, and executes tests successfully.

```text
02 11 2022 09:08:28.605:INFO [karma-server]: Karma v6.4.1 server started at http://localhost:9876/
02 11 2022 09:08:28.607:INFO [launcher]: Launching browsers Chrome with concurrency unlimited
02 11 2022 09:08:28.620:INFO [launcher]: Starting browser Chrome
02 11 2022 09:08:31.312:INFO [Chrome]: Connected on socket -LaEYvD2R7MdcS0-AAAB with id 31534482
Chrome: Executed 3 of 3 SUCCESS (0.193 secs / 0.172 secs)
TOTAL: 3 SUCCESS
```

--------------------------------

### Example Server-Side Route Configuration

Source: https://angular.dev/api/ssr/withRoutes

Illustrates how to define server-side routes using `withRoutes` and `provideServerRendering`, specifying different `RenderMode` options for various URL paths.

```typescript
import { provideServerRendering, withRoutes, ServerRoute, RenderMode } from '@angular/ssr';

const serverRoutes: ServerRoute[] = [
  {
    path: '', // This renders the "/" route on the client (CSR)
    renderMode: RenderMode.Client,
  },
  {
    path: 'about', // This page is static, so we prerender it (SSG)
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'profile', // This page requires user-specific data, so we use SSR
    renderMode: RenderMode.Server,
  },
  {
    path: '**', // All other routes will be rendered on the server (SSR)
    renderMode: RenderMode.Server,
  },
];

provideServerRendering(withRoutes(serverRoutes));
```

--------------------------------

### Install Angular CLI Globally

Source: https://angular.dev/cli/completion

Command to install the Angular CLI globally, which is required for autocompletion to function correctly.

```bash
npm install -g @angular/cli
```

--------------------------------

### Initial app.ts Component Setup for Pipe Tutorial

Source: https://angular.dev/tutorials/learn-angular/24-create-a-pipe

This snippet shows the initial `app.ts` file for an Angular component, defining a basic template and a `word` property, before integrating a custom pipe.

```typescript
import {Component} from '@angular/core};
import {ReversePipe} from './reverse.pipe';
  

@Component({
selector: 'app-root',
template: ` Reverse Machine: {{ word }} `,
imports: [],
})
export class App {
word = 'You are a champion';
}
```

--------------------------------

### Install Schematics CLI globally

Source: https://angular.dev/tools/cli/schematics-authoring

Install the command-line tool globally using npm. Requires Node 6.9 or later.

```bash
npm install -g @angular-devkit/schematics-cli
```

--------------------------------

### CLI Command: devserver.start (Experimental)

Source: https://angular.dev/ai/mcp

Asynchronously starts a development server that watches the workspace for changes, similar to running `ng serve`. Since this is asynchronous it returns immediately. To manage the resulting server, use the `devserver.stop` and `devserver.wait_for_build` tools. This experimental tool is local-only and read-only.

```APIDOC
## CLI Command: devserver.start (Experimental)

### Description
Asynchronously starts a development server that watches the workspace for changes, similar to running `ng serve`. Since this is asynchronous it returns immediately. To manage the resulting server, use the `devserver.stop` and `devserver.wait_for_build` tools. This experimental tool is local-only and read-only.

### Method
CLI Command

### Endpoint
devserver.start
```

--------------------------------

### Home Component Structure (Launchdownload)

Source: https://angular.dev/tutorials/first-app/09-services

This snippet presents the Home component's basic structure, including imports, component metadata, and template, as provided in the interactive example.

```TypeScript
import {Component} from '@angular/core';
import {HousingLocation} from '../housing-location/housing-location';
import {HousingLocationInfo} from '../housinglocation';
  

@Component({
selector: 'app-home',
imports: [HousingLocation],
template: `
<section>
<form>
<input type="text" placeholder="Filter by city" />
<button class="primary" type="button">Search</button>
</form>
</section>
<section class="results">
@for (housingLocation of housingLocationList; track $index) {
<app-housing-location [housingLocation]="housingLocation" />
}
</section>
`,
styleUrls: ['./home.css'],
})
export class Home {
```

--------------------------------

### begin(): void

Source: https://angular.dev/api/core/RendererFactory2

A callback invoked when rendering has begun.

```APIDOC
## Method: begin()

### Description
A callback invoked when rendering has begun.

### Parameters
(None)

### Returns
(`void`)
```

--------------------------------

### Automated Tailwind CSS setup with ng add

Source: https://angular.dev/guide/tailwind

Single command to automatically install Tailwind CSS packages, configure the project, and add the necessary imports. Run this in your Angular project root directory.

```bash
ng add tailwindcss
```

--------------------------------

### GET findProviders()

Source: https://angular.dev/api/core/Testability

Searches for providers by name starting from a specific root element within the application.

```APIDOC
## GET findProviders()

### Description
Find providers by name

### Method
GET

### Endpoint
Testability.findProviders(using, provider, exactMatch)

### Parameters
#### Query Parameters
- **using** (any) - Required - The root element to search from
- **provider** (string) - Required - The name of binding variable
- **exactMatch** (boolean) - Required - Whether using exactMatch

### Response
#### Success Response (200)
- **providers** (any[]) - Array of found providers
```

--------------------------------

### Resolver Implementation and Configuration

Source: https://angular.dev/api/router/ResolveFn

Example of implementing a ResolveFn and providing it in the router configuration.

```APIDOC
## CONFIGURATION resolve

### Description
Implementation of a resolver function and its registration within the route configuration using the `resolve` property.

### Method
IMPLEMENTATION

### Endpoint
Route.resolve

### Parameters
#### Configuration Object
- **path** (string) - Required - The path for the route.
- **component** (Type) - Required - The component to activate.
- **resolve** (Object) - Required - An object mapping data keys to ResolveFn implementations.

### Request Example
```typescript
export const heroResolver: ResolveFn<Hero> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(HeroService).getHero(route.paramMap.get('id')!);
};

provideRouter([
  {
    path: 'detail/:id',
    component: HeroDetailComponent,
    resolve: {hero: heroResolver},
  },
])
```

### Response
#### Success Response
- **activatedRoute.data** (Observable) - The resolved data accessible via the ActivatedRoute service in the component.

#### Response Example
```typescript
this.activatedRoute.data.subscribe(({hero}) => {
  console.log(hero.name);
});
```
```

--------------------------------

### Define Subcomponent Directive and Component (TypeScript)

Source: https://angular.dev/guide/testing/creating-component-harnesses

Example of a `MyMenuItem` directive and a `MyMenu` component that composes a `MyPopup` and projects content. This setup demonstrates a scenario for loading subcomponent harnesses.

```typescript
@Directive({
  selector: 'my-menu-item',
})
class MyMenuItem {}

@Component({
  selector: 'my-menu',
  template: `
    <my-popup>
      <ng-content />
    </my-popup>
  `,
})
class MyMenu {
  triggerText = input('');

  items = contentChildren(MyMenuItem);
}
```

--------------------------------

### Expect and Respond to a Single GET Request with HttpTestingController

Source: https://angular.dev/guide/http/testing

Use `expectOne` to intercept a single HTTP GET request, flush it with a mock response, and verify no other requests are outstanding. Requires `HttpClientTestingModule` setup.

```typescript
TestBed.configureTestingModule({
  providers: [ConfigService, provideHttpClientTesting()],
});

const httpTesting = TestBed.inject(HttpTestingController);

// Load `ConfigService` and request the current configuration.
const service = TestBed.inject(ConfigService);
const config$ = service.getConfig<Config>();

// `firstValueFrom` subscribes to the `Observable`, which makes the HTTP request,
// and creates a `Promise` of the response.
const configPromise = firstValueFrom(config$);

// At this point, the request is pending, and we can assert it was made
// via the `HttpTestingController`:
const req = httpTesting.expectOne('/api/config', 'Request to load the configuration');

// We can assert various properties of the request if desired.
expect(req.request.method).toBe('GET');

// Flushing the request causes it to complete, delivering the result.
req.flush(DEFAULT_CONFIG);

// We can then assert that the response was successfully delivered by the `ConfigService`:
expect(await configPromise).toEqual(DEFAULT_CONFIG);

// Finally, we can assert that no other requests were made.
httpTesting.verify();
```

--------------------------------

### Sample DOM for LocatorFactory

Source: https://angular.dev/api/cdk/testing/LocatorFactory

Example HTML structure used to demonstrate element and harness location behavior.

```html
<div id="d1"></div><div id="d2"></div>
```

--------------------------------

### Correct multi provider for ENVIRONMENT_INITIALIZER

Source: https://angular.dev/errors/NG0209

This example demonstrates the correct way to provide `ENVIRONMENT_INITIALIZER` as a multi provider, ensuring `multi: true` is set and the value is an object.

```typescript
{provide: ENVIRONMENT_INITIALIZER, multi: true, useValue: () => {...}}
```

--------------------------------

### ontouchstart

Source: https://angular.dev/api/elements/NgElement

Handles the `touchstart` event.

```APIDOC
## ontouchstart

### Type
`((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined`

### Description
Handles the `touchstart` event.
```

--------------------------------

### HashLocationStrategy component usage example

Source: https://angular.dev/api/common/HashLocationStrategy

Demonstrates how to configure HashLocationStrategy as a provider in an Angular component and use Location service methods to get the current URL path and normalize URL segments.

```TypeScript
import {HashLocationStrategy, Location, LocationStrategy} from '@angular/common';
import {Component} from '@angular/core';

@Component({
  selector: 'hash-location',
  providers: [Location, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  template: `
    <h1>HashLocationStrategy</h1>
    Current URL is: <code>{{ location.path() }}</code
    ><br />
    Normalize: <code>/foo/bar/</code> is: <code>{{ location.normalize('foo/bar') }}</code
    ><br />
  `,
  standalone: false,
})
export class HashLocationComponent {
  location: Location;
  constructor(location: Location) {
    this.location = location;
  }
}
```

--------------------------------

### Correcting an invalid Shadow DOM selector

Source: https://angular.dev/errors/NG2009

When using `ViewEncapsulation.ShadowDom`, the component's selector must follow custom element naming conventions: lowercase, contain a hyphen, and start with a letter. The 'Before' example shows an invalid selector, and the 'After' example demonstrates the correct format.

```typescript
@Component({
  selector: 'comp',
  encapsulation: ViewEncapsulation.ShadowDom
…
})
```

```typescript
@Component({
  selector: 'app-comp',
  encapsulation: ViewEncapsulation.ShadowDom
…
})
```

--------------------------------

### initialNavigation()

Source: https://angular.dev/api/router/Router

Sets up the location change listener and performs the initial navigation.

```APIDOC
## initialNavigation()

### Description
Sets up the location change listener and performs the initial navigation.

### Method
initialNavigation

### Endpoint
initialNavigation()

### Parameters
#### Path Parameters
- No path parameters.

#### Query Parameters
- No query parameters.

#### Request Body
- No request body.

### Request Example
```javascript
router.initialNavigation();
```

### Response
#### Success Response (void)
- This method does not return a value.

#### Response Example
```
```
```

--------------------------------

### Start JSON Server to serve db.json

Source: https://angular.dev/tutorials/first-app/14-http

Executes the `json-server` command, instructing it to watch the `db.json` file and serve its content as a REST API, typically accessible at `http://localhost:3000/locations`.

```bash
json-server --watch db.json
```

--------------------------------

### mapToCanDeactivate Usage Example

Source: https://angular.dev/api/router/mapToCanDeactivate

Example showing how to define an injectable guard class and use mapToCanDeactivate to convert it for use in a route definition. Note: The example uses mapToCanActivate but demonstrates the pattern for guard mapping.

```typescript
@Injectable({providedIn: 'root'})
export class AdminGuard {
  canActivate() {
    return true;
  }
}

const route: Route = {
  path: 'admin',
  canActivate: mapToCanActivate([AdminGuard]),
};
```

--------------------------------

### Invoke reusable animation with parameter overrides

Source: https://angular.dev/api/animations/animation

Invoke a previously defined reusable animation using `useAnimation()`. This example overrides the default `time`, `start`, and `end` parameters for the `fadeAnimation`.

```typescript
useAnimation(fadeAnimation, {
  params: {
    time: '2s',
    start: 1,
    end: 0
  }
})
```

--------------------------------

### onselectstart

Source: https://angular.dev/api/elements/NgElement

Handles the `selectstart` event.

```APIDOC
## onselectstart

### Type
`((this: GlobalEventHandlers, ev: Event) => any) | null`

### Description
Handles the `selectstart` event.
```

--------------------------------

### ng add @angular/pwa example

Source: https://angular.dev/cli/add

Example of adding the Angular PWA package to configure a project for Progressive Web App support.

```bash
ng add @angular/pwa
```

--------------------------------

### Define reusable animation with default parameters

Source: https://angular.dev/api/animations/animation

Use the `animation()` function to create a reusable animation block. This example defines a fade animation with default `time`, `start`, and `end` parameters.

```typescript
var fadeAnimation = animation([
  style({ opacity: '{{ start }}' }),
  animate('{{ time }}',
  style({ opacity: '{{ end }}'}))
  ],
  { params: { time: '1000ms', start: 0, end: 1 }});
```

--------------------------------

### Enable Debug Tracing with provideRouter

Source: https://angular.dev/api/router/withDebugTracing

This example demonstrates how to enable debug tracing by passing `withDebugTracing()` to the `provideRouter` function during application bootstrapping.

```typescript
const appRoutes: Routes = [];
bootstrapApplication(AppComponent,
  {
    providers: [
      provideRouter(appRoutes, withDebugTracing())
    ]
  }
);
```

--------------------------------

### get (Blob Response)

Source: https://angular.dev/api/common/http/HttpClient

Constructs a `GET` request that interprets the body as a `Blob` and returns the response as a `Blob`.

```APIDOC
## Method: get(url: string, options?: { responseType: "blob", observe?: "body", ... })

### Description
Constructs a `GET` request that interprets the body as a `Blob` and returns the response as a `Blob`.

### Method Signature
`get(url: string, options?: { headers?: HttpHeaders | Record<string, string | string[]> | undefined; context?: HttpContext | undefined; observe?: "body" | undefined; params?: HttpParams | Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined; reportProgress?: boolean | undefined; responseType: "blob"; withCredentials?: boolean | undefined; credentials?: RequestCredentials | undefined; keepalive?: boolean | undefined; priority?: RequestPriority | undefined; cache?: RequestCache | undefined; mode?: RequestMode | undefined; redirect?: RequestRedirect | undefined; referrer?: string | undefined; integrity?: string | undefined; referrerPolicy?: ReferrerPolicy | undefined; transferCache?: boolean | { includeHeaders?: string[] | undefined; } | undefined; timeout?: number | undefined; })`

### Parameters
#### Method Parameters
- **url** (string) - Required - The endpoint URL.
- **options** (object) - Optional - The HTTP options to send with the request.
    - **headers** (HttpHeaders | Record<string, string | string[]>) - Optional - HTTP headers.
    - **context** (HttpContext) - Optional - HTTP context.
    - **observe** ("body") - Optional - Specifies that the response body should be observed. Default is "body".
    - **params** (HttpParams | Record<string, string | number | boolean | readonly (string | number | boolean)[]) - Optional - HTTP query parameters.
    - **reportProgress** (boolean) - Optional - Whether to report upload/download progress.
    - **responseType** ("blob") - Required - Specifies that the response body should be interpreted as a `Blob`.
    - **withCredentials** (boolean) - Optional - Whether to send credentials (cookies, HTTP authentication) with the request.
    - **credentials** (RequestCredentials) - Optional - Specifies the credentials policy for the request.
    - **keepalive** (boolean) - Optional - Whether to keep the connection alive.
    - **priority** (RequestPriority) - Optional - Specifies the priority of the request.
    - **cache** (RequestCache) - Optional - Specifies the cache policy for the request.
    - **mode** (RequestMode) - Optional - Specifies the mode of the request.
    - **redirect** (RequestRedirect) - Optional - Specifies the redirect policy for the request.
    - **referrer** (string) - Optional - Specifies the referrer for the request.
    - **integrity** (string) - Optional - Specifies the integrity metadata for the request.
    - **referrerPolicy** (ReferrerPolicy) - Optional - Specifies the referrer policy for the request.
    - **transferCache** (boolean | { includeHeaders?: string[] }) - Optional - Specifies whether to use the transfer cache.
    - **timeout** (number) - Optional - Specifies the request timeout in milliseconds.

### Returns
`Observable<Blob>`
```

--------------------------------

### NgZone Service Example Component

Source: https://angular.dev/api/core/NgZone

This example demonstrates how to use NgZone to run tasks both inside and outside of the Angular zone, controlling when change detection is triggered for performance optimization.

```typescript
import {Component, NgZone} from '@angular/core';

@Component({
  selector: 'ng-zone-demo',
  template: `
    <h2>Demo: NgZone</h2>

    <p>Progress: {{progress}}%</p>
    @if(progress >= 100) {
       <p>Done processing {{label}} of Angular zone!</p>
    }

    <button (click)="processWithinAngularZone()">Process within Angular zone</button>
    <button (click)="processOutsideOfAngularZone()">Process outside of Angular zone</button>
  `,
})
export class NgZoneDemo {
  progress: number = 0;
  label: string;

  constructor(private _ngZone: NgZone) {}

  // Loop inside the Angular zone
  // so the UI DOES refresh after each setTimeout cycle
  processWithinAngularZone() {
    this.label = 'inside';
    this.progress = 0;
    this._increaseProgress(() => console.log('Inside Done!'));
  }

  // Loop outside of the Angular zone
  // so the UI DOES NOT refresh after each setTimeout cycle
  processOutsideOfAngularZone() {
    this.label = 'outside';
    this.progress = 0;
    this._ngZone.runOutsideAngular(() => {
      this._increaseProgress(() => {
        // reenter the Angular zone and display done
        this._ngZone.run(() => { console.log('Outside Done!'); });
      });
    });
  }

  _increaseProgress(doneCallback: () => void) {
    this.progress += 1;
    console.log(`Current progress: ${this.progress}%`);

    if (this.progress < 100) {
      window.setTimeout(() => this._increaseProgress(doneCallback), 10);
    } else {
      doneCallback();
    }
  }
}
```

--------------------------------

### get (ArrayBuffer Response)

Source: https://angular.dev/api/common/http/HttpClient

Constructs a `GET` request that interprets the body as an `ArrayBuffer` and returns the response in an `ArrayBuffer`.

```APIDOC
## Method: get(url: string, options?: { responseType: "arraybuffer", observe?: "body", ... })

### Description
Constructs a `GET` request that interprets the body as an `ArrayBuffer` and returns the response in an `ArrayBuffer`.

### Method Signature
`get(url: string, options?: { headers?: HttpHeaders | Record<string, string | string[]> | undefined; context?: HttpContext | undefined; observe?: "body" | undefined; params?: HttpParams | Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined; reportProgress?: boolean | undefined; responseType: "arraybuffer"; withCredentials?: boolean | undefined; credentials?: RequestCredentials | undefined; keepalive?: boolean | undefined; priority?: RequestPriority | undefined; cache?: RequestCache | undefined; mode?: RequestMode | undefined; redirect?: RequestRedirect | undefined; referrer?: string | undefined; integrity?: string | undefined; referrerPolicy?: ReferrerPolicy | undefined; transferCache?: boolean | { includeHeaders?: string[] | undefined; } | undefined; timeout?: number | undefined; })`

### Parameters
#### Method Parameters
- **url** (string) - Required - The endpoint URL.
- **options** (object) - Optional - The HTTP options to send with the request.
    - **headers** (HttpHeaders | Record<string, string | string[]>) - Optional - HTTP headers.
    - **context** (HttpContext) - Optional - HTTP context.
    - **observe** ("body") - Optional - Specifies that the response body should be observed. Default is "body".
    - **params** (HttpParams | Record<string, string | number | boolean | readonly (string | number | boolean)[]) - Optional - HTTP query parameters.
    - **reportProgress** (boolean) - Optional - Whether to report upload/download progress.
    - **responseType** ("arraybuffer") - Required - Specifies that the response body should be interpreted as an `ArrayBuffer`.
    - **withCredentials** (boolean) - Optional - Whether to send credentials (cookies, HTTP authentication) with the request.
    - **credentials** (RequestCredentials) - Optional - Specifies the credentials policy for the request.
    - **keepalive** (boolean) - Optional - Whether to keep the connection alive.
    - **priority** (RequestPriority) - Optional - Specifies the priority of the request.
    - **cache** (RequestCache) - Optional - Specifies the cache policy for the request.
    - **mode** (RequestMode) - Optional - Specifies the mode of the request.
    - **redirect** (RequestRedirect) - Optional - Specifies the redirect policy for the request.
    - **referrer** (string) - Optional - Specifies the referrer for the request.
    - **integrity** (string) - Optional - Specifies the integrity metadata for the request.
    - **referrerPolicy** (ReferrerPolicy) - Optional - Specifies the referrer policy for the request.
    - **transferCache** (boolean | { includeHeaders?: string[] }) - Optional - Specifies whether to use the transfer cache.
    - **timeout** (number) - Optional - Specifies the request timeout in milliseconds.

### Returns
`Observable<ArrayBuffer>`
```

--------------------------------

### Incorrectly Using isStable with Recurrent Tasks (RxJS)

Source: https://angular.dev/api/core/ApplicationRef

This example shows how `isStable` will never emit `true` if a recurrent asynchronous task (like `interval`) is started immediately, preventing the 'App is stable now' log.

```typescript
constructor(appRef: ApplicationRef) {
  appRef.isStable.pipe(
     filter(stable => stable)
  ).subscribe(() => console.log('App is stable now');
  interval(1000).subscribe(counter => console.log(counter));
}
```

--------------------------------

### GET {url} (ArrayBuffer Response)

Source: https://angular.dev/api/common/http/HttpClient

Constructs a `GET` request that interprets the body as an `ArrayBuffer` and returns the full `HttpResponse`.

```APIDOC
## GET {url}

### Description
Constructs a `GET` request that interprets the body as an `ArrayBuffer` and returns the full `HttpResponse`.

### Method
GET

### Endpoint
{url}

### Parameters
#### Path Parameters
- **url** (string) - Required - The endpoint URL.

#### Query Parameters
- **params** (HttpParams | Record<string, string | number | boolean | readonly (string | number | boolean)[]>) - Optional - HTTP query parameters.

### Response
#### Success Response (200)
- **Observable<HttpResponse<ArrayBuffer>>** (Observable) - An observable that emits the full HTTP response with the body interpreted as an `ArrayBuffer`.
```

--------------------------------

### Configure TestBed and Inject Services for Welcome Component (Angular)

Source: https://angular.dev/guide/testing/components-scenarios

This `beforeEach` block sets up the testing environment for the `Welcome` component, injecting the `UserAuthentication` service and querying the DOM for the welcome message element.

```typescript
let fixture: ComponentFixture<Welcome>;
let comp: Welcome;
let userAuth: UserAuthentication; // the TestBed injected service
let el: HTMLElement; // the DOM element with the welcome message

beforeEach(() => {
  fixture = TestBed.createComponent(Welcome);
  comp = fixture.componentInstance;

  // UserAuthentication from the root injector
  userAuth = TestBed.inject(UserAuthentication);

  //  get the "welcome" element by CSS selector (e.g., by class name)
  el = fixture.nativeElement.querySelector('.welcome');
});
```

--------------------------------

### Schematic Output: Service Creation

Source: https://angular.dev/tools/cli/schematics-for-libraries

Example console output showing a service file created by the executed schematic.

```bash
CREATE src/app/my-data.service.ts (208 bytes)
```

--------------------------------

### Implementing DoBootstrap for Manual Bootstrapping

Source: https://angular.dev/api/core/DoBootstrap

Illustrates how to implement the `DoBootstrap` interface in an `AppModule` to manually bootstrap an `AppComponent` using `ApplicationRef.bootstrap()`.

```typescript
class AppModule implements DoBootstrap {
  ngDoBootstrap(appRef: ApplicationRef) {
    appRef.bootstrap(AppComponent); // Or some other component
  }
}
```

--------------------------------

### provideNoopAnimations()

Source: https://angular.dev/api/platform-browser/animations/provideNoopAnimations

Returns the set of dependency-injection providers to disable animations in an application. See animations guide to learn more about animations in Angular. This function is useful when you want to bootstrap an application using the `bootstrapApplication` function, but you need to disable animations (for example, when running tests). It is deprecated since v20.2; use `animate.enter` or `animate.leave` instead.

```APIDOC
## provideNoopAnimations()

### Description
Returns the set of dependency-injection providers to disable animations in an application. This function is useful when you want to bootstrap an application using the `bootstrapApplication` function, but you need to disable animations (for example, when running tests).

### Signature
```typescript
function provideNoopAnimations(): Provider[];
```

### Parameters
This function takes no parameters.

### Returns
- `Provider[]` - An array of dependency-injection providers to disable animations.

### Deprecation
Deprecated since v20.2. Use `animate.enter` or `animate.leave` instead. Intent to remove in v23.

### Usage Example
```typescript
bootstrapApplication(RootComponent, {
  providers: [
    provideNoopAnimations()
  ]
});
```
```

--------------------------------

### Install Karma and Jasmine Packages (npm)

Source: https://angular.dev/guide/testing/karma

Install the necessary development dependencies for Karma and Jasmine in an existing Angular project using npm.

```bash
npm install --save-dev karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
```
