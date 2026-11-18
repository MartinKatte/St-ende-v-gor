(function () {
  const content = window.WAVE_CONTENT;
  const physics = window.WAVE_PHYSICS;
  const length = content.lengthMeters;
  const wavelengthSlider = document.getElementById("wavelength");
  const pipeOptions = document.getElementById("pipe-options");
  const leftEnd = document.getElementById("left-end");
  const rightEnd = document.getElementById("right-end");
  const waveVisual = document.getElementById("wave-visual");
  const playButton = document.getElementById("play-button");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let system = "string";
  let phase = 0;
  let playing = false;
  let animationFrame = null;
  let lastFrameTime = 0;

  function formatMeters(value) {
    return `${value.toFixed(2).replace(".", ",")} m`;
  }

  function getCurrentState() {
    const wavelength = Number(wavelengthSlider.value);
    const configuration = physics.getConfiguration(leftEnd.value, rightEnd.value, system);
    const resonances = physics.resonances(length, configuration.kind, 2.5);
    const closest = physics.closestResonance(wavelength, resonances);
    const isResonant = physics.isNearResonance(
      wavelength,
      resonances,
      content.approximateResonanceTolerance
    );
    return { wavelength, configuration, closest, isResonant };
  }

  function renderString(wavelength) {
    const x0 = 62;
    const x1 = 878;
    const centerY = 106;
    const amplitude = 54;
    const waveNumber = (2 * Math.PI) / wavelength;
    const points = [];
    const sampleCount = 180;
    for (let index = 0; index <= sampleCount; index += 1) {
      const ratio = index / sampleCount;
      const x = x0 + ratio * (x1 - x0);
      const y = centerY - amplitude * Math.sin(waveNumber * ratio * length) * Math.cos(phase);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }

    const endpointY = centerY - amplitude * Math.sin(waveNumber * length) * Math.cos(phase);
    const mismatch = Math.abs(endpointY - centerY) > 5;
    return `
      <svg viewBox="0 0 940 220" role="presentation" focusable="false">
        <line x1="${x0}" y1="${centerY}" x2="${x1}" y2="${centerY}" class="equilibrium-line"/>
        <line x1="${x0}" y1="53" x2="${x0}" y2="159" class="wall"/>
        <line x1="${x1}" y1="53" x2="${x1}" y2="159" class="wall"/>
        <polyline points="${points.join(" ")}" class="string-wave"/>
        <circle cx="${x0}" cy="${centerY}" r="6" class="anchor"/>
        <circle cx="${x1}" cy="${centerY}" r="6" class="anchor"/>
        ${mismatch ? `<line x1="${x1}" y1="${centerY}" x2="${x1}" y2="${endpointY.toFixed(1)}" class="mismatch-line"/>` : ""}
        <text x="${x0}" y="190" text-anchor="middle" class="svg-label">fast ände</text>
        <text x="${x1}" y="190" text-anchor="middle" class="svg-label">fast ände</text>
        <text x="470" y="207" text-anchor="middle" class="svg-label">L = ${length.toFixed(2).replace(".", ",")} m</text>
      </svg>`;
  }

  function displacementShape(ratio, configuration) {
    const leftIsClosed = configuration.leftEnd === "closed";
    return leftIsClosed
      ? Math.sin(Math.PI * 2 * ratio / (Number(wavelengthSlider.value) / length))
      : Math.cos(Math.PI * 2 * ratio / (Number(wavelengthSlider.value) / length));
  }

  function renderPipe(wavelength, configuration) {
    const x0 = 75;
    const x1 = 865;
    const centerY = 106;
    const height = 72;
    const particlesPerRow = 88;
    const particleRows = 5;
    const rowInset = 8;
    const rowSpacing = (height - 2 * rowInset) / (particleRows - 1);
    const displacement = Math.max(8, Math.min(55, wavelength * 36));
    const closedLeft = configuration.leftEnd === "closed";
    const closedRight = configuration.rightEnd === "closed";
    const circles = [];

    for (let row = 0; row < particleRows; row += 1) {
      const y = centerY - height / 2 + rowInset + row * rowSpacing;
      for (let index = 0; index < particlesPerRow; index += 1) {
        const restRatio = index / (particlesPerRow - 1);
        const shape = displacementShape(restRatio, configuration);
        const x = x0 + restRatio * (x1 - x0) + displacement * shape * Math.cos(phase);
        const boundedX = Math.max(x0 + 3, Math.min(x1 - 3, x));
        circles.push(`<circle cx="${boundedX.toFixed(1)}" cy="${y.toFixed(1)}" r="2.4" class="air-particle"/>`);
      }
    }

    return `
      <svg viewBox="0 0 940 220" role="presentation" focusable="false">
        <rect x="${x0}" y="${centerY - height / 2}" width="${x1 - x0}" height="${height}" rx="7" class="pipe-body"/>
        ${circles.join("")}
        ${closedLeft ? `<line x1="${x0}" y1="${centerY - height / 2 - 8}" x2="${x0}" y2="${centerY + height / 2 + 8}" class="closed-cap"/>` : `<path d="M ${x0} ${centerY - height / 2 - 9} V ${centerY + height / 2 + 9}" class="open-end"/>`}
        ${closedRight ? `<line x1="${x1}" y1="${centerY - height / 2 - 8}" x2="${x1}" y2="${centerY + height / 2 + 8}" class="closed-cap"/>` : `<path d="M ${x1} ${centerY - height / 2 - 9} V ${centerY + height / 2 + 9}" class="open-end"/>`}
        <text x="${x0}" y="190" text-anchor="middle" class="svg-label">${physics.endLabel(configuration.leftEnd).toLowerCase()} ände</text>
        <text x="${x1}" y="190" text-anchor="middle" class="svg-label">${physics.endLabel(configuration.rightEnd).toLowerCase()} ände</text>
        <text x="470" y="207" text-anchor="middle" class="svg-label">L = ${length.toFixed(2).replace(".", ",")} m</text>
      </svg>`;
  }

  function update() {
    const { wavelength, configuration, closest, isResonant } = getCurrentState();
    const systemContent = content.systems[system];
    document.getElementById("wavelength-output").textContent = formatMeters(wavelength);
    document.getElementById("visual-title").textContent = systemContent.title;
    waveVisual.setAttribute("aria-label", systemContent.ariaLabel);
    document.getElementById("boundary-summary").textContent = configuration.boundary;
    document.getElementById("formula-display").textContent = configuration.formula;
    document.getElementById("visual-legend").innerHTML = systemContent.legend
      .map(([className, label]) => `<span><i class="legend-${className}" aria-hidden="true"></i> ${label}</span>`)
      .join("");

    document.getElementById("concept-one-title").textContent = systemContent.concepts[0].title;
    document.getElementById("concept-one-copy").textContent = systemContent.concepts[0].text;
    document.getElementById("concept-two-title").textContent = systemContent.concepts[1].title;
    document.getElementById("concept-two-copy").textContent = systemContent.concepts[1].text;
    document.getElementById("concept-three-title").textContent = systemContent.concepts[2].title;
    document.getElementById("concept-three-copy").textContent = systemContent.concepts[2].text;

    const badge = document.getElementById("resonance-badge");
    const resultTitle = document.getElementById("result-title");
    const resultCopy = document.getElementById("result-copy");
    const resultSymbol = document.getElementById("result-symbol");
    badge.classList.toggle("is-resonant", isResonant);
    badge.textContent = isResonant ? "RESONANS" : "INTE RESONANS";
    resultTitle.textContent = isResonant
      ? systemContent.result.resonant
      : systemContent.result.notResonant;
    resultSymbol.textContent = isResonant ? "✓" : "!";
    resultSymbol.classList.toggle("is-resonant", isResonant);

    if (closest) {
      const nearestLabel = formatMeters(closest.wavelength);
      resultCopy.textContent = isResonant
        ? `Det här motsvarar resonansläge ${closest.mode}.`
        : `Prova nära ${nearestLabel} för att hitta närmaste resonansläge (${closest.mode}).`;
    } else {
      resultCopy.textContent = "Prova en längre våglängd för att hitta ett resonansläge.";
    }

    if (system === "string") {
      waveVisual.innerHTML = renderString(wavelength);
      document.getElementById("visual-legend").innerHTML =
        '<span><i class="legend-line" aria-hidden="true"></i> Strängens utslag</span><span><i class="legend-dash" aria-hidden="true"></i> Jämviktsläge</span>';
    } else {
      waveVisual.innerHTML = renderPipe(wavelength, configuration);
    }
  }

  function setSystem(nextSystem) {
    system = nextSystem;
    document.querySelectorAll(".system-button").forEach((button) => {
      const selected = button.dataset.system === system;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    pipeOptions.hidden = system !== "pipe";
    document.getElementById("visual-legend").classList.toggle("pipe-legend", system === "pipe");
    update();
  }

  function animate(timestamp) {
    if (!playing) return;
    if (lastFrameTime === 0) lastFrameTime = timestamp;
    const elapsed = timestamp - lastFrameTime;
    if (elapsed >= 32) {
      phase = (phase + elapsed * 0.003) % (2 * Math.PI);
      lastFrameTime = timestamp;
      update();
    }
    animationFrame = window.requestAnimationFrame(animate);
  }

  function togglePlayback() {
    playing = !playing;
    playButton.setAttribute("aria-pressed", String(playing));
    playButton.querySelector("span:last-child").textContent = playing ? "Pausa vågen" : "Spela vågen";
    playButton.querySelector(".play-icon").textContent = playing ? "Ⅱ" : "▶";
    if (playing) {
      lastFrameTime = 0;
      animationFrame = window.requestAnimationFrame(animate);
    } else if (animationFrame !== null) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  }

  document.querySelectorAll(".system-button").forEach((button) => {
    button.addEventListener("click", () => setSystem(button.dataset.system));
  });
  wavelengthSlider.addEventListener("input", update);
  leftEnd.addEventListener("change", update);
  rightEnd.addEventListener("change", update);
  playButton.addEventListener("click", togglePlayback);
  reduceMotion.addEventListener("change", (event) => {
    if (event.matches && playing) togglePlayback();
  });

  update();
})();
