import { Link } from "@remix-run/react";

export default function TopNav() {
  return (
    <nav className="flex flex-wrap items-center justify-between bg-gray-800 p-6">
      <ul className="mr-6 flex flex-shrink-0 items-center text-white">
        <li className="mr-6">
          <Link to="/">Home</Link>
        </li>
        <li className="mr-6">
          <Link to="/todos">Todos</Link>
        </li>
        <li className="mr-6">
          <Link to="/beta">Beta</Link>
        </li>
      </ul>
    </nav>
  );
}
