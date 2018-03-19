#!/bin/bash

clear
now=$(date)
echo $now

O='\033[0;33m' # orange
P='\033[1;35m' # pink
G='\033[0;32m' # green
R='\033[0;31m' # red
C='\033[0m' # clear

url="localhost:3000/api/officers"

# delete the officer collection
printf "${P}Test #50:${C} DELETE $url..."
testValue1=19
curl --silent -o ./output/test-50.result.json \
  --request DELETE \
  --url $url
length=$(cat ./output/test-50.result.json \
  | jq --raw-output '.n')
if [ $length == $testValue1 ]
then printf "${G}SUCCESS...$testValue1 == $length${C}\n";
else printf "${R}FAILURE...$testValue1 != $length${C}\n";
fi

# insertMany officers
printf "${P}Test #51:${C} POST $url..."
testValue1=18
curl --silent -o ./output/test-51.result.json \
  --request POST \
  --url $url \
  --header 'Content-Type: application/json' \
  --data "@./input/officers.json"
length=$(cat ./output/test-51.result.json \
  | jq --raw-output '.result.n')
if [ $length == $testValue1 ];
then printf "${G}SUCCESS...$testValue1 == $length${C}\n";
else printf "${R}FAILURE...$testValue1 != $length${C}\n";
fi

# insert one officer
printf "${P}Test #52:${C} POST $url..."
testValue1='Delrusso'
curl --silent -o ./output/test-52.result.json \
  --request POST \
  --url $url \
  --header 'Content-Type: application/json' \
  --data "@./input/officer.json"
lastName=$(cat ./output/test-52.result.json \
  | jq --raw-output '.ops[0].name.last')
if [ $lastName == $testValue1 ];
then printf "${G}SUCCESS...$testValue1 == $lastName${C}\n";
else printf "${R}FAILURE...$testValue1 != $lastName${C}\n";
fi

# get all episodes
printf "${P}Test #53:${C} GET $url..."
testValue1='Raquan'
testValue2=19
curl --silent -o ./output/test-53.result.json \
  --request GET \
  --url $url
lastName=$(cat ./output/test-53.result.json \
  | jq --raw-output '.[17].name.last')
length=$(cat ./output/test-53.result.json \
  | jq '. | length')
if [ $lastName == $testValue1 ] && [ $length == $testValue2 ];
then printf "${G}SUCCESS...$testValue1 == $lastName and $testValue2 == $length${C}\n";
else printf "${R}FAILURE...$testValue1 != $lastName and $testValue2 != $length${C}\n";
fi

# get an officer by _id
# replace an officer by _id
# get an officer by query
# get officers by squad
# delete an officer by deptID
# delete an officer by _id
# delete an officer by query
