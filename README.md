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

* Allow watching videos
* Homepage video feed
