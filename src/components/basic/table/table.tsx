import React, {Key, MouseEvent, useEffect, useState} from "react";

export type Column<T> = {
    header: string;
    name?: Key;
    render?: (record: T, index: number) => React.JSX.Element
}


type TableProps<DataType> = {
    columns: Column<DataType>[],
    data?: DataType[],
    onRowClick?: (e: MouseEvent<HTMLTableRowElement>, row: DataType) => void
}

const Table = <DataType extends Record<string, any>> ({ columns, data, onRowClick }: TableProps<DataType>) => {
    const tableRef = React.useRef<HTMLTableElement>(null);
    const [columnWidth, setColumnWidth] = useState<number>(0);

    const calculateColumnWidth = () => {
        if (tableRef.current) {
            const tableWidth = tableRef.current.offsetWidth;
            const averageColumnWidth = tableWidth / columns.length;
            setColumnWidth(averageColumnWidth);
        }
    };

    useEffect(() => {
        calculateColumnWidth();

        const handleResize = () => {
            calculateColumnWidth();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [columns.length]);

    const handleRowClick = (e: MouseEvent<HTMLTableRowElement>, row: DataType) => {
        onRowClick && onRowClick(e, row)
    }

    const renderCell = (row: DataType, column: Column<DataType>, rowIndex: number) => {
        if (column?.render) {
            return column.render(row, rowIndex)
        }
        return row[column.name as keyof DataType]
    }

    return (
        <div className="overflow-x-auto">
            <table ref={tableRef} className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-200">
                <tr>
                    {columns.map((column) => (
                        <th
                            key={column.name}
                            className="py-2 px-4 border-b border-gray-200 text-left text-gray-600"
                            style={{ width: `${columnWidth}px` }}
                        >
                            {column.header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data?.map((row, rowIndex) => (
                    <tr key={rowIndex} className="table--row even:bg-gray-50" onClick={(e) => handleRowClick(e, row)}>
                        {columns.map((column) => (
                            <td
                                key={column.name}
                                className="py-2 px-4 border-b border-gray-200 text-gray-800"
                            >
                                {
                                    renderCell(row, column, rowIndex)
                                }
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
