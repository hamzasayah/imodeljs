# Change Log - @bentley/bentleyjs-core

This log was last generated on Thu, 27 May 2021 20:04:22 GMT and should not be manually modified.

## 2.16.1
Thu, 27 May 2021 20:04:22 GMT

_Version update only_

## 2.16.0
Mon, 24 May 2021 15:58:39 GMT

### Updates

- Add Id64.iterable; deprecate iterate and forEach.
- Add Id64.fromUint32PairObject() for creating an Id64String from an Id64.Uint32Pair.

## 2.15.6
Wed, 26 May 2021 15:55:18 GMT

_Version update only_

## 2.15.5
Thu, 20 May 2021 15:06:26 GMT

_Version update only_

## 2.15.4
Tue, 18 May 2021 21:59:07 GMT

_Version update only_

## 2.15.3
Mon, 17 May 2021 13:31:37 GMT

_Version update only_

## 2.15.2
Wed, 12 May 2021 18:08:13 GMT

_Version update only_

## 2.15.1
Wed, 05 May 2021 13:18:31 GMT

_Version update only_

## 2.15.0
Fri, 30 Apr 2021 12:36:58 GMT

### Updates

- Added new error flags.
- Promote APIs to public.

## 2.14.4
Thu, 22 Apr 2021 21:07:33 GMT

_Version update only_

## 2.14.3
Thu, 15 Apr 2021 15:13:16 GMT

_Version update only_

## 2.14.2
Thu, 08 Apr 2021 14:30:09 GMT

_Version update only_

## 2.14.1
Mon, 05 Apr 2021 16:28:00 GMT

_Version update only_

## 2.14.0
Fri, 02 Apr 2021 13:18:42 GMT

_Version update only_

## 2.13.0
Tue, 09 Mar 2021 20:28:13 GMT

### Updates

- Initial setup for adding "basic manipulation" tools and commands to editor package.
- Fixed broken double angle bracket link syntax
- Add isIPhoneBrowser to ProcessDetector and make isIOSBrowser work for both iPads and iPhones. Clarify documentation.
- Add ProcessDetector
- Adjusted error messages and error when reversing or reinstating schema changesets
- Updated to use TypeScript 4.1
- begin rename project from iModel.js to iTwin.js

## 2.12.3
Mon, 08 Mar 2021 15:32:00 GMT

_Version update only_

## 2.12.2
Wed, 03 Mar 2021 18:48:52 GMT

_Version update only_

## 2.12.1
Tue, 23 Feb 2021 20:54:45 GMT

_Version update only_

## 2.12.0
Thu, 18 Feb 2021 22:10:12 GMT

_Version update only_

## 2.11.2
Thu, 18 Feb 2021 02:50:59 GMT

_Version update only_

## 2.11.1
Thu, 04 Feb 2021 17:22:41 GMT

### Updates

- Fix 64-bit addition for CompressedId64Set.
- Add OrderedSet that mimics the standard Set but maintains its contents in a user-specified ordering.
- add error values for Ipc

## 2.11.0
Thu, 28 Jan 2021 13:39:27 GMT

### Updates

- make BeEvent.raiseEvent type safe

## 2.10.3
Fri, 08 Jan 2021 18:34:03 GMT

_Version update only_

## 2.10.2
Fri, 08 Jan 2021 14:52:02 GMT

_Version update only_

## 2.10.1
Tue, 22 Dec 2020 00:53:38 GMT

_Version update only_

## 2.10.0
Fri, 18 Dec 2020 18:24:01 GMT

### Updates

- Added CheckpointV2 errors
- Fix exception when constructing ObservableSet from an Iterable; add CompressedId64Set.reset().

## 2.9.9
Sun, 13 Dec 2020 19:00:03 GMT

_Version update only_

## 2.9.8
Fri, 11 Dec 2020 02:57:36 GMT

_Version update only_

## 2.9.7
Wed, 09 Dec 2020 20:58:23 GMT

_Version update only_

## 2.9.6
Mon, 07 Dec 2020 18:40:48 GMT

_Version update only_

## 2.9.5
Sat, 05 Dec 2020 01:55:56 GMT

_Version update only_

## 2.9.4
Wed, 02 Dec 2020 20:55:40 GMT

_Version update only_

## 2.9.3
Mon, 23 Nov 2020 20:57:56 GMT

_Version update only_

## 2.9.2
Mon, 23 Nov 2020 15:33:50 GMT

_Version update only_

## 2.9.1
Thu, 19 Nov 2020 17:03:42 GMT

_Version update only_

## 2.9.0
Wed, 18 Nov 2020 16:01:50 GMT

### Updates

- DuplicatePolicy for SortedArray (additional option to replace existing equivalent value on insertion).
- partitionArray().

## 2.8.1
Tue, 03 Nov 2020 00:33:56 GMT

_Version update only_

## 2.8.0
Fri, 23 Oct 2020 17:04:02 GMT

_Version update only_

## 2.7.6
Wed, 11 Nov 2020 16:28:23 GMT

_Version update only_

## 2.7.5
Fri, 23 Oct 2020 16:23:50 GMT

_Version update only_

## 2.7.4
Mon, 19 Oct 2020 17:57:01 GMT

_Version update only_

## 2.7.3
Wed, 14 Oct 2020 17:00:58 GMT

_Version update only_

## 2.7.2
Tue, 13 Oct 2020 18:20:38 GMT

_Version update only_

## 2.7.1
Thu, 08 Oct 2020 13:04:35 GMT

_Version update only_

## 2.7.0
Fri, 02 Oct 2020 18:03:32 GMT

### Updates

- Expand APIs for operating on ordered sets of Id64Strings (compressed or otherwise).
- add Config.addEnvVarsStartingWith
- Added a new error code used in iModelHub client to indicate missing lock chunk.
- Introduce NoContentError (transmitted via 204)

## 2.6.5
Sat, 26 Sep 2020 16:06:34 GMT

_Version update only_

## 2.6.4
Tue, 22 Sep 2020 17:40:07 GMT

_Version update only_

## 2.6.3
Mon, 21 Sep 2020 14:47:09 GMT

_Version update only_

## 2.6.2
Mon, 21 Sep 2020 13:07:43 GMT

_Version update only_

## 2.6.1
Fri, 18 Sep 2020 13:15:08 GMT

_Version update only_

## 2.6.0
Thu, 17 Sep 2020 13:16:12 GMT

### Updates

- Add Id64 functions for working with compact representations of Id64Sets and ordering Id64Strings based on 64-bit numerical value.
- Moved ESLint configuration to a plugin

## 2.5.5
Wed, 02 Sep 2020 17:42:23 GMT

_Version update only_

## 2.5.4
Fri, 28 Aug 2020 15:34:15 GMT

_Version update only_

## 2.5.3
Wed, 26 Aug 2020 11:46:00 GMT

_Version update only_

## 2.5.2
Tue, 25 Aug 2020 22:09:08 GMT

_Version update only_

## 2.5.1
Mon, 24 Aug 2020 18:13:04 GMT

_Version update only_

## 2.5.0
Thu, 20 Aug 2020 20:57:09 GMT

### Updates

- Introduce IModelApp security options (including CSRF protection).
- Switch to ESLint

## 2.4.2
Fri, 14 Aug 2020 16:34:09 GMT

_Version update only_

## 2.4.1
Fri, 07 Aug 2020 19:57:43 GMT

### Updates

- Added metadata sources functions to Logger

## 2.4.0
Tue, 28 Jul 2020 16:26:23 GMT

_Version update only_

## 2.3.3
Thu, 23 Jul 2020 12:57:15 GMT

_Version update only_

## 2.3.2
Tue, 14 Jul 2020 23:50:36 GMT

_Version update only_

## 2.3.1
Mon, 13 Jul 2020 18:50:13 GMT

_Version update only_

## 2.3.0
Fri, 10 Jul 2020 17:23:14 GMT

### Updates

- Generic functions for dynamic casting.

## 2.2.1
Tue, 07 Jul 2020 14:44:52 GMT

_Version update only_

## 2.2.0
Fri, 19 Jun 2020 14:10:03 GMT

### Updates

- Introduce GeoServiceStatus status code

## 2.1.0
Thu, 28 May 2020 22:48:59 GMT

### Updates

- Added FailedToGetProductSettings error
- Setup Guid.normalize() for internal use. 
- channel rules

## 2.0.0
Wed, 06 May 2020 13:17:49 GMT

### Updates

- Monitor progress of downloading briefcases, ability to cancel download of briefcases. 
- Update Config.App documentation to reflect the removal of the config.json file
- Added ContextDoesNotExist error
- BUG273249
- Updated docs. 
- Updated error text. 
- added raw log method that bypass catogory check
- order imports.
- Add a type guard for `IDisposable`
- Add Config class previously hosted in imodeljs-clients
- Upgrade to Rush 5.23.2
- Added ReadonlySortedArray.
- Remove support for the iModel.js module system by no longer delivering modules.

## 1.14.1
Wed, 22 Apr 2020 19:04:00 GMT

_Version update only_

## 1.14.0
Tue, 31 Mar 2020 15:44:19 GMT

_Version update only_

## 1.13.0
Wed, 04 Mar 2020 16:16:31 GMT

_Version update only_

## 1.12.0
Wed, 12 Feb 2020 17:45:49 GMT

_Version update only_

## 1.11.0
Wed, 22 Jan 2020 19:24:11 GMT

### Updates

- VSS$257397: Temporary fix for checking electron renderer. 
- Upgrade to TypeScript 3.7.2.

## 1.10.0
Tue, 07 Jan 2020 19:44:01 GMT

### Updates

- Added ByteStream class.

## 1.9.0
Tue, 10 Dec 2019 18:08:56 GMT

### Updates

- Setup OidcDesktopClient for Electron use cases. 
- Added non-static wait and executeAfter to BeDuration
- Fix warnings from static analysis
- Added `BeDuration.race` for common timeout operations.

## 1.8.0
Fri, 22 Nov 2019 14:03:34 GMT

_Version update only_

## 1.7.0
Fri, 01 Nov 2019 13:28:37 GMT

_Version update only_

## 1.6.0
Wed, 09 Oct 2019 20:28:42 GMT

_Version update only_

## 1.5.0
Mon, 30 Sep 2019 22:28:48 GMT

### Updates

- Fixed AuthStatus error numbers not to overlap with others.
- Added ObservableSet<T>.
- upgrade to TypeScript 3.6.2

## 1.4.0
Tue, 10 Sep 2019 12:09:49 GMT

### Updates

- Fixed AuthStatus error numbers not to overlap with others.
- Added PriorityQueue.append function for adding new elements without applying sorting logic.

## 1.3.0
Tue, 13 Aug 2019 20:25:53 GMT

_Version update only_

## 1.2.0
Wed, 24 Jul 2019 11:47:26 GMT

_Version update only_

## 1.1.0
Mon, 01 Jul 2019 19:04:29 GMT

### Updates

- Added OneAtATimeActivity class
- Introduced AsyncMutex - a utility to run async blocks of code in sequence. 
- Update to TypeScript 3.5

## 1.0.0
Mon, 03 Jun 2019 18:09:39 GMT

### Updates

- RPC system now accepts only basic values (primitives, "interface" objects, and binary).
- Added Id64.getFirst to get the first value of an Id64Arg
- Added an error for seed file initialization timeout
- Switched from iModelHub Project API to Context API
- Refactored and simplified implementation of IModelDb.open
- Add property accessor for empty Guid

## 0.191.0
Mon, 13 May 2019 15:52:05 GMT

### Updates

- Adds parameter for api-extractor to validate missing release tags
- Add a Dictionary-based least-recently-used cache.
- Fix broken links
- LoggerCategory -> BentleyLoggerCategory
- Logged the fields in ClientRequestContext
- Logging fixes.
- Put sourcemap in npm package.
- Fixed logger to not mutate incoming objects. 
- Improved performance logging
- Added functions for iterating and obtaining the number of elements of a collection of Id64s represented as an Id64Arg.
- Setup a generic context for tracking client requests, and made various related enhancements to logging, usage tracking and authorization. 
- Use TextDecoder to decode binary utf-8 strings if supported.
- Upgrade TypeDoc dependency to 0.14.2

## 0.190.0
Thu, 14 Mar 2019 14:26:49 GMT

_Version update only_

## 0.189.0
Wed, 06 Mar 2019 15:41:22 GMT

### Updates

- Changes package.json to include api-extractor and adds api-extractor.json
- Use new buildIModelJsBuild script
- Add release tags to indicate API stability
- Remove unneeded typedoc plugin dependency
- Save BUILD_SEMVER to globally accessible map
- Upgrade to TypeScript 3.2.2

## 0.188.0
Wed, 16 Jan 2019 16:36:09 GMT

_Version update only_

## 0.187.0
Tue, 15 Jan 2019 15:18:59 GMT

_Version update only_

## 0.186.0
Mon, 14 Jan 2019 23:09:10 GMT

### Updates

- Removed IModelDb's cache of accessToken. For long running operations like AutoPush, the user must explicitly supply an IAccessTokenManager to keep the token current. 

## 0.185.0
Fri, 11 Jan 2019 18:29:00 GMT

### Updates

- Optimize Id64String operations and supply specialized, optimized collection types.

## 0.184.0
Thu, 10 Jan 2019 22:46:17 GMT

_Version update only_

## 0.183.0
Mon, 07 Jan 2019 21:49:21 GMT

_Version update only_

## 0.182.0
Mon, 07 Jan 2019 13:31:34 GMT

_Version update only_

## 0.181.0
Fri, 04 Jan 2019 13:02:40 GMT

_Version update only_

## 0.180.0
Wed, 02 Jan 2019 15:18:23 GMT

### Updates

- Enable usage of custom collection classes inside for..of loops.

## 0.179.0
Wed, 19 Dec 2018 18:26:14 GMT

### Updates

- Fix issue where all event listeners are removed.

## 0.178.0
Thu, 13 Dec 2018 22:06:10 GMT

_Version update only_

## 0.177.0
Wed, 12 Dec 2018 17:21:31 GMT

_Version update only_

## 0.176.0
Mon, 10 Dec 2018 21:19:45 GMT

_Version update only_

## 0.175.0
Mon, 10 Dec 2018 17:08:55 GMT

_Version update only_

## 0.174.0
Mon, 10 Dec 2018 13:24:09 GMT

_Version update only_

## 0.173.0
Thu, 06 Dec 2018 22:03:29 GMT

_Version update only_

## 0.172.0
Tue, 04 Dec 2018 17:24:39 GMT

_Version update only_

## 0.171.0
Mon, 03 Dec 2018 18:52:58 GMT

_Version update only_

## 0.170.0
Mon, 26 Nov 2018 19:38:42 GMT

### Updates

- Change Logger.ParseLogLevel() to use camelCased method naming, Logger.parseLogLevel().

## 0.169.0
Tue, 20 Nov 2018 16:17:15 GMT

### Updates

- Remove PromiseUtil class

## 0.168.0
Sat, 17 Nov 2018 14:20:11 GMT

_Version update only_

## 0.167.0
Fri, 16 Nov 2018 21:45:44 GMT

### Updates

- Changes to debug utilities. 
- Fluentd Bunnyan Logger added

## 0.166.0
Mon, 12 Nov 2018 16:42:10 GMT

_Version update only_

## 0.165.0
Mon, 12 Nov 2018 15:47:00 GMT

_Version update only_

## 0.164.0
Thu, 08 Nov 2018 17:59:20 GMT

### Updates

- OIDC related enhancments (WIP).
- Updated to TypeScript 3.1

## 0.163.0
Wed, 31 Oct 2018 20:55:37 GMT

### Updates

- Turn Guid class into a namespace and use GuidString in signatures.
- Guid.wrap creates a Guid object without validating the input string.
- Changed Id64 from a class to a namespace.

## 0.162.0
Wed, 24 Oct 2018 19:20:06 GMT

### Updates

- Breaking changes to optimize usage of 64-bit IDs.

## 0.161.0
Fri, 19 Oct 2018 13:04:14 GMT

_Version update only_

## 0.160.0
Wed, 17 Oct 2018 18:18:38 GMT

_Version update only_

## 0.159.0
Tue, 16 Oct 2018 14:09:09 GMT

_Version update only_

## 0.158.0
Mon, 15 Oct 2018 19:36:09 GMT

_Version update only_

## 0.157.0
Sun, 14 Oct 2018 17:20:06 GMT

_Version update only_

## 0.156.0
Fri, 12 Oct 2018 23:00:10 GMT

### Updates

- Initial release

