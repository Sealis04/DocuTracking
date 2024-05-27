import { Table,TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { type listDocument } from "~/models/models";
interface ListTableInterface{
    list:   listDocument []
}

export default function ListTable({list}:ListTableInterface){
    // list of general details of each transaction in table format.
    return (
      <Table className="select-none">
        <TableHeader>
            <TableRow>
                <TableHead>Particulars</TableHead>
                <TableHead>Endorsed Date</TableHead>
                <TableHead>Record Date</TableHead>
                <TableHead>Record By</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {list.map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{item.particulars}</TableCell>
                    <TableCell>
                      {item.endorsedDate?.toLocaleDateString()}
                    </TableCell>
                    <TableCell>{item.recDate.toLocaleDateString()}</TableCell>
                    <TableCell>
                      {item.recordUser.fName + " " +item.recordUser.lName}
                    </TableCell>
                  </TableRow>
                );
            })}
        </TableBody>
      </Table>
    );
}