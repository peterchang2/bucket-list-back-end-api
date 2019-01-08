# Bucket List Back End API

# How it works

### Once a user signs up and signs in, the user is able to create a bucket list item, along with a description that details what the user wants to do eventually in their lifetime (i.e. visit Hawaii, climb Mt. Kilimanjaro, etc.) The user can also show and list a single or all of their items, and update a particular entry. In addition, the user can even check an item off their bucket list once they accomplish that item in their bucket list and delete any particular item at any time they choose.

# Links

* [Bucket List Front End Client](https://github.com/WDI-28-peter-kwesi-lucas/bucket-list-front-end-client/)
* [Heroku](https://secure-bastion-12965.herokuapp.com/)
* [Deployed Site](https://wdi-28-peter-kwesi-lucas.github.io/bucket-list-front-end-client/)

# Entity Relationship Diagrams

* [Entity Relationship Diagrams](https://i.imgur.com/1WmRSOu.png)

# API Routes and Paths

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/sign-up`             | `users#signup`    |
| POST   | `/sign-in`             | `users#signin`    |
| DELETE | `/sign-out`            | `users#signout`   |
| PATCH  | `/change-password`     | `users#changepw`  |
| POST   | `/items`               | `items#create`    |
| GET    | `/items`               | `items#index`     |
| GET    | `/items/:id`           | `items#show`      |
| PATCH  | `/items/:id`           | `items#update`    |
| DELETE | `/items/:id/`          | `items#delete`    |

# List of Technologies Used

* Express
* Node.js
* Mongodb
* Mongoose

# Unsolved problems

As of right now, we don't really have major unsolved problems that are in our way. The app works fine and all auth and item actions do not return any errors. As for future plans, we currently don't have any future plans for this app, although that could very well change in the near future.

# Planning, process, and problem-solving strategies

When we started our group project, we agreed that Lucas and Kwesi would work on the back-end API while Peter would start out with the front-end client. Once our back-end API was completed, Kwesi helped Peter finish the front-end while Lucas filled out both READMEs, so we could get those requirements out of the way sooner to focus on adding additional front-end features after completing all requirements. Whenever we ran into an issue, we would first search Google/StackOverflow to find the specific issue that we ran into, or, as a last resort, we would open an issue cue and have an instructor help us remotely.
