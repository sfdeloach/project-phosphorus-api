#!/bin/bash

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
printf "expected "
stat --printf="%s" ./output/test-00.expected.json
printf " bytes, received "
stat --printf="%s" ./output/test-00.result.json
printf " bytes \n"
echo "-------------------------------------------------------"

# insertMany episodes
printf "\nTest #1: POST $url"
printf " - insert 12 episodes\n"
curl --silent -o ./output/test-01.result.json \
  --request POST \
  --url $url \
  --header 'Content-Type: application/json' \
  --data "@./input/episodes.json"
curl --silent \
  --request GET \
  --url $url | \
jq '{ number_of_episodes: . | length}'
printf "expected "
stat --printf="%s" ./output/test-01.expected.json
printf " bytes, received "
stat --printf="%s" ./output/test-01.result.json
printf " bytes \n"
echo "-------------------------------------------------------"

# insert a single episode
printf "\nTest #2: POST $url"
printf "\n..insert 1 episode\n"
curl --silent -o ./output/test-02.result.json \
  --request POST \
  --url $url \
  --header 'Content-Type: application/json' \
  --data "@./input/episode.json"
curl --silent \
  --request GET \
  --url $url | \
jq '{ number_of_episodes: . | length}'
printf "expected "
stat --printf="%s" ./output/test-02.expected.json
printf " bytes, received "
stat --printf="%s" ./output/test-02.result.json
printf " bytes \n"
echo "-------------------------------------------------------"

# get all episodes
printf "\nTest #3: GET $url"
printf "\n..retrieve all episodes\n"
curl --silent -o ./output/test-03.result.json \
  --request GET \
  --url $url
printf "expected "
stat --printf="%s" ./output/test-03.expected.json
printf " bytes, received "
stat --printf="%s" ./output/test-03.result.json
printf " bytes \n"
echo "-------------------------------------------------------"

# insert a unit via event number
printf "\nTest #4: POST $url/call/units/20170001013"
printf "\n..insert 'Orlando Newman' in the units array by event number\n"
curl --silent -o ./output/test-04.result.json \
  --request POST \
  --url $url/call/units/20170001013 \
  --header 'Content-Type: application/json' \
  --data "@./input/newmanOfc.json"
curl --silent \
  --request GET \
  --url $url | \
jq '.[12] | { newOfficer: .call.units[2].name }'
printf "expected "
stat --printf="%s" ./output/test-04.expected.json
printf " bytes, received "
stat --printf="%s" ./output/test-04.result.json
printf " bytes \n"
echo "-------------------------------------------------------"

# save the related ObjectID
objectID=$(curl --silent --request GET --url ${url} | jq -r '.[12] | ._id')

# insert a unit via object ID
printf "\nTest #5: POST $url/call/units/$objectID"
printf "\n..insert 'Rick Sanchez' in the units array by ObjectID\n"
curl --silent -o ./output/test-05.result.json \
  --request POST \
  --url $url/call/units/$objectID \
  --header 'Content-Type: application/json' \
  --data "@./input/sanchezOfc.json"
curl --silent \
  --request GET \
  --url $url | \
jq '.[12] | { newOfficer: .call.units[3].name }'
printf "expected "
stat --printf="%s" ./output/test-05.expected.json
printf " bytes, received "
stat --printf="%s" ./output/test-05.result.json
printf " bytes \n"
echo "-------------------------------------------------------"

# insert a report via id
printf "\nTest #6: POST $url/reports/$objectID"
printf "\n..insert crash report in the episode by ObjectID\n"
curl --silent -o ./output/test-06.result.json \
  --request POST \
  --url $url/reports/$objectID \
  --header 'Content-Type: application/json' \
  --data "@./input/crashReport.json"
curl --silent \
  --request GET \
  --url $url | \
jq '.[12] | { newReport: .reports[1].offenses[0].statuteDesc }'
printf "expected "
stat --printf="%s" ./output/test-06.expected.json
printf " bytes, received "
stat --printf="%s" ./output/test-06.result.json
printf " bytes \n"
echo "-------------------------------------------------------"

# insert a report via event number
printf "\nTest #7: POST $url/reports/20170001013"
printf "\n..insert field contact report in the episode by event number\n"
curl --silent -o ./output/test-07.result.json \
  --request POST \
  --url $url/reports/20170001013 \
  --header 'Content-Type: application/json' \
  --data "@./input/fccReport.json"
curl --silent \
  --request GET \
  --url $url | \
jq '.[12] | { newReport: .reports[2].offenses[0].statuteDesc }'
printf "expected "
stat --printf="%s" ./output/test-07.expected.json
printf " bytes, received "
stat --printf="%s" ./output/test-07.result.json
printf " bytes \n"
echo "-------------------------------------------------------"

# replace an entire episode (smaller)
# replace an entire episode (larger)
