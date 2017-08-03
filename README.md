# MeetNow

MeetNow is an mobile Application project in context of the lecture Platforms & Frameworks for Students of Business 
Information Technology at the [DHBW Mannheim](https://www.dhbw-mannheim.de/).

To get a quick overview, check out our 
[HTML5 Presentation](http://htmlpreview.github.io/?https://github.com/XLexxaX/MeetNow/blob/master/presentation/presentation.html)!

## _Table of contents_
- [Use Case](#use-case)
- [Architectural Overview](#architectural-overview)
- [URL's to our individual mobile App repostories (5. Semester)](#link-to-our-individual-github-repositories)
- [Frontend]()
  + [BlaBla](./docs/README.md#wrench-geolocation-options)
- [Backend]()
    + [Setup Development Environment](./backend/README.md#setup-development-environment)
    + [Swagger Usage](./backend/README.md#swagger-usage)
    + [API Endpoints with Spring](./backend/README.md#api-endpoints-with-spring)
    + [Persistence Handling](./backend/README.md#persistencehandling)
    + [Location Management](./backend/README.md#location-management)
    + [Consent Management](./backend/README.md#consent-management)
    + [Maven Usage and deployment](./backend/README.md#maven-usage-and-deployment)
    + [Security](./backend/README.md#security)

## Use Case

@carmabell please write few sentences about the use case.

## Architectural Overview
Below is a picture of our architectural setup. 
The mobile App is developed with the Ionic Framework, version 2. It persists necessary data using the native ionic 
storage. Using the OneSignal plugin for ionic, the mobile App is able to send push notifications to other clients. 
The app also exchanges information with our backend via REST-Calls, e. g. about meetings or geofence transitions. 

The backend itself is written in Java, using the [Spring Boot Framework](https://projects.spring.io/spring-boot/). 
The persistence Layer for the Spring Application 
is [MongoDB](https://www.mongodb.com/), as this was the most sufficient way of storing the meeting and user information. 
The backend also hosts the browser version of our app by serving the static HTML/CSS/JS-Files for the desktop browsers 
and handling 
authentication. The application is hosted on [SAP Cloud Platform](https://cloudplatform.sap.com/index.html). Our 
backend also communicates with the [OneSignal REST API](https://documentation.onesignal.com/v3.0/reference) to trigger
push notifications to participants of a meeting.

![Architectural Overview](./Architecture_Overview.png "Architecture of the whole MeetNow application")

## Link to our individual Github repositories
Florian Bunsmann:

Carmen Rannefeld: https://github.com/carmabell/MobileApp

Alexander Lütke:
