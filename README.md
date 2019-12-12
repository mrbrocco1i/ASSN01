[![pipeline status](https://gitlab.com/20086431/assn01-cicd/badges/master/pipeline.svg)](https://gitlab.com/20086431/assn01-cicd/commits/master)

[![coverage report](https://gitlab.com/20086431/assn01-cicd/badges/master/coverage.svg)](https://gitlab.com/20086431/assn01-cicd/badges/master/coverage.svg?job=coverage)

# Assignment 1 - Agile Software Practice.

Name:  Wuzhen Ye 

## Overview.

I'm developing a vending machine stock management system. Many beverages can be set up in the machine, and their information will be recorded in the database. Administrators can manage the information, such as price, amount, name, and if neccessary they can change what's being sold in the machine. Administrators have different privileges, some of whom can only search the information, but some can change the data. 

## API endpoints.
       Beverages
 + GET /beverages - Get all beverages.
 + GET /beverages/findById/:id- Get beverages by their IDs.
 + GET /beverages/findByType/:type - Get beverages by their categories.
 + GET /beverages/findByName_fuzzy/:fname - Get beverages by some key words in their name.
 + POST /beverages/addRecord - Add beverages records.
 + PUT /beverages/addAmount/:id - Add the amount of a certain beverage by 1
 + PUT /beverages/changePrice/:id
 + Delete /beverages/deleteById/:id
 + Delete /beverages/deleteByName/:name
 
        Administrators
 + GET /administrators
 + GET /administrators/findById/:id
 + Post /administrators/login
 + POST /administrators/addRecord
 + POST /administrators/loginByToken
 + Delete /administrators/deleteById/:id

## Data model.

Two models: administrator and beverage. Each admin can manage different beverages. Some can change the price, and some can delete a certain beverage.

![][datamodel]


## Sample Test execution.

~~~
    Beverages
      GET /beverages
        when the collection is not empty
          ✓ should GET all the beverages
        when the collection is empty
          ✓ should return a error message
      GET /beverages/findById/:id
        when the id is valid
          ✓ should return the matching beverage
        when the id is invalid
          ✓ should return a 404 for invalid message
        when the id is valid but not right
          ✓ should return an error message
      GET /beverages/findByType/:type
        when the id is valid
          ✓ should return the matching beverage
        when the id is invalid
          ✓ should return the NOT found message
      GET /beverages/findByName_fuzzy/:fname
        when the id is valid
          ✓ should return the matching beverage
        when the id is invalid
          ✓ should return the NOT found message
      POST /beverages/addRecord
        ✓ should return confirmation message and update database
      PUT /beverages/addAmount/:id
        when the id is valid
          ✓ should return a message and the beverage amount increased by 1
        when the id is invalid
          ✓ should return a 404 for invalid message
      PUT /beverages/changePrice/:id
        when the id is valid
          ✓ should return a message and the price is changed
        when the id is invalid
          ✓ should return a 404 for invalid message
      Delete /beverages/deleteById/:id
        when the id is valid
          ✓ should return a message and the record with this id will be discarded
        when the id is invalid
          ✓ should return a message for deleting failure
      Delete /beverages/deleteByName/:name
        ✓ should return a message and the record with this name will be discarded

    Administrators
      GET /administrators
        when the collection is not empty
          ✓ should GET all the admins
        when the collection is empty
          ✓ should return a error message
      GET /administrators/findById/:id
        when the id is valid
          ✓ should return the matching admin
        when the id is invalid
          ✓ should return a 404 for invalid message
      Post /administrators/login
        when the username and password are right
          ✓ should return a 'welcome' message
        when the username is not right,
          ✓ should return a error message
        when the password is not right,
          ✓ should return a error message
      POST /administrators/addRecord
        ✓ should return confirmation message and update database
      POST /administrators/loginByToken
        when the token is valid
          ✓ should return a 'welcome' message
        when the token is invalid
          ✓ should return an 'forbidden' message
      Delete /administrators/deleteById/:id
        when the id is valid
          ✓ should return a message and the record with this id will be discarded
        when the id is invalid
          ✓ should return a message for deleting failure


    29 passing (679ms)

~~~

## Extra features.

    Authentication using JWT 
When user visits the website again, the login information can be kept without reentering username and password a second time. (Testing code in ./test/functional/api/administratorsTest.js) 


[datamodel]: ./img/data_model.png
