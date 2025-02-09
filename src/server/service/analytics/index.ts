/**
 * @link https://developers.google.com/analytics/devguides/reporting/data/v1/basics
 * @link https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#dimensions
 * @link https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/Dimension
 * @link https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries
 */

import { BetaAnalyticsDataClient } from "@google-analytics/data";
import type { google } from "@google-analytics/data/build/protos/protos";

import { service } from "@/server/service";

type IRunReportRequest = google.analytics.data.v1beta.IRunReportRequest;

/**
 * find the property ID on {@link https://analytics.google.com/analytics/web/}
 */
const propertyId = 336713517;

/**
 * The date the analytics were first collected
 */
export const analyticsInceptionDate = "2020-03-31";

/**
 * service for controlling the Google Analytics client
 */
export class GoogleAnalyticsService {
  readonly client: BetaAnalyticsDataClient;

  constructor() {
    this.client = new BetaAnalyticsDataClient();
  }

  /**
   * run a report
   */
  private async runReport(reportRequest: IRunReportRequest) {
    const report = await this.client.runReport({
      property: `properties/${propertyId}`,
      ...reportRequest,
    });

    return report;
  }

  /**
   * Given a report request, run a report and return the formatted data as an object
   *
   * @param reportRequest the report request
   * @returns the report as an object
   */
  async asObject(reportRequest: IRunReportRequest) {
    const report = await this.runReport(reportRequest);

    const dimensionToMetric: Record<string, number> = {};

    report[0].rows?.map((row) => {
      const dimension = row.dimensionValues?.map((k) => k.value)[0];
      dimensionToMetric[dimension ?? ""] = parseInt(
        row.metricValues?.map((k) => k.value)[0] ?? "0",
        10,
      );
    });

    return dimensionToMetric;
  }

  /**
   * Get the view count for all datasets
   *
   * @param startDate the start date for the analytics
   * @param endDate the end date for the analytics
   *
   * @returns a map of dataset paths to view counts
   */
  async datasetViews(startDate = analyticsInceptionDate, endDate = "today") {
    const datasets = await service.dataset.find.byQuery({});
    const pagePaths = datasets.datasets.map(
      (dataset) => `/dataset/${dataset.id}/${dataset.slug}`,
    );

    const analytics = await this.asObject({
      dateRanges: [
        {
          startDate: startDate,
          endDate: endDate,
        },
      ],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          inListFilter: {
            values: pagePaths,
            caseSensitive: true,
          },
        },
      },
    });

    return analytics;
  }

  /**
   * Get the dataset's views by ID
   *
   * @param id the dataset ID
   * @param startDate the start date for the analytics
   * @param endDate the end date for the analytics
   *
   * @returns the dataset's views
   */
  async datasetViewsById(
    id: number,
    startDate = analyticsInceptionDate,
    endDate = "today",
  ) {
    const dataset = await service.dataset.find.byId({ datasetId: id });

    if (!dataset) {
      throw new Error(`dataset with ID ${id} not found`);
    }

    const datasetPath = `/dataset/${id}/${dataset?.slug}`;

    const analytics = await this.asObject({
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: {
            value: datasetPath,
            matchType: "EXACT",
            caseSensitive: true,
          },
        },
      },
    });

    const views = analytics[datasetPath] ?? 0;

    return views;
  }
}

export default GoogleAnalyticsService;
