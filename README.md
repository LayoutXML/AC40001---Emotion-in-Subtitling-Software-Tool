# AC40001 - Emotion in Subtitling Software Tool

This is an Angular and Firebase project.

## Frontend

To run the frontend (Angular project) the following are needed:

* Node.js (version 14.18.0)
* npm (version 6.14.15)
* Angular CLI (version 13.2.3)

To run it locally run the following command:

```
ng serve
```

To deploy, the CNAME file should be changed to include the domain name, and the following command should be ran:

```
ng build
```

## Backend

To run the backend (Google Firebase database), a Google Firebase project should be created and populated with the data from ``codes.json`` and ``videos.json`` files as separate collections.
