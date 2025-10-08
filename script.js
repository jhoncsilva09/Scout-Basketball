    let teamA = [];
    let teamB = [];
    let currentQuarter = 0;

    function startGame() {
      const nameA = document.getElementById("nameA").value;
      const nameB = document.getElementById("nameB").value;
      const playersAInput = document.getElementById("playersAInput").value.split(",");
      const playersBInput = document.getElementById("playersBInput").value.split(",");

      teamA = playersAInput.map(num => ({ numero: num.trim(), pontos: [0,0,0,0] }));
      teamB = playersBInput.map(num => ({ numero: num.trim(), pontos: [0,0,0,0] }));

      document.getElementById("teamAName").innerText = nameA;
      document.getElementById("teamBName").innerText = nameB;

      document.getElementById("config").style.display = "none";
      document.getElementById("scoreboard").style.display = "block";

      render();
    }

    function renderTeam(players, containerId, totalsId) {
      const container = document.getElementById(containerId);
      container.innerHTML = "";

      const table = document.createElement("table");
      let header = `
        <tr>
          <th class="col-num">Nº</th>
          <th class="col-q1">Q1</th><th class="col-q2">Q2</th><th class="col-q3">Q3</th><th class="col-q4">Q4</th>
          <th class="col-total">Total</th>
          <th>Ações</th>
        </tr>`;
      table.innerHTML = header;

      let teamTotals = [0,0,0,0];
      let teamTotalGeral = 0;

      players.forEach((p, i) => {
        const totalJogador = p.pontos.reduce((a,b) => a+b, 0);
        teamTotals = teamTotals.map((t, idx) => t + p.pontos[idx]);
        teamTotalGeral += totalJogador;

        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="col-num">${p.numero}</td>
          <td class="col-q1">${p.pontos[0]}</td>
          <td class="col-q2">${p.pontos[1]}</td>
          <td class="col-q3">${p.pontos[2]}</td>
          <td class="col-q4">${p.pontos[3]}</td>
          <td class="col-total"><b>${totalJogador}</b></td>
          <td>
            <button onclick="addPoints('${containerId}', ${i},1)">+1</button>
            <button onclick="addPoints('${containerId}', ${i},2)">+2</button>
            <button onclick="addPoints('${containerId}', ${i},3)">+3</button>
            <button onclick="removePoints('${containerId}', ${i},1)">-1</button>
            <button onclick="removePoints('${containerId}', ${i},2)">-2</button>
            <button onclick="removePoints('${containerId}', ${i},3)">-3</button>
          </td>
        `;
        table.appendChild(row);
      });

      container.appendChild(table);

      document.getElementById(totalsId).innerHTML =
        `Q1: ${teamTotals[0]} | Q2: ${teamTotals[1]} | Q3: ${teamTotals[2]} | Q4: ${teamTotals[3]} <br>
         <big>Total: ${teamTotalGeral}</big>`;
    }

    function addPoints(teamId, index, pts) {
      if (teamId === "playersA") teamA[index].pontos[currentQuarter] += pts;
      if (teamId === "playersB") teamB[index].pontos[currentQuarter] += pts;
      render();
    }

    function removePoints(teamId, index, pts) {
      if (teamId === "playersA") teamA[index].pontos[currentQuarter] = Math.max(0, teamA[index].pontos[currentQuarter] - pts);
      if (teamId === "playersB") teamB[index].pontos[currentQuarter] = Math.max(0, teamB[index].pontos[currentQuarter] - pts);
      render();
    }

    function nextQuarter() {
      if (currentQuarter < 3) {
        currentQuarter++;
        alert("Início do " + (currentQuarter+1) + "º quarto!");
        render();
      } else {
        alert("Fim da partida!");
        showHighlights();
      }
    }

    function resetGame() {
      teamA = [];
      teamB = [];
      currentQuarter = 0;

      document.getElementById("highlightA").style.display = "none";
      document.getElementById("highlightB").style.display = "none";

      document.getElementById("scoreboard").style.display = "none";
      document.getElementById("config").style.display = "block";
    }

    function showHighlights() {
      let cestinhasA = getHighlights(teamA);
      let cestinhasB = getHighlights(teamB);

      document.getElementById("highlightA").style.display = "block";
      document.getElementById("highlightB").style.display = "block";

      document.getElementById("highlightA").innerText =
        `Cestinha(s): ${cestinhasA.map(d => "Nº " + d.numero + " (" + d.pontos + " pts)").join(", ")}`;
      document.getElementById("highlightB").innerText =
        `Cestinha(s): ${cestinhasB.map(d => "Nº " + d.numero + " (" + d.pontos + " pts)").join(", ")}`;
    }

    function getHighlights(team) {
      let maiores = [];
      let maxPontos = 0;

      team.forEach(p => {
        let total = p.pontos.reduce((a,b) => a+b, 0);
        if (total > maxPontos) {
          maxPontos = total;
          maiores = [{ numero: p.numero, pontos: total }];
        } else if (total === maxPontos && total > 0) {
          maiores.push({ numero: p.numero, pontos: total });
        }
      });

      return maiores.length > 0 ? maiores : [{ numero: "-", pontos: 0 }];
    }

    function render() {
      renderTeam(teamA, "playersA", "totalsA");
      renderTeam(teamB, "playersB", "totalsB");
    }
