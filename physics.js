// Resonansvillkor för ändarna och formler som hör till vågmodellen.
window.WAVE_PHYSICS = {
  getConfiguration(leftEnd, rightEnd, system) {
    if (system === "string") {
      return {
        leftEnd: "fixed",
        rightEnd: "fixed",
        boundary: "Fast – fast",
        formula: "L = n · λ / 2",
        kind: "same"
      };
    }

    const bothSame = leftEnd === rightEnd;
    return {
      leftEnd,
      rightEnd,
      boundary: `${this.endLabel(leftEnd)} – ${this.endLabel(rightEnd)}`,
      formula: bothSame ? "L = n · λ / 2" : "L = (2n − 1) · λ / 4",
      kind: bothSame ? "same" : "mixed"
    };
  },

  endLabel(end) {
    return end === "open" ? "Öppen" : "Sluten";
  },

  resonances(length, kind, maximumWavelength) {
    const values = [];
    for (let n = 1; n <= 16; n += 1) {
      const wavelength = kind === "same"
        ? (2 * length) / n
        : (4 * length) / (2 * n - 1);
      if (wavelength >= 0.25 && wavelength <= maximumWavelength) {
        values.push({ wavelength, mode: n });
      }
    }
    return values;
  },

  closestResonance(wavelength, resonances) {
    return resonances.reduce((closest, resonance) => {
      const difference = Math.abs(resonance.wavelength - wavelength);
      return !closest || difference < closest.difference
        ? { ...resonance, difference }
        : closest;
    }, null);
  },

  isNearResonance(wavelength, resonances, tolerance) {
    const closest = this.closestResonance(wavelength, resonances);
    return closest !== null && closest.difference <= tolerance;
  }
};
