#!/bin/bash

now=$(date)
echo $now

O='\033[0;33m'
B='\033[1;35m'
C='\033[0m'

url="localhost:3000/api/episodes"

# delete the episode collection
printf "\nTest #0: DELETE $url"
printf " - drop the entire collection of episodes\n"
curl --silent -o ./output/test-00.result.json \
  --request DELETE \
  --url $url
curl --silent \
  --request GET \
  --url $url | \
  jq '{ episodes: . }'
printf "expected ${B}"
stat --printf="%s" ./output/test-00.expected.json
printf "${C} bytes, received ${B}"
stat --printf="%s" ./output/test-00.result.json
printf "${C} bytes \n"
echo "-------------------------------------------------------------------------"

# insertMany episodes
printf "\nTest #1: POST $url"
printf " - insert ${O}12${C} episodes\n"
curl --silent -o ./output/test-01.result.json \
  --request POST \
  --url $url \
  --header 'Content-Type: application/json' \
  --data "@./input/episodes.json"
curl --silent \
  --request GET \
  --url $url | \
  jq '{ number_of_episodes: . | length}'
printf "expected ${B}"
stat --printf="%s" ./output/test-01.expected.json
printf "${C} bytes, received ${B}"
stat --printf="%s" ./output/test-01.result.json
printf "${C} bytes \n"
echo "-------------------------------------------------------------------------"

# insert a single episode
printf "\nTest #2: POST $url"
printf "\n..insert 1 episode to make a total ${O}13${C}\n"
curl --silent -o ./output/test-02.result.json \
  --request POST \
  --url $url \
  --header 'Content-Type: application/json' \
  --data "@./input/episode.json"
curl --silent \
  --request GET \
  --url $url | \
  jq '{ number_of_episodes: . | length}'
printf "expected ${B}"
stat --printf="%s" ./output/test-02.expected.json
printf "${C} bytes, received ${B}"
stat --printf="%s" ./output/test-02.result.json
printf "${C} bytes \n"
echo "-------------------------------------------------------------------------"

# get all episodes
printf "\nTest #3: GET $url"
printf "\n..retrieve all episodes\n"
curl --silent -o ./output/test-03.result.json \
  --request GET \
  --url $url
printf "expected ${B}"
stat --printf="%s" ./output/test-03.expected.json
printf "${C} bytes, received ${B}"
stat --printf="%s" ./output/test-03.result.json
printf "${C} bytes \n"
echo "-------------------------------------------------------------------------"

# insert a unit via event number
printf "\nTest #4: POST $url/call/units/20170001013"
printf "\n..insert ${O}'Newman Orlando'${C} in the units array by event number\n"
curl --silent -o ./output/test-04.result.json \
  --request POST \
  --url $url/call/units/20170001013 \
  --header 'Content-Type: application/json' \
  --data "@./input/newmanOfc.json"
curl --silent \
  --request GET \
  --url $url | \
  jq '.[12] | { newOfficer: .call.units[2].name }'
printf "expected ${B}"
stat --printf="%s" ./output/test-04.expected.json
printf "${C} bytes, received ${B}"
stat --printf="%s" ./output/test-04.result.json
printf "${C} bytes \n"
echo "-------------------------------------------------------------------------"

# save the related ObjectID
objectID=$(curl --silent --request GET --url ${url} | jq -r '.[12] | ._id')

# insert a unit via object ID
printf "\nTest #5: POST $url/call/units/$objectID"
printf "\n..insert ${O}'Rick Sanchez'${C} in the units array by ObjectID\n"
curl --silent -o ./output/test-05.result.json \
  --request POST \
  --url $url/call/units/$objectID \
  --header 'Content-Type: application/json' \
  --data "@./input/sanchezOfc.json"
curl --silent \
  --request GET \
  --url $url | \
  jq '.[12] | { newOfficer: .call.units[3].name }'
printf "expected ${B}"
stat --printf="%s" ./output/test-05.expected.json
printf "${C} bytes, received ${B}"
stat --printf="%s" ./output/test-05.result.json
printf "${C} bytes \n"
echo "-------------------------------------------------------------------------"

# insert a report via id
printf "\nTest #6: POST $url/reports/$objectID"
printf "\n..insert crash report in the episode by ObjectID\n"
curl --silent -o ./output/test-06.result.json \
  --request POST \
  --url $url/reports/$objectID \
  --header 'Content-Type: application/json' \
  --data "@./input/crashReport.json"
printf "..expecting { ${O}'newReport': 'Traffic Crash'${C} }\n"
curl --silent \
  --request GET \
  --url $url | \
  jq '.[12] | { newReport: .reports[1].offenses[0].statuteDesc }'
printf "expected ${B}"
stat --printf="%s" ./output/test-06.expected.json
printf "${C} bytes, received ${B}"
stat --printf="%s" ./output/test-06.result.json
printf "${C} bytes \n"
echo "-------------------------------------------------------------------------"

# insert a report via event number
printf "\nTest #7: POST $url/reports/20170001013"
printf "\n..insert field contact report in the episode by event number\n"
curl --silent -o ./output/test-07.result.json \
  --request POST \
  --url $url/reports/20170001013 \
  --header 'Content-Type: application/json' \
  --data "@./input/fccReport.json"
printf "..expecting { ${O}'newReport': 'Non UCR - Field Contact'${C} }\n"
curl --silent \
  --request GET \
  --url $url | \
  jq '.[12] | { newReport: .reports[2].offenses[0].statuteDesc }'
printf "expected ${B}"
stat --printf="%s" ./output/test-07.expected.json
printf "${C} bytes, received ${B}"
stat --printf="%s" ./output/test-07.result.json
printf "${C} bytes \n"
echo "-------------------------------------------------------------------------"

# replace an entire episode (smaller) by event
printf "\nTest #8: PUT $url/20170992367"
printf "\n..replace an entire episode (smaller) by event number\n"
curl --silent -o ./output/test-08.result.json \
  --request PUT \
  --url $url/20170992367 \
  --header 'Content-Type: application/json' \
  --data "@./input/smallEpisode.json"
printf "..expecting { ${O}'eventType': '99MIU'${C} }\n"
curl --silent \
  --request GET \
  --url $url | \
  jq '.[11] | { eventType: .call.eventType }'
printf "expected ${B}"
stat --printf="%s" ./output/test-08.expected.json
printf "${C} bytes, received ${B}"
stat --printf="%s" ./output/test-08.result.json
printf "${C} bytes \n"
echo "-------------------------------------------------------------------------"

# save the related ObjectID
objectID=$(curl --silent --request GET --url ${url} | jq -r '.[11] | ._id')

# replace an entire episode (larger) by Object ID
printf "\nTest #9: PUT $url/$objectID"
printf "\n..replace an entire episode (larger) by Object ID\n"
curl --silent -o ./output/test-09.result.json \
  --request PUT \
  --url $url/$objectID \
  --header 'Content-Type: application/json' \
  --data "@./input/largeEpisode.json"
printf "..expecting { ${O}'eventType': '01IU'${C} }\n"
curl --silent \
  --request GET \
  --url $url | \
  jq '.[11] | { eventType: .call.eventType }'
printf "expected ${B}"
stat --printf="%s" ./output/test-09.expected.json
printf "${C} bytes, received ${B}"
stat --printf="%s" ./output/test-09.result.json
printf "${C} bytes \n"
echo "-------------------------------------------------------------------------"

# get episodes within a date range
printf "\nTest 10: GET $url/call/created/2017-10-01/2017-10-25"
printf "\n..retrieve episodes from 10/01/17 to 10/25/17\n"
printf "..expecting { ${O}'number_of_episodes': 5${C} }\n"
curl --silent -o ./output/test-10.result.json\
  --request GET \
  --url $url/call/created/2017-10-01/2017-10-25
cat ./output/test-10.result.json | jq '. | { number_of_episodes: length}'
printf "expected ${B}"
stat --printf="%s" ./output/test-10.expected.json
printf "${C} bytes, received ${B}"
stat --printf="%s" ./output/test-10.result.json
printf "${C} bytes \n"
echo "-------------------------------------------------------------------------"

# get an episode by event number
printf "\nTest 11: GET $url/call/eventNbr/20170001023"
printf "\n..find an episode by event number\n"
printf "..expecting { ${O}'eventType': '50IR'${C} }\n"
curl --silent -o ./output/test-11.result.json\
  --request GET \
  --url $url/call/eventNbr/20170001023
cat ./output/test-11.result.json | jq '.[0] | { eventType: .call.eventType }'
printf "expected ${B}"
stat --printf="%s" ./output/test-11.expected.json
printf "${C} bytes, received ${B}"
stat --printf="%s" ./output/test-11.result.json
printf "${C} bytes \n"
echo "-------------------------------------------------------------------------"

# find episode by :caseNbr = report.caseNbr
printf "\nTest 12: GET $url/reports/caseNbr/2017CJ003476"
printf "\n..find an episode by case number\n"
printf "..expecting { ${O}'statuteDesc': 'You got me!'${C} }\n"
curl --silent -o ./output/test-12.result.json\
  --request GET \
  --url $url/reports/caseNbr/2017CJ003476
cat ./output/test-12.result.json | jq '.[0] | { statuteDesc: .reports[0].offenses[0].statuteDesc }'
printf "expected ${B}"
stat --printf="%s" ./output/test-12.expected.json
printf "${C} bytes, received ${B}"
stat --printf="%s" ./output/test-12.result.json
printf "${C} bytes \n"
echo "-------------------------------------------------------------------------"

# find episodes by primaryUnit
printf "\nTest 13: GET $url/call/primaryUnit/deptID/531"
printf "\n..find episodes by primaryUnit\n"
printf "..expecting { ${O}'number': 2${C} }\n"
curl --silent -o ./output/test-13.result.json\
  --request GET \
  --url $url/call/primaryUnit/deptID/531
cat ./output/test-13.result.json | jq '. | { number: length }'
printf "expected ${B}"
stat --printf="%s" ./output/test-13.expected.json
printf "${C} bytes, received ${B}"
stat --printf="%s" ./output/test-13.result.json
printf "${C} bytes \n"
echo "-------------------------------------------------------------------------"

# return one episode by Object ID
printf "\nTest 14: GET $url/$objectID\n"
printf "..return one episode by Object ID\n"
printf "..expecting ${O}'Big Ass Episode'${C}\n"
curl --silent -o ./output/test-14.result.json \
  --request GET \
  --url $url/$objectID
cat ./output/test-14.result.json | jq '.[0].call.src'
printf "expected ${B}"
stat --printf="%s" ./output/test-14.expected.json
printf "${C} bytes, received ${B}"
stat --printf="%s" ./output/test-14.result.json
printf "${C} bytes \n"
echo "-------------------------------------------------------------------------"

# delete episodes via query: {"call.created": {"$gte": "2017-11-15T00:00:00.000Z","$lt": "2018-03-01T00:00:00.000Z"}}
printf "\nTest #15: DELETE $url\n"
printf "..delete episodes via query\n"
printf "..expecting { ${O}'n': 3${C} }\n"
curl --silent -o ./output/test-15.result.json \
  --request DELETE \
  --url $url/ \
  --header 'Content-Type: application/json' \
  --data "@./input/deleteQuery.json"
cat ./output/test-15.result.json | jq '. | { n: .n }'
printf "expected ${B}"
stat --printf="%s" ./output/test-15.expected.json
printf "${C} bytes, received ${B}"
stat --printf="%s" ./output/test-15.result.json
printf "${C} bytes \n"
echo "-------------------------------------------------------------------------"

# remove all reports given a case number
printf "\nTest #16: DELETE $url/reports/caseNbr/201710002321\n"
printf "..remove all reports given a case number\n"
printf "..expecting { ${O}'n': 2${C} }\n"
curl --silent -o ./output/test-16.result.json \
  --request DELETE \
  --url $url/reports/caseNbr/201710002321
cat ./output/test-16.result.json | jq '. | { n: .n }'
printf "expected ${B}"
stat --printf="%s" ./output/test-16.expected.json
printf "${C} bytes, received ${B}"
stat --printf="%s" ./output/test-16.result.json
printf "${C} bytes \n"
echo "-------------------------------------------------------------------------"

# remove all reports given a case number
printf "\nTest #17: DELETE $url/$objectID\n"
printf "..remove an episode via object ID\n"
printf "..expecting { ${O}'n': 1${C} }\n"
curl --silent -o ./output/test-17.result.json \
  --request DELETE \
  --url $url/$objectID
cat ./output/test-17.result.json | jq '. | { n: .n }'
printf "expected ${B}"
stat --printf="%s" ./output/test-17.expected.json
printf "${C} bytes, received ${B}"
stat --printf="%s" ./output/test-17.result.json
printf "${C} bytes \n"
echo "-------------------------------------------------------------------------"

# remove episodes within a given date range
printf "\nTest #18: DELETE $url/call/created/2017-11-01/2019-01-01\n"
printf "..remove episodes within a given date range\n"
printf "..expecting { ${O}'n': 2${C} }\n"
curl --silent -o ./output/test-18.result.json \
  --request DELETE \
  --url $url/call/created/2017-11-01/2019-01-01
cat ./output/test-18.result.json | jq '. | { n: .n }'
printf "expected ${B}"
stat --printf="%s" ./output/test-18.expected.json
printf "${C} bytes, received ${B}"
stat --printf="%s" ./output/test-18.result.json
printf "${C} bytes \n"
echo "-------------------------------------------------------------------------"

# with an episode matching eventNbr, remove the matching deptID
# removes Rick Sanchez
printf "\nTest #19: DELETE $url/call/units/20170001013/202\n"
printf "..with an episode matching eventNbr, remove the matching deptID\n"
printf "..expecting { ${O}'nModified': 1${C} }\n"
curl --silent -o ./output/test-19.result.json \
  --request DELETE \
  --url $url/call/units/20170001013/202
cat ./output/test-19.result.json | jq '. | { nModified: .nModified }'
printf "expected ${B}"
stat --printf="%s" ./output/test-19.expected.json
printf "${C} bytes, received ${B}"
stat --printf="%s" ./output/test-19.result.json
printf "${C} bytes \n"
echo "-------------------------------------------------------------------------"

# save the related ObjectID
objectID=$(curl --silent --request GET --url ${url} | jq -r '.[6] | ._id')

# with an episode matching object ID, remove the matching deptID
# removes Kyle Baker
printf "\nTest #20: DELETE $url/call/units/$objectID/101\n"
printf "..with an episode matching object ID, remove the matching deptID\n"
printf "..expecting { ${O}'nModified': 1${C} }\n"
curl --silent -o ./output/test-20.result.json \
  --request DELETE \
  --url $url/call/units/$objectID/101
cat ./output/test-20.result.json | jq '. | { nModified: .nModified }'
printf "expected ${B}"
stat --printf="%s" ./output/test-20.expected.json
printf "${C} bytes, received ${B}"
stat --printf="%s" ./output/test-20.result.json
printf "${C} bytes \n"
echo "-------------------------------------------------------------------------"

# test episode wildcard route
curl --silent -o ./output/test-21.result.json \
  --request POST \
  --url $url/does-not-exist

# test application wildcard route
curl --silent -o ./output/test-23.result.json \
  --request PUT \
  --url localhost:3000/apples/this-is-not-a-route

# test malformed episode URLs
curl --silent -o ./output/test-22.result.json \
  --request GET \
  --url $url/this-is-not-an-id-or-event-number
curl --silent -o ./output/test-24.result.json \
  --request DELETE \
  --url $url/this-is-not-an-id-or-event-number

# find episodes via query located @./input/findQuery.json
printf "\nTest #25: FIND $url\n"
printf "..find episodes via query\n"
printf "..expecting ${O}'Deltona'${C}\n"
curl --silent -o ./output/test-25.result.json \
  --request GET \
  --url $url/ \
  --header 'Content-Type: application/json' \
  --data "@./input/findQuery.json"
cat ./output/test-25.result.json | jq '.[0].call.primaryUnit.name.last'
printf "expected ${B}"
stat --printf="%s" ./output/test-25.expected.json
printf "${C} bytes, received ${B}"
stat --printf="%s" ./output/test-25.result.json
printf "${C} bytes \n"
echo "-------------------------------------------------------------------------"
echo "                             TESTS COMPLETE                              "
echo "-------------------------------------------------------------------------"
