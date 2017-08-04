# Backend for the meetNow app
Written in Java using [Spring Boot](https://projects.spring.io/spring-boot) and [swagger](http://swagger.io/). 
Persistence is handled by [MongoDB](https://www.mongodb.com/), the app is hosted on SAP Cloud Platform.


## _Table of contents_
+ [Setup Development Environment](#setup-development-environment)
+ [Swagger Usage](#swagger-usage)
+ [API Endpoints with Spring](#api-endpoints-with-spring)
+ [Persistence Handling](#persistencehandling)
+ [Location Management](#location-management)
+ [Consent Management](#consent-management)
+ [Maven Usage and deployment](#maven-usage-and-deployment)
+ [Security](#security)

## Setup Development Environment

This is just for us working on the project.

### Maven
1. If you don't have maven, download the binary zip archive from [here](https://maven.apache.org/download.cgi).
2. Follow the installation steps described [here](https://maven.apache.org/install.html).
3. Especially ensure that `JAVA_HOME` environment variable is set and add the maven/bin directory to the `PATH` 
Variable.

### Eclipse / Spring Tool Suite Setup
1. Create a new general project at the location of the MeetNow/backend directory.
2. Press `F5`(refresh) on the project. The subfolders should now appear.
3. Right-click the project and choose `Configure` -> `Convert to Maven project`.
4. Press `Alt+F5` to update the maven project and download necessary dependencies.
5. Run `mvn clean verify` in a terminal in the project folder. This will generate the class files from the swagger code
 generation.
6. Add the `gen/src/java` directory to the build path (only the subfolder!). Therefore right-click the java folder and
 choose 
`Build-Path`->`Use as source folder`.

Your project structure should look as shown below now.

![folderStructure](./folderStructure.png "Folder structure in the maven project")

### MongoDB
The java application uses MongoDB for persistence. In order to be able to test your application locally, follow the 
described steps.
1. Download MongoDB from [here](https://www.mongodb.com/download-center#community).
2. Follow the installation guide using the default options.
3. Create the directory where mongoDB will store data. Open a terminal and enter `md C:\data\db` as described 
[here](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#run-mongodb-community-edition).
4. Test if everything works by starting your MongoDB. Therefore go into the installation directory, e. g. 
```cd "C:\Program Files\MongoDB\Server\3.4\bin"```
and run `mongod`. End the process with `Ctrl+C` afterwards.
5. For convenience while testing, you can also create a `.bat` file in your project. Therefore right-click your 
Eclipse/STS project and choose `New`->`Other` and  `File`. Enter the filename `mongoStartUp.bat`. Open the file with a
 text editor by right-clicking it and choosing `Open-With`->`Text Editor`.
Enter the following line and save the file (the specified path has to match your installation directory).
```
"C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe"
```
If you want to run the bat file now, you right-click and choose `Open-With`->`System Editor`. After you've done this once, you can just double-click the file to start MongoDB.

### Postman
1. Add the Postman Extension as a Chrome Plugin.
2. Open the Postman plugin by pressing the `windows key` and typing "postman". Choose the option `take me directly to the app`.

## Local Testing
Before you can test your spring application, you have to start MongoDB as described [above](#mongodb). So you need to run your mongoStartUp.bat file. You don't need to restart MongoDB every time you restart your application, so you can just leave it open in the background.
Test your spring Application:
- Eclipse: Open the `BackendApplication` class and choose `Run`->`Run-As`->`Java Application`.
- STS: Open the Spring Boot View and press the start button.

After Startup, you can access the application via postman. You can import example requests as a collection by choosing `Import` and navigating to your project directory and choosing the `MeetingApi.postman_collection.json` file. This will probably updated regularly, so you might have to delete the collection and import it again.

## Committing
1. Before you commit your changes to the github repository, always run a `mvn clean verify`. Only push to git if your 
build ended up with `BUILD SUCCESS`. (Only for the spring project! If you changed something regarding the mobile app, 
you don't need to run maven)
2. Add your changes using your IDE or `git add filename`.
3. Commit your local changes using your IDE or `git commit -m "your commit message"`.
4. Fetch updates from upstream using your IDE or `git fetch`.
5. If there are updates, use `git rebase` to set your commit(s) on top of the remote commits.
6. After a successful rebase, push your changes to the remote repository using `git push`.

## Swagger Usage
The application uses swagger to specify the API between the mobile Ionic App and the Java Backend.
The API is defined in the [api.yaml](./api.yaml) file. Afterwards in the maven generate phase, the Swagger Maven
Plugin generates the necessary model and API classes in the `gen/src/java` folder for the backend. The client code for
the mobile App is generated in typescript/angular2. The backend and the mobile App both us the model generated from the
[api.yaml](./api.yaml). As there were a few changes necessary to the generated code for communication, the swagger code
was used as a starting point for that. You can't see the generated code online, as the folders are on the gitignore.

### Viewing the API documentation
If you are interested in the documentation of our API, follow these quick steps:
1. Open the online [swagger editor](http://editor.swagger.io). 
2. Copy this [url](https://raw.githubusercontent.com/XLexxaX/MeetNow/master/backend/src/main/resources/api.yaml).
3. In the editor, choose File -> Import URL and paste the just copied URL.
4. You should see the documentation on the right side of your editor.

## API Endpoints with Spring
Spring makes it easy to define API endpoints. You can take a look at the class 
[MobileAppController](./src/main/java/meetNow/api/controller/MobileAppController.java). This class uses the Spring Web
annotations to declare the handling of the defined API Endpoints. All of the data conversion from JSON to Java Objects
and back is done by the Spring Boot Framework and it's easy to declare custom exceptions and handler methods to define
what to return is specific error cases.

## Persistence Handling
Our backend persists meeting and user data in the mongoDB. We use the `spring-mongo-starter` maven dependency for the 
integration. We defined to repositories: the 
[MeetingRepository](./src/main/java/meetNow/dataaccess/repositories/MeetingRepository.java) and the 
[UserRepository](./src/main/java/meetNow/dataaccess/repositories/UserRepository.java). Both repositories just extend the
basic interface `MongoRepository` and can be used as a simple CRUD-Repository for objects to persist.
The user data can be used to authenticate the client while the meeting data is necessary to handle the geofence 
transitions and the consent management ([see below](#location-management)).

## Location Management
Geofence transitations of the mobile devices are submitted to the backend using the API endpoint. The backend now keeps
track of this meeting in the class [SimpleMeetingStatusHandler](./src/main/java/meetNow/logic/SimpleMeetingStatusHandler.java).
The backend checks if every participant of the meeting is currently in the defined area. If this is the case, a REST
Call is send to the OneSignalAPI to send the notification that a meeting could start. The request is send asynchronous
using the Java 8 features for Concurrency. This can be observed in the class 
[OneSignalMessenger](./src/main/java/meetNow/logic/OneSignalMessenger.java).

## Consent Management
When all participants are in the defined area, the consent management is activated to receive the responses of the 
clients. When all meeting participants have submitted their response, the consent management checks if they all have 
time to meet now. If this is the case, a push notification is triggered using the OneSignal REST API as described 
[above](#location-management).

## Maven usage and deployment
### Maven
All dependencies of the backend project are managed with maven and as this is a Spring Boot project, most of the 
versions are managed by Spring (see our [pom.xml](./pom.xml)). We use multiple maven plugins to automate our development
process as much as possible.
- Swagger maven plugin, as described [above](#swagger-usage).
- Spring boot maven plugin: Running a spring application locally, hot code replacement when debugging.
- maven resources plugin: During the `generate-resources` phase, we copy the generated platform code for desktop browers
from our mobile app project to our backend in order to serve the files at our base URL 
https://meetnow.cfapps.eu10.hana.ondemand.com. Spring takes care of the static file server, no configuration 
necessary.

### Deployment
We deploy our app to the [SAP Cloud Platform](https://cloudplatform.sap.com/index.html). SCP uses Cloud Foundry, an open 
industry standard for cloud application platform that abstracts away infrastructure so you can focus on app innovation.
Therefore, the Cloud Foundry command line interface can be used to deploy and monitor the application in the cloud. To
deploy the app, there is a [manifest.yml](./manifest.yml) file to define parameters about the application for
deployment. Using `cf push`, the app is deployed to the cloud, an instance is started automatically and connected to the
MongoDb service, which was created before the push.

## Security
All communications channels are secured using SSL. Clients receive a so called secret, which is a true random number
and can be used as a password to validate the client is who he claims to be. This is used to authenticate a client when
using the browser app. At this point in time, it is not used to secure the API endpoints offered to the mobileApp as we
had to stop the development at some point, but it could be easily added as the data is already there on both sides.

