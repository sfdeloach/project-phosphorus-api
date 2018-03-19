#!/bin/bash

clear
now=$(date)
echo $now

R='\033[0;31m' # red
G='\033[0;32m' # green
O='\033[0;33m' # orange
P='\033[1;35m' # pink
C='\033[0m' # clear

url="localhost:3000/api/officers"

# delete the officer collection
printf "${P}Test #50:${C} DELETE $url..."
expected01=19
curl --silent -o ./output/test-50.result.json \
  --request DELETE \
  --url $url
length=$(cat ./output/test-50.result.json \
  | jq --raw-output '.n')
if [ $length == $expected01 ]
then printf "${G}SUCCESS...$expected01 == $length${C}\n";
else printf "${R}FAILURE...$expected01 != $length${C}\n";
fi

# insertMany officers
printf "${P}Test #51:${C} POST $url..."
expected01=18
curl --silent -o ./output/test-51.result.json \
  --request POST \
  --url $url \
  --header 'Content-Type: application/json' \
  --data "@./input/officers.json"
length=$(cat ./output/test-51.result.json \
  | jq --raw-output '.result.n')
if [ $length == $expected01 ];
then printf "${G}SUCCESS...$expected01 == $length${C}\n";
else printf "${R}FAILURE...$expected01 != $length${C}\n";
fi

# insert one officer
printf "${P}Test #52:${C} POST $url..."
expected01='Delrusso'
curl --silent -o ./output/test-52.result.json \
  --request POST \
  --url $url \
  --header 'Content-Type: application/json' \
  --data "@./input/officer.json"
lastName=$(cat ./output/test-52.result.json \
  | jq --raw-output '.ops[0].name.last')
if [ $lastName == $expected01 ];
then printf "${G}SUCCESS...$expected01 == $lastName${C}\n";
else printf "${R}FAILURE...$expected01 != $lastName${C}\n";
fi

# get all episodes
printf "${P}Test #53:${C} GET $url..."
expected01='Raquan'
expected02=19
curl --silent -o ./output/test-53.result.json \
  --request GET \
  --url $url
lastName=$(cat ./output/test-53.result.json \
  | jq --raw-output '.[17].name.last')
length=$(cat ./output/test-53.result.json \
  | jq --raw-output '. | length')
if [ $lastName == $expected01 ] && [ $length == $expected02 ];
then printf "${G}SUCCESS...$expected01 == $lastName and $expected02 == $length${C}\n";
else printf "${R}FAILURE...$expected01 != $lastName and $expected02 != $length${C}\n";
fi

# save _id of an officer
objectID=$(cat ./output/test-53.result.json \
  | jq --raw-output '.[7]._id')

# get an officer by _id
printf "${P}Test #54:${C} GET $url..."
expected01='Raquan'
expected02=19
curl --silent -o ./output/test-54.result.json \
  --request GET \
  --url $url
lastName=$(cat ./output/test-54.result.json \
  | jq --raw-output '.[17].name.last')
length=$(cat ./output/test-54.result.json \
  | jq '. | length')
if [ $lastName == $expected01 ] && [ $length == $expected02 ];
then printf "${G}SUCCESS...$expected01 == $lastName and $expected02 == $length${C}\n";
else printf "${R}FAILURE...$expected01 != $lastName and $expected02 != $length${C}\n";
fi

# replace an officer by _id
# get an officer by query
# get officers by squad
# delete an officer by deptID
# delete an officer by _id
# delete an officer by query
