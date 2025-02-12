/////////////////////////////////////////
// StreamingFramework
// Copyright (c) 2024, 2025 Braid Technologies Ltd
/////////////////////////////////////////

/**
 * @module StreamingFramework
 * @description Provides a framework for streaming data to and from JSON in the Boxer application.
 * 
 * This module includes the MStreamable and MDynamicStreamable classes which handle:
 * - Creating and managing streaming objects with dynamic class names
 * - Streaming data to and from JSON
 * - Managing dynamic streamable objects based on class names stored in the stream
 */

/// <summary>
/// MStreamable - root class for all derived types that can stream to and from JSON 
/// </summary>
export abstract class MStreamable {

   constructor() {
   }

   abstract streamOut(): string;
   abstract streamIn(stream: string): void;
}

/// <summary>
/// MDynamicStreamable - root class for all derived types that can stream to and from JSON with dynamic creation based on className stored in the stream
/// </summary>
export abstract class MDynamicStreamable extends MStreamable {

   constructor() {
      super();
   }

   abstract dynamicClassName(): string;

   flatten (): string {

      return JSON.stringify({ className: this.dynamicClassName(), data: this.streamOut() });
   }

   static resurrect(stream: string): MDynamicStreamable | undefined {

      const parsed = JSON.parse(stream);

      let obj = DynamicStreamableFactory.create(parsed.className);

      if (obj)
         obj.streamIn(parsed.data);

      return obj;
   }
}

// Signature for the factory function 
type FactoryFunctionFor<MDynamicStreamable> = () => MDynamicStreamable;

var firstDynamicStreamableFactory: DynamicStreamableFactory | undefined = undefined;

export class DynamicStreamableFactory {

   _className: string;
   _factoryMethod: FactoryFunctionFor<MDynamicStreamable>;
   _nextFactory: DynamicStreamableFactory | undefined;

   constructor(className_: string, factoryMethod_: FactoryFunctionFor<MDynamicStreamable>) {
      this._className = className_;
      this._factoryMethod = factoryMethod_;
      this._nextFactory = undefined;

      if (firstDynamicStreamableFactory === undefined) {
         firstDynamicStreamableFactory = this;
      } else {
         var nextFactory: DynamicStreamableFactory = firstDynamicStreamableFactory;

         while (nextFactory._nextFactory) {
            nextFactory = nextFactory._nextFactory;
         }
         nextFactory._nextFactory = this;
      }
   }

   static create(className: string): MDynamicStreamable | undefined {
      var nextFactory: DynamicStreamableFactory | undefined = firstDynamicStreamableFactory;

      while (nextFactory) {
         if (nextFactory._className === className) {
            return nextFactory._factoryMethod();
         }
         nextFactory = nextFactory._nextFactory;
      }
      return undefined;
   }
}
