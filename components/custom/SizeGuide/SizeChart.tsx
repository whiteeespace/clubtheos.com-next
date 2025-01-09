import React from "react";

import { VariantSizeChart } from "@utils/utils/get-variant-size-chart";

import styles from "./styles.module.scss";

const getSizeChartMeasurements = (sizeGuide: string) => {
  switch (sizeGuide) {
    case "pants":
      return ["Waist (A)", "Outseam (B)", "Inseam (C)", "Thigh (D)", "Leg opening (E)"];
    default:
      return ["Chest (A)", "Length (B)", "Sleeve length (C)", "Shoulder (D)", "Hem (E)"];
  }
};

interface SizeChartProps {
  sizeGuide: string;
  sizeChart: VariantSizeChart;
}

export const SizeChart: React.FC<SizeChartProps> = ({ sizeChart, sizeGuide }) => {
  const measurements = getSizeChartMeasurements(sizeGuide);

  return (
    <div className={styles.sizeChartContainer}>
      <table className={styles.sizeChart}>
        <thead>
          <tr>
            <th>Measurement</th>
            {sizeChart.map((variantSizeChart) => (
              <th key={variantSizeChart.size}>{variantSizeChart.size}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {measurements.map((measurement, index) => (
            <tr key={index}>
              <td>{measurement}</td>
              {sizeChart.map((variantSizeChart) => (
                <td key={variantSizeChart.size}>
                  {variantSizeChart[index]?.value && (
                    <>
                      {variantSizeChart[index].value}&quot;{" "}
                      <span>({(variantSizeChart[index].value * 2.54).toFixed(1)}cm)</span>
                    </>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
