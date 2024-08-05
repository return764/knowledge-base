import {Key} from "react";

type Column<T> = {
    header: string;
    name: Key;
}


type TableProps<DataType> = {
    columns: Column<DataType>[],
    data?: DataType[]
}

const Table = <DataType extends Record<string, any>> ({ columns, data }: TableProps<DataType>) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-200">
                <tr>
                    {columns.map((column) => (
                        <th
                            key={column.name}
                            className="py-2 px-4 border-b border-gray-200 text-left text-gray-600"
                        >
                            {column.header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data?.map((row, rowIndex) => (
                    <tr key={rowIndex} className="even:bg-gray-50">
                        {columns.map((column) => (
                            <td
                                key={column.name}
                                className="py-2 px-4 border-b border-gray-200 text-gray-800"
                            >
                                {row[column.name]}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
