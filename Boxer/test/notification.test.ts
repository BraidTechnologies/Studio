'use strict';
// Copyright Braid technologies ltd, 2024
import { describe, it} from 'mocha';
import { expect } from 'expect';

import {
   Interest,
   Notification,
   NotificationFor,
   ObserverInterest,
   Notifier,
   IObserver,
   NotificationRouter,
   NotificationRouterFor,
   FunctionForNotification
} from '../core/NotificationFramework';
import { throwIfUndefined } from '../core/Asserts';

class MockObserver implements IObserver {

   public _lastNotification: Notification | undefined = undefined;

   constructor() {
      this._lastNotification = undefined;
   }

   notify(interest_: Interest, notification_: Notification): void {

      this._lastNotification = notification_;
   };

   notifyInt (interest_: Interest, notification_: NotificationFor<number>): void {

      this._lastNotification = notification_;
   };
};

describe("NotificationFramework", function () {
  
   it("Needs to create, test & assign Interest", function () {

      var notificationId1 : string = "Playing";
      var notificationId2: string = "Paused";

      var interest1: Interest = new Interest(notificationId1);
      var interest2: Interest = new Interest(notificationId2);
      var interest3: Interest = new Interest (interest1);
      var interest4: Interest = new Interest();

      expect(interest1.equals(interest1)).toEqual(true);
      expect(interest1.equals(interest2)).toEqual(false);
      expect(interest1.equals(interest3)).toEqual(true);
      expect(interest1.equals(interest4)).toEqual(false);
      expect(interest1.notificationId === notificationId1).toEqual(true);

      interest2.assign(interest1);
      expect(interest1.equals(interest2)).toEqual(true);
   });

   it("Needs to create, test & assign Notification", function () {

      var notificationId1: string = "Playing";
      var notificationId2: string = "Paused";

      var interest1: Interest = new Interest(notificationId1);
      var interest2: Interest = new Interest(notificationId2);

      var notification1: Notification = new Notification(interest1);
      var notification2: Notification = new Notification(interest2);
      var notification3: Notification = new Notification(notification1);
      var notification4: Notification = new Notification();

      expect(notification1.equals(notification1)).toEqual(true);
      expect(notification1.equals(notification2)).toEqual(false);
      expect(notification1.equals(notification3)).toEqual(true);
      expect(notification1.equals(notification4)).toEqual(false);
      expect(notification1.interest.equals(interest1)).toEqual(true);

      notification2.assign(notification1);
      expect(notification1.equals(notification2)).toEqual(true);
   });

   it("Need to create, test & assign Notification", function () {

      var notificationId1: string = "Playing";
      var notificationId2: string = "Paused";

      var interest1: Interest = new Interest(notificationId1);
      var interest2: Interest = new Interest(notificationId2);

      var notification1: Notification = new Notification(interest1);
      var notification2: Notification = new Notification(interest2);
      var notification3: Notification = new Notification(notification1);
      var notification4: Notification = new Notification();

      expect(notification1.equals(notification1)).toEqual(true);
      expect(notification1.equals(notification2)).toEqual(false);
      expect(notification1.equals(notification3)).toEqual(true);
      expect(notification1.equals(notification4)).toEqual(false);
      expect(notification1.interest.equals(interest1)).toEqual(true);

      notification2.assign(notification1);
      expect(notification1.equals(notification2)).toEqual(true);
   });

   it("Need to create, test & assign NotificationFor<EventData>", function () {

      var notificationId1: string = "Playing";
      var notificationId2: string = "Paused";

      var interest1: Interest = new Interest(notificationId1);
      var interest2: Interest = new Interest(notificationId2);

      var notification1: NotificationFor<number> = new NotificationFor<number>(interest1, 1);
      var notification2: NotificationFor<number> = new NotificationFor<number>(interest2, 2);
      var notification3: NotificationFor<number> = new NotificationFor<number>(notification1);
      var notification4: NotificationFor<number> = new NotificationFor<number>();

      expect(notification1.equals(notification1)).toEqual(true);
      expect(notification1.equals(notification2)).toEqual(false);
      expect(notification1.equals(notification3)).toEqual(true);
      expect(notification1.equals(notification4)).toEqual(false);
      expect(notification1.interest.equals(interest1)).toEqual(true);
      expect(notification1.eventData === 1).toEqual(true);

      notification2.assign(notification1);
      expect(notification1.equals(notification2)).toEqual(true);
   });

   it("Need to create, test & assign ObserverInterest", function () {

      var observer = new MockObserver();
      var notificationId1: string = "Playing";
      var notificationId2: string = "Paused";

      var interest1: Interest = new Interest(notificationId1);
      var interest2: Interest = new Interest(notificationId2);

      var observerInterest1: ObserverInterest = new ObserverInterest (observer, interest1);
      var observerInterest2: ObserverInterest = new ObserverInterest (observer, interest2);
      var observerInterest3: ObserverInterest = new ObserverInterest (observerInterest1);
      var observerInterest4: ObserverInterest = new ObserverInterest();

      expect(observerInterest1.equals(observerInterest1)).toEqual(true);
      expect(observerInterest1.equals(observerInterest2)).toEqual(false);
      expect(observerInterest1.equals(observerInterest3)).toEqual(true);
      expect(observerInterest1.equals(observerInterest4)).toEqual(false);
      expect(observerInterest1.interest.equals(interest1)).toEqual(true);
      expect(observerInterest1.observer === observer).toEqual(true);

      observerInterest4.assign(observerInterest1);
      expect(observerInterest1.equals(observerInterest4)).toEqual(true);
   });
   
   it("Need to create, test & assign NotificationRouter", function () {

      var observer = new MockObserver();
      var observer2 = new MockObserver();

      let observationRouter1 = new NotificationRouter(observer.notifyInt.bind(observer) as FunctionForNotification);
      var observationRouter2: NotificationRouter = new NotificationRouter(observer.notifyInt.bind(observer2) as FunctionForNotification);
      var observationRouter3: NotificationRouter = new NotificationRouter(observationRouter1);
      var observationRouter4: NotificationRouter = new NotificationRouter();

      expect(observationRouter1.equals(observationRouter1)).toEqual(true);
      expect(observationRouter1.equals(observationRouter2)).toEqual(false);
      expect(observationRouter1.equals(observationRouter3)).toEqual(true);
      expect(observationRouter1.function !== undefined).toEqual(true);
      expect(observationRouter4.function === undefined).toEqual(true);

      observationRouter2.assign(observationRouter1);
      expect(observationRouter1.equals(observationRouter2)).toEqual(true);
   });


   it("Need to create, test & assign NotificationRouterFor", function () {

      var observer = new MockObserver();
      var observer2 = new MockObserver();

      var observationRouter1: NotificationRouterFor<number> = new NotificationRouterFor<number>(observer.notifyInt.bind(observer));
      var observationRouter2: NotificationRouterFor<number> = new NotificationRouterFor<number>(observer.notifyInt.bind(observer2));
      var observationRouter3: NotificationRouterFor<number> = new NotificationRouterFor<number>(observationRouter1);
      var observationRouter4: NotificationRouterFor<number> = new NotificationRouterFor<number>();

      expect(observationRouter1.equals(observationRouter1)).toEqual(true);
      expect(observationRouter1.equals(observationRouter2)).toEqual(false);
      expect(observationRouter1.equals(observationRouter3)).toEqual(true);
      expect(observationRouter1.function !== undefined).toEqual(true);
      expect(observationRouter4.function === undefined).toEqual(true);

      observationRouter2.assign(observationRouter1);
      expect(observationRouter1.equals(observationRouter2)).toEqual(true);
   });

   it("Needs to flow notifications from Notifier to Observer", function () {

      var notifier = new Notifier();
      var observerYes = new MockObserver();
      var observerNo = new MockObserver();

      var notificationId1: string = "Playing";
      var notificationId2: string = "Paused";

      var interest1: Interest = new Interest(notificationId1);
      var interest2: Interest = new Interest(notificationId2);

      var observerInterest1: ObserverInterest = new ObserverInterest(observerYes, interest1);
      var observerInterest2: ObserverInterest = new ObserverInterest(observerNo, interest2);

      notifier.addObserver(observerInterest1);
      notifier.addObserver(observerInterest2);

      // Call sequence 1 - simple notification
      var notification: Notification = new Notification(interest1);

      notifier.notifyObservers(interest1, notification);

      throwIfUndefined (observerYes._lastNotification);

      expect(observerYes._lastNotification.equals(notification) === true).toEqual(true);
      expect((observerNo._lastNotification === undefined) === true).toEqual(true);

      // Call sequence 2 - notification with Notification payload
      var notificationForInt: NotificationFor<number> = new NotificationFor<number>(interest1, 1);

      notifier.notifyObservers(interest1, notificationForInt);

      throwIfUndefined (observerYes._lastNotification);

      expect(observerYes._lastNotification.equals(notificationForInt) === true).toEqual(true);
      expect((observerNo._lastNotification === undefined) === true).toEqual(true);

      // Tidy
      expect(notifier.removeObserver(observerInterest2) === true).toEqual(true);
      expect(notifier.removeObserver(observerInterest2) === false).toEqual(true);
      notifier.removeAllObservers();

      // Call sequence 3 - routed 
      var observationRouter3: NotificationRouter = new NotificationRouter (observerYes.notify.bind(observerYes));

      var observerInterest3: ObserverInterest = new ObserverInterest(observationRouter3, interest1);
      notifier.addObserver(observerInterest3);

      var notification3: Notification = new Notification(interest1);
      notifier.notifyObservers(interest1, notification3);
      
      throwIfUndefined (observerYes._lastNotification);

      expect(observerYes._lastNotification.equals(notification3) === true).toEqual(true);
      expect((observerNo._lastNotification === undefined) === true).toEqual(true);

      expect(notifier.removeObserver(observerInterest3) === true).toEqual(true);
      notifier.removeAllObservers();

      // Call sequence 4 - routed & with a payload
      var observationRouter4: NotificationRouterFor<number> = new NotificationRouterFor<number>(observerYes.notifyInt.bind(observerYes));

      var observerInterest4: ObserverInterest = new ObserverInterest(observationRouter4, interest1);
      notifier.addObserver(observerInterest4);

      var notification4: NotificationFor<number> = new NotificationFor<number>(interest1, 2);
      notifier.notifyObservers(interest1, notification4);
      
      throwIfUndefined (observerYes._lastNotification);

      expect(observerYes._lastNotification.equals(notification4) === true).toEqual(true);
      expect((observerNo._lastNotification === undefined) === true).toEqual(true);
      notifier.removeAllObservers();
   });
});
   
