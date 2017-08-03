# Mobile MeetNow App
Build with Ionic2. The functionality/pages described in this readme can be observed in our presentation. This page will
give some more information about the technical side and will give hints where to find important code.

## _Table of contents_
+ [Contacts](#contacts)
+ [Plan a meeting](#plan-a-meeting)
+ [Share a meeting](#share-a-meeting)
+ [Additional Pages not shown in the videos](#additional-pages-not-shown-in-the-videos)
  - [Settings](#settings)
  - [Licences](#licences)


## Contacts
This functionality is for adding new contacts to organize meetings with. Find the code
in this [folder](./src/pages/contacts). A user sends a message with his unique user id to somebody else who also has the
MeetNow App installed. The message contains a link, which will automatically open in the MeetNow app and guide him to 
the contact page. He will have to add a display name to this contact. Afterwards, a post notification will be triggered
to the user who has sent out the friend request containing his own unique id. Again a display name has to be specified 
and now the users are connected with each other and can organize meetings with each other.

Used Plugins:
- [Cordova universal links plugin](https://github.com/nordnet/cordova-universal-links-plugin)
- [Ionic oneSignal plugin](https://documentation.onesignal.com/v3.0/docs/ionic-sdk-setup)
- [Ionic Social Sharing](https://ionicframework.com/docs/native/social-sharing)

## Plan a meeting


## Share a meeting
When the user is in the detail view for a meeting, he can also share the meeting information with his friends using the
share button, as shown in one of the videos. Code is available [here](./src/pages/viewScheduledEvent)

Used Plugins:
- [Ionic Social Sharing](https://ionicframework.com/docs/native/social-sharing)

## Additional Pages not shown in the videos

### Settings
On the settings page, there is the functionality to disable tracking of geofences. This might be useful is a user is 
busy at the moment and can't participate anyway in meetings or if he doesn't want to participate at the moment.
On the settings page, the user can obtain the login information for the desktop browser. Therefore he needs his unique
id and his private secret, which he can view by clicking the eye icon in the password field.

![SettingsPage](./SettingsPage.png "SettingsPage")


### License Page
Not much to talk about, just some static content which contains the License information regarding the app and from the
Google Maps API.

![Licences](./Licences.png "Licenses")
