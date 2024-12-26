import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'

export type Column<T> = ColumnDef<T>

type TableProps<DataType> = {
    columns: Column<DataType>[],
    data?: DataType[],
    onRowClick?: (row: DataType) => void
}

const Table = <DataType extends object>({
    columns,
    data = [],
    onRowClick
}: TableProps<DataType>) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="max-w-full overflow-x-auto">
            <table className="w-full table table-auto text-sm text-left rounded-lg border border-gray-10">
                <thead className="text-xs uppercase bg-gray-50/50">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    className="px-6 py-4 font-medium text-gray-500 whitespace-nowrap"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr
                            key={row.id}
                            className="border-t border-gray-100 transition-colors hover:bg-gray-50/50 cursor-pointer"
                            onClick={() => onRowClick?.(row.original)}
                        >
                            {row.getVisibleCells().map(cell => (
                                <td
                                    key={cell.id}
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {(!data || data.length === 0) && (
                <div className="flex justify-center items-center py-8 text-gray-500 text-sm">
                    暂无数据
                </div>
            )}
        </div>
    )
}

export default Table
