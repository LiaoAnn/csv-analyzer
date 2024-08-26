import { useState, useMemo, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Papa from "papaparse";
import { BarChart2, Table as TableIcon } from "lucide-react";
import Filter from "./filter";
import GroupBy from "./groupby";
import CollapsibleTable from "./collapsible-table";
import { AnalysisChart } from "./analysis-chart";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  clearFilters,
  setFileName as setFilterFileName,
} from "@/lib/features/filter";
import { setFileName as setGroupByFileName } from "@/lib/features/groupBy";

export default function CSVAnalyzer() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filter.filters);
  const groupBy = useAppSelector((state) => state.groupBy.list);
  const fileName = useAppSelector((state) => state.filter.fileName);

  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [showChart, setShowChart] = useState(false);

  const handleFileUpload = (event: ChangeEvent) => {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    if (fileName !== file.name) {
      dispatch(clearFilters());
      dispatch(setFilterFileName(file.name));
      dispatch(setGroupByFileName(file.name));
    }

    Papa.parse(file, {
      complete: (result) => {
        if (result.data && result.data.length > 0) {
          setData(result.data as never[]);
          setHeaders((result.meta.fields as never) || []);
          setError("");
        } else {
          setError("No data found in the CSV file");
        }
      },
      header: true,
      dynamicTyping: true,
      error: (error) => {
        setError("Error parsing CSV: " + error.message);
      },
    });
  };

  const filteredAndGroupedData = useMemo(() => {
    // apply filters
    let result: any = data.filter((row) => {
      return filters.every((filter: Filter) => {
        const value = row[filter.column];
        switch (filter.condition) {
          case "equals":
            return value == filter.value;
          case "not equals":
            return value != filter.value;
          case "in":
            return filter.value
              .split(",")
              .map((v) => v.trim())
              .includes(String(value));
          case "not in":
            return !filter.value
              .split(",")
              .map((v) => v.trim())
              .includes(String(value));
          default:
            return true;
        }
      });
    });

    // Then, apply grouping if a groupBy property is set
    if (groupBy.length > 0) {
      const groups: Record<string, any> = {};

      result.forEach((row: any) => {
        // generate a key for the group
        const key = groupBy
          .map((field: string) => String(row[field]))
          .join(", ");

        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(row);
      });

      // sorting by length
      const sortedGroups = Object.entries(groups)
        .sort((a, b) => b[1].length - a[1].length)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, any>);

      // return the grouped data
      result = sortedGroups;
    }
    return result;
  }, [data, filters, groupBy, headers]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="csv-upload">Upload CSV File</Label>
        <Input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {data.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Label htmlFor="view-toggle">View:</Label>
              <ToggleGroup
                type="single"
                value={showChart ? "chart" : "table"}
                onValueChange={(val) => setShowChart(val === "chart")}
              >
                <ToggleGroupItem value="table">
                  <TableIcon className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="chart">
                  <BarChart2 className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <GroupBy headers={headers} groupBy={groupBy} />
          </div>
          <Filter filters={filters} headers={headers} />
          <h2 className="text-2xl font-bold">Data Visualization</h2>
          {showChart ? (
            groupBy.length > 0 ? (
              <AnalysisChart filteredAndGroupedData={filteredAndGroupedData} />
            ) : (
              <div>
                <p className="text-red-500">
                  Please select a column to group by to view the chart
                </p>
              </div>
            )
          ) : (
            <CollapsibleTable
              headers={headers}
              filteredAndGroupedData={filteredAndGroupedData}
            />
          )}
        </div>
      )}
    </div>
  );
}
