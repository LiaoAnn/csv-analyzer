import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Papa from "papaparse";
import { BarChart2, Table as TableIcon } from "lucide-react";
import Filter from "./filter";
import GroupBy from "./groupby";
import CollapsibleTable from "./collapsible-table";
import { AnalysisChart } from "./analysis-chart";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export default function CSVAnalyzer() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [error, setError] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [filters, setFilters] = useState([]);
  const [groupBy, setGroupBy] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          if (result.data && result.data.length > 0) {
            setData(result.data);
            setHeaders(result.meta.fields || []);
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
    }
  };

  const filteredAndGroupedData = useMemo(() => {
    // apply filters
    let result = data.filter((row) => {
      return filters.every((filter) => {
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
      const groups = {};

      result.forEach((row) => {
        // generate a key for the group
        const key = groupBy.map((field) => String(row[field])).join(", ");

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
        }, {});

      // return the grouped data
      result = sortedGroups;
    }
    return result;
  }, [data, filters, groupBy, headers]);

  const renderChart = () => (
    <div className="border rounded-md p-4 h-[600px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={filteredAndGroupedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={groupBy !== "none" ? groupBy : headers[0]} />
          <YAxis />
          <Tooltip />
          <Legend />
          {headers
            .filter(
              (header) => header !== (groupBy !== "none" ? groupBy : null)
            )
            .map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={`hsl(${index * 30}, 70%, 50%)`}
              />
            ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

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
            <GroupBy
              headers={headers}
              groupBy={groupBy}
              setGroupBy={setGroupBy}
            />
          </div>
          <Filter filters={filters} headers={headers} setFilters={setFilters} />
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
