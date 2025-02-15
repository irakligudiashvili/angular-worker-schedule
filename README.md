# Angular Shift Scheduler

## Overview

This project is an Angular-based frontend built to interact with a C# backend provided by our lecturer. It implements authentication, role-based access control, and various management features for users, jobs, and schedules. The application ensures a smooth and secure user experience using JWT authentication and Angular guards to restrict access based on user roles.

## Features

### Registration

Users can register and pick a job role that is pulled from the database

![](/client//src/assets/screenshots/registration.png)

### Authentication

Users can log in using JWT authenthication

![](/client/src/assets/screenshots/login.png)

And will be notified if they've logged in as a regular worker or admin via Toastr

![](/client/src/assets/screenshots/dashboard.png)

### Schedules

Users can see weekly schedules divided into night and morning shifts. On this page, users can request a shift and can see who is approved on what shift. Unapproved shifts are only visible to admins, pending verification or cancellation.

![](/client/src/assets/screenshots/schedule.png)

### User List

Accessible only to admins, the worker dashboard page lists all users that are registered and comes equipped with the functionality to delete users and either give or revoke admin role from others.

![](/client/src/assets/screenshots/roles.png)

### Jobs List

Accessible only to admins, the jobs page lists all jobs that are available and comes with the functionality to delete or add new jobs

![](/client/src/assets/screenshots/jobs.png)