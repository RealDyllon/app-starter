import { rankItem } from "@tanstack/match-sorter-utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	createColumnHelper,
	type FilterFn,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/examples/table")({
	component: TableExample,
});

type Project = {
	name: string;
	owner: string;
	status: "Design" | "Build" | "Launch";
	budget: number;
};

const projects: Project[] = [
	{ name: "Operations Hub", owner: "Mira", status: "Build", budget: 48_000 },
	{ name: "Partner Portal", owner: "Noah", status: "Design", budget: 32_000 },
	{
		name: "Analytics Refresh",
		owner: "Iris",
		status: "Launch",
		budget: 26_500,
	},
	{ name: "Support Console", owner: "Theo", status: "Build", budget: 41_250 },
];

const fuzzyFilter: FilterFn<Project> = (row, columnId, value, addMeta) => {
	const itemRank = rankItem(row.getValue(columnId), value);

	addMeta({ itemRank });

	return itemRank.passed;
};

const columnHelper = createColumnHelper<Project>();

function TableExample() {
	const [globalFilter, setGlobalFilter] = useState("");
	const columns = useMemo(
		() => [
			columnHelper.accessor("name", {
				header: "Project",
				cell: (info) => info.getValue(),
			}),
			columnHelper.accessor("owner", {
				header: "Owner",
				cell: (info) => info.getValue(),
			}),
			columnHelper.accessor("status", {
				header: "Status",
				cell: (info) => <span className="status-pill">{info.getValue()}</span>,
			}),
			columnHelper.accessor("budget", {
				header: "Budget",
				cell: (info) =>
					new Intl.NumberFormat(undefined, {
						style: "currency",
						currency: "USD",
						maximumFractionDigits: 0,
					}).format(info.getValue()),
			}),
		],
		[],
	);
	const table = useReactTable({
		data: projects,
		columns,
		state: {
			globalFilter,
		},
		globalFilterFn: fuzzyFilter,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	return (
		<main className="app-shell">
			<section className="page-wrap">
				<nav aria-label="Examples" className="page-nav">
					<Link to="/" className="nav-link">
						Home
					</Link>
					<Link to="/examples/form" className="nav-link">
						Form
					</Link>
					<Link to="/examples/table" className="nav-link">
						Table
					</Link>
					<Link to="/examples/store" className="nav-link">
						Store
					</Link>
				</nav>

				<section className="hello-card">
					<p className="hello-label">TanStack Table</p>
					<h1>Project portfolio</h1>
					<p>
						A sortable, searchable table using TanStack Table and fuzzy ranking
						from match-sorter utilities.
					</p>

					<label className="form-field table-search">
						<span>Search projects</span>
						<input
							value={globalFilter}
							onChange={(event) => setGlobalFilter(event.target.value)}
							placeholder="Try owner, status, or project name"
						/>
					</label>

					<div className="table-shell">
						<table>
							<thead>
								{table.getHeaderGroups().map((headerGroup) => (
									<tr key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<th key={header.id}>
												<button
													type="button"
													onClick={header.column.getToggleSortingHandler()}
												>
													{flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
													<span>
														{{
															asc: " ↑",
															desc: " ↓",
														}[header.column.getIsSorted() as string] ?? ""}
													</span>
												</button>
											</th>
										))}
									</tr>
								))}
							</thead>
							<tbody>
								{table.getRowModel().rows.map((row) => (
									<tr key={row.id}>
										{row.getVisibleCells().map((cell) => (
											<td key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			</section>
		</main>
	);
}
