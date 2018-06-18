# Daisy's Garden README

This repository contains the Hypermedia Application course project developed during the Academic Year 2017/2018.

## Division of Work:

Because of the didactical purpose of this project, every team member (Luca Falaschini, Leonardo Febbo, Alberto Floris) partecipated in every activity during the project development.


## Client Side languages used:
the project is based on CSS3, HTML5 and Javascript.

## Template used:
the footer's code is taken from another web application, but we can not remember where we take it.


## External scripts, API and plugins:
we used:

1. bootstrap (https://getbootstrap.com/)

2. jQuery (https://jquery.com/)

3. popper (https://popper.js.org/)

4. Google Fonts (https://fonts.google.com/)

## Main difficulties faced during the project development:

the most difficult issue to overcame was making the website responsive without breaking containers, titles images and similar elements.
we all started from zero experience on web design and we are satisfied by our work. 

## How to test it: 

simply click on: https://polimi-hyp-2018-team-10508999.herokuapp.com/

***

## backend APIs documentation ##

#### how to fetch locations list
simply send this GET request:

`http://polimi-hyp-2018-team-10508999.herokuapp.com/api/locations`

in that case you will receive a Json Response like this: 

```
    [{
        "id":1,
        "name":"Augusta",
        "image":"location1.jpg"
    },
    ...,
    {
        "id":5,
        "name":"Tagliacozzo",
        "image":"location5.jpg"
        }]

```

as you can see, each element of the array possesses `id`, `name`, and `image`
fields. `image` field contains the filename of the image, which will be searched inside
`/public/assets/images` folder.

you may also want to receive a list of location without the image; if that's the case, you can use this GET request:

`http://polimi-hyp-2018-team-10508999.herokuapp.com/api/locations/namelist`

#### how to fetch services list
simply send this GET request:

`http://polimi-hyp-2018-team-10508999.herokuapp.com/api/services`

in that case you will receive a Json Response like this: 

```
    [{
        "id":5,
        "name":"Biblioteca Speciale",
        "image":"service05.jpg"
    },
    ...,
    {
        "id":3,
        "name":"Noi con Te",
        "image":"service03.jpg"
        }]

```

as you can see, each element of the array possesses `id`, `name`, and `image`
fields. `image` field contains the filename of the image, which will be searched inside
`/public/assets/images` folder. the JSON array will also be ordered in alphabetical order, relating to the `name` field

you may also want to receive a list of location without the image; if that's the case, you can use this GET request:

`http://polimi-hyp-2018-team-10508999.herokuapp.com/api/services/namelist`


#### how to fetch people list

you can simply send this GET request:

`http://polimi-hyp-2018-team-10508999.herokuapp.com/api/people`

the response you will receive it's similar to this:

```
    [{
        "id":1,
        "name":"Bruno",
        "surname":"Biondo",
        "mansione":"Responsabile 'Dalmine'",
        "image":"bruno_biondo.jpg"
    },
    ...,
    {
        "id":12,
        "name":"Marina",
        "surname":"Stella",
        "mansione":"Responsabile 'Tagliacozzo'",
        "image":"marina_stella.jpg"
    }]
```
in this case we have five different fields: 
* `id` field contains the person's id
* `name` field contains the person's first name
* `surname` field contains the person's last name
* `mansione` field contains the person's role inside Daisy's Garden.


as you may notice, the response array is alphabetically ordered taking into consideration the `surname` field.

#### how to fetch info about a single location

every location possesses three different dialogue acts, therefore it's represented by four different pages.

in order to minimize the response size, you have to send a parametric GET request in order to
obtain only info relating to a specific page. there's no way to obtain all the info in only one response.

the GET request you have to send is the following:

`http://polimi-hyp-2018-team-10508999.herokuapp.com/api/locations/<location_id>?page=<name>`

you have to substitute `<location_id>` with the proper ID of the location you chose, 
and substitute the `<name>` parameter with the name relating to the page you want to see.

correct names to be placed in the `<name>` field are:

+ `desc`
+ `map`
+ `contacts`

##### Examples using different 'name' parameters
for `?page=desc` you will receive a JSON like this:
``` 
[{
    "id":1,
    "name":"Augusta",
    "description": *some descriptive text you may not want to read now*,
    "image":"location1.jpg"
    }]
```

the `image` field contains the image name relating to the specific location, while the 
`description` field contains descriptive text that is then inserted into the webpage.

for `?page=map` you will receive a JSON like this:
```
[{  
    "id":1,
    "name":"Augusta",
    "address":"Via Giuseppe di Vittorio, Augusta (SR)",
    "orari":"09:00-18:00",
    "image":"location1.jpg",
    "lat":"37.2490889",
    "lng":"15.2233656",
    "calendar":"Lun-Ven"
    }]
```
the `lat` and `long` fields represents the geographical coordinates of our location
which are used in order to respresent the location on the map. we also have some 
other fields like `calendar` which contains the days of the week in which our location
is open to the public, or `orari` which represents the opening time of our
location. finally, we have an `address` field which represents the location's
address as shown in the map and in the page informations.


for `?name=contacts` the response will be like this:

```
[{
    "id":1,
    "name":"Augusta",
    "mail":"segreteria.augusta@dgarden.it",
    "image":"location1.jpg",
    "tel":"800 800 123",
    "manager_name":"Franco",
    "manager_surname":"Forte",
    "manager_id":7,
    "manager_mail":"franco.forte@dgarden.com"
    }]
```

as you may see, more than the usual contact informations regarding the chosen location
we pass back also info about the manager of that location, such as `manager_name ` and 
`manager_surname` which represents respectively the manager's first and last name, 
or `manager_mail` which contains the manager's prersonal e-mail.


#### how to fetch info about a single service

#### how to fetch a list about services issued in a specific location

#### how to fetch which locations are related to a single service

#### how to fetch which people are related to a single service

#### how to fetch a list of services related to a single person

#### how to fetch footer infos