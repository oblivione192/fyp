import { Table } from "react-bootstrap";
export default function TableView({ headers, data, accessor }) {
  return (
    <Table>
      <thead>
        <tr>
          {headers.map((header, idx) => (
            <th key={idx}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, rowIdx) => (
          <tr key={rowIdx}>
            {accessor.map((col, colIdx) => (
              <td key={colIdx}>{item[col.header]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
