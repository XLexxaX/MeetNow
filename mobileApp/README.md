# Mobile MeetNow app
Build with Ionic2. 

## Development setup
The api model is generated using swagger. These generated files are in the folder `src/gen` and are on the gitignore (so you won't see them online). 
To generate the necessary resources (and remove the errors in your project), follow these quick steps:
1. Open a terminal and switch to the backend directory, which would be `cd ..\backend` from this directory.
2. Run `mvn compile`. This will regenerate both the spring server api in java aswell as the angular2 client library in typescript.
