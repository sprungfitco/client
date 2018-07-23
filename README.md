# client
To Run Client in local -
Make sure you have yarn, node installed in your Mac.

1. make install
2. make start
3. Go to - http://localhost:5000/



# Open Tok Library 

We are using the opentok-react library and editing the code as per our requirements. (Since it is A MIT license)

https://github.com/sprunginc/client/tree/master/web/src/lib/opentok


# Backend server

Backend exposes graphQL API at this endpoint 
- http://devapiserver.sprung.us:9090/graphql

Please use the API explorer tool below to understand and use the server APIs
- https://github.com/skevy/graphiql-app

# Coding and development guidelines
This section will evolve, but for now here are a few guidelines we need to follow.

## Code styling
We will follow Google's Javascript styling guide. Please take some time to review it. All code changes should adhere to this standard.
- https://google.github.io/styleguide/jsguide.html

## Master stability
We need to keep master branch stable at all times. Having a stable branch helps fellow engineers and yourself to contribute effectively without any unexpected problems. Together, it helps us stay productive and reach our goals faster.

## Code Reviews
As a team, it is important that we contribute reliable code. A detailed code review helps reduce bugs. Fewer bugs means less disruption for people building on top of your code or testing your code and hence fewer bugs that end up on your plate later. Helping colleagues with code reviews also leads to better reviews for your code in return. This culture of ongoing collaborative code reviews helps improve reliability, increases productivity making it pleasant to work with the codebase.

We'll rigorously follow code review practice before every checkin. No code will be checked-in to master without getting at least one review from a colleague. It is also a well-known fact that very large code changes drain the reviewers and more bugs fall through the cracks. Small changes lead to faster reviews and faster checkins. So please send out smaller pull requests, less than couple hundred lines in each commit if possible. 

## Testing
All code changes will be need to be tested before sending out the pull request. Please mention the testing steps in your pull request as described in the section below.

## Pull request description
Every pull request will need a description with the following sections

- Purpose of the change

Briefly describe the main purpose of the change

- Description of the code changes

Your description goes here

- Testing done

List the test coverage and/or the steps you used.

If any of the sections is missing, the pull request will be rejected.

