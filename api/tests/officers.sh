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
expected01=10
curl --silent -o ./output/test-50.result.json \
  --request DELETE \
  --url $url
length=$(cat ./output/test-50.result.json \
  | jq --raw-output '.n')
if [ "$length" == "$expected01" ]
then printf "${G}SUCCESS...$length${C}\n";
else printf "${R}FAILURE...$expected01 != $length${C}\n";
fi

# insertMany officers
printf "${P}Test #51:${C} POST $url/:{officers}..."
expected01=18
curl --silent -o ./output/test-51.result.json \
  --request POST \
  --url $url \
  --header 'Content-Type: application/json' \
  --data "@./input/officers.json"
length=$(cat ./output/test-51.result.json \
  | jq --raw-output '.result.n')
if [ "$length" == "$expected01" ];
then printf "${G}SUCCESS...$length${C}\n";
else printf "${R}FAILURE...$expected01 != $length${C}\n";
fi

# insert one officer
printf "${P}Test #52:${C} POST $url/:{officer}..."
expected01='Delrusso'
curl --silent -o ./output/test-52.result.json \
  --request POST \
  --url $url \
  --header 'Content-Type: application/json' \
  --data "@./input/officer.json"
lastName=$(cat ./output/test-52.result.json \
  | jq --raw-output '.ops[0].name.last')
if [ "$lastName" == "$expected01" ];
then printf "${G}SUCCESS...$lastName${C}\n";
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
if [ "$lastName" == "$expected01" ] && [ $length == $expected02 ];
then printf "${G}SUCCESS...$lastName and $length${C}\n";
else printf "${R}FAILURE...$expected01 != $lastName and $expected02 != $length${C}\n";
fi

# post an empty body in the request
printf "${P}Test #54:${C} POST $url/:{null}..."
expected01='nothing to insert'
curl --silent -o ./output/test-54.result.json \
  --request POST \
  --url $url \
  --header 'Content-Type: application/json' \
  --data "@./input/emptyBody.json"
length=$(cat ./output/test-54.result.json \
  | jq --raw-output '.error')
if [ "$length" == "$expected01" ];
then printf "${G}SUCCESS...$length${C}\n";
else printf "${R}FAILURE...$expected01 != $length${C}\n";
fi

# save _id of an officer
objectID=$(cat ./output/test-53.result.json \
  | jq --raw-output '.[7]._id')

# get an officer by _id
printf "${P}Test #55:${C} GET $url/$objectID..."
expected01=655
expected02='Bolo'
curl --silent -o ./output/test-55.result.json \
  --request GET \
  --url $url/$objectID
deptID=$(cat ./output/test-55.result.json \
  | jq --raw-output '.[0].deptID')
lastName=$(cat ./output/test-55.result.json \
  | jq --raw-output '.[0].name.last')
if [ $deptID == $expected01 ] && [ $lastName == $expected02 ];
then printf "${G}SUCCESS...$deptID and $lastName${C}\n";
else printf "${R}FAILURE...$expected01 != $deptID and $expected02 != $lastName${C}\n";
fi

# replace an officer by _id
printf "${P}Test #56:${C} PUT $url/$objectID/:{officer}..."
expected01=1
expected02=1
curl --silent -o ./output/test-56.result.json \
  --request PUT \
  --url $url/$objectID \
  --header 'Content-Type: application/json' \
  --data "@./input/updateOfc01.json"
n=$(cat ./output/test-56.result.json \
  | jq --raw-output '.n')
nModified=$(cat ./output/test-56.result.json \
  | jq --raw-output '.nModified')
if [ $n == $expected01 ] && [ $nModified == $expected02 ];
then printf "${G}SUCCESS...$n and $nModified${C}\n";
else printf "${R}FAILURE...$expected01 != $n and $expected02 != $nModified${C}\n";
fi

# replace an officer by deptID
printf "${P}Test #57:${C} PUT $url/deptID/545/:{officer}..."
expected01=1
expected02=1
curl --silent -o ./output/test-57.result.json \
  --request PUT \
  --url $url/deptID/545 \
  --header 'Content-Type: application/json' \
  --data "@./input/updateOfc02.json"
n=$(cat ./output/test-57.result.json \
  | jq --raw-output '.n')
nModified=$(cat ./output/test-57.result.json \
  | jq --raw-output '.nModified')
if [ $n == $expected01 ] && [ $nModified == $expected02 ];
then printf "${G}SUCCESS...$n and $nModified${C}\n";
else printf "${R}FAILURE...$expected01 != $n and $expected02 != $nModified${C}\n";
fi

# replace an officer by deptID, pass an empty body in the request
printf "${P}Test #58:${C} PUT $url/deptID/545/:{null}..."
expected01="document must be a valid JavaScript object"
curl --silent -o ./output/test-58.result.json \
  --request PUT \
  --url $url/deptID/545 \
  --header 'Content-Type: application/json' \
  --data "@./input/emptyBody.json"
error=$(cat ./output/test-58.result.json \
  | jq --raw-output '.error')
if [ "$error" == "$expected01" ];
then printf "${G}SUCCESS...$error${C}\n";
else printf "${R}FAILURE...$expected01 != $error${C}\n";
fi

# get an officer by query
printf "${P}Test #59:${C} GET $url\:{query}..."
expected01='Done'
expected02=3
curl --silent -o ./output/test-59.result.json \
  --request GET \
  --url $url \
  --header 'Content-Type: application/json' \
  --data "@./input/findOfcQuery.json"
lastName=$(cat ./output/test-59.result.json \
  | jq --raw-output '.[1].name.last')
length=$(cat ./output/test-59.result.json \
  | jq --raw-output '. | length')
if [ "$lastName" == "$expected01" ] && [ $length == $expected02 ];
then printf "${G}SUCCESS...$lastName and $length${C}\n";
else printf "${R}FAILURE...$expected01 != $lastName and $expected02 != $length${C}\n";
fi

# get officers by squad
printf "${P}Test #60:${C} GET $url/squad/c..."
expected01='Singh'
expected02=7
curl --silent -o ./output/test-60.result.json \
  --request GET \
  --url $url/squad/c
lastName=$(cat ./output/test-60.result.json \
  | jq --raw-output '.[1].name.last')
length=$(cat ./output/test-60.result.json \
  | jq --raw-output '. | length')
if [ "$lastName" == "$expected01" ] && [ $length == $expected02 ];
then printf "${G}SUCCESS...$lastName and $length${C}\n";
else printf "${R}FAILURE...$expected01 != $lastName and $expected02 != $length${C}\n";
fi

# delete an officer by deptID
printf "${P}Test #61:${C} DELETE $url/$objectID..."
expected01=1
expected02=1
curl --silent -o ./output/test-61.result.json \
  --request DELETE \
  --url $url/$objectID
n=$(cat ./output/test-61.result.json \
  | jq --raw-output '.n')
ok=$(cat ./output/test-61.result.json \
  | jq --raw-output '.ok')
if [ "$n" == "$expected01" ] && [ $ok == $expected02 ];
then printf "${G}SUCCESS...$n and $ok${C}\n";
else printf "${R}FAILURE...$expected01 != $n and $expected02 != $ok${C}\n";
fi

# delete an officer by _id
printf "${P}Test #62:${C} DELETE $url/deptID/531..."
expected01=1
expected02=1
curl --silent -o ./output/test-62.result.json \
  --request DELETE \
  --url $url/deptID/531
n=$(cat ./output/test-62.result.json \
  | jq --raw-output '.n')
ok=$(cat ./output/test-62.result.json \
  | jq --raw-output '.ok')
if [ "$n" == "$expected01" ] && [ $ok == $expected02 ];
then printf "${G}SUCCESS...$n and $ok${C}\n";
else printf "${R}FAILURE...$expected01 != $n and $expected02 != $ok${C}\n";
fi

# delete an officer by query
printf "${P}Test #63:${C} DELETE $url/:{query}..."
expected01=3
expected02=1
curl --silent -o ./output/test-63.result.json \
  --request DELETE \
  --url $url \
  --header 'Content-Type: application/json' \
  --data "@./input/findOfcQuery.json"
n=$(cat ./output/test-63.result.json \
  | jq --raw-output '.n')
ok=$(cat ./output/test-63.result.json \
  | jq --raw-output '.ok')
if [ "$n" == "$expected01" ] && [ $ok == $expected02 ];
then printf "${G}SUCCESS...$n and $ok${C}\n";
else printf "${R}FAILURE...$expected01 != $n and $expected02 != $ok${C}\n";
fi

# send a request to a bad url
printf "${P}Test #64:${C} GET $url/id/nonexistence..."
expected01=3
expected02=1
curl --silent -o ./output/test-64.result.json \
  --request GET \
  --url $url/id/nonexistence
n=$(cat ./output/test-64.result.json \
  | jq --raw-output '.n')
ok=$(cat ./output/test-64.result.json \
  | jq --raw-output '.ok')
if [ "$n" == "$expected01" ] && [ $ok == $expected02 ];
then printf "${G}SUCCESS...$n and $ok${C}\n";
else printf "${R}FAILURE...$expected01 != $n and $expected02 != $ok${C}\n";
fi
