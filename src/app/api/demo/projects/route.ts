import { NextResponse } from "next/server";
import type { Project } from "@/types/project";

const projects: Project[] = [
  {
    id: "prj-001",
    name: "Customer Churn Prediction",
    description: "Explore customer behavior and identify churn risk signals.",
    status: "active",
    updatedAt: "2026-10-08T10:30:00.000Z",
  },
  {
    id: "prj-002",
    name: "Retail Demand Forecasting",
    description: "Prepare a forecasting workflow for product demand.",
    status: "draft",
    updatedAt: "2026-10-07T14:15:00.000Z",
  },
  {
    id: "prj-003",
    name: "Equipment Failure Analysis",
    description: "Evaluate sensor data for predictive maintenance.",
    status: "completed",
    updatedAt: "2026-10-05T09:00:00.000Z",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Deliberate error mode for testing the frontend error state.
  if (searchParams.get("simulateError") === "true") {
    return NextResponse.json(
      { detail: "Demo API error: the projects request was rejected intentionally." },
      { status: 503 },
    );
  }

  return NextResponse.json(projects, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  });
}
