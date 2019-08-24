# Getting started
 
**W**eb **A**pp **A**pi **S**ervice (WAAS) - lightweight JS/Angular 6+ library that organizes your APIs.

## Usage

Install WAAS library by running

```npm i -S @ciklum-digital/waas```

Then add `WaasModule` to imports of your module and register services

For the main application:
```typescript 
import { NgModule } from '@angular/core';
import { HttpTransportAdapterService, IWaasConfiguration, WaasModule } from '@ciklum/ng-waas';

const waasConfig: IWaasConfiguration = {
  basePath: 'https://reqres.in/api'
};

@NgModule({
  imports: [
     WaasModule.forRoot( waasConfig, [HttpClient], HttpTransportAdapterService]),
  ]
})
export class MyModule {
}
``` 

For the module of application:
```typescript 
import { NgModule } from '@angular/core';
import { IServiceRegistration, WaasModule } from '@ciklum/ng-waas';

export const searchServices: IServiceRegistration[] = [
  {
    path: '/test',
    alias: 'search'
  }
];

@NgModule({
  imports: [WaasModule.forFeature(searchServices)]
})
export class MyModule { }
``` 


## API

### Api Service
`WaasService` class allows you to move the most of your payload outside your main code and care only
about business logic.

```
...
constructor(private readonly waas: NgWaasService) {
  this.userService = waas.service('users');
}
...
```
or

````
@Waas('test') testService: IWaasChildService;
````

#### Http Adapter
Adapter tells Api Service how to work with some API.
Adapter should implement `ITransportAdapter` interface.
The default adapter provided by class ``HttpTransportAdapterService``, which uses native angular ``HttpClient`` under the hood.

#### Mock Plugin
`NgWaasMockService` add a possibility to returns a mocked response if it was provided or makes http request if wasn't.

```
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    WaasModule.forRoot( waasConfig, [HttpClient], HttpTransportAdapterService, [NgWaasMockService]),
    WaasMockModule.forRoot([MockItem])
  ],
  providers: [],
  bootstrap: [AppComponent]
})

....
const ITEMS_MOCK = [
  {title: 'Item 1', description: 'item 1 description'},
  {title: 'Item 2', description: 'item 2 description'},
];

@mockApiClass
export class MockItem {
  @mockApiData({path: '/test', method: 'get'})
  getData(data: IMockRequest): any {
    return ITEMS_MOCK;
  }
}

```

* `@mockApiClass` - mark current class as mock class
* `@mockApiData({path: ..., method: ...})` - use this method as mock data for defined path and method

#### Api Service configuration
```
export interface IWaasConfiguration {
  basePath: string; // Base path
  hooks?: IWaasHooks; //Hooks for service
} 
```


### Hooks

#### Hooks types
```
export interface IWaasHooks {
  before?: ((config: IRequestConfigExecute) => IRequestConfigExecute)[]
    | ((data: IRequestConfigExecute) => IRequestConfigExecute); // Before request send
  after?: ((config: any) => any)[] | ((config: any) => any); //After recieved response
}
```

### Events

#### Event types
WAAS provides custom events:  
```typescript
export enum RequestEventEnum {
  request = 'request', // before send request
  success = 'success', // response status is 2xx
  error = 'error', // response status is 4xx
  failure = 'failure', // all other response status
  cancel = 'cancel' // request is canceled
}
```
