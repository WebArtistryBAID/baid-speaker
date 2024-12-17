# TEMPORARY: How tasks should be allocated

Upon lecture creation: Wait for lecture to be assigned to host

Upon lecture assigned to host:

* `confirmDate`: Assigned to host, no deadline

Upon finishing of `confirmDate`:

* `confirmNeedComPoster`: Assigned to lecture owner, deadline 5 days before date
* `inviteTeacher`: Assigned to lecture host, deadline 5 days before date
* `submitPresentation`: Assigned to lecture owner, deadline 3 days before date
* `confirmLocation`: Assigned to lecture host, deadline 3 days before date

Upon finishing of `confirmNeedComPoster`:

* If user requests com poster, `confirmPosterDesigner`: Assigned to lecture host, deadline 4 days before date
  * Upon finishing of `confirmPosterDesigner`, `submitPoster`: Assigned to poster designer, deadline 3 days before date
* If user does not request com poster, `submitPoster`: Assigned to lecture owner, deadline 3 days before date

Upon finishing of `submitPoster`:

* `schoolApprovePoster`: Assigned to lecture host, deadline 1 day before date

Upon finishing of `schoolApprovePoster`:

* If `uploadedSlides != null`: `sendAdvertisements`: Assigned to lecture owner, deadline 1 day before date

Upon finishing of `submitPresentation`:

* `teacherApprovePresentation`: Assigned to lecture host, deadline 1 day before date
* `createGroupChat`: Assigned to lecture host, deadline 1 day before date
* `inviteParticipants`: Assigned to lecture owner, deadline 1 day before date
* If `posterApproved`, `sendAdvertisements`: Assigned to lecture owner, deadline 1 day before date

Upon finishing of `confirmLocation`:

* `testDevice`: Assigned to lecture host, deadline 1 day before date

Upon completing of lecture:

* `updateLiveAudience`: Assigned to lecture host, deadline 1 day after date
* `submitFeedback`: Assigned to lecture host, deadline 1 day after date
* `submitVideo`: Assigned to lecture host, deadline 1 day after date
* `submitReflection`: Assigned to lecture host, deadline 7 days after date

## Features to complete

* Allow editing location and date of lecture - notice that date of lecture contains more complicated logic with changing
  the task dates as well
* The host can unassign the teacher and the artist from the lecture. They can change to another host, but not unassign
  themselves, because that would cause complication.
* Show the following on the lecture dashboard
  * Lecture poster (if available)
  * Lecture presentation (if available)
  * Lecture group QR code (if available)
  * Teacher feedback (if given)
  * After lecture completion, show the following
    * Teacher rating
    * Lecture video (with link to main video page)
    * Lecture video views
    * Lecture video likes
    * Lecture presentation
    * Lecture feedback form
* Show all available files on lectures
* Add a dialog on first open for users, hosts, teachers, and artists to explain how to use the app when they open
  lecture page
* Show in-progress lectures, completed lectures, and all lectures in manage page: pagination
* Show users in user management page: pagination
* Allow editing users (mostly permissions) in user management page
