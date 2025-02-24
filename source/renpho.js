// grab the ride ID from the URL in the browser
var rideID = window.location.pathname.split("/");
rideID = rideID[rideID.length - 1];

// peloton doesn't respond with target metrics if credentials are not included
fetch("https://api.onepeloton.com/api/ride/" + rideID + "/details?stream_source=multichannel", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "en-US",
      "peloton-platform": "web",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "x-requested-with": "XmlHttpRequest"
    },
    "referrer": "https://members.onepeloton.com/classes/player/" + rideID,
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  }).then(function (response) {
    return response.json()
  })
  .then(function (ride) {

    // renpho mapping, values in order corresponding to peloton
    var renphoResistance = [
        0, 0.5, 0.5, 0.5, 1, 1, 1.5, 1.5, 2, 2, // 0-9 => 0-1-2
        2.5, 2.5, 2.5, 3, 3, 3, 3, 3.5, 3.5, 3.5, // 10-19 2.5-3-3.5
        4, 4, 4.5, 4.5, 5, 5, 5.5, 6, 6, 6.5,  // 20-29 - 4-5-6.5
        7, 7.5, 8, 8.5, 9, 10, 11, 12, 13, 13.5,  // 30-39 7-10-13.5
        14, 14.5, 15, 16.5, 17, 17.5, 18.5, 20, 21, 22,  // 40-49 14-17.5-22
        22.5, 23, 24.5, 26, 27.5, 29, 30.5, 32, 33, 35,  // 50-59 22.5--36
        36.5, 38, 39, 40, 40, 40, 40, 40, 40, 40, // 60-69
        40, 40, 40, 40, 40, 40, 40, 40, 40, 40, // 70-79
        40, 40, 40, 40, 40, 40, 40, 40, 40, 40, // 80-89
        40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40]; // 90-100

    var classDuration = Number(ride.ride.duration);

    var cadResistDiv = document.createElement('div');
    cadResistDiv.id = 'cadresist';
    cadResistDiv.style = 'color:white; padding: 8px; border: 1px none; border-radius: 10px; background-color: rgba(0,0,0, 50%); position:absolute; top: 5%; left:36%; margin-top: 35px';
    cadResistDiv.innerHTML = '<div id="cadresisttxt" style="width:100%;color:white;text-align:center;">metrics start during warmup</div><div style="margin-top:10px;width:100%; height:2px; background-color:#555555"><div id="cadresistprogress" style="width:0%;transition:990ms linear;height:2px;background-color:white"></div></div>';
    document.querySelector("div[class='jw-wrapper jw-reset']").after(cadResistDiv);

    var cadResisTextDiv = document.getElementById('cadresisttxt');
    var cadResisProgressDiv = document.getElementById('cadresistprogress');

    //does the class have target metrics?
    if (!ride.instructor_cues.length) {
      cadResistDiv.innerHTML = "Class does not have target metrics.";
      setTimeout(function () {
        cadResistDiv.innerHTML = "";
      }, 5000);
      return;
    }

    // combinue consecutive cues that are the same
    //   some classes have lots of consecutive segments of only a couple seconds, but all with the same cadence/resistance 
    var rideCue = [];
    var cue = ride.instructor_cues[0];
    for (var i = 1; i < ride.instructor_cues.length; i++) {
      var newCue = ride.instructor_cues[i];
      if (cue.resistance_range.upper == newCue.resistance_range.upper &&
        cue.resistance_range.lower == newCue.resistance_range.lower &&
        cue.cadence_range.upper == newCue.cadence_range.upper &&
        cue.cadence_range.lower == newCue.cadence_range.lower) {
        cue.offsets.end = newCue.offsets.end;
      } else {
        rideCue.push(cue);
        cue = newCue;
      }
    }
    rideCue.push(newCue);
    ride.instructor_cues = rideCue; //overwrite original cue data

    // set an observer on the timer, triggers running the code when it changes
    //var mPar = document.querySelector("div[data-test-id='video-timer']"),
    var mPar = document.querySelector("div[class='player-overlay-wrapper']"),
      options = {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
      },
      observer = new MutationObserver(mCallback);

    function mCallback(mutations) {
      // if the course has not started (1 minute warm-up), exit
      var timestamp = document.querySelector("p[data-test-id='time-to-complete']");
      if (!timestamp) return;

      // split the mm:ss timestamp from the peloton GUI
      timestamp = timestamp.innerHTML.split(":");
      if (timestamp.length != 2) return;

      // convert mm:ss timestamp to cue timecode in the API (seconds elapsed)
      var timecode = (classDuration - (Number(timestamp[0]) * 60 + Number(timestamp[1]))) + Number(ride.ride.pedaling_start_offset);
      for (var i = 0; i < ride.instructor_cues.length; i++) {
        var cue = ride.instructor_cues[i];
        if (timecode >= Number(cue.offsets.start) && timecode <= Number(cue.offsets.end)) {
          cadResisTextDiv.innerHTML = "cadence: " + cue.cadence_range.lower + " - " + cue.cadence_range.upper + " &nbsp;&nbsp;&nbsp;&nbsp; resistance: " + renphoResistance[cue.resistance_range.lower] + " - " + renphoResistance[cue.resistance_range.upper] + "&nbsp;&nbsp;&nbsp;&nbsp; (" + cue.resistance_range.lower + " - " + cue.resistance_range.upper + ")";

          if (timecode == Number(cue.offsets.start)) {
            cadResisProgressDiv.style.transition = "none";
            cadResisProgressDiv.style.width = "0%";
          } else {
            cadResisProgressDiv.style.transition = "990ms linear";
            cadResisProgressDiv.style.width = Math.round((((timecode) - cue.offsets.start) / (cue.offsets.end - cue.offsets.start)) * 100) + "%";
          }
          return;
        }

      }

    }

    observer.observe(mPar, options);

  });
