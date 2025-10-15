// My globals - kidList holds the data, maxSessions is total
        var kidList = []; // Using var here, old habit
        let maxSessions = 300; // But let for this one, mixing it up

        // Some unused var I added by mistake, oops - leftover from testing
        var testVar = 0;

        // Kick off with some example kids, comment out if you want empty
        function startWithExamples() {
            kidList = [
                {name: "Vishal Singh", attended: 200}, // Changed names to sound more real
                {name: "Ashish Dwivedi", attended: 250},
                {name: "Pranjal Upadhyay", attended: 285}
            ];
            showTheTable(); // My function name
            updateQuickStats();
        }

        // Change the total sessions
        function changeMaxSessions() {
            var inputVal = document.getElementById('maxSessions').value;
            maxSessions = parseInt(inputVal) || 10; // Double-check parse cuz inputs can be weird
            if (maxSessions < 1) maxSessions = 1; // Extra check I added later
            doAllCalcs(); // Recalc after change
        }

        
        function addKid() {
            var nameInput = document.getElementById('kidName').value.trim();
            var attendedInput = document.getElementById('sessionsAttended').value;
            var attendedNum = parseInt(attendedInput) || 0;
            
            if (nameInput === '') {
                alert('Dude, need a name!');
                return;
            }
            
            // Check if already there - simple loop cuz I don't wanna use fancy array methods yet
            for (var i = 0; i < kidList.length; i++) {
                if (kidList[i].name.toLowerCase() === nameInput.toLowerCase()) {
                    alert('That kid is already added. Update their attended instead.');
                    return;
                }
            }
            
            if (attendedNum > maxSessions || attendedNum < 0) {
                alert('Attended has to be 0 to ' + maxSessions + '. Fix it.');
                return;
            }
            
            kidList.push({name: nameInput, attended: attendedNum});
            document.getElementById('kidName').value = ''; // Clear
            document.getElementById('sessionsAttended').value = '';
            showTheTable();
            updateQuickStats();
        }

        // Show the table - this is kinda long but it works
        function showTheTable() {
            var tbody = document.getElementById('tableRows');
            tbody.innerHTML = ''; // Wipe it clean
            
            for (var j = 0; j < kidList.length; j++) { // Using for loop, feels more straightforward
                var row = tbody.insertRow();
                var kid = kidList[j];
                row.innerHTML = `
                    <td>${kid.name}</td>
                    <td>${maxSessions}</td>
                    <td>
                        <input type="number" value="${kid.attended}" min="0" max="${maxSessions}" 
                               onchange="updateKidAttended(${j}, this.value)" style="width: 60px; padding: 4px;"> <!-- Inline style for the input -->
                    </td>
                    <td id="percent-${j}">...</td>
                    <td id="stat-${j}">...</td>
                    <td>
                        <button onclick="kickOutKid(${j})" style="background-color: #f44336; padding: 5px 10px;">Boot</button> <!-- Shorter button text -->
                    </td>
                `;
            }
        }

        // Update one kid's attended - I call this from the input change
        function updateKidAttended(index, newValue) {
            var newAtt = parseInt(newValue) || 0;
            if (newAtt > maxSessions || newAtt < 0) {
                alert('Keep it between 0 and ' + maxSessions);
                showTheTable(); // Re-show to reset the input
                return;
            }
            kidList[index].attended = newAtt;
            calcOneKid(index); // My calc function
            updateQuickStats();
        }

        // Calc for one kid - the math part
        function calcOneKid(idx) {
            var kid = kidList[idx];
            if (maxSessions === 0) { // Edge case, don't divide by zero
                document.getElementById(`percent-${idx}`).textContent = '0%';
                document.getElementById(`stat-${idx}`).textContent = 'N/A';
                return;
            }
            
            var perc = (kid.attended / maxSessions) * 100;
            document.getElementById(`percent-${idx}`).textContent = perc.toFixed(2) + '%';
            
            if (perc < 75) {
                document.getElementById(`stat-${idx}`).innerHTML = '<span class="alertLow">Heads up: Low attendance!</span>'; // More casual warning text
            } else {
                document.getElementById(`stat-${idx}`).innerHTML = '<span class="okStatus">All good</span>';
            }
        }

        // Do calcs for everyone
        function doAllCalcs() {
            for (var k = 0; k < kidList.length; k++) {
                calcOneKid(k);
            }
            updateQuickStats();
        }

        // Remove a kid
        function kickOutKid(idx) {
            if (confirm('You sure? Removing ' + kidList[idx].name)) {
                kidList.splice(idx, 1);
                showTheTable();
                updateQuickStats();
            }
        }

        // Update the summary - counts the slackers
        function updateQuickStats() {
            document.getElementById('kidCount').textContent = 'Kids: ' + kidList.length;
            
            var slackCount = 0;
            for (var m = 0; m < kidList.length; m++) {
                if (maxSessions > 0) {
                    var kidPerc = (kidList[m].attended / maxSessions) * 100;
                    if (kidPerc < 75) slackCount++;
                }
            }
            document.getElementById('lowCount').textContent = 'Kids slacking (<75%): ' + slackCount;
        }

        // Start it up - I call this at the end
        startWithExamples(); // Comment this out for no examples