import { HoldingsPayload } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function HoldingsTable({ holdings }: { holdings: HoldingsPayload }) {
  const topItems = holdings.items.slice(0, 10);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Gewicht</TableHead>
          <TableHead>Meta</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {topItems.map((item) => (
          <TableRow key={item.name}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{item.weightPct.toFixed(2)}%</TableCell>
            <TableCell className="text-slate-500">
              {item.meta
                ? Object.entries(item.meta)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(" | ")
                : "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
