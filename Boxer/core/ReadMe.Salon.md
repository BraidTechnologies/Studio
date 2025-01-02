**ActivityRecord.ts**

The `ActivityRecord` module defines interfaces and utilities for storing user activity records within the Braid system.

Key interfaces include:
- `IStoredActivity`: A base interface for all activity records, extending `IStorable`.
- `IStoredUrlActivity`: An extension of `IStoredActivity`, adding a `url` property for URL-based activities.
- `IStoredLikeUrlActivity`: An extension of `IStoredUrlActivity`, adding a `like` property to indicate if the URL was liked.
- `IStoredMessageActivity`: Extends `IStoredActivity` with a `message` property.

Each activity record class includes constants for the class name and schema version. 

The module also provides the utility function `makeDateUTC` for ensuring dates are stored in UTC format.

**ActivityRepository.ts**

This module, named `ActivityRepository`, handles the storage and retrieval of user activities, specifically for URLs visited, likes/unlikes, and messages in Braid.

The `ActivityRepositoryCosmos` class implements the `IActivityRepository` interface and mainly interacts with Cosmos DB for data persistence. 

Key functions include saving activities (`save`), loading recent URL-based activities (`loadRecentUrlActivity`), loading recent messages (`loadRecentMessages`), and removing message records (`removeMessageRecord`).

The class requires a session key for authentication and uses environment configuration for determining API endpoints. The `ActivityRepositoryApi` handles API requests.

Important modules and functions include: `ActivityRepositoryCosmos`, `save`, `loadRecentUrlActivity`, `loadRecentMessages`, `loadRecent`, and `removeMessageRecord`.

**AIConnection.ts**

### Summary:

The `AIConnection` module manages communication between the Boxer application and AI/LLM (Large Language Model) services.

The key class, `AIConnection`, handles making enriched queries to LLM models, streaming responses back to the UI, managing conversation history, and tracking the active call state. 

The constructor of `AIConnection` initiates the connection using a session key for authentication and API endpoints based on the environment configuration. 

Two primary functions, `makeEnrichedCall` and `makeFollowUpCall`, manage enriched query calls and generate follow-up questions respectively. 

Private methods like `streamResponse` handle asynchronously updating responses. Static methods include `buildEnrichmentQuery`, `buildQueryForQuestionPrompt`, and helpful utilities for managing tokens and identifying AI-related messages.

**ApiCalls.ts**

The module `ApiCalls` provides functions for making API calls to the Braid backend, focusing on summarization requests to the Summarise API.

The main function, `makeSummaryCall`, takes a session key and a text string as inputs, builds a summarization request, and sends it to the Summarise API using the `axios` library. It then returns the API's response in the form of a summary or handles errors by logging them.

Important classes and functions in this module include `SessionKey` for handling session keys, `logApiError` for error logging, `getDefaultEnvironment` for obtaining the environment configuration, and various type imports like `ISummariseRequest` and `ISummariseResponse` to structure the API request and response.

**Asserts.ts**

The module **Asserts** provides utility functions to ensure objects are neither undefined nor null. This helps maintain type safety and prevents runtime errors.

The module imports **AssertionFailedError** from a file named `Errors`.

It defines two main functions:
1. **throwIfUndefined**: Takes an object `x` and throws an **AssertionFailedError** if `x` is undefined.
2. **throwIfNull**: Takes an object `x` and throws an **AssertionFailedError** if `x` is null. 

These functions are generics that enforce a non-null and non-undefined type for the passed objects.

**BoxerFluidConnection.ts**

The `BraidFluidConnection` class in the `BoxerFluidConnection` module is derived from `FluidConnection` and manages the Fluid connection for the Boxer application. Key functionalities include setting up local caucuses for participants, messages, and shared embeddings using `SharedMap`. It can also handle adding the Boxer persona to the participants' caucus.

The `setupLocalCaucuses` method initializes the schema-defined caucuses and starts an interval to ensure the local user is added to the participant caucus. 

The `resetMessages` method clears all messages and participants from their respective caucuses. 

It uses helper functions like `throwIfUndefined` for error handling and `checkAddAddSelfToAudience` to manage user participation in discussions.

**CaucusFramework.ts**

This module, `CaucusFramework`, provides a framework for managing caucuses within the Boxer application. The primary class `CaucusOf` extends the `Notifier` class from the `NotificationFramework` module, facilitating notification mechanisms for events. 

Key features include static interests for notifications when elements are added, changed, or removed. These are identified by IDs such as `caucusMemberAddedNotificationId`, `caucusMemberChangedNotificationId`, and `caucusMemberRemovedNotificationId`.

The `CaucusOf` class manages a shared map (`SharedMap`) and local data structures to add, remove, update, or synchronize elements efficiently. Important methods include `add`, `remove`, `amend`, `get`, `current`, `currentAsArray`, and `synchFrom`. The class also handles cache updates and includes a `binarySearch` method for efficient element searching.

**ConfigStrings.ts**

This module, `ConfigStrings`, provides constants and enumerations for configuration strings and values used in the Boxer application.

The `EConfigStrings` enumeration includes constants for logging categories (`kCoreLogCategory`, `kApiLogCategory`), font names (`kFontNameForTextWrapCalculation`), URLs (`kHomeRelativeUrl`, `kAzureProductionFluidHost`), authentication and session parameters (`kSessionParamName`, `kSecretParamName`), and strings for interacting with AI models (`kLLMName`, `kPromptLookFor1` to `kPromptReplaceWith6`).

The `EConfigNumbers` enumeration contains numerical configuration values such as delays, counts, lengths, and other thresholds (`kInitialHelpfulPromptDelayMsecs`, `kMaximumLinkTextlength`, `kMaxChatLevel`).

The `KStubEnvironmentVariables` object provides default session and conversation keys for local development, avoiding the use of production secrets.

**Debounce.ts**

The Debounce module provides a utility function for debouncing function calls, ensuring that a given function is not called more frequently than a specified delay period.

The main function exported is `debounce(fn_: Function, ms_: number)`, which takes two parameters: `fn_` (the function to debounce) and `ms_` (the delay in milliseconds).

The `debounce` function returns a new function that uses `setTimeout` to call the original function after the specified delay. If the debounced function is called again before the delay period ends, the previous timer is cleared using `clearTimeout`.

The `throwIfNull` function from the Asserts module ensures that the timer is not null before clearing it.

**Errors.ts**

This module, developed by Braid Technologies Ltd, is designed to define custom error classes specifically for the Boxer application. 

The classes included are `InvalidParameterError`, `InvalidOperationError`, `InvalidStateError`, `ConnectionError`, `EnvironmentError`, and `AssertionFailedError`. Each class extends the built-in `Error` class and includes a constructor that logs the error using either `logCoreError` or `logApiError` functions.

To ensure stack traces display correctly, each constructor sets the prototype chain using `Object.setPrototypeOf(this, new.target.prototype)` and assigns the appropriate name to the error instance for accurate error handling.

**FluidConnection.ts**

The `FluidConnection` module provides a base class for managing connections to Fluid containers in the Boxer application. It handles creating and attaching to Fluid containers, disconnecting from them, managing local caucuses for participants and messages, and tracking the active call state. The connection requires a session key for authentication and uses environment configuration to determine API endpoints.

### Important Classes and Functions:
- **FluidConnection Class**: Manages Fluid container connections.
- **createNew**: Creates a new Fluid container and attaches it to the service.
- **attachToExisting**: Attaches to an existing Fluid container using a conversation key.
- **canDisconnect** and **isConnected**: Check the connection state.
- **disconnect**: Disconnects from the Fluid container.
- **setupBeforeConnection** and **setupAfterConnection**: Internal setup functions for initializing the connection.
- **schema**, **setupLocalCaucuses**, and **disconnectLocalCaucuses**: Abstract methods to be implemented by subclasses.

**IActivityRepository.ts**

This module defines an interface `IActivityRepository` for managing stored activities.

The `save` function accepts an `IStoredActivity` record and returns a promise that resolves to a boolean, indicating whether the save operation was successful.

The `loadRecentUrlActivity` function takes a count and returns a promise that resolves to an array of `IStoredActivity` records, representing the most recent URL activities up to the specified count.

The `loadRecentMessages` function also takes a count and returns a promise that resolves to an array of `IStoredActivity` records, representing recent messages.

The `removeMessageRecord` function takes a `messageId` and returns a promise that resolves to a boolean, indicating whether the removal was successful.

Key interface:
- `IActivityRepository`

Key functions:
- `save`
- `loadRecentUrlActivity`
- `loadRecentMessages`
- `removeMessageRecord`

**IActivityRepositoryFactory.ts**

This module, `IActivityRepositoryFactory`, provides a factory function for creating activity repositories.

The key function, `getRecordRepository`, takes a `SessionKey` as an argument and returns an implementation of `IActivityRepository`.

Currently, the repository implementation being returned is `ActivityRepositoryCosmos`, which is a Cosmos DB-backed activity repository.

Key imports include `SessionKey` from `./Keys`, `IActivityRepository` from `./IActivityRepository`, and `ActivityRepositoryCosmos` from `./ActivityRepository`.

**IAdminRepository.ts**

This module defines an interface and a class for checking if a user is an admin.

**Classes/Functions:**
- **IAdminRepository:** An interface declaring an `isAdmin` method which takes a `Persona` object and returns a Promise of a boolean indicating admin status.
- **getDefaultAdminRepository:** A function that returns an instance of `DefaultAdminRepository`.
- **DefaultAdminRepository:** A class implementing the `IAdminRepository` interface. Its `isAdmin` method checks if a user's name, contained in `Persona`, is in a predefined list of admin names (`EConfigStrings.kAdminUserNames`), and resolves a Promise with a boolean result based on this check.

**Usage:**
- Ensure to import `Persona` and `EConfigStrings` modules which contain necessary user and configuration details.


**Icons.ts**

This module, named `Icons`, is responsible for defining an enumeration of icon names used in the Boxer application.

The `EIcon` enum lists several icons, such as `kPersonPersona`, `kLLMPersona`, `kBotPersona`, `kUnknownPersona`, and `kFromBcd`. These represent different personas or sources in the application.

Notably, `kBotPersona` is kept for backward compatibility.

This enum can be used throughout the application to standardize the references to these specific icon names, ensuring consistency and easier management of icon usage.

**IKeyGenerator.ts**

The provided code defines an interface called `IKeyGenerator` within a module meant for generating unique keys.

The `generateKey` function generates a unique key, and the `generateSecret` function generates a secret. 

The `couldBeAKey` method checks if a given string could potentially be a valid key.

The `saveSecret` function allows for saving a secret, and `matchesSavedSecret` checks if a given secret matches the saved one.

The `haveSavedSecret` method verifies the existence of a saved secret, while `savedSecret` retrieves said secret.

This interface establishes a contract that any implementing class must follow, ensuring consistency in key and secret management.

**IKeyGeneratorFactory.ts**

The `IKeyGeneratorFactory` module provides a factory function for creating key generators.

The main function in this module is `getDefaultKeyGenerator`, which returns an instance of the `UuidKeyGenerator` class.

This module depends on two other classes, `IKeyGenerator` and `UuidKeyGenerator`, imported from their respective modules.

The purpose of `getDefaultKeyGenerator` is to abstract the creation of key generator instances, making it easier to retrieve the default key generator in a standardized way.

**JoinDetails.ts**

The module `JoinDetails` manages join details in the Boxer application, including functionalities for parsing, validating, and converting join details. The `JoinDetails` class is the primary class, handling these operations.

The `JoinDetails` class includes a constructor that parses a string to extract email, session key, conversation key, and name information. It provides getter functions for these details.

Key functions in the module:
- `validateEmail(email: string): boolean` validates email format.
- `toString(): string` and `static toString(email: string, name: string, session: SessionKey, conversation: ConversationKey, secret: string): string` convert details to a query string format.
- `canAttemptJoin(): boolean` checks if the join details are valid based on environment and presence of session and conversation keys.
- `static makeFromParts(email: string, name: string, session: SessionKey, conversation: ConversationKey, secret: string)` creates a `JoinDetails` instance from individual parts. 

Supporting classes: `SessionKey`, `ConversationKey`.

Key imports: `qs` for query string parsing, `EConfigStrings`, `getDefaultFluidEnvironment`, `EEnvironment`.

**JoinPageValidator.ts**

The code defines a module named `JoinPageValidator` used in the Boxer application to validate join details for conversations.

The primary class provided is `JoinPageValidator`. The constructor simply initializes the object.

The `canAttemptJoin` function checks if the provided email, name, session, and conversation keys are valid for joining a conversation by utilizing the `JoinDetails` class.

The `matchesSavedSecret`, `haveSavedSecret`, and `savedSecret` functions interact with a key generator (obtained via `getDefaultKeyGenerator`) to manage and validate stored secrets for user authentication.

Key classes and functions include `JoinPageValidator`, `canAttemptJoin`, `matchesSavedSecret`, `haveSavedSecret`, and `savedSecret`.

**KeyRetriever.ts**

**KeyRetriever Class:**  
This class is responsible for retrieving keys from the Braid backend using API calls, tracking the state of active calls, and logging errors. It is the main class provided in this module.

**Important Functions:**
- **Constructor:** Initializes an instance of `KeyRetriever` and sets `activeCallCount` to 0.
- **requestKey:** An asynchronous function to send GET requests using Axios to retrieve keys from the API. It increments the `activeCallCount` at the start of the call and decrements it after finishing or encountering an error. Errors are logged using the `logApiError` function, and a `ConnectionError` is thrown if the API call fails.
- **isBusy:** A function that returns whether there are any active API calls by checking if `activeCallCount` is not zero.

**Error Handling:**
- **logApiError:** This function logs errors encountered during API calls.
- **ConnectionError:** This custom error is thrown when the API call to retrieve the key fails.

**External Imports:**
- **axios:** Used to make HTTP requests.
- **logApiError:** Function used to log API errors.
- **EConfigStrings:** Enum that holds configuration strings, including error messages.
- **ConnectionError:** Custom error for connection issues.
- **SessionKey:** Represents a session key used in the API call.



**Keys.ts**

The `Keys` module handles key management in the Boxer application. It includes the `SessionKey` and `ConversationKey` classes.

`SessionKey` class wraps a string representing a session ID. It validates the session key by checking if it looks like a valid UUID using the `looksValidSessionKey` method and converts it to a string using the `toString` method.

`ConversationKey` class wraps a string representing a conversation ID. It validates the conversation key's format using the `looksValidConversationKey` method and converts it to a string using the `toString` method.

Both classes leverage an `IKeyGenerator` obtained from `getDefaultKeyGenerator` for UUID validation.

**Like.ts**

The module manages "likes" in the Boxer application.

It includes the `Like` class which facilitates creating and managing "like" objects, each containing a name and timestamp. The class supports multiple construction patterns: initializing through no arguments, with a name and timestamp, or by copying from another `Like` object or JSON.

It includes methods for streaming data in (`streamIn`), streaming data out (`streamOut`), equality check (`equals`), and assignment (`assign`). 

There are also getter and setter methods for the private properties `_name` and `_when`.

Important classes and functions:
- `Like` class: manages like objects.
- `streamOut()`: serializes object data to JSON string.
- `streamIn()`: initializes object data from JSON string.
- `equals()`: compares two `Like` objects.
- `assign()`: assigns values from another `Like` object.

**Logging.ts**

This module provides a logging system for the Boxer application. It includes functions for logging various types of errors and information.

The important functions in this module are:
- `logCoreError`: Logs core errors.
- `logDbError`: Logs database errors.
- `logApiError`: Logs API errors.
- `logApiInfo`: Logs API information.

The logging handler, `logger`, maps different log levels to corresponding console methods (`console.error`, `console.warn`, and `console.log`).

The `log.init` function initializes the logging system with specific log levels (`DEBUG`) and a callback to map the logging levels to the handler methods.

**Media.ts**

This module defines a `Media` class for managing media queries in the Boxer application. 

The `Media` class maintains a list of listeners and uses the `window.matchMedia` function to create an `isMobileFormFactorQuery` that checks if the viewport width is 1023 pixels or less, indicating a mobile form factor.

The constructor sets up an event listener for changes in the mobile form factor and binds it to the `onMobileFormFactorChange` method.

The `isSmallFormFactor` method returns a boolean indicating if the viewport currently matches the mobile form factor query.

The `onMobileFormFactorChange` method invokes all stored listeners when the viewport transitions to or from the mobile form factor size.

The `addMobileFormFactorChangeListener` method allows external listeners to be registered and notified when the mobile form factor changes.

**Message.ts**

The `Message` class manages messages in the Boxer application. 

**Constructor:**
It supports multiple initialization patterns, including creating an empty message, cloning from another object, or initializing with specific parameters like `id`, `authorId`, `responseToId`, `text`, `sentAt`, and `chunks`.

**Methods:**
- Implements methods for serialization (`streamOut()`, `streamIn()`), dynamic class name retrieval (`dynamicClassName()`), token calculation (`calculateTokens()`), and live streaming updates (`hookLiveAppend()`, `unhookLiveAppend()`, `liveUpdateText()`, and `liveUpdateChunks()`).
- Includes equality check (`equals()`), assignment (`assign()`), and ID validation (`isValidId()`).
  
**Key Components:**
- Uses `GPT4Tokenizer` for tokenization.
- Incorporates utility functions from `Errors`, `Asserts`, and `Utilities`.
- Integrates `IKeyGenerator` for key generation.
  
**Important Properties:**
- `id`, `authorId`, `responseToId`, `text`, `sentAt`, `chunks`, `tokens`, and `isStreaming`. 

It follows the `MDynamicStreamable` interface from the `StreamingFramework` for dynamic streaming.

**NotificationFramework.ts**

The module `NotificationFramework` provides a framework for managing notifications.

The `Interest` class manages notification interests with unique IDs. It has multiple constructors for different initialization patterns, including copying from JSON or another `Interest` instance, and provides methods for equality checking and assignment.

The `Notification` class serves as a base for events, holding a reference to an `Interest`. It supports multiple constructors, equality checks, and assignment operations.

`NotificationFor` extends `Notification` by adding an notification data payload, supporting similar constructor patterns, equality checks, and assignments.

The `ObserverInterest` class combines an `IObserver` and an `Interest`, allowing `Notifier` classes to track observer interests.

The `NotificationRouter` and `NotificationRouterFor` classes link notifications to specific functions.

The `Notifier` class sends notifications to registered observers and manages the list of `ObserverInterest` objects, with methods to add, remove and notify observers.

Key Classes and Functions:
- `Interest`
- `Notification`
- `NotificationFor`
- `ObserverInterest`
- `NotificationRouter`
- `NotificationRouterFor`
- `IObserver` interface
- `INotifier` interface
- `Notifier`

**Persona.ts**

**Important Classes or Functions:**
- `Persona` class
- Constructor Overloads
- `equals` method
- `assign` method
- `dynamicClassName`, `createDynamicInstance`, `streamOut`, `streamIn` methods
- Static validity check methods: `isValidId`, `isValidName`, `isValidEmail`, `isValidThumbnailB64`
- Static helper methods: `unknown`, `safeAuthorLookup`, `isUnknown`

**Summary:**
The module manages personas in the Boxer application. The `Persona` class encapsulates attributes like name, icon, email, and last interaction timestamp. It offers multiple constructors to create instances from parameters, copied objects, or JSON.

It implements serialization methods to support dynamic streaming. Methods for equality check and assignment between `Persona` objects are also provided, facilitating object manipulation.

Static validity checks ensure attributes like id, name, email, and thumbnail are valid. There are additional static methods to handle 'unknown' personas and safely look up authors from a map.

**Queue.ts**

This module provides a `Queue` class that implements a generic queue data structure for the Boxer application, following the First-In-First-Out (FIFO) principle.

The `Queue` class manages the queue through an array and an offset for efficient memory management. 

Key methods in the `Queue` class include:
- `constructor()`: Initializes the queue and the offset.
- `getLength()`: Returns the current length of the queue.
- `isEmpty()`: Checks if the queue is empty.
- `enqueue(item)`: Adds an item to the end of the queue.
- `dequeue()`: Removes and returns the item at the front of the queue, managing the offset to maintain efficiency.
- `peek()`: Returns the item at the front of the queue without removing it.

**SharedEmbedding.ts**

The `SharedEmbedding` module manages shared embedding objects within the Boxer application.

The `SharedEmbedding` class is the primary class in the module. It handles creating and managing shared embeddings, which include properties like URL, conversation ID, and likes. The class supports multiple constructor patterns: one for initializing empty objects, another for initializing with specific parameters, and a third for copying from an existing object.

Important class methods include `like` and `unlike` to add and remove likes, `streamOut` and `streamIn` for serializing and deserializing objects, and `equals` and `assign` for comparing and assigning embedded objects. Additionally, `isValidId` checks if an ID is valid, and `findInMap` is a helper function to find a `SharedEmbedding` in a map by URL.

**StreamingFramework.ts**

The code module, `StreamingFramework`, manages streaming data to and from JSON within the `Boxer` application.

The `MStreamable` class is an abstract root class designed for objects that can stream data (serialize and deserialize) to and from JSON. It defines two abstract methods: `streamOut` for serializing data and `streamIn` for deserializing data.

The `MDynamicStreamable` class extends `MStreamable` and adds the ability to dynamically manage objects based on their class names stored in the JSON stream. It includes methods `dynamicClassName`, `flatten`, and a static method `resurrect`.

The `DynamicStreamableFactory` class provides a factory pattern for creating `MDynamicStreamable` objects based on class names. It registers and links creation methods for dynamic classes and provides the static method `create` to instantiate objects using the class name.

Important classes and functions:
- `MStreamable` (abstract class)
- `MDynamicStreamable` (abstract class)
- `DynamicStreamableFactory` (class)
- `resurrect` (static method in `MDynamicStreamable`)
- `create` (static method in `DynamicStreamableFactory`)

**Utilities.ts**

The module "Utilities" provides comparison functions for the Boxer application. 

The `areSameDate` function compares two Date objects, including handling cases where either or both dates are undefined, using the `throwIfUndefined` function for validation.

The `areSameShallowArray` function compares two arrays for shallow equality, meaning it checks if the arrays are the same length and each element is equal using the `===` operator.

The `areSameDeepArray` function compares arrays for deep equality, checking if the arrays are the same length and all corresponding elements are equal by converting each element to a JSON string and comparing these strings.

**UuidKeyGenerator.ts**

The `UuidKeyGenerator` module provides functionalities for generating and managing UUIDs and secrets within the Boxer application. 

The main class, `UuidKeyGenerator`, implements the `IKeyGenerator` interface and includes methods to generate UUIDs (`generateKey`), generate secrets (`generateSecret`), check if a string looks like a valid UUID (`couldBeAKey`), save secrets (`saveSecret`), check if a given secret matches the saved secret (`matchesSavedSecret`), verify if a secret has been saved (`haveSavedSecret`), and retrieve a saved secret (`savedSecret`).

Utility functions include `NumberToUint32Array` for converting numbers to `Uint32Array` and `looksLikeUuid` for syntax validation of UUIDs. The `uuid` function generates unique UUIDs with a fallback method if `Blob` objects are not supported.

