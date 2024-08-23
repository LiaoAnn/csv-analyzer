import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

type CollapsibleTableProps = {
  headers: string[];
  filteredAndGroupedData: any[] | Record<string, any[]>;
};

const CollapsibleTable = ({
  headers,
  filteredAndGroupedData,
}: CollapsibleTableProps) => (
  <div className="border rounded-md">
    <div className="overflow-auto max-h-[600px]">
      <Table>
        <TableHeader className="bg-background z-10">
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header} className="py-2">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(filteredAndGroupedData) &&
          filteredAndGroupedData.length > 0
            ? filteredAndGroupedData.map((row, index) => (
                <TableRow key={index}>
                  {headers.map((header) => (
                    <TableCell key={header} className="whitespace-nowrap">
                      {typeof row[header] === "number"
                        ? row[header].toFixed(2)
                        : row[header]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : Object.entries(filteredAndGroupedData).map(([key, rows]) => (
                <Collapsible key={key} asChild>
                  <>
                    <CollapsibleTrigger asChild>
                      <TableRow>
                        <TableCell colSpan={headers.length}>
                          {key} - {rows.length} rows
                        </TableCell>
                      </TableRow>
                    </CollapsibleTrigger>
                    <CollapsibleContent asChild>
                      <>
                        {rows.map((row: any, index: number) => (
                          <TableRow key={index}>
                            {headers.map((header) => (
                              <TableCell
                                key={header}
                                className="whitespace-nowrap"
                              >
                                {typeof row[header] === "number"
                                  ? row[header].toFixed(2)
                                  : row[header]}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </>
                    </CollapsibleContent>
                  </>
                </Collapsible>
              ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

export default CollapsibleTable;
