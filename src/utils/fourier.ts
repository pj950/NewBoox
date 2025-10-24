export interface FourierDecomposition {
  trend: number[];
  residual: number[];
}

function shouldKeepCoefficient(index: number, length: number, harmonics: number) {
  if (index === 0) {
    return true;
  }

  if (index <= harmonics) {
    return true;
  }

  if (index >= length - harmonics) {
    return true;
  }

  return false;
}

function clampHarmonics(length: number, harmonics: number) {
  if (length <= 1) {
    return 0;
  }
  return Math.max(1, Math.min(harmonics, Math.floor(length / 2)));
}

export function fourierLowPass(data: number[], harmonics = 2): FourierDecomposition {
  const n = data.length;

  if (n === 0) {
    return {
      trend: [],
      residual: []
    };
  }

  const effectiveHarmonics = clampHarmonics(n, harmonics);
  const real = new Array<number>(n).fill(0);
  const imag = new Array<number>(n).fill(0);

  for (let k = 0; k < n; k++) {
    let sumReal = 0;
    let sumImag = 0;

    for (let t = 0; t < n; t++) {
      const angle = (2 * Math.PI * t * k) / n;
      sumReal += data[t] * Math.cos(angle);
      sumImag -= data[t] * Math.sin(angle);
    }

    real[k] = sumReal;
    imag[k] = sumImag;
  }

  const filteredReal = real.map((value, index) => (shouldKeepCoefficient(index, n, effectiveHarmonics) ? value : 0));
  const filteredImag = imag.map((value, index) => (shouldKeepCoefficient(index, n, effectiveHarmonics) ? value : 0));

  const trend = new Array<number>(n).fill(0);

  for (let t = 0; t < n; t++) {
    let value = 0;

    for (let k = 0; k < n; k++) {
      const angle = (2 * Math.PI * t * k) / n;
      value += filteredReal[k] * Math.cos(angle) - filteredImag[k] * Math.sin(angle);
    }

    trend[t] = Number((value / n).toFixed(4));
  }

  const residual = data.map((value, index) => Number((value - trend[index]).toFixed(4)));

  return {
    trend,
    residual
  };
}

export function normalizeSeries(series: number[]): number[] {
  if (series.length === 0) {
    return [];
  }

  const min = Math.min(...series);
  const max = Math.max(...series);

  if (max === min) {
    return series.map(() => 0.5);
  }

  return series.map((value) => (value - min) / (max - min));
}
