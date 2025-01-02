// NotificationFramework
// Copyright (c) 2024 Braid Technologies Ltd
/////////////////////////////////////////
/**
 * @module NotificationFramework
 * @description Provides a framework for managing notifications in the Boxer application.
 * 
 * This module includes the Interest class which handles:
 * - Creating and managing notification interests with unique IDs
 * - Supporting multiple constructor patterns for initialization
 * - Copying interest objects from JSON or constructed sources
 */


/// <summary>
/// Interest -  encapsulates what is being observed - a specific notificationId.
/// </summary>
export class Interest { 

   private _notificationId: string;
   private static noInterest : string  = "nullInterest";

   /**
    * Create a Interest object
    * @param notificationId_ - id of the notification 
    */
   constructor(notificationId_: string);

   /**
    * Create a Interest object
    * @param interest_ - object to copy from - should work for JSON format and for real constructed objects
    */
   public constructor(interest_: Interest);

   /**
    * Create an empty Interest object - required for particiation in serialisation framework
    */
   constructor ();

   constructor(...arr: any[]) { 
      if (arr.length === 0) { // Empty Constructor
         this._notificationId = Interest.noInterest;
         return;
      }
      else {
         if (this.isMyType(arr[0])) { // Copy Constructor
            this._notificationId = arr[0]._notificationId;
         }
         else { // Individual arguments
            this._notificationId = arr[0];
         }
      }
   }

   private isMyType(rhs_: Interest): boolean {
      return rhs_.hasOwnProperty('_notificationId');
   }

   /**
   * set of 'getters' for private variables
   */
   get notificationId(): string  {
      return this._notificationId;
   }

   /**
    * test for equality - checks all fields are the same. 
    * NB must use field values, not identity bcs if objects are streamed to/from JSON, identities will be different. 
    * @param rhs_ - the object to compare this one to.  
    */
   equals(rhs_: Interest): boolean {
      
      return (this._notificationId === rhs_._notificationId);
   }

   /**
    * assignment operator 
    * @param rhs_ - the object to assign this one from.  
    */
   assign(rhs_: Interest): Interest {
      this._notificationId = rhs_._notificationId;

      return this;
   }

   public static createNullInterest () : Interest {
      return new Interest (Interest.noInterest);

   }
}

/// <summary>
/// Notification -  base class for all events. Base carries references to the notifcationId. derived classes add a data package via template class below.
/// Value class - just holds reference to the data, is expected to exist only for the synchronous life of the notification.
/// </summary>
export class Notification {

   private _interest: Interest;

   /**
    * Create a Notification object
    * @param interest_ - the Interest to identify the notification 
    */
   constructor(interest_: Interest);

   /**
    * Create a Notification object
    * @param notification_ - object to copy from - should work for JSON format and for real constructed objects
    */
   public constructor(notification_: Notification);

   /**
    * Create an empty Interest object - required for particiation in serialisation framework
    */
   constructor();

   constructor(...arr: any[]) {
      if (arr.length === 0) { // Empty Contrutructor
         this._interest = Interest.createNullInterest();
         return;
      }
      else {
         if (this.isMyType(arr[0])) { // Copy Contrutructor
            this._interest = new Interest (arr[0]._interest);
         }
         else { // Individual arguments
            this._interest = new Interest (arr[0]);
         }
      }
   }

   private isMyType(rhs_: Notification): boolean {
      return rhs_.hasOwnProperty('_interest');
   }

   /**
   * set of 'getters' for private variables
   */
   get interest (): Interest {
      return this._interest;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Shallow check.
    * @param rhs_ - the object to compare this one to.  
    */
   equals(rhs_: Notification): boolean {

      return (this.interest === rhs_.interest) ||
         (this._interest.equals(rhs_._interest));
   }

   /**
    * assignment operator 
    * @param rhs_ - the object to assign this one from.  
    */
   assign(rhs_: Notification): Notification {
      this._interest = rhs_._interest;

      return this;
   }

}

/// <summary>
/// NotificationFor -  template to specialse Notification by adding an NotificationData class. 
/// Value class - just holds reference to the data, is expected to exist only for the synchronous life of the notification. 
/// If you want data to last longer, add a reference type and the observer will have to save it. 
/// </summary>
export class NotificationFor<EventData> extends Notification
{
   private _eventData: EventData | undefined;


   /**
    * Create an empty NotificationFor<NotificationData>  object - required for particiation in serialisation framework
    */
   constructor();

   /**
    * Create a NotificationFor<NotificationData> object
    * @param notification_ - object to copy from - should work for JSON format and for real constructed objects
    */
   public constructor(notification_: NotificationFor<EventData>);

   /**
    * Create a Notification object
    * @param interest_ - id of the notification 
    * @param eventData_ - the data payload to send with it
    */
   constructor(interest_: Interest, eventData_: EventData) 

   constructor(...arr: any[]) {
      if (arr.length === 0) { // Construct empty
         super();
         this._eventData = undefined;
         return;
      }
      else 
      if (arr.length === 1) { // Copy constructor
         super (arr[0])
         this._eventData = arr[0]._eventData;
      }
      else { // Individual arguments
         super (arr[0])
         this._eventData = arr[1];
      }
   }

   /**
   * set of 'getters' for private variables
   */
   get eventData(): EventData | undefined {
      return this._eventData;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Is a shallow compare if the payload is an object
    * @param rhs_ - the object to compare this one to.  
    */
   equals(rhs_: NotificationFor<EventData>): boolean {

      return (super.equals(rhs_) &&
         (this._eventData === rhs_._eventData));
   }

   /**
    * assignment operator 
    * @param rhs_ - the object to assign this one from.  
    */
   assign(rhs_: NotificationFor<EventData>): NotificationFor<EventData> {
      super.assign(rhs_);
      this._eventData = rhs_._eventData;

      return this;
   }
}

/// <summary>
/// ObserverInterest -  an IObserver plus an Interest . Used by Notifieres to hold a list of things that observers are interested in so it can notify them. 
/// </summary>
export class ObserverInterest {

   private _observer: IObserver | undefined;
   private _interest: Interest;

   /**
    * Create a Interest object
    * @param observer_ - reference to the observer 
    * @param interest_ - the thing it is interested in 
    */
   constructor(observer_: IObserver, interest_: Interest);

   /**
    * Create a ObserverInterest object
    * @param observerInterest_ - object to copy from - should work for JSON format and for real constructed objects
    */
   public constructor(observerInterest_ : ObserverInterest);

   /**
    * Create an empty Interest object - required for particiation in serialisation framework
    */
   constructor();

   constructor(...arr: any[]) {
      if (arr.length === 0) { // Empty constructor
         this._observer = undefined;
         this._interest = Interest.createNullInterest();
         return;
      }
      if (arr.length === 1) { // Copy constructor
         this._observer = arr[0]._observer;
         this._interest = new Interest (arr[0]._interest);
      }
      else { // Indivual arguments
         this._observer = arr[0];
         this._interest = new Interest (arr[1]);
      }
   }

   /**
   * set of 'getters' for private variables
   */
   get observer(): IObserver | undefined {
      return this._observer;
   }
   get interest(): Interest {
      return this._interest;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Shallow compare
    * @param rhs_ - the object to compare this one to.  
    */
   equals(rhs_: ObserverInterest): boolean {

      return ((this._observer === rhs_._observer) && 
         ( (this.interest === rhs_.interest) ||
           (rhs_.interest !== undefined) && (this._interest.equals(rhs_._interest))));
   }

   /**
    * assignment operator 
    * @param rhs_ - the object to assign this one from.  
    */
   assign(rhs_: ObserverInterest): ObserverInterest {
      this._observer = rhs_._observer;
      this._interest = new Interest(rhs_._interest);

      return this;
   }

}

/// <summary>
/// NotificationRouter -  template to act as an intermediary, type-safe router that connects a specific function signature for the method that is called in a notification
/// </summary>
/// 
export type FunctionForNotification = (interest: Interest, data: Notification) => void;

export class NotificationRouter implements IObserver {
   private _function: FunctionForNotification | undefined;

   /**
    * Create empty NotificationRouterFor object
    */
   constructor();

   /**
    * Create a NotificationRouter object
    * @param function_ - function to call on notification 
    */
   constructor(function_: FunctionForNotification);

   /**
    * Create a NotificationRouter  object
    * @param notificationRouter_ - object to copy from - should work for JSON format and for real constructed objects
    */
   public constructor(notificationRouter_: NotificationRouter);

   constructor(...arr: any[]) {
      if (arr.length === 0) { // Construct empty
         this._function = undefined;
         return;
      }
      else {
         if (this.isMyType(arr[0])) { // Copy constructor
            this._function = arr[0]._function;
         }
         else { // Individual arguments
            this._function = arr[0];
         }
      }
   }

   private isMyType(rhs_: FunctionForNotification): boolean {
      return rhs_.hasOwnProperty('_function');
   }

   /**
   * set of 'getters' for private variables
   */
   get function(): FunctionForNotification | undefined {
      return this._function;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Shallow compare
    * @param rhs_ - the object to compare this one to.  
    */
   equals(rhs_: NotificationRouter): boolean {

      return (this._function === rhs_._function);
   }

   /**
    * assignment operator 
    * @param rhs_ - the object to assign this one from.  
    */
   assign(rhs_: NotificationRouter): NotificationRouter {
      this._function = rhs_._function;

      return this;
   }

   notify(interest_: Interest, notification_: Notification): void {

      // pass on to the required method
      if (this._function)
         this._function(interest_, notification_);
   }
}


/// <summary>
/// NotificationRouterFor -  template to act as an intermediary, type-safe router that connects a specific function signature for the method that is called in a notification
/// </summary>
/// 
type FunctionFor<NotificationData> = (interest: Interest, data: NotificationFor<NotificationData>) => void;

export class NotificationRouterFor<NotificationData> implements IObserver
{
   private _function: FunctionFor<NotificationData> | undefined;

   /**
    * Create empty NotificationRouterFor object
    */
   constructor();

   /**
    * Create a NotificationRouterFor object
    * @param function_ - function to call on notification 
    */
   constructor(function_: FunctionFor<NotificationData>);

   /**
    * Create a NotificationRouterFor<NotificationData>  object
    * @param observerRouter - object to copy from - should work for JSON format and for real constructed objects
    */
   public constructor(observerRouter: NotificationRouterFor<NotificationData>);

   constructor(...arr: any[]) {
      if (arr.length === 0) { // Construct empty
         this._function = undefined;
         return;
      }
      else {
         if (this.isMyType (arr[0])) { // Copy constructor
            this._function = arr[0]._function;
         }
         else { // Individual arguments
            this._function = arr[0];
         }
      }
   }

   private isMyType(rhs_: FunctionFor<NotificationData>): boolean {
      return rhs_.hasOwnProperty('_function');
   }

   /**
   * set of 'getters' for private variables
   */
   get function(): FunctionFor<NotificationData> | undefined {
      return this._function;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Shallow compare
    * @param rhs_ - the object to compare this one to.  
    */
   equals(rhs_: NotificationRouterFor<NotificationData>): boolean {

      return (this._function === rhs_._function);
   }

   /**
    * assignment operator 
    * @param rhs_ - the object to assign this one from.  
    */
   assign(rhs_: NotificationRouterFor<NotificationData>): NotificationRouterFor<NotificationData> {
      this._function = rhs_._function;

      return this;
   }

   notify(interest_: Interest, notification_: NotificationFor<NotificationData>): void {

      // pass on to the required method
      if (this._function)
         this._function(interest_, notification_);
   }
}

export interface IObserver {
   notify(interest_: Interest, notification_: Notification): void;
}

export interface INotifier {
   addObserver(observerInterest_: ObserverInterest): void;
   removeObserver(observerInterest_: ObserverInterest): boolean;
   removeAllObservers(): void;
}

/// <summary>
/// Notifier -  class that sends notifications when things change
/// </summary>
export class Notifier implements INotifier {

   private _observerInterests : Array<ObserverInterest>;

   /**
    * Create an empty Notifier object - required for particiation in serialisation framework
    */
   constructor() {
      this._observerInterests = new Array<ObserverInterest>();
   }

   // Operations
   notifyObservers(interest_: Interest, notificationData_: Notification): void {

      //log.debug(tag.notification, "Notification:" + interest_.notificationId + ": " + JSON.stringify (notificationData_));

      for (var i = 0; i < this._observerInterests.length; i++) {

         let interest = this._observerInterests[i].interest;
         let observer = this._observerInterests[i].observer;

         if (interest) {
            if (interest.equals (interest_)) {
               if (observer)
                  observer.notify(interest, notificationData_);
            }
         }
       }
    }

   // Add the supplied observer to the list of observers associated with
   // the supplied interest. 
   addObserver(observerInterest_: ObserverInterest): void {

      const index = this._observerInterests.indexOf(observerInterest_);
      if (index === -1) {
         this._observerInterests.push(observerInterest_);
      }
   }

   // Remove the supplied observer from the list of observers associated
   // with the supplied interest.
   // returns TRUE if it was correctly found
   removeObserver(observerInterest_: ObserverInterest): boolean {

      const index = this._observerInterests.indexOf(observerInterest_);
      if (index > -1) {
         this._observerInterests.splice(index, 1);
         return true;
      }
      return false;
   }

   removeAllObservers(): void {
      this._observerInterests.length = 0
   }

};  //Notifier


