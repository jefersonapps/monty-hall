let cumulative_wins = [];

async function monty_hall_simulator(num_simulations, Switch = false) {
  const runSimulatorBtn = document.getElementById("run-simulator-btn");
  runSimulatorBtn.classList.add("disable");
  runSimulatorBtn.textContent = "Simulando ...";

  let tableNum = document.querySelectorAll("table").length + 1;

  let exportBtn = document.createElement("button");
  exportBtn.id = "export-btn" + tableNum;
  exportBtn.className =
    "export-btn bg-blue-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded";
  exportBtn.textContent = "Download CSV";
  const validate = Switch
    ? "Resultados das simulações trocando sempre de porta"
    : "Resultados das simulações mantendo sempre a mesma porta";

  exportBtn.setAttribute("onclick", `exportTableToCSV('${validate}', ${0})`);

  document.body.appendChild(exportBtn);

  let table = document.createElement("table");
  table.id = "table-0";
  const title = Switch
    ? "Resultados das simulações trocando sempre de porta"
    : "Resultados das simulações mantendo sempre a mesma porta";
  table.innerHTML = Switch
    ? `
    <h2>${title}</h2>
    <thead>
      <tr>
        <th>Nº da simulação</th>
        <th>Porta com prêmio</th>
        <th>Porta escolhida</th>
        <th>Porta final escolhida</th>
        <th>Porta aberta por Monty</th>
        <th>Vitória</th>
        <th>Derrota</th>
      </tr>
    </thead>
    <tbody></tbody>
  `
    : `
    <h2>${title}</h2>
    <thead>
      <tr>
        <th>Nº da simulação</th>
        <th>Porta com prêmio</th>
        <th>Porta escolhida</th>
        <th>Porta aberta por Monty</th>
        <th>Vitória</th>
        <th>Derrota</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  document.body.appendChild(table);

  let wins = 0;
  let losses = 0;

  let tbody = table.querySelector("tbody");

  for (let i = 0; i < num_simulations; i++) {
    let simulations_number = document.querySelector("#simulations_number");
    simulations_number.innerHTML = `${i + 1}`;

    let doorsContainer = document.createElement("div");
    doorsContainer.classList.add("doors-container");

    doorsContainer.addEventListener("animationend", async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      doorsContainer.remove();
    });

    let door1 = document.createElement("div");
    door1.classList.add("door");
    doorsContainer.appendChild(door1);

    let door2 = document.createElement("div");
    door2.classList.add("door");
    doorsContainer.appendChild(door2);

    let door3 = document.createElement("div");
    door3.classList.add("door");
    doorsContainer.appendChild(door3);

    document.body.appendChild(doorsContainer);

    let doors = [0, 0, 0];
    let prize_door = Math.floor(Math.random() * 3);

    doors[prize_door] = 1;

    doorsContainer.children[prize_door].classList.add("prize-door");

    let player_choice = Math.floor(Math.random() * 3);

    doorsContainer.children[player_choice].classList.add("player-choice");

    let monty_choices = Array.from({ length: 3 }, (_, i) => i).filter(
      (i) => i !== prize_door && i !== player_choice
    );
    let monty_choice =
      monty_choices[Math.floor(Math.random() * monty_choices.length)];

    doorsContainer.children[monty_choice].classList.add("monty-choice");

    doorsContainer.children[monty_choice].classList.add("open");

    let oldPlayerChoice = player_choice;

    if (Switch) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      doorsContainer.children[player_choice].classList.remove("player-choice");
      let player_choices = Array.from({ length: 3 }, (_, i) => i).filter(
        (i) => i !== player_choice && i !== monty_choice
      );
      player_choice =
        player_choices[Math.floor(Math.random() * player_choices.length)];

      doorsContainer.children[player_choice].classList.add("player-choice");
    }

    if (doors[player_choice] === 1) {
      wins += 1;
    } else {
      losses += 1;
    }

    cumulative_wins.push(wins);

    let row = document.createElement("tr");
    row.innerHTML = Switch
      ? `
      <td>${i + 1}</td>
      <td>${prize_door + 1}</td>
      <td>${oldPlayerChoice + 1}</td>
      <td>${player_choice + 1}</td>
      <td>${monty_choice + 1}</td>
      <td>${doors[player_choice] === 1 ? "1" : "0"}</td>
      <td>${doors[player_choice] !== 1 ? "1" : "0"}</td>
    `
      : `
      <td>${i + 1}</td>
      <td>${prize_door + 1}</td>
      <td>${player_choice + 1}</td>
      <td>${monty_choice + 1}</td>
      <td>${doors[player_choice] === 1 ? "1" : "0"}</td>
      <td>${doors[player_choice] !== 1 ? "1" : "0"}</td>
    `;
    tbody.appendChild(row);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    let wins_number = document.querySelector("#wins_number");
    let losses_number = document.querySelector("#losses_number");

    wins_number.innerHTML = `${wins}`;
    losses_number.innerHTML = `${losses}`;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    doorsContainer.classList.add("fade-out");
    doorsContainer.children[player_choice].classList.add("fade-out");
    doorsContainer.children[prize_door].classList.add("fade-out");

    if (i + 1 === num_simulations) {
      let tableElement = document.querySelector("table");
      tableElement.classList.add("show-table");
      exportBtn.classList.add("show-btn");

      createHistogram(Switch);

      wins_number.innerHTML = `${wins} ≈ ${(
        (wins * 100) /
        num_simulations
      ).toFixed(2)}%`;
      losses_number.innerHTML = `${losses} ≈ ${(
        (losses * 100) /
        num_simulations
      ).toFixed(2)}%`;
      console.log(cumulative_wins);
    }
  }

  runSimulatorBtn.classList.remove("disable");
  runSimulatorBtn.textContent = "Simular";

  return [wins, losses];
}

function monty_hall_simulator_no_animation(num_simulations, Switch = true) {
  let tableNum = document.querySelectorAll("table").length + 1;

  let exportBtn = document.createElement("button");
  exportBtn.id = "export-btn" + tableNum;
  exportBtn.className =
    "export-btn bg-blue-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded show-btn";
  exportBtn.textContent = "Download CSV";
  const validate = Switch
    ? "Resultados das simulações trocando sempre de porta"
    : "Resultados das simulações mantendo sempre a mesma porta";

  exportBtn.setAttribute(
    "onclick",
    `exportTableToCSV('${validate}', ${tableNum})`
  );

  document.body.appendChild(exportBtn);

  let table = document.createElement("table");
  table.id = "table-" + tableNum;

  table.innerHTML = Switch
    ? `
  <h2>Resultados das simulações trocando sempre de porta</h2>
    <thead>
      <tr>
        <th>Nº da simulação</th>
        <th>Porta com prêmio</th>
        <th>Porta escolhida</th>
        <th>Porta final escolhida</th>
        <th>Porta aberta por Monty</th>
        <th>Vitória</th>
        <th>Derrota</th>
      </tr>
    </thead>
    <tbody></tbody>
  `
    : `
  <h2>Resultados das simulações mantendo sempre a mesma porta</h2>
    <thead>
      <tr>
        <th>Nº da simulação</th>
        <th>Porta com prêmio</th>
        <th>Porta escolhida</th>
        <th>Porta aberta por Monty</th>
        <th>Vitória</th>
        <th>Derrota</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  let wins = 0;
  let losses = 0;

  document.body.appendChild(table);

  let tbody = table.querySelector("tbody");

  let arrayWins = [];

  for (let i = 0; i < num_simulations; i++) {
    let doors = [0, 0, 0];
    let prize_door = Math.floor(Math.random() * 3);
    doors[prize_door] = 1;
    let player_choice = Math.floor(Math.random() * 3);
    let monty_choices = Array.from({ length: 3 }, (_, i) => i).filter(
      (i) => i !== prize_door && i !== player_choice
    );
    let monty_choice =
      monty_choices[Math.floor(Math.random() * monty_choices.length)];

    let oldPlayerChoice = player_choice;

    if (Switch) {
      let player_choices = Array.from({ length: 3 }, (_, i) => i).filter(
        (i) => i !== player_choice && i !== monty_choice
      );
      player_choice =
        player_choices[Math.floor(Math.random() * player_choices.length)];
    }

    if (doors[player_choice] === 1) {
      arrayWins.push(wins + 1);
      wins += 1;
    } else {
      arrayWins.push(wins);
      losses += 1;
    }

    let row = document.createElement("tr");
    row.innerHTML = Switch
      ? `
      <td>${i + 1}</td>
      <td>${prize_door + 1}</td>
      <td>${oldPlayerChoice + 1}</td>
      <td>${player_choice + 1}</td>
      <td>${monty_choice + 1}</td>
      <td>${doors[player_choice] === 1 ? "1" : "0"}</td>
      <td>${doors[player_choice] !== 1 ? "1" : "0"}</td>
    `
      : `
    <td>${i + 1}</td>
    <td>${prize_door + 1}</td>
    <td>${player_choice + 1}</td>
    <td>${monty_choice + 1}</td>
    <td>${doors[player_choice] === 1 ? "1" : "0"}</td>
    <td>${doors[player_choice] !== 1 ? "1" : "0"}</td>
  `;

    tbody.appendChild(row);
    let tableElement = document.querySelector("#table-" + tableNum);
    tableElement.classList.add("show-table");
  }

  return arrayWins;
}

function createLineGraph(
  switch_false_wins = false,
  switch_true_wins = false,
  num_simulations
) {
  let simulations_number = document.querySelector("#simulations_number");
  let wins_number = document.querySelector("#wins_number");
  let losses_number = document.querySelector("#losses_number");

  if (switch_false_wins && switch_true_wins) {
    simulations_number.innerHTML = `${num_simulations}`;
    wins_number.innerHTML = `Sem mudar - ${
      switch_false_wins[switch_false_wins.length - 1]
    } ≈ ${(
      (switch_false_wins[switch_false_wins.length - 1] * 100) /
      num_simulations
    ).toFixed(2)}%
    
    <br> Mudando - ${switch_true_wins[switch_true_wins.length - 1]}
    ≈ ${(
      (switch_true_wins[switch_true_wins.length - 1] * 100) /
      num_simulations
    ).toFixed(2)}%
    `;
    losses_number.innerHTML = `Sem mudar - ${Math.abs(
      switch_false_wins[switch_false_wins.length - 1] - num_simulations
    )}
    ≈ ${(
      (Math.abs(
        switch_false_wins[switch_false_wins.length - 1] - num_simulations
      ) *
        100) /
      num_simulations
    ).toFixed(2)}%
    
    <br> Mudando - ${Math.abs(
      switch_true_wins[switch_true_wins.length - 1] - num_simulations
    )}
    
    ≈ ${(
      (Math.abs(
        switch_true_wins[switch_true_wins.length - 1] - num_simulations
      ) *
        100) /
      num_simulations
    ).toFixed(2)}%
    `;
  } else if (switch_false_wins && !switch_true_wins) {
    simulations_number.innerHTML = `${num_simulations}`;
    wins_number.innerHTML = `${switch_false_wins[switch_false_wins.length - 1]}
    ≈ ${(
      (switch_false_wins[switch_false_wins.length - 1] * 100) /
      num_simulations
    ).toFixed(2)}%
    `;

    losses_number.innerHTML = `${Math.abs(
      switch_false_wins[switch_false_wins.length - 1] - num_simulations
    )}
    ≈ ${(
      (Math.abs(
        switch_false_wins[switch_false_wins.length - 1] - num_simulations
      ) *
        100) /
      num_simulations
    ).toFixed(2)}%
    `;
  } else if (!switch_false_wins && switch_true_wins) {
    simulations_number.innerHTML = `${num_simulations}`;
    wins_number.innerHTML = `${switch_true_wins[switch_true_wins.length - 1]}
    ≈ ${(
      (switch_true_wins[switch_true_wins.length - 1] * 100) /
      num_simulations
    ).toFixed(2)}%
    `;
    losses_number.innerHTML = `${Math.abs(
      switch_true_wins[switch_true_wins.length - 1] - num_simulations
    )}
    ≈ ${(
      (Math.abs(
        switch_true_wins[switch_true_wins.length - 1] - num_simulations
      ) *
        100) /
      num_simulations
    ).toFixed(2)}%
    `;
  }

  let graphContainerNoSimulation = document.createElement("div");
  graphContainerNoSimulation.id = "graphContainerNoSimulation";
  document.body.appendChild(graphContainerNoSimulation);
  let getGraphContainerNoSimulation = document.getElementById(
    "graphContainerNoSimulation"
  );
  let canvas = document.createElement("canvas");
  canvas.id = "line-chart";
  getGraphContainerNoSimulation.appendChild(canvas);

  let labels = Array.from({ length: num_simulations }, (_, i) => i + 1);

  configDataSets =
    switch_false_wins && switch_true_wins
      ? [
          {
            label: "Sem trocar",
            data: switch_false_wins,
            fill: false,
            borderColor: "rgb(255, 99, 132)",

            tension: 0.1,
          },
          {
            label: "Trocando sempre",
            data: switch_true_wins,
            fill: false,
            borderColor: "rgb(54, 162, 235)",
            tension: 0.1,
          },
        ]
      : switch_false_wins && !switch_true_wins
      ? [
          {
            label: "Sem trocar",
            data: switch_false_wins,
            fill: false,
            borderColor: "rgb(255, 99, 132)",
            tension: 0.1,
          },
        ]
      : !switch_false_wins &&
        switch_true_wins && [
          {
            label: "Trocando sempre",
            data: switch_true_wins,
            fill: false,
            borderColor: "rgb(54, 162, 235)",
            tension: 0.1,
          },
        ];

  const chartConfig = {
    type: "line",
    data: {
      labels: labels,
      datasets: configDataSets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "white",
          },
        },
      },
      scales: {
        y: {
          title: {
            display: true,
            text: "Vitórias acumuladas",
            color: "white",
            font: {
              size: 16,
            },
          },
          ticks: {
            beginAtZero: true,
            color: "white",
          },
          grid: {
            color: "#3f3f46",
          },
        },
        x: {
          title: {
            display: true,
            text: "Simulações",
            color: "white",
            font: {
              size: 16,
            },
          },
          ticks: {
            fontSize: 12,
            color: "white",
          },
          grid: {
            color: "#3f3f46",
          },
        },
      },
    },
  };

  return (myChart = new Chart(canvas, chartConfig));
}

function createHistogram(Switch) {
  let graphContainer = document.createElement("div");
  graphContainer.id = "graphContainer";
  document.body.appendChild(graphContainer);

  let canvas1 = document.createElement("canvas");
  canvas1.id = "line-chart-1";
  graphContainer.appendChild(canvas1);

  return (lineChart = new Chart(canvas1, {
    type: "line",
    data: {
      labels: Array.from({ length: cumulative_wins.length }, (_, i) => i + 1),
      datasets: [
        {
          label: Switch ? "Trocando sempre" : "Sem trocar",
          data: cumulative_wins,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "white",
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Simulações",
            color: "white",
            font: {
              size: 16,
            },
          },
          ticks: {
            fontSize: 12,
            color: "white",
          },
          grid: {
            color: "#3f3f46",
          },
        },
        y: {
          title: {
            display: true,
            text: "Vitórias acumuladas",
            color: "white",
            font: {
              size: 16,
            },
          },
          ticks: {
            beginAtZero: true,
            color: "white",
          },
          grid: {
            color: "#3f3f46",
          },
        },
      },
    },
  }));
}

const runSimulatorBtn = document.getElementById("run-simulator-btn");

runSimulatorBtn.addEventListener("click", () => {
  cumulative_wins = [];

  let old_tables = document.querySelectorAll("table");
  if (old_tables) {
    old_tables.forEach((table) => {
      table.remove();
    });
  }
  let btns = document.querySelectorAll("button");

  let lineChart = document.getElementById("line-chart");
  let lineChartContainer = document.getElementById("graphContainer");
  let getGraphContainerNoSimulation = document.getElementById(
    "graphContainerNoSimulation"
  );
  if (lineChart) {
    lineChart.remove();
  }
  if (lineChartContainer) {
    lineChartContainer.remove();
  }

  if (getGraphContainerNoSimulation) {
    getGraphContainerNoSimulation.remove();
  }

  if (btns) {
    btns.forEach((btn) => {
      if (btn.id !== "run-simulator-btn") {
        btn.remove();
      }
    });
  }

  const numSimulationsInput = document.getElementById("num-of-simulations");

  const switchDoorInput = document.getElementById("switch-door");

  const numSimulations = Number(numSimulationsInput.value);
  const switchDoor = switchDoorInput.checked;

  const animationValue = document.getElementById("animation").checked;

  const compare = document.getElementById("compare").checked;

  if (numSimulations <= 0 || numSimulations > 10000) {
    alert("Insira um valor entre 1 e 10000.");
  } else if (animationValue == true) {
    monty_hall_simulator(numSimulations, switchDoor);
  } else if (switchDoor === true && !compare) {
    let switch_true_wins = monty_hall_simulator_no_animation(
      numSimulations,
      true
    );
    createLineGraph(false, switch_true_wins, numSimulations);
  } else if (switchDoor === false && !compare) {
    let switch_false_wins = monty_hall_simulator_no_animation(
      numSimulations,
      false
    );

    createLineGraph(switch_false_wins, false, numSimulations);
  } else if (compare) {
    let switch_false_wins = monty_hall_simulator_no_animation(
      numSimulations,
      false
    );

    let switch_true_wins = monty_hall_simulator_no_animation(
      numSimulations,
      true
    );
    createLineGraph(switch_false_wins, switch_true_wins, numSimulations);
  }
});

function downloadCSV(csv, filename) {
  let csvFile;
  let downloadLink;

  csvFile = new Blob([csv], { type: "text/csv" });

  downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";

  document.body.appendChild(downloadLink);
  downloadLink.click();
}

function exportTableToCSV(filename, i = "") {
  console;
  let csv = [];
  let rows = document.querySelectorAll(`#table-${i} tr`);

  for (let i = 0; i < rows.length; i++) {
    let row = [];
    let cols = rows[i].querySelectorAll("td, th");

    for (let j = 0; j < cols.length; j++) {
      row.push(cols[j].innerText);
    }

    csv.push(row.join(","));
  }

  downloadCSV(csv.join("\n"), filename);
}

function handleInputsChange() {
  const animationValue = document.getElementById("animation").checked;
  const compare = document.getElementById("compare");
  compare.onclick = function () {
    if (animationValue === true) {
      alert("desative animação");
    }
  };
  if (animationValue) {
    document.getElementById("compare").checked = false;
  }
}

document
  .getElementById("animation")
  .addEventListener("change", handleInputsChange);
document
  .getElementById("compare")
  .addEventListener("change", handleInputsChange);
